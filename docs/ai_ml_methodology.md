# AI / ML Methodology & Algorithmic Formulation - CAREERMIND AI

## 1. Job Match Score Formulation
CareerMind AI uses an explainable weighted scoring formula rather than black-box probabilities:

$$\text{Overall Compatibility} = (S_{\text{skill}} \times W_{\text{skill}}) + (S_{\text{sem}} \times W_{\text{sem}}) + (S_{\text{pref}} \times W_{\text{pref}}) + (S_{\text{exp}} \times W_{\text{exp}})$$

Where:
* $S_{\text{skill}} = \frac{|\text{User Skills} \cap \text{Required Job Skills}|}{|\text{Required Job Skills}|} \times 100$
* $S_{\text{sem}} = \text{CosineSimilarity}(\mathbf{v}_{\text{resume}}, \mathbf{v}_{\text{job}}) \times 100$
* $W_{\text{skill}} = 0.40, W_{\text{sem}} = 0.25, W_{\text{pref}} = 0.20, W_{\text{exp}} = 0.15$

## 2. Text Representation & Cosine Similarity
Using Term Frequency-Inverse Document Frequency (TF-IDF):

$$\text{CosineSimilarity}(A, B) = \frac{\mathbf{A} \cdot \mathbf{B}}{\|\mathbf{A}\| \|\mathbf{B}\|} = \frac{\sum_{i=1}^{n} A_i B_i}{\sqrt{\sum_{i=1}^{n} A_i^2} \sqrt{\sum_{i=1}^{n} B_i^2}}$$

## 3. RAG Knowledge System Architecture
1. **Document Chunking**: Career guides and interview topic documents split into semantic passages.
2. **Embedding & Vector Search**: TF-IDF / Dense sentence embeddings vectorized and indexed in a scikit-learn matrix.
3. **Retrieval**: Top $K=2$ passages retrieved using cosine distance thresholds.
4. **Prompt Injection Defense**: User document text strictly treated as DATA variables, preventing system instruction override.

## 4. Career DNA Readiness Stage Calculation
$$\text{Readiness Score} = \frac{|\text{User Skills} \cap \text{Target Role Core Skills}|}{|\text{Target Role Core Skills}|} \times 100$$
* $\ge 80\%$: Job-Ready Candidate
* $50\% - 79\%$: Intermediate Developer
* $< 50\%$: Learning & Building Stage
