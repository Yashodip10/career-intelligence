const parseResume = require("../utils/resumeParser")
const fs = require("fs")
const { PDFParse } = require("pdf-parse")
const Resume = require("../models/Resume")
const CandidateProfile = require("../models/CandidateProfile")
const User = require("../models/User")


const calculateProfileCompleteness = (parsedData) => {
  const sections = [
    parsedData.name,
    parsedData.email,
    parsedData.phone,
    parsedData.education?.length,
    parsedData.skills?.length,
    parsedData.projects?.length,
    parsedData.experience?.length,
    parsedData.certifications?.length
  ]

  const completedSections = sections.filter(
    (section) => section
  ).length

  return Math.round(
    (completedSections / sections.length) * 100
  )
}

const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "Please upload a PDF resume"
      })
    }

    const filePath = req.file.path

    const dataBuffer = fs.readFileSync(filePath)

    const parser = new PDFParse({
      data: dataBuffer
    })

    const pdfData = await parser.getText()

    await parser.destroy()

    const rawText = pdfData.text

    const parsedData = parseResume(rawText)

    const resume = await Resume.create({
      userId: req.userId,
      fileName: req.file.originalname,
      filePath: req.file.path,
      rawText,
      parsedData
    })

const profileCompleteness =
  calculateProfileCompleteness(parsedData)

await CandidateProfile.findOneAndUpdate(
  { userId: req.userId },
  {
    userId: req.userId,

    name: parsedData.name || "",
    email: parsedData.email || "",
    phone: parsedData.phone || "",

    skills: parsedData.skills || [],
    education: parsedData.education || [],
    projects: parsedData.projects || [],
    experience: parsedData.experience || [],
    certifications: parsedData.certifications || [],

    resumeFileName: req.file.originalname,

    profileCompleteness,

    lastResumeUpdatedAt: new Date()
  },
  {
    new: true,
    upsert: true,
    setDefaultsOnInsert: true
  }
)

await User.findByIdAndUpdate(
  req.userId,
  {
    resumeUploaded: true
  }
)

    res.status(201).json({
      message: "Resume uploaded and parsed successfully",

      resume: {
        id: resume._id,
        fileName: resume.fileName,
        parsedData: resume.parsedData
      }
    })
  } catch (error) {
    console.error(
      "Resume processing error:",
      error
    )

    res.status(500).json({
      message: "Failed to process resume",
      error: error.message
    })
  }
}

const getMyResume = async (req, res) => {
  try {
    const resume = await Resume.findOne({
      userId: req.userId
    }).sort({
      createdAt: -1
    })

    if (!resume) {
      return res.status(404).json({
        message: "No resume found"
      })
    }

    res.json({
      resume
    })
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message
    })
  }
}

module.exports = {
  uploadResume,
  getMyResume
}