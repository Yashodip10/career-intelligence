const mongoose = require("mongoose")

const resumeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    fileName: {
      type: String,
      required: true
    },

    filePath: {
      type: String,
      required: true
    },

    rawText: {
      type: String,
      default: ""
    },

    parsedData: {
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

      education: {
        type: [String],
        default: []
      },

      skills: {
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
      }
    }
  },
  {
    timestamps: true
  }
)

const Resume = mongoose.model("Resume", resumeSchema)

module.exports = Resume