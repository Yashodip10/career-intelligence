from fastapi import FastAPI
from pydantic import BaseModel
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity

app = FastAPI()

# Load the pretrained sentence-transformer model
model = SentenceTransformer("all-MiniLM-L6-v2")


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
# Semantic Resume Matching
# ==========================================

@app.post("/semantic-match")
def semantic_match(data: SemanticMatchRequest):

    resume_embedding = model.encode(
        [data.resume_text],
        normalize_embeddings=True
    )

    job_embedding = model.encode(
        [data.job_text],
        normalize_embeddings=True
    )

    similarity = cosine_similarity(
        resume_embedding,
        job_embedding
    )[0][0]

    score = round(
        float(similarity) * 100,
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

    resume_embeddings = model.encode(
        resume_skills,
        normalize_embeddings=True
    )

    job_embeddings = model.encode(
        job_skills,
        normalize_embeddings=True
    )


    # --------------------------------------
    # Calculate similarity matrix
    # --------------------------------------

    similarity_matrix = cosine_similarity(
        resume_embeddings,
        job_embeddings
    )


    matched_skills = []
    related_skills = []

    matched_job_indexes = set()


    # --------------------------------------
    # Find best semantic match
    # for every resume skill
    # --------------------------------------

    for resume_index, resume_skill in enumerate(
        resume_skills
    ):

        best_job_index = int(
            similarity_matrix[
                resume_index
            ].argmax()
        )

        best_similarity = float(
            similarity_matrix[
                resume_index,
                best_job_index
            ]
        )

        job_skill = job_skills[
            best_job_index
        ]

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
    # Find job skills not matched
    # --------------------------------------

    missing_skills = []

    for index, job_skill in enumerate(
        job_skills
    ):

        if index not in matched_job_indexes:

            missing_skills.append(
                job_skill
            )


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