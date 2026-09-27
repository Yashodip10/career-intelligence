const Job = require("../models/Job")

const CandidateProfile = require("../models/CandidateProfile")

const {
  calculateKeywordMatch
} = require("../utils/jobMatcher")

const {
  calculateSemanticSkillMatch
} = require("../utils/semanticMatcher")


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


    const candidateSkills =
      profile.skills || []


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
    // Step 1: Keyword Matching
    // Fast local calculation for all jobs
    // =====================================================

    const keywordRecommendations =
      jobs.map(job => {

        const keywordResult =
          calculateKeywordMatch(
            candidateSkills,
            job.skills || []
          )


        return {

          job,

          keywordResult,

          keywordScore:
            keywordResult.score || 0

        }

      })


    // =====================================================
    // Step 2: Select Top Candidates
    // Only these jobs use Gemini semantic matching
    // =====================================================

    const semanticCandidates =
      [...keywordRecommendations]
        .sort(
          (a, b) =>
            b.keywordScore -
            a.keywordScore
        )
        .slice(0, 5)


    // =====================================================
    // Step 3: Calculate Semantic Matching
    // Only for top 5 keyword matches
    // =====================================================

    const semanticResults =
      new Map()


    for (
      const item of semanticCandidates
    ) {

      const job =
        item.job


      try {

        const semanticResult =
          await calculateSemanticSkillMatch(

            candidateSkills,

            job.skills || []

          )


        semanticResults.set(

          job._id.toString(),

          {

            score:
              semanticResult.score || 0,

            matchedSkills:
              semanticResult.matchedSkills || [],

            missingSkills:
              semanticResult.missingSkills || []

          }

        )

      } catch (error) {

        console.error(

          `Semantic matching failed for ${job.title}:`,

          error.message

        )


        // Fall back to keyword score
        // if Gemini is temporarily unavailable.

        semanticResults.set(

          job._id.toString(),

          {

            score:
              item.keywordScore,

            matchedSkills:
              item.keywordResult.matchedSkills || [],

            missingSkills:
              item.keywordResult.missingSkills || []

          }

        )

      }

    }


    // =====================================================
    // Step 4: Calculate Final Recommendations
    // =====================================================

    const recommendations = []


    for (
      const item of keywordRecommendations
    ) {

      const job =
        item.job


      const keywordResult =
        item.keywordResult


      const keywordScore =
        item.keywordScore


      const semanticResult =
        semanticResults.get(
          job._id.toString()
        )


      let semanticScore = 0

      let semanticMatchedSkills = []

      let semanticMissingSkills = []


      if (semanticResult) {

        semanticScore =
          semanticResult.score || 0

        semanticMatchedSkills =
          semanticResult.matchedSkills || []

        semanticMissingSkills =
          semanticResult.missingSkills || []

      } else {

        // Jobs outside top 5 use keyword
        // score as their semantic fallback.

        semanticScore =
          keywordScore

        semanticMatchedSkills =
          keywordResult.matchedSkills || []

        semanticMissingSkills =
          keywordResult.missingSkills || []

      }


      // ---------------------------------------------------
      // Combined Recommendation Score
      // ---------------------------------------------------

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

      let matchLabel =
        "Potential Match"


      if (
        recommendationScore >= 80
      ) {

        matchLabel =
          "Strong Match"

      }

      else if (
        recommendationScore >= 60
      ) {

        matchLabel =
          "Good Match"

      }

      else if (
        recommendationScore >= 40
      ) {

        matchLabel =
          "Partial Match"

      }


      // ---------------------------------------------------
      // Add Recommendation
      // ---------------------------------------------------

      recommendations.push({

        job: {

          _id:
            job._id,

          title:
            job.title,

          company:
            job.company,

          location:
            job.location,

          jobType:
            job.jobType,

          experience:
            job.experience,

          skills:
            job.skills,

          description:
            job.description,

          applyLink:
            job.applyLink,

          source:
            job.source,

          postedAt:
            job.postedAt

        },


        recommendationScore,

        matchLabel,


        keywordMatching: {

          score:
            keywordScore,

          matchedSkills:
            keywordResult.matchedSkills || [],

          missingSkills:
            keywordResult.missingSkills || []

        },


        semanticMatching: {

          score:
            semanticScore,

          matchedSkills:
            semanticMatchedSkills,

          missingSkills:
            semanticMissingSkills

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

      count:
        recommendations.length,

      recommendations

    })


  } catch (error) {

    console.error(

      "Recommendation error:",

      error

    )


    res.status(500).json({

      message:
        "Failed to generate recommendations",

      error:
        error.message

    })

  }

}


module.exports = {

  getRecommendedJobs

}