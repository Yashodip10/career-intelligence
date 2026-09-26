import { useLocation, useNavigate } from "react-router-dom"
import axios from "axios"
import { useState } from "react"

function InterviewResult() {
  const location = useLocation()
  const navigate = useNavigate()

  const result = location.state?.result

  const [startingInterview, setStartingInterview] =
    useState(false)

  const [error, setError] = useState("")

  if (!result) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-6">

        <div className="max-w-xl mx-auto">

          <div className="bg-white border border-slate-200 rounded-xl p-6 text-center">

            <div className="w-10 h-10 mx-auto rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-semibold">
              ?
            </div>

            <h1 className="text-lg font-semibold text-slate-900 mt-3">
              Interview result not found
            </h1>

            <p className="text-sm text-slate-500 mt-1">
              Complete an interview to view your results.
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
  // Practice Again
  // ==========================================

  const handlePracticeAgain = async () => {
    try {
      setStartingInterview(true)
      setError("")

      const token = localStorage.getItem("token")

      const response = await axios.post(
        `http://127.0.0.1:8000/api/interviews/start/${result.job.id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      navigate("/mock-interview", {
        state: {
          interview: response.data.interview
        }
      })

    } catch (error) {
      console.error(
        "Practice again error:",
        error
      )

      setError(
        error.response?.data?.message ||
          "Failed to start a new interview"
      )

    } finally {
      setStartingInterview(false)
    }
  }

  const totalQuestions =
    result.questions?.length || 0

  return (
    <div className="min-h-screen bg-slate-50">

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">

        {/* ==================================
            Result Header
        ================================== */}

        <section className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6">

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">

            <div className="min-w-0">

              <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide">
                AI Mock Interview
              </p>

              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
                Interview Result
              </h1>

              <p className="text-sm text-slate-500 mt-1 truncate">
                {result.job.title} · {result.job.company}
              </p>

            </div>


            {/* Overall Score */}

            <div className="sm:text-right shrink-0">

              <p className="text-xs text-slate-500">
                Overall Score
              </p>

              <p className="text-3xl sm:text-4xl font-bold text-blue-600 mt-1">
                {result.totalScore}/10
              </p>

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
            Question Results
        ================================== */}

        <div className="mt-4 space-y-4">

          {result.questions.map(
            (question, index) => (

              <section
                key={index}
                className="bg-white border border-slate-200 rounded-xl overflow-hidden"
              >

                {/* Question Header */}

                <div className="px-5 py-4 border-b border-slate-100">

                  <div className="flex items-start justify-between gap-3">

                    <div className="flex items-start gap-3 min-w-0">

                      <span className="w-7 h-7 shrink-0 rounded-md bg-blue-50 text-blue-700 flex items-center justify-center text-xs font-bold">
                        {index + 1}
                      </span>

                      <p className="text-sm sm:text-base font-semibold text-slate-900 leading-6">
                        {question.question}
                      </p>

                    </div>


                    <span
                      className={`shrink-0 text-sm font-bold px-2.5 py-1 rounded-md ${
                        question.score >= 7
                          ? "bg-green-50 text-green-700"
                          : question.score >= 5
                            ? "bg-amber-50 text-amber-700"
                            : "bg-red-50 text-red-700"
                      }`}
                    >
                      {question.score}/10
                    </span>

                  </div>

                </div>


                {/* Question Content */}

                <div className="p-5 space-y-4">


                  {/* Your Answer */}

                  <div>

                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                      Your Answer
                    </p>

                    <div className="mt-2 bg-slate-50 border border-slate-200 rounded-lg p-3">

                      <p className="text-sm text-slate-700 whitespace-pre-line leading-5">
                        {question.answer ||
                          "No answer provided."}
                      </p>

                    </div>

                  </div>


                  {/* AI Feedback */}

                  <div>

                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                      AI Feedback
                    </p>

                    <div className="mt-2 bg-blue-50 border border-blue-100 rounded-lg p-3">

                      <p className="text-sm text-slate-700 whitespace-pre-line leading-5">
                        {question.feedback ||
                          "No feedback available."}
                      </p>

                    </div>

                  </div>


                  {/* Recommended Answer */}

                  <div>

                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                      Recommended Answer
                    </p>

                    <div className="mt-2 bg-green-50 border border-green-100 rounded-lg p-3">

                      <p className="text-sm text-slate-700 whitespace-pre-line leading-5">
                        {question.recommendedAnswer ||
                          "No recommended answer available."}
                      </p>

                    </div>

                  </div>


                  {/* Explanation */}

                  <div>

                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                      Explanation
                    </p>

                    <div className="mt-2 bg-amber-50 border border-amber-100 rounded-lg p-3">

                      <p className="text-sm text-slate-700 whitespace-pre-line leading-5">
                        {question.explanation ||
                          "No explanation available."}
                      </p>

                    </div>

                  </div>


                  {/* Example */}

                  {question.example && (

                    <div>

                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                        Example
                      </p>

                      <div className="mt-2 bg-purple-50 border border-purple-100 rounded-lg p-3">

                        <p className="text-sm text-slate-700 whitespace-pre-line leading-5">
                          {question.example}
                        </p>

                      </div>

                    </div>

                  )}


                  {/* Remember This */}

                  <div>

                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                      Remember This
                    </p>

                    <div className="mt-2 bg-orange-50 border border-orange-100 rounded-lg p-3">

                      <p className="text-sm font-medium text-slate-800 whitespace-pre-line leading-5">
                        {question.rememberThis ||
                          "No key point available."}
                      </p>

                    </div>

                  </div>

                </div>

              </section>

            )
          )}

        </div>


        {/* ==================================
            Actions
        ================================== */}

        <section className="mt-4 bg-white border border-slate-200 rounded-xl p-5">

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

            <div>

              <h2 className="text-base font-semibold text-slate-900">
                Practice again
              </h2>

              <p className="text-xs text-slate-500 mt-1">
                Generate {totalQuestions || 5} new questions for this role.
              </p>

            </div>


            <div className="flex flex-col sm:flex-row gap-2">

              <button
                onClick={() => navigate("/")}
                className="h-10 px-4 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-sm font-semibold transition"
              >
                Browse Jobs
              </button>

              <button
                onClick={handlePracticeAgain}
                disabled={startingInterview}
                className="h-10 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold disabled:bg-slate-300 disabled:cursor-not-allowed transition"
              >
                {startingInterview
                  ? "Generating..."
                  : "Practice Again"}
              </button>

            </div>

          </div>

        </section>

      </main>

    </div>
  )
}

export default InterviewResult