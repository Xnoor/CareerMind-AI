from typing import Dict, Any, List
from backend.services.skill_gap_service import analyze_skill_gap

def generate_personalized_roadmap(target_role: str, user_skills: List[str]) -> Dict[str, Any]:
    gap = analyze_skill_gap(user_skills, target_role)
    missing = gap["skills_you_need"]

    # Fill default plan
    month_plans = [
        {
            "month": 1,
            "skill": missing[0] if len(missing) > 0 else "Advanced Python & Code Quality",
            "category": "Core Foundation",
            "why_it_matters": "Establishes a solid foundational baseline required for production software engineering.",
            "project_idea": "Build an async CLI tool with comprehensive unit testing and logging.",
            "practice_task": "Solve 10 algorithm problems focusing on data structures and performance."
        },
        {
            "month": 2,
            "skill": missing[1] if len(missing) > 1 else "Machine Learning Fundamentals",
            "category": "Domain Specialization",
            "why_it_matters": "Crucial for understanding underlying algorithms, mathematical loss functions, and data transformations.",
            "project_idea": "Train and compare 3 baseline classifiers on a real-world tabular dataset.",
            "practice_task": "Perform EDA and feature engineering pipeline on a noisy dataset."
        },
        {
            "month": 3,
            "skill": missing[2] if len(missing) > 2 else "Deep Learning & Frameworks",
            "category": "Advanced Neural Networks",
            "why_it_matters": "Powers modern AI models, computer vision, and language understanding pipelines.",
            "project_idea": "Implement a custom PyTorch model for image or text classification with data loaders.",
            "practice_task": "Debug vanishing gradients and tune learning rate schedulers."
        },
        {
            "month": 4,
            "skill": missing[3] if len(missing) > 3 else "RAG & LLM Application Architecture",
            "category": "AI Applications",
            "why_it_matters": "High demand in current AI industry for building intelligent enterprise search & assistants.",
            "project_idea": "Build a Document Q&A Knowledge Base assistant using embeddings and vector search.",
            "practice_task": "Optimize vector retrieval recall using semantic chunking strategies."
        },
        {
            "month": 5,
            "skill": missing[4] if len(missing) > 4 else "MLOps & Docker Deployment",
            "category": "Production & Infrastructure",
            "why_it_matters": "Bridges the gap between standalone notebooks and scalable, monitored cloud services.",
            "project_idea": "Containerize a FastAPI app with Docker and setup a GitHub Actions CI/CD pipeline.",
            "practice_task": "Deploy your API container with health check probes and monitoring logs."
        },
        {
            "month": 6,
            "skill": "Portfolio Engineering & AI Mock Interviews",
            "category": "Career Launch",
            "why_it_matters": "Demonstrates full-stack end-to-end execution to technical hiring managers and recruiters.",
            "project_idea": "Assemble your top 3 projects into a interactive web portfolio with live demo URLs.",
            "practice_task": "Complete 5 AI Mock Interview sessions and practice technical coding challenges."
        }
    ]

    for item in month_plans:
        item["status"] = "Not Started"

    return {
        "target_role": target_role,
        "title": f"6-Month {target_role} Mastery Roadmap",
        "duration_months": 6,
        "items": month_plans
    }
