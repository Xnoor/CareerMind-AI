from typing import Dict, Any, List
from backend.services.nlp_service import compute_cosine_similarity, compute_skill_overlap

def compute_job_match(
    user_skills: List[str],
    user_resume_text: str,
    job_required_skills: List[str],
    job_text: str,
    user_experience_years: float = 0.0,
    weights_config: Dict[str, float] = None
) -> Dict[str, Any]:
    if weights_config is None:
        weights_config = {
            "skill_similarity": 0.40,
            "semantic_similarity": 0.25,
            "preference_match": 0.20,
            "experience_alignment": 0.15
        }

    # 1. Skill Coverage Ratio
    skill_overlap_ratio, matched_skills, missing_skills = compute_skill_overlap(user_skills, job_required_skills)
    skill_score = skill_overlap_ratio * 100.0

    # 2. Semantic Similarity
    semantic_sim = compute_cosine_similarity(user_resume_text or " ".join(user_skills), job_text)
    semantic_score = semantic_sim * 100.0

    # 3. Preference Match (Default 75% for baseline compatibility)
    preference_score = 75.0

    # 4. Experience Alignment
    # Baseline experience score: entry level 85%, adjusts depending on years
    exp_score = min(100.0, max(50.0, 70.0 + (user_experience_years * 5.0)))

    # Weighted Overall Compatibility Score
    w_skill = weights_config.get("skill_similarity", 0.40)
    w_sem = weights_config.get("semantic_similarity", 0.25)
    w_pref = weights_config.get("preference_match", 0.20)
    w_exp = weights_config.get("experience_alignment", 0.15)

    overall_score = (
        (skill_score * w_skill) +
        (semantic_score * w_sem) +
        (preference_score * w_pref) +
        (exp_score * w_exp)
    )
    overall_score = round(min(98.0, max(15.0, overall_score)), 1)

    # Generate transparent explanation
    explanation = (
        f"Matched because your resume contains key skills ({', '.join(matched_skills[:4]) if matched_skills else 'base profile skills'}), "
        f"which overlap with the job requirements. Semantic similarity is {round(semantic_sim, 2)} with a skill coverage of {int(skill_score)}%."
    )

    return {
        "overall_score": overall_score,
        "semantic_similarity": round(semantic_sim, 2),
        "skill_coverage": round(skill_score, 1),
        "experience_alignment": round(exp_score, 1),
        "matched_skills": matched_skills,
        "missing_skills": missing_skills,
        "explanation": explanation
    }
