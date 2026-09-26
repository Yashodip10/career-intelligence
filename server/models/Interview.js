const mongoose = require("mongoose")


const questionSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true
    },

    answer: {
      type: String,
      default: ""
    },

    score: {
      type: Number,
      default: 0
    },

    feedback: {
      type: String,
      default: ""
    },

    recommendedAnswer: {
      type: String,
      default: ""
    },

    explanation: {
      type: String,
      default: ""
    },

    example: {
      type: String,
      default: ""
    },

    rememberThis: {
      type: String,
      default: ""
    }
  },
  {
    _id: false
  }
)


const interviewSchema = new mongoose.Schema(
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

    questions: {
      type: [questionSchema],
      default: []
    },

    totalScore: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
)


const Interview = mongoose.model(
  "Interview",
  interviewSchema
)


module.exports = Interview