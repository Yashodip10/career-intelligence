const Resume = require("../models/Resume")
const Job = require("../models/Job")

const {
  calculateKeywordMatch
} = require("../utils/jobMatcher")

const {
  calculateSemanticTextMatch,
  calculateSemanticSkillMatch
} = require("../utils/semanticMatcher")


const matchResumeWithJob = async (req, res) => {

  try {

    const { jobId } = req.params


    // =========================================
    // Get latest resume
    // =========================================

    const resume = await Resume.findOne({
      userId: req.userId
    }).sort({
      createdAt: -1
    })


    if (!resume) {

      return res.status(404).json({
        message: "Please upload a resume first"
      })

    }


    // =========================================
    // Get job
    // =========================================

    const job = await Job.findById(jobId)


    if (!job) {

      return res.status(404).json({
        message: "Job not found"
      })

    }


    // =========================================
    // Resume and Job Skills
    // =========================================

    const resumeSkills =
      resume.parsedData?.skills || []

    const jobSkills =
      job.skills || []


    const resumeText =
      (resume.rawText || "").toLowerCase()

    const jobDescription =
      (job.description || "").toLowerCase()


    // =========================================
    // 1. Keyword Matching
    // =========================================

    const keywordResult =
      calculateKeywordMatch(
        resumeSkills,
        jobSkills
      )


    const keywordMatchedCount =
      keywordResult.matchedSkills.length

    const keywordRequiredCount =
      jobSkills.length


    // =========================================
    // 2. Whole Resume Semantic Matching
    // =========================================

    const semanticScore =
      await calculateSemanticTextMatch(
        resume.rawText,
        job.description
      )


    // =========================================
    // Professional Semantic Explanation
    // =========================================

    let semanticReason = ""

    let semanticImprovements = []


    // -----------------------------------------
    // Identify common role-specific areas
    // -----------------------------------------

    const roleAreas = []


    if (
      jobDescription.includes("responsive") ||
      jobDescription.includes("frontend") ||
      jobDescription.includes("front-end") ||
      jobDescription.includes("user interface") ||
      jobDescription.includes("ui")
    ) {

      roleAreas.push(
        "responsive frontend development"
      )

    }


    if (
      jobDescription.includes("api") ||
      jobDescription.includes("backend") ||
      jobDescription.includes("server")
    ) {

      roleAreas.push(
        "API and backend development"
      )

    }


    if (
      jobDescription.includes("database") ||
      jobDescription.includes("mongodb") ||
      jobDescription.includes("mysql") ||
      jobDescription.includes("sql")
    ) {

      roleAreas.push(
        "database development"
      )

    }


    if (
      jobDescription.includes("testing") ||
      jobDescription.includes("test")
    ) {

      roleAreas.push(
        "software testing"
      )

    }


    if (
      jobDescription.includes("cloud") ||
      jobDescription.includes("aws") ||
      jobDescription.includes("azure")
    ) {

      roleAreas.push(
        "cloud technologies"
      )

    }


    // =========================================
    // High Semantic Score
    // =========================================

    if (semanticScore >= 70) {

      if (keywordMatchedCount === keywordRequiredCount) {

        semanticReason =
          `Your resume demonstrates strong alignment with this ${job.title} role. The required technical skills are present and the overall resume content is relevant to the responsibilities described in the job.`

      } else {

        semanticReason =
          `Your resume content is strongly aligned with this ${job.title} role, although some of the required skills are not explicitly represented in your resume.`

      }


      if (roleAreas.length > 0) {

        semanticReason +=
          ` The job particularly emphasizes ${roleAreas.slice(0, 2).join(" and ")}.`

      }


      if (keywordResult.missingSkills.length > 0) {

        semanticImprovements.push(
          `Strengthen evidence for ${keywordResult.missingSkills.join(", ")} if you genuinely have experience with these skills.`
        )

      }


      semanticImprovements.push(
        "Continue highlighting measurable contributions and relevant project outcomes."
      )

    }


    // =========================================
    // Moderate Semantic Score
    // =========================================

    else if (semanticScore >= 50) {

      semanticReason =
        `Your resume has relevant technical skills for this ${job.title} role, but the overall content has only moderate alignment with the job description.`


      if (keywordMatchedCount === keywordRequiredCount) {

        semanticReason +=
          ` Although all listed technical skills are covered, the project and experience descriptions do not fully reflect the responsibilities emphasized in the job.`

      }


      if (roleAreas.length > 0) {

        semanticReason +=
          ` The job description places emphasis on ${roleAreas.slice(0, 2).join(" and ")}, which should be represented more clearly in your resume.`

      }


      if (keywordResult.missingSkills.length > 0) {

        semanticImprovements.push(
          `Add relevant evidence for ${keywordResult.missingSkills.join(", ")} if you genuinely have experience with them.`
        )

      }


      semanticImprovements.push(
        `Strengthen your ${job.title} project descriptions by explaining what you built, your responsibilities, and the technologies you used.`
      )


      semanticImprovements.push(
        "Highlight projects that are most closely related to this role."
      )

    }


    // =========================================
    // Low Semantic Score
    // =========================================

    else {

      semanticReason =
        `Your resume contains some relevant skills, but the overall content has limited alignment with this ${job.title} role.`


      if (keywordMatchedCount === keywordRequiredCount) {

        semanticReason +=
          ` The required skill names are present, but the resume does not provide enough contextual evidence showing how those skills were applied.`

      }


      if (roleAreas.length > 0) {

        semanticReason +=
          ` The job focuses on ${roleAreas.slice(0, 2).join(" and ")}, which is not strongly represented in the current resume content.`

      }


      if (keywordResult.missingSkills.length > 0) {

        semanticImprovements.push(
          `Strengthen or acquire relevant experience with ${keywordResult.missingSkills.join(", ")} based on your actual background and career goals.`
        )

      }


      semanticImprovements.push(
        `Expand your ${job.title} project and experience descriptions with specific responsibilities, implementation details, and outcomes.`
      )


      semanticImprovements.push(
        "Prioritize projects and experience that demonstrate direct relevance to this role."
      )

    }


    // =========================================
    // 3. Semantic Skill Matching
    // =========================================

    const semanticSkillResult =
      await calculateSemanticSkillMatch(
        resumeSkills,
        jobSkills
      )


    const semanticSkillScore =
      semanticSkillResult.score


    const semanticSkillMatched =
      semanticSkillResult.matchedSkills || []


    const semanticSkillMissing =
      semanticSkillResult.missingSkills || []


    // =========================================
    // Professional Skill Explanation
    // =========================================

    let semanticSkillReason = ""

    let semanticSkillImprovements = []


    if (semanticSkillMissing.length === 0) {

      semanticSkillReason =
        `All ${jobSkills.length} required skills for this ${job.title} role have a strong or semantically similar match in your resume.`


      semanticSkillImprovements.push(
        "No major skill gap was detected. Focus on demonstrating these skills through relevant projects and experience."
      )

    } else {

      semanticSkillReason =
        `${semanticSkillMissing.length} of ${jobSkills.length} required skills for this ${job.title} role were not strongly matched with your resume.`


      semanticSkillImprovements.push(
        `Strengthen your evidence for ${semanticSkillMissing.join(", ")} if you genuinely have experience with these skills.`
      )


      semanticSkillImprovements.push(
        "Add relevant projects or experience that demonstrate the missing skills before listing them on your resume."
      )

    }


    // =========================================
    // Final Response
    // =========================================

    res.json({

      job: {
        id: job._id,
        title: job.title,
        company: job.company
      },


      // =======================================
      // Keyword Matching
      // =======================================

      keywordMatching: {

        score:
          keywordResult.score,

        matchedSkills:
          keywordResult.matchedSkills || [],

        missingSkills:
          keywordResult.missingSkills || [],

        matchedSkillCount:
          keywordMatchedCount,

        requiredSkillCount:
          keywordRequiredCount

      },


      // =======================================
      // Semantic Resume Matching
      // =======================================

      semanticMatching: {

        score:
          semanticScore,

        reason:
          semanticReason,

        improvements:
          semanticImprovements

      },


      // =======================================
      // Semantic Skill Matching
      // =======================================

      semanticSkillMatching: {

        score:
          semanticSkillScore,

        reason:
          semanticSkillReason,

        improvements:
          semanticSkillImprovements,

        matchedSkills:
          semanticSkillMatched,

        missingSkills:
          semanticSkillMissing

      }

    })

  }


  catch (error) {

    console.error(
      "Matching error:",
      error.message
    )


    res.status(500).json({

      message:
        "Failed to match resume with job",

      error:
        error.message

    })

  }

}


module.exports = {
  matchResumeWithJob
}