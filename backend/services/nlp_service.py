import re
from typing import List, Dict, Set, Tuple
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

# Comprehensive taxonomy of technical & soft skills
SKILL_TAXONOMY = {
    "Languages": [
        "python", "javascript", "typescript", "c++", "c#", "java", "go", "rust", "r", "sql", "html", "css", "bash", "shell", "kotlin", "swift"
    ],
    "AI/ML & Data Science": [
        "machine learning", "deep learning", "nlp", "natural language processing", "computer vision", "pytorch", "tensorflow", "keras",
        "scikit-learn", "pandas", "numpy", "opencv", "transformers", "huggingface", "llm", "large language models", "rag", "retrieval-augmented generation",
        "faiss", "chromadb", "embeddings", "reinforcement learning", "spacy", "nltk", "bert", "gpt", "data science", "data analysis", "neural networks"
    ],
    "Backend & Web": [
        "fastapi", "flask", "django", "node.js", "express", "react", "next.js", "vue", "angular", "rest api", "graphql", "microservices",
        "sqlalchemy", "postgresql", "mysql", "mongodb", "redis", "elasticsearch", "docker", "kubernetes", "git", "github", "ci/cd", "aws",
        "gcp", "azure", "mlops", "airflow", "kafka", "spark", "hadoop", "system design"
    ],
    "Tools & Frameworks": [
        "jupyter", "git", "docker", "linux", "postman", "streamlit", "gradio", "mlflow", "wandb", "dbt", "tableau", "power bi"
    ],
    "Soft Skills": [
        "problem solving", "communication", "teamwork", "leadership", "critical thinking", "agile", "scrum", "time management", "analytical skills"
    ]
}

FLAT_SKILL_MAP = {}
for category, skills in SKILL_TAXONOMY.items():
    for skill in skills:
        FLAT_SKILL_MAP[skill.lower()] = skill

def clean_text(text: str) -> str:
    if not text:
        return ""
    # Lowercase & remove abnormal whitespace
    text = text.lower()
    text = re.sub(r'\s+', ' ', text)
    return text.strip()

def extract_skills_from_text(text: str) -> List[str]:
    cleaned = clean_text(text)
    extracted = set()

    for skill_lower, original_name in FLAT_SKILL_MAP.items():
        # Word boundary match to prevent false positives like 'r' matching inside 'car'
        pattern = r'\b' + re.escape(skill_lower) + r'\b'
        if re.search(pattern, cleaned):
            # Format nicely
            extracted.add(format_skill_name(original_name))

    return sorted(list(extracted))

def format_skill_name(name: str) -> str:
    # Capitalize nicely
    mappings = {
        "python": "Python", "javascript": "JavaScript", "typescript": "TypeScript", "c++": "C++", "c#": "C#",
        "java": "Java", "sql": "SQL", "html": "HTML", "css": "CSS", "pytorch": "PyTorch", "tensorflow": "TensorFlow",
        "fastapi": "FastAPI", "react": "React", "next.js": "Next.js", "node.js": "Node.js", "nlp": "NLP",
        "rag": "RAG", "llm": "LLM", "mlops": "MLOps", "aws": "AWS", "gcp": "GCP", "azure": "Azure", "postgresql": "PostgreSQL",
        "mongodb": "MongoDB", "redis": "Redis", "docker": "Docker", "kubernetes": "Kubernetes", "git": "Git",
        "ci/cd": "CI/CD", "scikit-learn": "Scikit-Learn", "pandas": "Pandas", "numpy": "NumPy", "opencv": "OpenCV"
    }
    return mappings.get(name.lower(), name.title())

def compute_cosine_similarity(text1: str, text2: str) -> float:
    if not text1 or not text2:
        return 0.0
    try:
        vectorizer = TfidfVectorizer(stop_words='english')
        tfidf_matrix = vectorizer.fit_transform([text1, text2])
        sim = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])[0][0]
        return float(round(sim, 4))
    except Exception:
        return 0.0

def compute_skill_overlap(skills1: List[str], skills2: List[str]) -> Tuple[float, List[str], List[str]]:
    s1 = set(s.lower() for s in skills1)
    s2 = set(s.lower() for s in skills2)
    
    if not s2:
        return 1.0, list(skills1), []

    matched_lower = s1.intersection(s2)
    missing_lower = s2 - s1

    # Map back to formatted names
    matched = [format_skill_name(s) for s in matched_lower]
    missing = [format_skill_name(s) for s in missing_lower]
    
    overlap_ratio = len(matched_lower) / len(s2) if s2 else 0.0
    return float(round(overlap_ratio, 4)), matched, missing
