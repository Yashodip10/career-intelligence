from fastapi import FastAPI
from pydantic import BaseModel
from fastembed import TextEmbedding
import numpy as np

app = FastAPI()

# Load lightweight ONNX embedding model
model = TextEmbedding(
    model_name="sentence-transformers/all-MiniLM-L6-v2"
)


# ==========================================
# Request Models
# ==========================================

class SemanticMatchRequest(BaseModel):
    resume_text: str
    job_text: str


class SemanticSkillMatchRequest(BaseModel):
    resume_skills: list[str]
    job_skills: list[str]


# ==========================================
# Basic Test Route
# ==========================================

@app.get("/")
def home():
    return {
        "message": "Career Intelligence AI Service is running"
    }


# ==========================================
# Helper
# ==========================================

def cosine_similarity(vector_a, vector_b):
    vector_a = np.array(vector_a)
    vector_b = np.array(vector_b)

    denominator = (
        np.linalg.norm(vector_a) *
        np.linalg.norm(vector_b)
    )

    if denominator == 0:
        return 0.0

    return float(
        np.dot(vector_a, vector_b) / denominator
    )


# ==========================================
# Semantic Resume Matching
# ==========================================

@app.post("/semantic-match")
def semantic_match(data: SemanticMatchRequest):

    resume_embedding = list(
        model.embed([data.resume_text])
    )[0]

    job_embedding = list(
        model.embed([data.job_text])
    )[0]

    similarity = cosine_similarity(
        resume_embedding,
        job_embedding
    )

    score = round(
        similarity * 100,
        2
    )

    return {
        "score": score
    }


# ==========================================
# Semantic Skill Matching
# ==========================================

@app.post("/semantic-skill-match")
def semantic_skill_match(
    data: SemanticSkillMatchRequest
):

    resume_skills = data.resume_skills
    job_skills = data.job_skills

    # --------------------------------------
    # Handle empty skill lists
    # --------------------------------------

    if not resume_skills or not job_skills:
        return {
            "score": 0,
            "matchedSkills": [],
            "relatedSkills": [],
            "missingSkills": job_skills
        }

    # --------------------------------------
    # Create embeddings
    # --------------------------------------

    resume_embeddings = list(
        model.embed(resume_skills)
    )

    job_embeddings = list(
        model.embed(job_skills)
    )

    # --------------------------------------
    # Find semantic matches
    # --------------------------------------

    matched_skills = []
    related_skills = []
    matched_job_indexes = set()

    for resume_index, resume_skill in enumerate(
        resume_skills
    ):

        best_job_index = -1
        best_similarity = -1.0

        for job_index, job_embedding in enumerate(
            job_embeddings
        ):

            similarity = cosine_similarity(
                resume_embeddings[resume_index],
                job_embedding
            )

            if similarity > best_similarity:
                best_similarity = similarity
                best_job_index = job_index

        job_skill = job_skills[best_job_index]

        similarity_percentage = round(
            best_similarity * 100,
            2
        )

        # ----------------------------------
        # Strong / exact semantic match
        # ----------------------------------

        if best_similarity >= 0.80:

            matched_skills.append({
                "resumeSkill": resume_skill,
                "jobSkill": job_skill,
                "similarity": similarity_percentage
            })

            matched_job_indexes.add(
                best_job_index
            )

        # ----------------------------------
        # Related semantic skill
        # ----------------------------------

        elif best_similarity >= 0.45:

            related_skills.append({
                "resumeSkill": resume_skill,
                "jobSkill": job_skill,
                "similarity": similarity_percentage
            })

            matched_job_indexes.add(
                best_job_index
            )

    # --------------------------------------
    # Find missing job skills
    # --------------------------------------

    missing_skills = []

    for index, job_skill in enumerate(
        job_skills
    ):

        if index not in matched_job_indexes:
            missing_skills.append(job_skill)

    # --------------------------------------
    # Calculate semantic skill score
    # --------------------------------------

    matched_count = len(
        matched_job_indexes
    )

    score = round(
        (
            matched_count /
            len(job_skills)
        ) * 100,
        2
    )

    # --------------------------------------
    # Return result
    # --------------------------------------

    return {
        "score": score,
        "matchedSkills": matched_skills,
        "relatedSkills": related_skills,
        "missingSkills": missing_skills
    }