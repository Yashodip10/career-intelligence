const Application = require("../models/Application")
const Job = require("../models/Job")
const Resume = require("../models/Resume")

// ==========================================
// Apply for Job
// ==========================================

const applyForJob = async (req, res) => {
  try {
    const { jobId } = req.params

    // --------------------------------------
    // Check job
    // --------------------------------------

    const job = await Job.findOne({
      _id: jobId,
      isActive: true,
      $or: [
        { expiresAt: null },
        { expiresAt: { $gt: new Date() } }
      ]
    })

    if (!job) {
      return res.status(404).json({
        message: "This job is no longer available."
      })
    }

    // --------------------------------------
    // Check resume
    // --------------------------------------

    const resume = await Resume.findOne({
      userId: req.userId
    }).sort({
      createdAt: -1
    })

    if (!resume) {
      return res.status(400).json({
        message: "Please upload your resume before applying."
      })
    }

    // --------------------------------------
    // Check duplicate application
    // --------------------------------------

    const existingApplication =
      await Application.findOne({
        userId: req.userId,
        jobId
      })

    if (existingApplication) {
      return res.status(409).json({
        message: "You have already applied for this job.",
        application: existingApplication
      })
    }

    // --------------------------------------
    // Create application
    // --------------------------------------

    const application =
      await Application.create({
        userId: req.userId,
        jobId,
        resumeId: resume._id
      })

    res.status(201).json({
      message: "Application submitted successfully.",
      application
    })
  } catch (error) {
    console.error(
      "Apply for job error:",
      error
    )

    // Duplicate index protection
    if (error.code === 11000) {
      return res.status(409).json({
        message: "You have already applied for this job."
      })
    }

    res.status(500).json({
      message: "Failed to submit application.",
      error: error.message
    })
  }
}


// ==========================================
// Get My Application For A Job
// ==========================================

const getMyJobApplication = async (req, res) => {
  try {
    const { jobId } = req.params

    const application =
      await Application.findOne({
        userId: req.userId,
        jobId
      })

    res.json({
      applied: Boolean(application),
      application: application || null
    })
  } catch (error) {
    console.error(
      "Get application error:",
      error
    )

    res.status(500).json({
      message: "Failed to get application status.",
      error: error.message
    })
  }
}


// ==========================================
// Get My Applications
// ==========================================

const getMyApplications = async (req, res) => {
  try {
    const applications =
      await Application.find({
        userId: req.userId
      })
        .populate(
          "jobId",
          "title company location jobType experience"
        )
        .sort({
          appliedAt: -1
        })

    res.json({
      count: applications.length,
      applications
    })
  } catch (error) {
    console.error(
      "Get my applications error:",
      error
    )

    res.status(500).json({
      message: "Failed to load applications.",
      error: error.message
    })
  }
}


module.exports = {
  applyForJob,
  getMyJobApplication,
  getMyApplications
}