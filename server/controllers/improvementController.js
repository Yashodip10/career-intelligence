const Resume = require("../models/Resume")
const Job = require("../models/Job")
const { calculateKeywordMatch } = require("../utils/jobMatcher")

const getResumeImprovements = async (req, res) => {
  try {
    const { jobId } = req.params

    const resume = await Resume.findOne({
      userId: req.userId
    }).sort({ createdAt: -1 })

    if (!resume) {
      return res.status(404).json({
        message: "Please upload a resume first"
      })
    }

    const job = await Job.findById(jobId)

    if (!job) {
      return res.status(404).json({
        message: "Job not found"
      })
    }

    const resumeSkills = resume.parsedData?.skills || []
    const jobSkills = job.skills || []

    const matchResult = calculateKeywordMatch(
      resumeSkills,
      jobSkills
    )

    const suggestions = []

    if (matchResult.missingSkills.length > 0) {
      suggestions.push({
        type: "Skills",
        title: "Strengthen missing job skills",
        description:
          `Focus on learning and demonstrating these skills: ${matchResult.missingSkills.join(", ")}.`
      })
    }

    if (!resume.parsedData?.projects?.length) {
      suggestions.push({
        type: "Projects",
        title: "Add relevant projects",
        description:
          "Add projects that demonstrate the technologies and responsibilities mentioned in the job description."
      })
    }

    if (!resume.parsedData?.experience?.length) {
      suggestions.push({
        type: "Experience",
        title: "Highlight practical experience",
        description:
          "Include internships, freelance work, academic projects, or practical development experience relevant to this position."
      })
    }

    suggestions.push({
      type: "Resume",
      title: "Customize your resume for this job",
      description:
        `Prioritize experience and projects related to the ${job.title} role and place the most relevant skills prominently in your resume.`
    })

    suggestions.push({
      type: "Keywords",
      title: "Use job-relevant terminology",
      description:
        "Where truthful, use terminology from the job description when describing your existing skills, projects, and experience."
    })

    res.json({
      job: {
        id: job._id,
        title: job.title,
        company: job.company
      },
      missingSkills: matchResult.missingSkills,
      suggestions
    })

  } catch (error) {
    console.error("Improvement error:", error.message)

    res.status(500).json({
      message: "Failed to generate resume improvements",
      error: error.message
    })
  }
}

module.exports = {
  getResumeImprovements
}