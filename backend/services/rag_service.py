from typing import List, Dict, Any
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

# Career Knowledge Base Documents
CAREER_KNOWLEDGE_DOCS = [
    {
        "id": "doc_1",
        "title": "AI Engineer Preparation & Roadmap",
        "content": "An AI Engineer builds production systems combining software engineering, deep learning, LLMs, and RAG architectures. Essential skills include Python, PyTorch, FastAPI, Vector DBs (FAISS/ChromaDB), and Docker. Key interview topics include transformer attention mechanisms, embedding similarity, and MLOps deployment."
    },
    {
        "id": "doc_2",
        "title": "RAG (Retrieval-Augmented Generation) Concepts",
        "content": "RAG connects an LLM to external knowledge bases. The pipeline chunks documents into text passages, converts them into dense vector embeddings using models like SentenceTransformers, stores them in a vector index, and retrieves top-k relevant chunks to inject into the LLM prompt context."
    },
    {
        "id": "doc_3",
        "title": "ATS Resume Optimization Strategy",
        "content": "Applicant Tracking Systems (ATS) scan resumes for exact keyword alignment, section headings, and readable formatting. To pass ATS: use standard section titles (Skills, Experience, Education), quantify project achievements with metrics, and match tech skills directly to target job descriptions."
    },
    {
        "id": "doc_4",
        "title": "System Design for Machine Learning APIs",
        "content": "Building scalable ML APIs requires separating heavy model inference from request processing. Use asynchronous web frameworks like FastAPI, queueing systems like Celery/Redis for background jobs, model quantization to reduce latency, and containerization with Docker."
    },
    {
        "id": "doc_5",
        "title": "Technical Interview Answer Framework (STAR Method)",
        "content": "In technical and behavioral interviews, structure answers using the STAR method: Situation (context), Task (goal), Action (specific implementation & technical decisions), Result (quantified impact and lessons learned)."
    }
]

class CareerRAGSystem:
    def __init__(self):
        self.docs = CAREER_KNOWLEDGE_DOCS
        self.vectorizer = TfidfVectorizer(stop_words='english')
        self.doc_texts = [d["content"] for d in self.docs]
        self.matrix = self.vectorizer.fit_transform(self.doc_texts)

    def retrieve_relevant_chunks(self, query: str, top_k: int = 2) -> List[Dict[str, Any]]:
        if not query:
            return []
        try:
            q_vec = self.vectorizer.transform([query])
            sims = cosine_similarity(q_vec, self.matrix)[0]

            indexed_sims = list(enumerate(sims))
            indexed_sims.sort(key=lambda x: x[1], reverse=True)

            results = []
            for idx, score in indexed_sims[:top_k]:
                if score > 0.05: # Relevance threshold
                    doc = self.docs[idx].copy()
                    doc["relevance_score"] = float(round(score, 4))
                    results.append(doc)
            return results
        except Exception:
            return []

rag_system = CareerRAGSystem()
