from typing import Dict, Any, List
from backend.services.nlp_service import compute_cosine_similarity
from backend.services.skill_gap_service import analyze_skill_gap

PROJECT_CATALOG = [
    {
        "id": "proj_1",
        "target_role": "AI Engineer",
        "title": "Production RAG Knowledge Assistant",
        "difficulty": "Intermediate",
        "skills_demonstrated": ["Python", "FastAPI", "RAG", "PyTorch", "Embeddings", "Docker"],
        "description": "Build an enterprise document search engine with semantic embeddings, vector index retrieval, and grounded AI responses.",
        "steps": [
            "Parse PDF/DOCX files into semantic chunks",
            "Generate sentence embeddings using PyTorch/SentenceTransformers",
            "Store vectors in FAISS or ChromaDB index",
            "Expose FastAPI endpoints with streaming responses and Dockerize"
        ]
    },
    {
        "id": "proj_2",
        "target_role": "AI Engineer",
        "title": "Autonomous AI Agent Workflow Pipeline",
        "difficulty": "Advanced",
        "skills_demonstrated": ["Python", "LLM", "Tool Calling", "Asyncio", "Docker"],
        "description": "Develop a multi-agent system where independent AI agents plan, execute shell scripts, and verify code tasks.",
        "steps": [
            "Define tool schemas and execution sandbox",
            "Implement agent loop with goal decomposition",
            "Integrate error fallback and logging dashboard"
        ]
    },
    {
        "id": "proj_3",
        "target_role": "ML Engineer",
        "title": "End-to-End MLOps Pipeline with MLflow & Docker",
        "difficulty": "Intermediate",
        "skills_demonstrated": ["Python", "MLOps", "Scikit-Learn", "Docker", "Git", "REST API"],
        "description": "Train, track, containerize, and deploy a machine learning regression model with automated metrics logging.",
        "steps": [
            "Setup MLflow experiment tracking for hyperparameter sweeps",
            "Build model validation and artifact registry",
            "Package model into Dockerized FastAPI microservice"
        ]
    },
    {
        "id": "proj_4",
        "target_role": "Python Developer",
        "title": "High-Throughput Microservice with Redis Caching",
        "difficulty": "Intermediate",
        "skills_demonstrated": ["Python", "FastAPI", "PostgreSQL", "Redis", "Docker"],
        "description": "Architect a scalable backend system with connection pooling, Redis caching layer, and rate-limiting middleware.",
        "steps": [
            "Design normalized PostgreSQL database schema with SQLAlchemy",
            "Implement Redis caching for high-frequency queries",
            "Add JWT authentication and automated API documentation"
        ]
    }
]

def recommend_projects(target_role: str, user_skills: List[str]) -> List[Dict[str, Any]]:
    gap_info = analyze_skill_gap(user_skills, target_role)
    missing_skills = gap_info["skills_you_need"]

    scored_projects = []
    for proj in PROJECT_CATALOG:
        # Match score based on role match + missing skill coverage
        role_score = 40.0 if proj["target_role"] == target_role else 15.0
        
        # Skill gap overlap
        demonstrated = proj["skills_demonstrated"]
        gap_overlap = [s for s in demonstrated if s in missing_skills]
        gap_score = (len(gap_overlap) / len(missing_skills) * 45.0) if missing_skills else 25.0

        total_score = round(min(98.0, role_score + gap_score + 15.0), 1)

        scored_projects.append({
            "project": proj,
            "score": total_score,
            "addresses_gaps": gap_overlap
        })

    scored_projects.sort(key=lambda x: x["score"], reverse=True)
    return [item["project"] for item in scored_projects]
