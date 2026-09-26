from sqlalchemy.orm import Session
from backend.models.models import User, UserProfile, UserPreference, JobDescription, CodingChallenge, ProjectRecommendation
from backend.services.auth_service import get_password_hash

def seed_database(db: Session):
    # Check if already seeded
    if db.query(JobDescription).first():
        return

    # 1. Seed Demo User
    demo_user = User(
        name="Alex Morgan",
        email="alex@careermind.ai",
        password_hash=get_password_hash("password123")
    )
    db.add(demo_user)
    db.commit()
    db.refresh(demo_user)

    profile = UserProfile(
        user_id=demo_user.id,
        education="Master of Computer Applications (MCA)",
        degree="MCA / Computer Science",
        experience_level="Entry Level",
        current_role="Student / Fresh Graduate",
        target_role="AI Engineer",
        years_of_experience=0.5,
        skills=["Python", "Machine Learning", "FastAPI", "React", "SQL", "Pandas", "Scikit-Learn"],
        technical_interests=["Generative AI", "LLM", "MLOps", "Full Stack Development"],
        preferred_locations=["Remote", "San Francisco", "Bangalore", "New York"],
        preferred_industries=["Artificial Intelligence", "SaaS", "FinTech"],
        bio="Aspiring AI Engineer passionate about building scalable generative AI applications and intelligent career tools."
    )
    db.add(profile)

    preference = UserPreference(
        user_id=demo_user.id,
        dark_mode=True
    )
    db.add(preference)

    # 2. Seed Realistic Sample Jobs
    jobs_data = [
        {
            "title": "AI Engineer (LLM & RAG)",
            "company": "Cognitive Cloud AI",
            "location": "Remote / San Francisco",
            "description_text": """Cognitive Cloud AI is looking for an AI Engineer to join our core product team. 
You will build, deploy, and scale Retrieval-Augmented Generation (RAG) applications, LLM agents, and vector search engines.
Requirements:
- Strong proficiency in Python, PyTorch, and FastAPI.
- Hands-on experience with vector databases (FAISS, ChromaDB) and sentence embeddings.
- Experience with Docker, MLOps pipelines, and PostgreSQL.
- Knowledge of Deep Learning, NLP, and model evaluation metrics.""",
            "required_skills": ["Python", "PyTorch", "FastAPI", "LLM", "RAG", "Vector Store", "Docker", "SQL"],
            "preferred_skills": ["MLOps", "Kubernetes", "Redis", "LangChain"],
            "experience_required": "0-2 years",
            "tools": ["Docker", "FAISS", "Git", "Postman"],
            "domain": "Artificial Intelligence",
            "is_sample": True
        },
        {
            "title": "Machine Learning Engineer",
            "company": "DataPulse Analytics",
            "location": "Hybrid / Bangalore",
            "description_text": """DataPulse is seeking an ML Engineer to design predictive models and deploy automated ML workflows.
Key Responsibilities:
- Build and evaluate machine learning models using Scikit-Learn, PyTorch, and Pandas.
- Package ML models into containerized FastAPI REST APIs.
- Monitor model drift and automate retraining pipelines using Docker and MLOps tools.""",
            "required_skills": ["Python", "Machine Learning", "Scikit-Learn", "PyTorch", "Docker", "SQL", "Git"],
            "preferred_skills": ["MLOps", "MLflow", "TensorFlow", "AWS"],
            "experience_required": "1-3 years",
            "tools": ["Docker", "Jupyter", "Git", "MLflow"],
            "domain": "Machine Learning",
            "is_sample": True
        },
        {
            "title": "Junior Python Developer",
            "company": "Nexus Web Systems",
            "location": "Remote",
            "description_text": """Nexus Web Systems is hiring a Junior Python Developer to build high-performance backend microservices.
Requirements:
- Strong core Python syntax, OOP, and data structures.
- Experience with FastAPI, Django, or Flask.
- Good understanding of PostgreSQL, SQL queries, REST API design, and Git version control.""",
            "required_skills": ["Python", "FastAPI", "SQL", "PostgreSQL", "REST API", "Git"],
            "preferred_skills": ["Docker", "Redis", "React"],
            "experience_required": "0-2 years",
            "tools": ["Git", "Postman", "Linux"],
            "domain": "Backend Engineering",
            "is_sample": True
        }
    ]

    for j in jobs_data:
        job_obj = JobDescription(**j)
        db.add(job_obj)

    # 3. Seed Coding Challenges
    challenges = [
        {
            "title": "Cosine Similarity Calculation",
            "category": "Machine Learning",
            "difficulty": "Easy",
            "problem_statement": "Write a Python function `cosine_sim(v1, v2)` that calculates the cosine similarity between two 1D numerical lists `v1` and `v2`. Return the float rounded to 4 decimal places.",
            "starter_code": """def cosine_sim(v1, v2):
    # Compute dot product and magnitudes
    dot = sum(a * b for a, b in zip(v1, v2))
    mag1 = (sum(a**2 for a in v1)) ** 0.5
    mag2 = (sum(b**2 for b in v2)) ** 0.5
    if mag1 == 0 or mag2 == 0:
        return 0.0
    return round(dot / (mag1 * mag2), 4)

# Test execution
v1 = [1, 2, 3]
v2 = [1, 2, 3]
print(cosine_sim(v1, v2))""",
            "example_input": "v1 = [1, 0], v2 = [0, 1]",
            "example_output": "0.0",
            "test_cases": [{"expected": "1.0"}]
        },
        {
            "title": "Text Skill Extraction & Frequency",
            "category": "NLP",
            "difficulty": "Easy",
            "problem_statement": "Write a function `count_keywords(text, keywords)` that returns a dictionary mapping each keyword to its frequency count in `text` (case-insensitive).",
            "starter_code": """def count_keywords(text, keywords):
    t_lower = text.lower()
    result = {}
    for kw in keywords:
        result[kw] = t_lower.count(kw.lower())
    return result

text = "Python is great for Python AI and Machine Learning"
keywords = ["python", "ai", "java"]
print(count_keywords(text, keywords))""",
            "example_input": "text = 'Python Python', keywords = ['python']",
            "example_output": "{'python': 2}",
            "test_cases": [{"expected": "{'python': 2, 'ai': 1, 'java': 0}"}]
        }
    ]

    for c in challenges:
        c_obj = CodingChallenge(**c)
        db.add(c_obj)

    db.commit()
