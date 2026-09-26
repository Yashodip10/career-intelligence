const mongoose = require("mongoose")

const candidateProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true
    },

    name: {
      type: String,
      default: ""
    },

    email: {
      type: String,
      default: ""
    },

    phone: {
      type: String,
      default: ""
    },

    skills: {
      type: [String],
      default: []
    },

    education: {
      type: [String],
      default: []
    },

    projects: {
      type: [String],
      default: []
    },

    experience: {
      type: [String],
      default: []
    },

    certifications: {
      type: [String],
      default: []
    },

    resumeFileName: {
      type: String,
      default: ""
    },

    profileCompleteness: {
      type: Number,
      default: 0
    },

    lastResumeUpdatedAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
)

const CandidateProfile = mongoose.model(
  "CandidateProfile",
  candidateProfileSchema
)

module.exports = CandidateProfile