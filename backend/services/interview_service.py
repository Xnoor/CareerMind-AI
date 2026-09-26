import random
from typing import Dict, Any, List
from backend.services.nlp_service import compute_cosine_similarity

QUESTION_BANK = {
    "AI Engineer": {
        "Technical": [
            {
                "question": "Explain the difference between Supervised and Unsupervised Learning, and give real-world examples of each.",
                "category": "ML Fundamentals",
                "keywords": ["labeled", "unlabeled", "regression", "classification", "clustering", "kmeans", "target"]
            },
            {
                "question": "How does Retrieval-Augmented Generation (RAG) differ from fine-tuning an LLM? When would you use each?",
                "category": "LLM Architecture",
                "keywords": ["context", "embeddings", "vector store", "hallucination", "knowledge base", "weights", "cost"]
            },
            {
                "question": "What is overfitting in Deep Learning models, and what techniques do you use to prevent it?",
                "category": "Deep Learning",
                "keywords": ["dropout", "regularization", "early stopping", "data augmentation", "validation loss", "generalization"]
            },
            {
                "question": "How do Vector Databases (like FAISS or ChromaDB) perform fast similarity search over high-dimensional embeddings?",
                "category": "Vector Search",
                "keywords": ["cosine similarity", "dot product", "indexing", "hnsw", "nearest neighbor", "dimension"]
            },
            {
                "question": "Explain how you would deploy a PyTorch model into production using FastAPI and Docker.",
                "category": "MLOps & APIs",
                "keywords": ["container", "endpoint", "inference", "quantization", "gunicorn", "health check", "latency"]
            }
        ],
        "HR": [
            {
                "question": "Tell me about a challenging technical project you built. What obstacles did you encounter and how did you resolve them?",
                "category": "Behavioral",
                "keywords": ["problem", "solution", "tradeoffs", "learning", "teamwork", "debugging"]
            },
            {
                "question": "How do you stay updated with rapidly evolving AI research and tools?",
                "category": "Continuous Learning",
                "keywords": ["papers", "arxiv", "blogs", "github", "experiments", "community", "projects"]
            }
        ]
    },
    "Python Developer": {
        "Technical": [
            {
                "question": "Explain the difference between Python lists, tuples, and sets in terms of mutability, ordering, and performance.",
                "category": "Python Core",
                "keywords": ["mutable", "immutable", "hashable", "constant time", "hash table", "indexed"]
            },
            {
                "question": "How do Python decorators work under the hood? Provide a code example concept.",
                "category": "Advanced Python",
                "keywords": ["higher-order function", "wrapper", "closure", "@syntax", "arguments", "return"]
            },
            {
                "question": "What are Asyncio and event loops in Python? When should you use async over multithreading?",
                "category": "Concurrency",
                "keywords": ["non-blocking", "event loop", "await", "async def", "io bound", "gil"]
            }
        ],
        "HR": [
            {
                "question": "Why are you interested in specializing as a Python Developer, and what type of products do you want to build?",
                "category": "Career Motivation",
                "keywords": ["backend", "automation", "clean code", "frameworks", "scalability"]
            }
        ]
    }
}

def generate_interview_questions(target_role: str, difficulty: str = "Intermediate", interview_type: str = "Technical") -> List[Dict[str, Any]]:
    role_questions = QUESTION_BANK.get(target_role, QUESTION_BANK["AI Engineer"])
    
    selected = []
    if interview_type == "HR":
        source = role_questions.get("HR", QUESTION_BANK["AI Engineer"]["HR"])
        selected = source[:3]
    elif interview_type == "Technical":
        source = role_questions.get("Technical", QUESTION_BANK["AI Engineer"]["Technical"])
        selected = source[:4]
    else: # Mixed
        tech = role_questions.get("Technical", QUESTION_BANK["AI Engineer"]["Technical"])
        hr = role_questions.get("HR", QUESTION_BANK["AI Engineer"]["HR"])
        selected = tech[:3] + hr[:1]

    questions = []
    for idx, q in enumerate(selected):
        questions.append({
            "order": idx + 1,
            "question_text": q["question"],
            "category": q["category"],
            "expected_keywords": q["keywords"]
        })

    return questions

def evaluate_user_answer(user_answer: str, expected_keywords: List[str], category: str) -> Dict[str, Any]:
    ans_clean = (user_answer or "").lower()
    
    if len(ans_clean.strip()) < 10:
        return {
            "score": 25.0,
            "relevance_score": 30.0,
            "technical_depth": 20.0,
            "feedback": "Answer is too brief. Elaborate with technical concepts, code logic, or real-world examples."
        }

    # Count keyword matches
    found_keywords = [k for k in expected_keywords if k in ans_clean]
    keyword_ratio = len(found_keywords) / len(expected_keywords) if expected_keywords else 0.5

    # Relevance & Depth calculation based on length and keyword coverage
    relevance_score = min(95.0, max(40.0, 50.0 + (keyword_ratio * 45.0)))
    depth_score = min(95.0, max(35.0, (len(ans_clean.split()) / 50.0) * 40.0 + (keyword_ratio * 50.0)))
    
    total_score = round((relevance_score * 0.5) + (depth_score * 0.5), 1)

    feedback_parts = []
    if found_keywords:
        feedback_parts.append(f"Good inclusion of key concepts: {', '.join(found_keywords[:3])}.")
    missing_k = [k for k in expected_keywords if k not in found_keywords]
    if missing_k:
        feedback_parts.append(f"To improve depth, consider mentioning: {', '.join(missing_k[:3])}.")

    return {
        "score": total_score,
        "relevance_score": round(relevance_score, 1),
        "technical_depth": round(depth_score, 1),
        "feedback": " ".join(feedback_parts) if feedback_parts else "Solid explanation covering the essential concepts."
    }

def summarize_interview_session(answers_eval: List[Dict[str, Any]], target_role: str) -> Dict[str, Any]:
    if not answers_eval:
        return {
            "technical_score": 60.0,
            "answer_relevance": 65.0,
            "concept_coverage": 60.0,
            "communication_score": 70.0,
            "overall_score": 64.0,
            "strong_areas": ["Problem Understanding"],
            "weak_areas": ["Elaborating Architecture"],
            "concepts_to_revise": ["Core System Design"],
            "next_recommended_level": "Intermediate"
        }

    avg_tech = round(sum(a.get("technical_depth", 60.0) for a in answers_eval) / len(answers_eval), 1)
    avg_rel = round(sum(a.get("relevance_score", 65.0) for a in answers_eval) / len(answers_eval), 1)
    avg_score = round(sum(a.get("score", 60.0) for a in answers_eval) / len(answers_eval), 1)

    comm_score = min(95.0, max(60.0, avg_rel + 5.0))
    concept_cov = min(95.0, max(50.0, avg_tech))

    strong = []
    weak = []
    if avg_rel >= 75:
        strong.append("Clear Concept Explanation & Relevance")
    else:
        weak.append("Answering directly to core keywords")

    if avg_tech >= 75:
        strong.append("Technical Depth & Terminology")
    else:
        weak.append("Deep architectural detail & trade-off discussion")

    if not strong:
        strong.append("Structured Answer Formulation")
    if not weak:
        weak.append("Complex Edge Case Handling")

    next_lvl = "Advanced" if avg_score >= 82 else ("Intermediate" if avg_score >= 60 else "Beginner")

    return {
        "technical_score": avg_tech,
        "answer_relevance": avg_rel,
        "concept_coverage": concept_cov,
        "communication_score": comm_score,
        "overall_score": avg_score,
        "strong_areas": strong,
        "weak_areas": weak,
        "concepts_to_revise": [f"{target_role} Architecture Patterns", "Optimization & Trade-offs"],
        "next_recommended_level": next_lvl
    }
