import { useEffect, useState } from "react"
import axios from "axios"
import { Link, useNavigate } from "react-router-dom"
import { API_URL } from "../config"

function MyApplications() {
  const navigate = useNavigate()

  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchApplications = async () => {
      const token = localStorage.getItem("token")

      if (!token) {
        navigate("/login")
        return
      }

      try {
        const response = await axios.get(
          `${API_URL}/api/applications/my`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )

        setApplications(response.data.applications || [])
      } catch (error) {
        console.error("Fetch applications error:", error)

        setError(
          error.response?.data?.message ||
            "Failed to load your applications."
        )
      } finally {
        setLoading(false)
      }
    }

    fetchApplications()
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

        {/* Header */}
        <div className="mb-6">
          <Link
            to="/"
            className="text-sm text-slate-500 hover:text-blue-600"
          >
            ← Back to Jobs
          </Link>

          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-4">
            My Applications
          </h1>

          <p className="text-sm text-slate-500 mt-1">
            Track the jobs you have applied for.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-100 text-red-600 rounded-lg px-4 py-3 text-sm mb-4">
            {error}
          </div>
        )}

        {/* Empty */}
        {!error && applications.length === 0 && (
          <div className="bg-white border border-slate-200 rounded-xl p-8 text-center">
            <div className="w-12 h-12 mx-auto rounded-full bg-slate-100 flex items-center justify-center text-xl">
              📄
            </div>

            <h2 className="text-lg font-semibold text-slate-900 mt-4">
              No applications yet
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              Explore available jobs and submit your first application.
            </p>

            <Link
              to="/jobs"
              className="inline-flex mt-4 h-10 px-4 items-center bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold"
            >
              Browse Jobs
            </Link>
          </div>
        )}

        {/* Applications */}
        <div className="space-y-3">
          {applications.map((application) => {
            const job = application.jobId

            if (!job) return null

            return (
              <div
                key={application._id}
                className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

                  <div className="min-w-0">
                    <h2 className="text-base sm:text-lg font-semibold text-slate-900">
                      {job.title}
                    </h2>

                    <p className="text-sm text-slate-600 mt-1">
                      {job.company}
                    </p>

                    <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-slate-500">
                      <span>📍 {job.location}</span>
                      <span>{job.jobType}</span>
                      <span>{job.experience || "Fresher"}</span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:items-end gap-2 shrink-0">

                    <span className="inline-flex w-fit px-2.5 py-1 rounded-full bg-blue-50 border border-blue-100 text-xs font-medium text-blue-700">
                      {application.status || "Applied"}
                    </span>

                    <span className="text-xs text-slate-400">
                      Applied {formatDate(application.appliedAt || application.createdAt)}
                    </span>

                    <Link
                      to={`/jobs/${job._id}`}
                      className="text-sm font-semibold text-blue-600 hover:text-blue-700"
                    >
                      View Job →
                    </Link>

                  </div>

                </div>
              </div>
            )
          })}
        </div>

      </main>
    </div>
  )
}

export default MyApplications