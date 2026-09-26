from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from backend.database.session import get_db
from backend.models.models import User, UserProfile, Interview, InterviewQuestion, InterviewAnswer, InterviewEvaluation, CodingChallenge, CodingSubmission
from backend.schemas.schemas import StartInterviewRequest, SubmitAnswerRequest, InterviewResultOut, CodingChallengeOut, CodingSubmissionRequest, CodingSubmissionResult
from backend.services.auth_service import get_current_user
from backend.services.interview_service import generate_interview_questions, evaluate_user_answer, summarize_interview_session
from backend.services.coding_evaluator import evaluate_coding_challenge

router = APIRouter(prefix="/api/interview", tags=["Interview"])

@router.post("/start")
def start_interview(
    req: StartInterviewRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    interview = Interview(
        user_id=current_user.id,
        target_role=req.target_role,
        difficulty=req.difficulty,
        interview_type=req.interview_type,
        status="In Progress"
    )
    db.add(interview)
    db.commit()
    db.refresh(interview)

    q_list = generate_interview_questions(req.target_role, req.difficulty, req.interview_type)
    for q in q_list:
        iq = InterviewQuestion(
            interview_id=interview.id,
            question_order=q["order"],
            question_text=q["question_text"],
            category=q["category"],
            expected_keywords=q["expected_keywords"]
        )
        db.add(iq)
    db.commit()

    # Retrieve created questions
    questions = db.query(InterviewQuestion).filter(InterviewQuestion.interview_id == interview.id).order_by(InterviewQuestion.question_order).all()
    return {
        "interview_id": interview.id,
        "target_role": interview.target_role,
        "difficulty": interview.difficulty,
        "interview_type": interview.interview_type,
        "questions": [
            {
                "id": q.id,
                "order": q.question_order,
                "question_text": q.question_text,
                "category": q.category
            } for q in questions
        ]
    }

@router.post("/{id}/answer")
def submit_interview_answer(
    id: int,
    req: SubmitAnswerRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    interview = db.query(Interview).filter(Interview.id == id, Interview.user_id == current_user.id).first()
    if not interview:
        raise HTTPException(status_code=404, detail="Interview session not found")

    question = db.query(InterviewQuestion).filter(InterviewQuestion.id == req.question_id, InterviewQuestion.interview_id == id).first()
    if not question:
        raise HTTPException(status_code=404, detail="Question not found")

    eval_res = evaluate_user_answer(req.user_answer, question.expected_keywords or [], question.category)

    # Check if answer already submitted
    ans = db.query(InterviewAnswer).filter(InterviewAnswer.question_id == question.id).first()
    if not ans:
        ans = InterviewAnswer(
            question_id=question.id,
            user_answer=req.user_answer,
            score=eval_res["score"],
            relevance_score=eval_res["relevance_score"],
            technical_depth=eval_res["technical_depth"],
            feedback=eval_res["feedback"]
        )
        db.add(ans)
    else:
        ans.user_answer = req.user_answer
        ans.score = eval_res["score"]
        ans.relevance_score = eval_res["relevance_score"]
        ans.technical_depth = eval_res["technical_depth"]
        ans.feedback = eval_res["feedback"]

    db.commit()

    return {
        "question_id": question.id,
        "score": eval_res["score"],
        "relevance_score": eval_res["relevance_score"],
        "technical_depth": eval_res["technical_depth"],
        "feedback": eval_res["feedback"]
    }

@router.get("/{id}/results", response_model=InterviewResultOut)
def get_interview_results(id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    interview = db.query(Interview).filter(Interview.id == id, Interview.user_id == current_user.id).first()
    if not interview:
        raise HTTPException(status_code=404, detail="Interview not found")

    questions = db.query(InterviewQuestion).filter(InterviewQuestion.interview_id == id).order_by(InterviewQuestion.question_order).all()

    answers_eval = []
    qna_list = []

    for q in questions:
        ans = db.query(InterviewAnswer).filter(InterviewAnswer.question_id == q.id).first()
        ans_data = {
            "question": q.question_text,
            "category": q.category,
            "user_answer": ans.user_answer if ans else "No answer provided",
            "score": ans.score if ans else 0.0,
            "relevance_score": ans.relevance_score if ans else 0.0,
            "technical_depth": ans.technical_depth if ans else 0.0,
            "feedback": ans.feedback if ans else "Not answered"
        }
        if ans:
            answers_eval.append(ans_data)
        qna_list.append(ans_data)

    summary = summarize_interview_session(answers_eval, interview.target_role)

    # Save Evaluation to DB
    interview.status = "Completed"
    interview.overall_score = summary["overall_score"]

    eval_obj = db.query(InterviewEvaluation).filter(InterviewEvaluation.interview_id == id).first()
    if not eval_obj:
        eval_obj = InterviewEvaluation(
            interview_id=id,
            technical_score=summary["technical_score"],
            answer_relevance=summary["answer_relevance"],
            concept_coverage=summary["concept_coverage"],
            communication_score=summary["communication_score"],
            strong_areas=summary["strong_areas"],
            weak_areas=summary["weak_areas"],
            concepts_to_revise=summary["concepts_to_revise"],
            next_recommended_level=summary["next_recommended_level"]
        )
        db.add(eval_obj)
    db.commit()

    return {
        "interview_id": interview.id,
        "target_role": interview.target_role,
        "overall_score": summary["overall_score"],
        "technical_score": summary["technical_score"],
        "answer_relevance": summary["answer_relevance"],
        "concept_coverage": summary["concept_coverage"],
        "communication_score": summary["communication_score"],
        "strong_areas": summary["strong_areas"],
        "weak_areas": summary["weak_areas"],
        "concepts_to_revise": summary["concepts_to_revise"],
        "next_recommended_level": summary["next_recommended_level"],
        "qna_list": qna_list
    }

# Coding Challenge Endpoints
@router.get("/coding/challenges", response_model=List[CodingChallengeOut])
def get_coding_challenges(db: Session = Depends(get_db)):
    return db.query(CodingChallenge).all()

@router.post("/coding/submit", response_model=CodingSubmissionResult)
def submit_coding_challenge(
    req: CodingSubmissionRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    challenge = db.query(CodingChallenge).filter(CodingChallenge.id == req.challenge_id).first()
    if not challenge:
        raise HTTPException(status_code=404, detail="Coding challenge not found")

    res = evaluate_coding_challenge(req.code, challenge.test_cases or [])

    sub = CodingSubmission(
        user_id=current_user.id,
        challenge_id=challenge.id,
        code=req.code,
        status=res["status"],
        passed_test_cases=res["passed_test_cases"],
        total_test_cases=res["total_test_cases"],
        stdout=res["stdout"]
    )
    db.add(sub)
    db.commit()

    return res
