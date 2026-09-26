const axios = require("axios")

const Job = require("../models/Job")
const CandidateProfile = require("../models/CandidateProfile")

const {
  calculateKeywordMatch
} = require("../utils/jobMatcher")


const getRecommendedJobs = async (req, res) => {
  try {

    // =====================================================
    // Get Candidate Profile
    // =====================================================

    const profile = await CandidateProfile.findOne({
      userId: req.userId
    })

    if (!profile) {
      return res.status(404).json({
        message: "Please upload your resume first"
      })
    }

    const candidateSkills = profile.skills || []

    if (candidateSkills.length === 0) {
      return res.status(400).json({
        message: "No skills were detected in your resume"
      })
    }


    // =====================================================
    // Get Active Jobs
    // =====================================================

    const jobs = await Job.find({
      isActive: true,
      $or: [
        {
          expiresAt: null
        },
        {
          expiresAt: {
            $gt: new Date()
          }
        }
      ]
    }).sort({
      postedAt: -1
    })

    if (jobs.length === 0) {
      return res.json({
        count: 0,
        recommendations: []
      })
    }


    // =====================================================
    // Calculate Recommendations
    // =====================================================

    const recommendations = []


    for (const job of jobs) {

      // ---------------------------------------------------
      // Keyword Matching
      // ---------------------------------------------------

      const keywordResult =
        calculateKeywordMatch(
          candidateSkills,
          job.skills || []
        )


      // ---------------------------------------------------
      // Semantic Skill Matching
      // ---------------------------------------------------

      let semanticScore = 0

      try {

        const semanticResponse =
          await axios.post(
            "http://127.0.0.1:8000/semantic-skill-match",
            {
              resume_skills: candidateSkills,
              job_skills: job.skills || []
            }
          )

        semanticScore =
          semanticResponse.data.score || 0

      } catch (error) {

        console.error(
          `Semantic matching failed for ${job.title}:`,
          error.message
        )

        // If AI service is unavailable,
        // keyword score remains available.
        semanticScore = keywordResult.score
      }


      // ---------------------------------------------------
      // Combined Recommendation Score
      // ---------------------------------------------------

      const keywordScore =
        keywordResult.score || 0

      const recommendationScore =
        Math.round(
          (
            keywordScore * 0.4 +
            semanticScore * 0.6
          ) * 100
        ) / 100


      // ---------------------------------------------------
      // Recommendation Label
      // ---------------------------------------------------

      let matchLabel = "Potential Match"

      if (recommendationScore >= 80) {
        matchLabel = "Strong Match"
      } else if (recommendationScore >= 60) {
        matchLabel = "Good Match"
      } else if (recommendationScore >= 40) {
        matchLabel = "Partial Match"
      }


      // ---------------------------------------------------
      // Add Recommendation
      // ---------------------------------------------------

      recommendations.push({

        job: {
          _id: job._id,
          title: job.title,
          company: job.company,
          location: job.location,
          jobType: job.jobType,
          experience: job.experience,
          skills: job.skills,
          description: job.description,
          applyLink: job.applyLink,
          source: job.source,
          postedAt: job.postedAt
        },

        recommendationScore,

        matchLabel,

        keywordMatching: {
          score: keywordScore,
          matchedSkills:
            keywordResult.matchedSkills || [],
          missingSkills:
            keywordResult.missingSkills || []
        },

        semanticMatching: {
          score: semanticScore
        }
      })
    }


    // =====================================================
    // Sort Best Matches First
    // =====================================================

    recommendations.sort(
      (a, b) =>
        b.recommendationScore -
        a.recommendationScore
    )


    // =====================================================
    // Send Response
    // =====================================================

    res.json({
      count: recommendations.length,
      recommendations
    })

  } catch (error) {

    console.error(
      "Recommendation error:",
      error
    )

    res.status(500).json({
      message: "Failed to generate recommendations",
      error: error.message
    })
  }
}


module.exports = {
  getRecommendedJobs
}