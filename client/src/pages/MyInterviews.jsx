import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import axios from "axios"
import { API_URL } from "../config"

function MyInterviews() {
  const navigate = useNavigate()

  const [interviews, setInterviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchInterviews = async () => {
      const token = localStorage.getItem("token")

      if (!token) {
        navigate("/login")
        return
      }

      try {
        const response = await axios.get(
          `${API_URL}/api/interviews/my`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )

        setInterviews(response.data.interviews || [])
      } catch (error) {
        console.error("Fetch interviews error:", error)

        setError(
          error.response?.data?.message ||
            "Failed to load interview history."
        )
      } finally {
        setLoading(false)
      }
    }

    fetchInterviews()
  }, [navigate])

  const formatDate = (date) => {
    if (!date) return "Recently"

    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric"
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-6">
        <div className="max-w-5xl mx-auto animate-pulse">
          <div className="h-7 w-48 bg-slate-200 rounded" />
          <div className="h-4 w-72 bg-slate-200 rounded mt-3" />

          <div className="h-28 bg-white border border-slate-200 rounded-xl mt-6" />
          <div className="h-28 bg-white border border-slate-200 rounded-xl mt-3" />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">

        <div className="mb-6">
          <Link
            to="/"
            className="text-sm text-slate-500 hover:text-blue-600"
          >
            ← Back to Jobs
          </Link>

          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-4">
            My Interviews
          </h1>

          <p className="text-sm text-slate-500 mt-1">
            Review your completed AI mock interviews and scores.
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-100 text-red-600 rounded-lg px-4 py-3 text-sm mb-4">
            {error}
          </div>
        )}

        {!error && interviews.length === 0 && (
          <div className="bg-white border border-slate-200 rounded-xl p-8 text-center">
            <div className="w-12 h-12 mx-auto rounded-full bg-slate-100 flex items-center justify-center text-xl">
              🎯
            </div>

            <h2 className="text-lg font-semibold text-slate-900 mt-4">
              No interviews completed
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              Start an AI mock interview from a job details page.
            </p>

            <Link
              to="/jobs"
              className="inline-flex mt-4 h-10 px-4 items-center bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold"
            >
              Browse Jobs
            </Link>
          </div>
        )}

        <div className="space-y-3">
          {interviews.map((interview) => (
            <div
              key={interview._id}
              className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

                <div className="min-w-0">
                  <h2 className="text-base sm:text-lg font-semibold text-slate-900">
                    {interview.jobTitle || "AI Mock Interview"}
                  </h2>

                  {interview.company && (
                    <p className="text-sm text-slate-600 mt-1">
                      {interview.company}
                    </p>
                  )}

                  <p className="text-xs text-slate-400 mt-2">
                    Completed {formatDate(interview.completedAt || interview.createdAt)}
                  </p>
                </div>

                <div className="flex items-center gap-5 shrink-0">

                  <div className="text-right">
                    <p className="text-xs text-slate-400">
                      Score
                    </p>

                    <p className="text-xl font-bold text-blue-600">
                      {typeof interview.totalScore === "number"
                        ? `${interview.totalScore}/10`
                        : "—"}
                    </p>
                  </div>

                </div>

              </div>
            </div>
          ))}
        </div>

      </main>
    </div>
  )
}

export default MyInterviews