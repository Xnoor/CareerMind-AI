import re
from typing import Dict, Any, List
from backend.services.nlp_service import extract_skills_from_text, format_skill_name

def parse_job_description(title: str, company: str, description_text: str) -> Dict[str, Any]:
    text = description_text or ""
    all_skills = extract_skills_from_text(text)

    # Distinguish required vs preferred skills heuristic
    lines = text.split("\n")
    required = []
    preferred = []
    is_pref = False

    for line in lines:
        l_lower = line.lower()
        if "preferred" in l_lower or "nice to have" in l_lower or "plus" in l_lower:
            is_pref = True
        elif "required" in l_lower or "must have" in l_lower or "qualifications" in l_lower:
            is_pref = False

        line_skills = extract_skills_from_text(line)
        for s in line_skills:
            if is_pref:
                if s not in preferred:
                    preferred.append(s)
            else:
                if s not in required:
                    required.append(s)

    # Ensure all extracted skills are at least in required if missing
    for s in all_skills:
        if s not in required and s not in preferred:
            required.append(s)

    # Extract experience required
    exp_match = re.search(r'(\d+[\+-]?\s*(?:to\s*\d+\s*)?(?:years?|yrs?))', text, re.IGNORECASE)
    exp_req = exp_match.group(0) if exp_match else "0-2 years"

    # Identify tools & responsibilities
    tools = [s for s in all_skills if s in ["Docker", "Kubernetes", "Git", "Postman", "Linux", "MLflow", "Jupyter", "Wandb", "Airflow"]]
    
    responsibilities = []
    for line in lines:
        if line.strip().startswith(("-", "•", "*", "1.", "2.", "3.")):
            cleaned_line = re.sub(r'^[-•*\d\.]+\s*', '', line).strip()
            if len(cleaned_line) > 15:
                responsibilities.append(cleaned_line)

    return {
        "title": title or "Software Engineer",
        "company": company or "Tech Company",
        "description_text": text,
        "required_skills": required,
        "preferred_skills": preferred,
        "experience_required": exp_req,
        "tools": tools,
        "responsibilities": responsibilities[:8]
    }
