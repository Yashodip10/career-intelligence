const CandidateProfile = require("../models/CandidateProfile")

const getMyProfile = async (req, res) => {
  try {
    const profile = await CandidateProfile.findOne({
      userId: req.userId
    })

    if (!profile) {
      return res.status(404).json({
        message: "Candidate profile not found. Please upload a resume first."
      })
    }

    res.json({
      profile
    })
  } catch (error) {
    console.error("Get candidate profile error:", error)

    res.status(500).json({
      message: "Server error",
      error: error.message
    })
  }
}

module.exports = {
  getMyProfile
}