const Interview = require("../models/Interview")
const Job = require("../models/Job")
const Resume = require("../models/Resume")

const {
  generateInterviewQuestions
} = require("../services/interviewAI")

const {
  evaluateInterviewAnswers
} = require("../services/interviewEvaluationAI")


// ==========================================
// START INTERVIEW
// ==========================================

const startInterview = async (req, res) => {
  try {
    const { jobId } = req.params

    const job = await Job.findById(jobId)

    if (!job) {
      return res.status(404).json({
        message: "Job not found"
      })
    }

    const resume = await Resume.findOne({
      userId: req.userId
    }).sort({
      createdAt: -1
    })

    if (!resume) {
      return res.status(404).json({
        message: "Please upload a resume first"
      })
    }

    // Get previous interviews for this user and job
    const previousInterviews = await Interview.find({
      userId: req.userId,
      jobId: job._id
    }).sort({
      createdAt: -1
    })

    // Collect questions from previous attempts
    const previousQuestions = []

    previousInterviews.forEach((interview) => {
      interview.questions.forEach((question) => {
        if (question.question) {
          previousQuestions.push(
            question.question
          )
        }
      })
    })

    const aiResult =
      await generateInterviewQuestions({
        job,
        resume,
        previousQuestions
      })

    const questions = aiResult.questions.map(
      (item) => ({
        question: item.question
      })
    )

    const interview = await Interview.create({
      userId: req.userId,
      jobId: job._id,
      questions
    })

    res.status(201).json({
      message: "AI interview started",

      interview: {
        id: interview._id,

        job: {
          id: job._id,
          title: job.title,
          company: job.company
        },

        questions: interview.questions
      }
    })

  } catch (error) {

    console.error(
      "Start interview error:",
      error.message
    )

    res.status(500).json({
      message: "Failed to start AI interview",
      error: error.message
    })
  }
}


// ==========================================
// SUBMIT INTERVIEW
// ==========================================

const submitInterview = async (req, res) => {
  try {

    const { interviewId } = req.params

    const { answers = [] } = req.body

    const interview = await Interview.findOne({
      _id: interviewId,
      userId: req.userId
    })

    if (!interview) {
      return res.status(404).json({
        message: "Interview not found"
      })
    }

    const job = await Job.findById(
      interview.jobId
    )

    if (!job) {
      return res.status(404).json({
        message: "Job not found"
      })
    }


    // ------------------------------------------
    // Send answers to AI evaluator
    // ------------------------------------------

    const evaluation =
      await evaluateInterviewAnswers({
        job,
        questions: interview.questions,
        answers
      })


    // ------------------------------------------
    // Save every question result
    // ------------------------------------------

    let totalScore = 0

    interview.questions.forEach(
      (question, index) => {

        const submittedAnswer =
          answers.find(
            (item) =>
              item.questionIndex === index
          )?.answer?.trim() || ""


        const result =
          evaluation.results?.find(
            (item) =>
              item.questionIndex === index
          )


        // --------------------------------------
        // IMPORTANT:
        // Blank answer ALWAYS = 0
        // --------------------------------------

        if (!submittedAnswer) {

          question.answer = ""

          question.score = 0

          question.feedback =
            result?.feedback ||
            "You did not provide an answer. Prepare this concept before your technical interview."

          question.recommendedAnswer =
            result?.recommendedAnswer ||
            "Prepare a clear answer explaining the main concept, how it works, and a simple practical example."

          question.explanation =
            result?.explanation ||
            "Review the main concept behind this question and understand why it is used."

          question.example =
            result?.example ||
            "Try to connect the concept with a small project or practical coding example."

          question.rememberThis =
            result?.rememberThis ||
            "Understand the concept first, then remember the key idea."

        } else {

          // ------------------------------------
          // Normal answered question
          // ------------------------------------

          question.answer =
            submittedAnswer

          question.score =
            typeof result?.score === "number"
              ? Math.max(
                  0,
                  Math.min(10, result.score)
                )
              : 0

          question.feedback =
            result?.feedback ||
            "Review your answer and improve its technical clarity."

          question.recommendedAnswer =
            result?.recommendedAnswer ||
            "Prepare a clearer and more structured answer for this question."

          question.explanation =
            result?.explanation ||
            "Review the concept and understand how it works."

          question.example =
            result?.example || ""

          question.rememberThis =
            result?.rememberThis ||
            "Remember the main concept and explain it clearly."
        }


        totalScore += question.score
      }
    )


    // ------------------------------------------
    // Calculate score ourselves
    // ------------------------------------------

    if (interview.questions.length > 0) {

      totalScore =
        totalScore /
        interview.questions.length

    } else {

      totalScore = 0
    }


    totalScore =
      Math.round(totalScore * 10) / 10


    interview.totalScore = totalScore

    await interview.save()


    // ------------------------------------------
    // Return complete result
    // ------------------------------------------

    res.json({

      message: "Interview evaluated successfully",

      interview: {

        id: interview._id,

        job: {
          id: job._id,
          title: job.title,
          company: job.company
        },

        questions:
          interview.questions,

        totalScore:
          interview.totalScore
      }
    })

  } catch (error) {

    console.error(
      "Submit interview error:",
      error.message
    )

    res.status(500).json({

      message: "Failed to evaluate interview",

      error: error.message
    })
  }
}


// ==========================================
// GET MY COMPLETED INTERVIEWS
// ==========================================

const getMyInterviews = async (req, res) => {

  try {

    const interviews = await Interview.find({

      userId: req.userId,

      totalScore: {
        $ne: null
      }

    })
      .populate(
        "jobId",
        "title company location jobType experience"
      )
      .sort({
        createdAt: -1
      })


    const formattedInterviews =
      interviews.map((interview) => ({

        _id: interview._id,

        jobId:
          interview.jobId?._id || null,

        jobTitle:
          interview.jobId?.title ||
          "AI Mock Interview",

        company:
          interview.jobId?.company ||
          "",

        location:
          interview.jobId?.location ||
          "",

        jobType:
          interview.jobId?.jobType ||
          "",

        experience:
          interview.jobId?.experience ||
          "",

        totalScore:
          interview.totalScore,

        createdAt:
          interview.createdAt

      }))


    res.json({

      count:
        formattedInterviews.length,

      interviews:
        formattedInterviews

    })

  } catch (error) {

    console.error(
      "Get my interviews error:",
      error.message
    )

    res.status(500).json({

      message:
        "Failed to load interview history.",

      error:
        error.message
    })
  }
}


// ==========================================
// EXPORT CONTROLLERS
// ==========================================

module.exports = {

  startInterview,

  submitInterview,

  getMyInterviews

}