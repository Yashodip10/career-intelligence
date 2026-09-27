const { GoogleGenAI } = require("@google/genai")


const MODEL = "gemini-embedding-2"
const OUTPUT_DIMENSIONALITY = 768


const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
})


// ==========================================
// Generate Embedding
// ==========================================

const generateEmbedding = async (text) => {

  if (!text || !text.trim()) {
    return []
  }


  const response =
    await ai.models.embedContent({

      model: MODEL,

      contents: text,

      config: {
        outputDimensionality:
          OUTPUT_DIMENSIONALITY
      }

    })


  if (
    !response.embeddings ||
    !response.embeddings[0] ||
    !response.embeddings[0].values
  ) {

    throw new Error(
      "Gemini embedding was not generated"
    )

  }


  return response.embeddings[0].values
}


// ==========================================
// Cosine Similarity
// ==========================================

const cosineSimilarity = (
  vectorA,
  vectorB
) => {

  if (
    !vectorA.length ||
    !vectorB.length ||
    vectorA.length !== vectorB.length
  ) {

    return 0

  }


  let dotProduct = 0
  let magnitudeA = 0
  let magnitudeB = 0


  for (
    let i = 0;
    i < vectorA.length;
    i++
  ) {

    dotProduct +=
      vectorA[i] * vectorB[i]

    magnitudeA +=
      vectorA[i] * vectorA[i]

    magnitudeB +=
      vectorB[i] * vectorB[i]

  }


  if (
    magnitudeA === 0 ||
    magnitudeB === 0
  ) {

    return 0

  }


  return (
    dotProduct /
    (
      Math.sqrt(magnitudeA) *
      Math.sqrt(magnitudeB)
    )
  )

}


// ==========================================
// Similarity → Score
// ==========================================

const similarityToScore = (
  similarity
) => {

  const normalized =
    Math.max(
      0,
      Math.min(
        1,
        (similarity + 1) / 2
      )
    )


  return Math.round(
    normalized * 10000
  ) / 100

}


// ==========================================
// Whole Resume Semantic Matching
// ==========================================

const calculateSemanticTextMatch = async (
  resumeText,
  jobText
) => {

  if (
    !resumeText ||
    !resumeText.trim() ||
    !jobText ||
    !jobText.trim()
  ) {

    return 0

  }


  try {

    const [
      resumeEmbedding,
      jobEmbedding
    ] = await Promise.all([

      generateEmbedding(resumeText),

      generateEmbedding(jobText)

    ])


    const similarity =
      cosineSimilarity(
        resumeEmbedding,
        jobEmbedding
      )


    return similarityToScore(
      similarity
    )

  } catch (error) {

    console.error(
      "Semantic text matching error:",
      error.message
    )

    throw error

  }

}


// ==========================================
// Semantic Skill Matching
// ==========================================

const calculateSemanticSkillMatch = async (
  resumeSkills,
  jobSkills
) => {

  if (
    !Array.isArray(resumeSkills) ||
    !Array.isArray(jobSkills) ||
    resumeSkills.length === 0 ||
    jobSkills.length === 0
  ) {

    return {

      score: 0,

      matchedSkills: [],

      missingSkills: jobSkills || []

    }

  }


  const cleanResumeSkills =
    resumeSkills
      .filter(Boolean)
      .map(
        skill =>
          skill.toString().trim()
      )
      .filter(Boolean)


  const cleanJobSkills =
    jobSkills
      .filter(Boolean)
      .map(
        skill =>
          skill.toString().trim()
      )
      .filter(Boolean)


  if (
    cleanResumeSkills.length === 0 ||
    cleanJobSkills.length === 0
  ) {

    return {

      score: 0,

      matchedSkills: [],

      missingSkills:
        cleanJobSkills

    }

  }


  try {

    // ----------------------------------------
    // Create ONE combined representation
    // for resume skills and ONE for job skills.
    // ----------------------------------------

    const resumeSkillText =
      cleanResumeSkills.join(", ")


    const jobSkillText =
      cleanJobSkills.join(", ")


    const [
      resumeEmbedding,
      jobEmbedding
    ] = await Promise.all([

      generateEmbedding(
        resumeSkillText
      ),

      generateEmbedding(
        jobSkillText
      )

    ])


    // ----------------------------------------
    // Overall semantic skill similarity
    // ----------------------------------------

    const similarity =
      cosineSimilarity(
        resumeEmbedding,
        jobEmbedding
      )


    const score =
      similarityToScore(
        similarity
      )


    // ----------------------------------------
    // Determine matched / missing skills
    //
    // Keyword matching already handles exact
    // skill names. Here we use simple semantic
    // groups for useful explanations without
    // making dozens of Gemini API calls.
    // ----------------------------------------

    const resumeLower =
      cleanResumeSkills.map(
        skill =>
          skill.toLowerCase()
      )


    const matchedSkills = []
    const missingSkills = []


    for (
      const jobSkill of cleanJobSkills
    ) {

      const jobSkillLower =
        jobSkill.toLowerCase()


      const exactMatch =
        resumeLower.some(
          resumeSkill =>
            resumeSkill ===
              jobSkillLower ||
            resumeSkill.includes(
              jobSkillLower
            ) ||
            jobSkillLower.includes(
              resumeSkill
            )
        )


      if (exactMatch) {

        matchedSkills.push(
          jobSkill
        )

      } else {

        missingSkills.push(
          jobSkill
        )

      }

    }


    return {

      score,

      matchedSkills,

      missingSkills

    }

  } catch (error) {

    console.error(
      "Semantic skill matching error:",
      error.message
    )

    throw error

  }

}


// ==========================================
// Export
// ==========================================

module.exports = {

  generateEmbedding,

  cosineSimilarity,

  calculateSemanticTextMatch,

  calculateSemanticSkillMatch

}