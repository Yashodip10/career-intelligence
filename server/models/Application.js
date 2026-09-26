const mongoose = require("mongoose")

const applicationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true
    },

    resumeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Resume",
      required: true
    },

    status: {
      type: String,
      enum: [
        "Applied",
        "Under Review",
        "Shortlisted",
        "Rejected"
      ],
      default: "Applied"
    },

    appliedAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
)

// One candidate can apply to a particular job only once.
applicationSchema.index(
  {
    userId: 1,
    jobId: 1
  },
  {
    unique: true
  }
)

const Application = mongoose.model(
  "Application",
  applicationSchema
)

module.exports = Application