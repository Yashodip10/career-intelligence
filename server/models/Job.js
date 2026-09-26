const mongoose = require("mongoose")

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },

    company: {
      type: String,
      required: true,
      trim: true
    },

    location: {
      type: String,
      required: true,
      trim: true
    },

    jobType: {
      type: String,
      enum: [
        "Full-time",
        "Part-time",
        "Internship",
        "Contract"
      ],
      default: "Full-time"
    },

    experience: {
      type: String,
      default: "Fresher"
    },

    skills: {
      type: [String],
      default: []
    },

    description: {
      type: String,
      required: true
    },

    applyLink: {
      type: String,
      required: true
    },

    // Job source
    source: {
      type: String,
      default: "Admin",
      trim: true
    },

    // Date when the job was posted
    postedAt: {
      type: Date,
      default: Date.now
    },

    // Whether the job is currently visible
    isActive: {
      type: Boolean,
      default: true
    },

    // Optional expiry date
    expiresAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
)

const Job = mongoose.model("Job", jobSchema)

module.exports = Job