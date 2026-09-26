import { useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import axios from "axios"

function MockInterview() {
  const location = useLocation()
  const navigate = useNavigate()

  const interview = location.state?.interview

  const [answers, setAnswers] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")

  // ==========================================
  // Interview not found
  // ==========================================

  if (!interview) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-6">

        <div className="max-w-xl mx-auto">

          <div className="bg-white border border-slate-200 rounded-xl p-6 text-center">

            <div className="w-10 h-10 mx-auto rounded-full bg-slate-100 text-slate-500 flex items-center justify-center">
              ?
            </div>

            <h1 className="text-lg font-semibold text-slate-900 mt-3">
              Interview not found
            </h1>

            <p className="text-sm text-slate-500 mt-1">
              Start an interview from a job details page.
            </p>

            <button
              onClick={() => navigate("/")}
              className="mt-4 h-10 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition"
            >
              Browse Jobs
            </button>

          </div>

        </div>

      </div>
    )
  }

  // ==========================================
  // Answer change
  // ==========================================

  const handleAnswerChange = (index, value) => {
    setAnswers({
      ...answers,
      [index]: value
    })
  }

  // ==========================================
  // Submit Interview
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault()

    setError("")

    const formattedAnswers =
      interview.questions.map(
        (question, index) => ({
          questionIndex: index,
          answer: answers[index] || ""
        })
      )

    try {
      setSubmitting(true)

      const token = localStorage.getItem("token")

      const response = await axios.post(
        `http://127.0.0.1:8000/api/interviews/${interview.id}/submit`,
        {
          answers: formattedAnswers
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      navigate("/interview-result", {
        state: {
          result: response.data.interview
        }
      })

    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to submit interview"
      )
    } finally {
      setSubmitting(false)
    }
  }

  const totalQuestions =
    interview.questions?.length || 0

  const answeredQuestions =
    interview.questions.filter(
      (_, index) =>
        answers[index]?.trim()
    ).length

  return (
    <div className="min-h-screen bg-slate-50">

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">

        {/* ==================================
            Header
        ================================== */}

        <section className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6">

          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">

            <div className="min-w-0">

              <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide">
                AI Mock Interview
              </p>

              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1 leading-tight">
                {interview.job.title}
              </h1>

              <p className="text-sm text-slate-500 mt-1">
                {interview.job.company}
              </p>

            </div>


            {/* Progress */}

            <div className="sm:text-right shrink-0">

              <p className="text-lg font-bold text-slate-900">
                {answeredQuestions}/{totalQuestions}
              </p>

              <p className="text-xs text-slate-500">
                answered
              </p>

            </div>

          </div>


          {/* Progress Bar */}

          <div className="mt-5">

            <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">

              <div
                className="h-full bg-blue-600 rounded-full transition-all"
                style={{
                  width:
                    totalQuestions === 0
                      ? "0%"
                      : `${(answeredQuestions / totalQuestions) * 100}%`
                }}
              />

            </div>

          </div>

        </section>


        {/* ==================================
            Error
        ================================== */}

        {error && (

          <div className="mt-3 px-4 py-3 bg-red-50 border border-red-100 text-red-600 rounded-lg text-sm">
            {error}
          </div>

        )}


        {/* ==================================
            Questions
        ================================== */}

        <form
          onSubmit={handleSubmit}
          className="mt-4 space-y-4"
        >

          {interview.questions.map(
            (question, index) => {

              const hasAnswer =
                Boolean(
                  answers[index]?.trim()
                )

              return (

                <section
                  key={index}
                  className="bg-white border border-slate-200 rounded-xl p-5"
                >

                  {/* Question Header */}

                  <div className="flex items-start justify-between gap-3">

                    <div className="flex items-center gap-2">

                      <span className="w-7 h-7 shrink-0 rounded-md bg-blue-50 text-blue-700 flex items-center justify-center text-xs font-bold">
                        {index + 1}
                      </span>

                      <h2 className="text-sm font-semibold text-slate-900">
                        Question {index + 1}
                      </h2>

                    </div>


                    {hasAnswer && (

                      <span className="text-[11px] font-medium text-green-700 bg-green-50 border border-green-100 px-2 py-1 rounded-full">
                        Answered
                      </span>

                    )}

                  </div>


                  {/* Question */}

                  <p className="text-sm sm:text-base text-slate-800 leading-6 mt-4">
                    {question.question}
                  </p>


                  {/* Answer */}

                  <textarea
                    value={answers[index] || ""}
                    onChange={(e) =>
                      handleAnswerChange(
                        index,
                        e.target.value
                      )
                    }
                    placeholder="Write your answer..."
                    rows={5}
                    className="w-full mt-4 px-3 py-3 border border-slate-200 rounded-lg text-sm text-slate-800 placeholder:text-slate-400 outline-none resize-y focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition"
                  />

                </section>

              )
            }
          )}


          {/* ==================================
              Submit
          ================================== */}

          <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5">

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

              <div>

                <p className="text-sm font-semibold text-slate-900">
                  Ready to submit?
                </p>

                <p className="text-xs text-slate-500 mt-1">
                  {answeredQuestions} of {totalQuestions} answered
                </p>

              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full sm:w-auto h-10 px-5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold disabled:bg-slate-300 disabled:cursor-not-allowed transition"
              >
                {submitting
                  ? "Evaluating..."
                  : "Submit Interview"}
              </button>

            </div>

          </div>

        </form>

      </main>

    </div>
  )
}

export default MockInterview