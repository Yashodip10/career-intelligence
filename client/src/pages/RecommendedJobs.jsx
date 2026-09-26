import { useEffect, useState } from "react"
import axios from "axios"
import { Link } from "react-router-dom"

function RecommendedJobs() {
  const [recommendations, setRecommendations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const getToken = () => {
    return localStorage.getItem("token")
  }

  // ==========================================
  // Fetch recommendations
  // ==========================================

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        setLoading(true)
        setError("")

        const token = getToken()

        const response = await axios.get(
          "http://127.0.0.1:8000/api/recommendations",
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )

        setRecommendations(
          response.data.recommendations || []
        )
      } catch (error) {
        console.error(
          "Recommendations error:",
          error
        )

        setError(
          error.response?.data?.message ||
            "Failed to load recommended jobs"
        )
      } finally {
        setLoading(false)
      }
    }

    fetchRecommendations()
  }, [])

  // ==========================================
  // Helpers
  // ==========================================

  const getCompanyInitial = (company) => {
    if (!company) return "C"

    return company
      .trim()
      .charAt(0)
      .toUpperCase()
  }

  const getMatchStyle = (score) => {
    if (score >= 80) {
      return {
        badge:
          "bg-emerald-50 text-emerald-700 border-emerald-200",
        text: "Strong Match"
      }
    }

    if (score >= 60) {
      return {
        badge:
          "bg-blue-50 text-blue-700 border-blue-200",
        text: "Good Match"
      }
    }

    if (score >= 40) {
      return {
        badge:
          "bg-amber-50 text-amber-700 border-amber-200",
        text: "Partial Match"
      }
    }

    return {
      badge:
        "bg-slate-100 text-slate-600 border-slate-200",
      text: "Potential Match"
    }
  }

  const getPostedText = (date) => {
    if (!date) return "Recently posted"

    const postedDate = new Date(date)

    if (Number.isNaN(postedDate.getTime())) {
      return "Recently posted"
    }

    const now = new Date()

    const difference =
      now.getTime() - postedDate.getTime()

    const hours = Math.floor(
      difference / (1000 * 60 * 60)
    )

    const days = Math.floor(
      difference / (1000 * 60 * 60 * 24)
    )

    if (hours < 1) return "Just now"

    if (hours < 24) {
      return `${hours}h ago`
    }

    if (days < 7) {
      return `${days}d ago`
    }

    return postedDate.toLocaleDateString(
      "en-IN",
      {
        day: "numeric",
        month: "short"
      }
    )
  }

  // ==========================================
  // Loading
  // ==========================================

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 sm:px-6 py-6">

        <div className="max-w-6xl mx-auto animate-pulse">

          <div className="h-7 bg-slate-200 rounded w-56" />

          <div className="h-4 bg-slate-200 rounded w-32 mt-3" />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-6">

            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="bg-white border border-slate-200 rounded-xl p-5"
              >
                <div className="flex gap-3">

                  <div className="w-10 h-10 bg-slate-200 rounded-lg" />

                  <div className="flex-1">
                    <div className="h-5 bg-slate-200 rounded w-2/3" />
                    <div className="h-3 bg-slate-200 rounded w-1/3 mt-2" />
                  </div>

                </div>

                <div className="h-3 bg-slate-200 rounded w-full mt-5" />
                <div className="h-3 bg-slate-200 rounded w-3/4 mt-2" />
              </div>
            ))}

          </div>

        </div>
      </div>
    )
  }

  // ==========================================
  // Error
  // ==========================================

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">

        <div className="w-full max-w-sm bg-white border border-slate-200 rounded-xl p-6 text-center">

          <div className="w-10 h-10 mx-auto rounded-full bg-red-50 text-red-600 flex items-center justify-center font-bold">
            !
          </div>

          <h2 className="text-lg font-semibold text-slate-900 mt-3">
            Unable to load recommendations
          </h2>

          <p className="text-sm text-red-500 mt-2">
            {error}
          </p>

          <Link
            to="/resume"
            className="inline-flex items-center justify-center h-10 px-4 mt-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold"
          >
            Check Resume
          </Link>

        </div>

      </div>
    )
  }

  // ==========================================
  // Main
  // ==========================================

  return (
    <div className="min-h-screen bg-slate-50">

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">

        {/* Header */}

        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-5">

          <div>

            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
              Recommended Jobs
            </h1>

            <p className="text-sm text-slate-500 mt-1">
              {recommendations.length}{" "}
              {recommendations.length === 1
                ? "job"
                : "jobs"}{" "}
              matched to your profile
            </p>

          </div>

          <Link
            to="/jobs"
            className="text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            Browse all jobs →
          </Link>

        </div>


        {/* No recommendations */}

        {recommendations.length === 0 && (

          <div className="bg-white border border-slate-200 rounded-xl p-8 sm:p-10 text-center">

            <div className="w-12 h-12 mx-auto rounded-xl bg-slate-100 flex items-center justify-center text-slate-400">

              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-4-4" />
              </svg>

            </div>

            <h2 className="text-lg font-semibold text-slate-900 mt-4">
              No recommendations yet
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              Upload a resume with your skills to get matched jobs.
            </p>

            <Link
              to="/resume"
              className="inline-flex items-center justify-center h-10 px-4 mt-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold"
            >
              Update Resume
            </Link>

          </div>

        )}


        {/* Recommendation cards */}

        {recommendations.length > 0 && (

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

            {recommendations.map((recommendation) => {

              const job = recommendation.job

              const matchStyle =
                getMatchStyle(
                  recommendation.recommendationScore
                )

              const matchedSkills =
                recommendation
                  .keywordMatching
                  ?.matchedSkills || []

              const missingSkills =
                recommendation
                  .keywordMatching
                  ?.missingSkills || []

              return (
                <article
                  key={job._id}
className="bg-white border border-slate-200 rounded-xl p-5 hover:border-blue-200 hover:shadow-sm transition flex flex-col h-full"                >

                  {/* Top */}

                  <div className="flex items-start justify-between gap-3">

                    <div className="flex items-start gap-3 min-w-0">

                      <div className="w-10 h-10 shrink-0 rounded-lg bg-blue-50 text-blue-700 border border-blue-100 flex items-center justify-center font-bold">
                        {getCompanyInitial(
                          job.company
                        )}
                      </div>

                      <div className="min-w-0">

                        <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                          {job.title}
                        </h2>

                        <p className="text-sm text-slate-600 mt-0.5">
                          {job.company}
                        </p>

                      </div>

                    </div>


                    {/* Score */}

                    <div className="shrink-0 text-right">

                      <p className="text-xl font-bold text-slate-900">
                        {Math.round(
                          recommendation.recommendationScore
                        )}%
                      </p>

                      <span
                        className={`inline-block mt-1 text-[11px] font-semibold border px-2 py-1 rounded-full ${matchStyle.badge}`}
                      >
                        {matchStyle.text}
                      </span>

                    </div>

                  </div>


                  {/* Job info */}

                  <div className="flex flex-wrap gap-x-4 gap-y-1 mt-4 text-xs text-slate-500">

                    <span>
                      📍 {job.location}
                    </span>

                    <span>
                      {job.jobType}
                    </span>

                    <span>
                      {job.experience}
                    </span>

                  </div>


                  {/* Matching skills */}

                  {matchedSkills.length > 0 && (

                    <div className="mt-4">

                      <p className="text-xs font-semibold text-slate-700 mb-2">
                        Matching skills
                      </p>

                      <div className="flex flex-wrap gap-1.5">

                        {matchedSkills
                          .slice(0, 6)
                          .map((skill) => (

                            <span
                              key={skill}
                              className="text-[11px] font-medium text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-1 rounded-md"
                            >
                              ✓ {skill}
                            </span>

                          ))}

                      </div>

                    </div>

                  )}


                  {/* Missing skills */}

                  {missingSkills.length > 0 && (

                    <div className="mt-3">

                      <p className="text-xs font-semibold text-slate-700 mb-2">
                        Skills to strengthen
                      </p>

                      <div className="flex flex-wrap gap-1.5">

                        {missingSkills
                          .slice(0, 5)
                          .map((skill) => (

                            <span
                              key={skill}
                              className="text-[11px] font-medium text-amber-700 bg-amber-50 border border-amber-100 px-2 py-1 rounded-md"
                            >
                              {skill}
                            </span>

                          ))}

                      </div>

                    </div>

                  )}


                  {/* Bottom */}

<div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                    <span className="text-xs text-slate-400">
                      {getPostedText(
                        job.postedAt ||
                        job.createdAt
                      )}
                    </span>

                   <div className="flex">

  <Link
    to={`/jobs/${job._id}`}
    className="h-9 px-4 flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs sm:text-sm font-semibold transition"
  >
    View Job
  </Link>

</div>

                  </div>

                </article>
              )
            })}

          </div>

        )}

      </main>

    </div>
  )
}

export default RecommendedJobs