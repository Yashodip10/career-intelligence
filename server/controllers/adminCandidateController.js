const User = require("../models/User")
const Resume = require("../models/Resume")
const Interview = require("../models/Interview")

// Get all candidates
const getCandidates = async (req, res) => {
  try {
    const users = await User.find({ role: "user" })
      .select("-password")
      .sort({ createdAt: -1 })

    const candidates = await Promise.all(
      users.map(async (user) => {
        const resume = await Resume.findOne({
          userId: user._id
        }).sort({ createdAt: -1 })

        const interviewCount = await Interview.countDocuments({
          userId: user._id
        })

        return {
          id: user._id,
          name: user.name,
          email: user.email,
          resumeUploaded: !!resume,
          resumeFileName: resume?.fileName || null,
          skills: resume?.parsedData?.skills || [],
          interviewCount,
          lastLoginAt: user.lastLoginAt,
          createdAt: user.createdAt
        }
      })
    )

    res.json({
      candidates
    })
  } catch (error) {
    console.error("Get candidates error:", error)

    res.status(500).json({
      message: "Server error",
      error: error.message
    })
  }
}


// Get candidate statistics
const getCandidateStats = async (req, res) => {
  try {
    const totalCandidates = await User.countDocuments({
      role: "user"
    })

    const totalResumes = await Resume.countDocuments()

    const totalInterviews = await Interview.countDocuments()

    const activeCandidates = await User.countDocuments({
      role: "user",
      lastLoginAt: {
        $ne: null
      }
    })

    res.json({
      totalCandidates,
      totalResumes,
      totalInterviews,
      activeCandidates
    })
  } catch (error) {
    console.error("Get candidate stats error:", error)

    res.status(500).json({
      message: "Server error",
      error: error.message
    })
  }
}


// Get single candidate
const getCandidateById = async (req, res) => {
  try {
    const { id } = req.params

    const user = await User.findOne({
      _id: id,
      role: "user"
    }).select("-password")

    if (!user) {
      return res.status(404).json({
        message: "Candidate not found"
      })
    }

    const resume = await Resume.findOne({
      userId: user._id
    }).sort({ createdAt: -1 })

    const interviews = await Interview.find({
      userId: user._id
    })
      .sort({ createdAt: -1 })
      .select(
        "jobTitle company totalScore createdAt questions"
      )

    res.json({
      candidate: {
        id: user._id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
        lastLoginAt: user.lastLoginAt,

        resume: resume
          ? {
              fileName: resume.fileName,
              parsedData: resume.parsedData,
              createdAt: resume.createdAt
            }
          : null,

        interviews
      }
    })
  } catch (error) {
    console.error("Get candidate error:", error)

    res.status(500).json({
      message: "Server error",
      error: error.message
    })
  }
}


module.exports = {
  getCandidates,
  getCandidateStats,
  getCandidateById
}