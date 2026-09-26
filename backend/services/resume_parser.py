import io
import re
from typing import Dict, Any, List

try:
    from pypdf import PdfReader
except ImportError:
    PdfReader = None

try:
    import docx
except ImportError:
    docx = None


from backend.services.nlp_service import extract_skills_from_text, format_skill_name

def extract_text_from_file(file_bytes: bytes, filename: str) -> str:
    ext = filename.lower().split('.')[-1]
    text = ""
    if ext == "pdf":
        if PdfReader is not None:
            try:
                reader = PdfReader(io.BytesIO(file_bytes))
                for page in reader.pages:
                    text += page.extract_text() or ""
            except Exception as e:
                text = f"Error reading PDF: {str(e)}"
        else:
            text = file_bytes.decode("utf-8", errors="ignore")
    elif ext in ["docx", "doc"]:
        if docx is not None:
            try:
                doc = docx.Document(io.BytesIO(file_bytes))
                for para in doc.paragraphs:
                    text += para.text + "\n"
            except Exception as e:
                text = f"Error reading DOCX: {str(e)}"
        else:
            text = file_bytes.decode("utf-8", errors="ignore")

    elif ext == "txt":
        try:
            text = file_bytes.decode("utf-8", errors="ignore")
        except Exception as e:
            text = f"Error reading TXT: {str(e)}"
    else:
        text = file_bytes.decode("utf-8", errors="ignore")

    return text.strip()

def parse_resume_structure(text: str) -> Dict[str, Any]:
    # Extract contact info strictly without fabricating missing data
    email_match = re.search(r'[\w\.-]+@[\w\.-]+\.\w+', text)
    phone_match = re.search(r'(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}', text)
    
    # Extract Name candidate (first non-empty line)
    lines = [l.strip() for l in text.split("\n") if l.strip()]
    name_candidate = lines[0] if lines else "Not detected"
    if len(name_candidate) > 50 or "@" in name_candidate:
        name_candidate = "Not detected"

    email = email_match.group(0) if email_match else "Not detected"
    phone = phone_match.group(0) if phone_match else "Not detected"

    # Extract skills
    skills = extract_skills_from_text(text)

    # Detect sections
    sections = {
        "education": [],
        "experience": [],
        "projects": [],
        "certifications": []
    }

    current_section = None
    lines_lower = text.lower().split("\n")

    for line in lines:
        l_clean = line.strip().lower()
        if "education" in l_clean or "qualification" in l_clean or "academic" in l_clean:
            current_section = "education"
            continue
        elif "experience" in l_clean or "employment" in l_clean or "work history" in l_clean:
            current_section = "experience"
            continue
        elif "project" in l_clean or "portfolio" in l_clean:
            current_section = "projects"
            continue
        elif "certification" in l_clean or "certificate" in l_clean or "license" in l_clean:
            current_section = "certifications"
            continue

        if current_section and len(line) > 3:
            sections[current_section].append(line)

    # Clean section strings
    edu_str = "\n".join(sections["education"][:5]) if sections["education"] else "Not detected"
    exp_str = "\n".join(sections["experience"][:10]) if sections["experience"] else "Not detected"
    proj_str = "\n".join(sections["projects"][:10]) if sections["projects"] else "Not detected"
    cert_str = "\n".join(sections["certifications"][:5]) if sections["certifications"] else "Not detected"

    return {
        "name": name_candidate,
        "email": email,
        "phone": phone,
        "skills": skills,
        "education": edu_str,
        "experience": exp_str,
        "projects": proj_str,
        "certifications": cert_str,
        "raw_length": len(text)
    }

def analyze_resume_ats_quality(parsed_data: Dict[str, Any], text: str) -> Dict[str, Any]:
    score = 50.0 # base score
    breakdown = {}
    suggestions = []

    # 1. Skills Completeness (Max 25 pts)
    skills = parsed_data.get("skills", [])
    if len(skills) >= 10:
        skill_pts = 25.0
    elif len(skills) >= 5:
        skill_pts = 18.0
        suggestions.append("Add more domain-specific technical skills to pass keyword filters.")
    else:
        skill_pts = 10.0
        suggestions.append("Skill section is sparse. Include relevant languages, frameworks, and libraries.")
    breakdown["skill_coverage"] = skill_pts

    # 2. Section Completeness (Max 25 pts)
    sec_pts = 0
    if parsed_data.get("education") != "Not detected":
        sec_pts += 7.0
    else:
        suggestions.append("Add a clear 'Education' section with your degree and university.")

    if parsed_data.get("experience") != "Not detected":
        sec_pts += 9.0
    else:
        suggestions.append("Add an 'Experience' or 'Internship' section describing your responsibilities.")

    if parsed_data.get("projects") != "Not detected":
        sec_pts += 9.0
    else:
        suggestions.append("Include a 'Projects' section highlighting real-world AI/ML or engineering builds.")
    breakdown["section_completeness"] = sec_pts

    # 3. Action Verbs & Measurable Impact (Max 25 pts)
    action_verbs = ["developed", "built", "implemented", "designed", "engineered", "optimized", "increased", "reduced", "led", "created", "deployed"]
    text_lower = text.lower()
    verb_matches = [v for v in action_verbs if v in text_lower]
    
    if len(verb_matches) >= 5:
        impact_pts = 25.0
    elif len(verb_matches) >= 2:
        impact_pts = 15.0
        suggestions.append("Use strong action verbs like 'Engineered', 'Optimized', 'Deployed' at the start of bullet points.")
    else:
        impact_pts = 8.0
        suggestions.append("Your project descriptions describe technologies but do not quantify outcomes. Add metrics (e.g., 'Improved accuracy by 15%').")
    breakdown["action_verbs_and_impact"] = impact_pts

    # 4. Contact & Formatting (Max 25 pts)
    fmt_pts = 0
    if parsed_data.get("email") != "Not detected":
        fmt_pts += 12.5
    else:
        suggestions.append("Ensure your email address is clearly visible at the top of your resume.")
    
    if parsed_data.get("raw_length", 0) > 300:
        fmt_pts += 12.5
    else:
        suggestions.append("Resume content appears very short. Expand on technical projects and coursework.")
    breakdown["formatting_and_contact"] = fmt_pts

    total_ats_score = round(skill_pts + sec_pts + impact_pts + fmt_pts, 1)

    return {
        "ats_score": total_ats_score,
        "ats_breakdown": breakdown,
        "improvement_suggestions": suggestions
    }
