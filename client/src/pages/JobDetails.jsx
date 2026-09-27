import { useEffect, useState } from "react"
import axios from "axios"
import { API_URL } from "../config"
import {
  useParams,
  useNavigate,
  Link
} from "react-router-dom"

function JobDetails() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [job, setJob] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  // Resume matching
  const [matchResult, setMatchResult] = useState(null)
  const [matchLoading, setMatchLoading] = useState(false)
  const [matchError, setMatchError] = useState("")

  // Resume improvement
  const [improvements, setImprovements] = useState(null)
  const [improvementLoading, setImprovementLoading] = useState(false)
  const [improvementError, setImprovementError] = useState("")

  // Interview
  const [interviewLoading, setInterviewLoading] = useState(false)

  // Application
  const [applied, setApplied] = useState(false)
  const [application, setApplication] = useState(null)
  const [applicationLoading, setApplicationLoading] = useState(false)
  const [applicationError, setApplicationError] = useState("")
  const [showApplyModal, setShowApplyModal] = useState(false)
  const [applicationSubmitted, setApplicationSubmitted] = useState(false)

  // ==========================================
  // Fetch Job
  // ==========================================

  useEffect(() => {
    const fetchJob = async () => {
      try {
        setLoading(true)

        const response = await axios.get(
          `${API_URL}/api/jobs/${id}`
        )

        setJob(response.data.job)
      } catch (error) {
        console.error("Fetch job error:", error)
        setError("Failed to load job")
      } finally {
        setLoading(false)
      }
    }

    fetchJob()
  }, [id])

  // ==========================================
  // Check Application
  // ==========================================

  useEffect(() => {
    const checkApplication = async () => {
      const token = localStorage.getItem("token")

      if (!token) return

      try {
        const response = await axios.get(
`${API_URL}/api/applications/job/${id}`,          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )

        setApplied(response.data.applied || false)
        setApplication(response.data.application || null)
      } catch (error) {
        console.error(
          "Application status error:",
          error
        )
      }
    }

    checkApplication()
  }, [id])

  // ==========================================
  // Apply
  // ==========================================

  const openApplyModal = () => {
    const token = localStorage.getItem("token")

    if (!token) {
      navigate("/login")
      return
    }

    if (applied) return

    setApplicationError("")
    setApplicationSubmitted(false)
    setShowApplyModal(true)
  }

  const submitApplication = async () => {
    const token = localStorage.getItem("token")

    if (!token) {
      navigate("/login")
      return
    }

    try {
      setApplicationLoading(true)
      setApplicationError("")

      const response = await axios.post(
        `${API_URL}/api/applications/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      setApplication(
        response.data.application || null
      )

      setApplied(true)
      setApplicationSubmitted(true)
    } catch (error) {
      console.error(
        "Application submission error:",
        error
      )

      setApplicationError(
        error.response?.data?.message ||
          "Failed to submit application."
      )
    } finally {
      setApplicationLoading(false)
    }
  }

  const closeApplyModal = () => {
    if (applicationLoading) return

    setShowApplyModal(false)
    setApplicationError("")
  }

  // ==========================================
  // Analyze Resume
  // ==========================================

  const analyzeResume = async () => {
    const token = localStorage.getItem("token")

    if (!token) {
      navigate("/login")
      return
    }

    try {
      setMatchLoading(true)
      setMatchError("")

      const response = await axios.get(
       `${API_URL}/api/matches/job/${id}` ,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      setMatchResult(response.data)
    } catch (error) {
      setMatchError(
        error.response?.data?.message ||
          "Failed to analyze resume"
      )
    } finally {
      setMatchLoading(false)
    }
  }

  // ==========================================
  // Resume Improvement
  // ==========================================

  const getImprovementSuggestions = async () => {
    const token = localStorage.getItem("token")

    if (!token) {
      navigate("/login")
      return
    }

    try {
      setImprovementLoading(true)
      setImprovementError("")

      const response = await axios.get(
       `${API_URL}/api/improvements/job/${id}` ,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      setImprovements(response.data)
    } catch (error) {
      setImprovementError(
        error.response?.data?.message ||
          "Failed to generate suggestions"
      )
    } finally {
      setImprovementLoading(false)
    }
  }

  // ==========================================
  // AI Interview
  // ==========================================

  const startInterview = async () => {
    const token = localStorage.getItem("token")

    if (!token) {
      navigate("/login")
      return
    }

    try {
      setInterviewLoading(true)
      setError("")

      const response = await axios.post(
        `${API_URL}/api/interviews/start/${id}`,
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
      setError(
        error.response?.data?.message ||
          "Failed to start interview"
      )
    } finally {
      setInterviewLoading(false)
    }
  }

  // ==========================================
  // Loading
  // ==========================================

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-6">
        <div className="max-w-5xl mx-auto animate-pulse">
          <div className="h-4 w-24 bg-slate-200 rounded mb-4" />

          <div className="bg-white border border-slate-200 rounded-xl p-5">
            <div className="h-7 bg-slate-200 rounded w-2/3" />
            <div className="h-4 bg-slate-200 rounded w-1/3 mt-3" />
            <div className="h-4 bg-slate-200 rounded w-1/4 mt-2" />
          </div>
        </div>
      </div>
    )
  }

  // ==========================================
  // Error
  // ==========================================

  if (error && !job) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="w-full max-w-sm bg-white border border-slate-200 rounded-xl p-6 text-center">

          <h2 className="text-lg font-semibold text-slate-900">
            Unable to load job
          </h2>

          <p className="text-sm text-red-500 mt-2">
            {error}
          </p>

          <Link
            to="/"
            className="inline-flex mt-4 h-10 px-4 items-center bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold"
          >
            Back to Jobs
          </Link>

        </div>
      </div>
    )
  }

  if (!job) {
    return null
  }

  return (
    <div className="min-h-screen bg-slate-50">

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-5 sm:py-7">

        {/* Back */}

        <Link
          to="/"
          className="inline-flex text-sm text-slate-500 hover:text-blue-600 mb-4"
        >
          ← Back to Jobs
        </Link>


        {/* ======================================
            Job Card
        ====================================== */}

        <section className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6">

          <div className="flex flex-col lg:flex-row lg:justify-between gap-5">

            <div className="min-w-0">

              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 leading-tight">
                {job.title}
              </h1>

              <p className="text-base text-slate-600 mt-1">
                {job.company}
              </p>

              <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3 text-sm text-slate-500">
                <span>📍 {job.location}</span>
                <span>{job.jobType}</span>
                <span>{job.experience || "Fresher"}</span>
              </div>

            </div>


            {/* Apply */}

            <div className="w-full lg:w-auto">

              {applied ? (

                <div className="w-full lg:min-w-44 border border-green-200 bg-green-50 rounded-lg px-4 py-2.5">
                  <p className="text-sm font-semibold text-green-700">
                    ✓ Application submitted
                  </p>

                  <p className="text-xs text-green-600 mt-0.5">
                    {application?.status || "Applied"}
                  </p>
                </div>

              ) : (

                <button
                  onClick={openApplyModal}
                  className="w-full lg:w-auto h-10 px-5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition"
                >
                  Apply Now
                </button>

              )}

            </div>

          </div>


          {/* Skills */}

          <div className="mt-5">

            <h2 className="text-sm font-semibold text-slate-900">
              Required Skills
            </h2>

            <div className="flex flex-wrap gap-1.5 mt-2">

              {(job.skills || []).map((skill) => (
                <span
                  key={skill}
                  className="text-xs font-medium text-blue-700 bg-blue-50 border border-blue-100 px-2.5 py-1 rounded-md"
                >
                  {skill}
                </span>
              ))}

            </div>

          </div>


          {/* Description */}

          <div className="mt-5">

            <h2 className="text-sm font-semibold text-slate-900">
              Job Description
            </h2>

            <p className="text-sm leading-6 text-slate-600 mt-2 whitespace-pre-line">
              {job.description}
            </p>

          </div>


          {/* Actions */}

          <div className="flex flex-col sm:flex-row flex-wrap gap-2 mt-5 pt-5 border-t border-slate-100">

            <button
              onClick={analyzeResume}
              disabled={matchLoading}
              className="h-10 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-sm font-semibold disabled:opacity-50"
            >
              {matchLoading
                ? "Analyzing..."
                : "Analyze Resume"}
            </button>

            <button
              onClick={getImprovementSuggestions}
              disabled={improvementLoading}
              className="h-10 px-4 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-sm font-semibold disabled:opacity-50"
            >
              {improvementLoading
                ? "Generating..."
                : "Improve Resume"}
            </button>

            <button
              onClick={startInterview}
              disabled={interviewLoading}
              className="h-10 px-4 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-sm font-semibold disabled:opacity-50"
            >
              {interviewLoading
                ? "Starting..."
                : "AI Mock Interview"}
            </button>

          </div>

        </section>


        {/* ======================================
            Match Error
        ====================================== */}

        {matchError && (
          <div className="mt-3 px-4 py-3 bg-red-50 border border-red-100 text-red-600 rounded-lg text-sm">
            {matchError}
          </div>
        )}


        {/* ======================================
            Match Results
        ====================================== */}

        {matchResult && (

          <section className="mt-5">

            <h2 className="text-lg font-bold text-slate-900 mb-3">
              Resume Match
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">

              {/* Keyword */}

              <div className="bg-white border border-slate-200 rounded-xl p-4">

                <p className="text-sm font-semibold text-slate-900">
                  Keyword Match
                </p>

                <p className="text-2xl font-bold text-slate-900 mt-2">
                  {matchResult.keywordMatching?.score || 0}%
                </p>

                <div className="mt-3">

                  <p className="text-xs font-medium text-slate-500">
                    Matched
                  </p>

                  <div className="flex flex-wrap gap-1 mt-1">

                    {(matchResult.keywordMatching?.matchedSkills || []).map(
                      (skill) => (
                        <span
                          key={skill}
                          className="text-[11px] text-green-700 bg-green-50 px-2 py-1 rounded"
                        >
                          {skill}
                        </span>
                      )
                    )}

                  </div>

                </div>

                <div className="mt-3">

                  <p className="text-xs font-medium text-slate-500">
                    Missing
                  </p>

                  <div className="flex flex-wrap gap-1 mt-1">

                    {(matchResult.keywordMatching?.missingSkills || []).map(
                      (skill) => (
                        <span
                          key={skill}
                          className="text-[11px] text-red-700 bg-red-50 px-2 py-1 rounded"
                        >
                          {skill}
                        </span>
                      )
                    )}

                  </div>

                </div>

              </div>


              {/* Semantic Resume */}

              <div className="bg-white border border-slate-200 rounded-xl p-4">

                <p className="text-sm font-semibold text-slate-900">
                  Semantic Resume
                </p>

                <p className="text-2xl font-bold text-slate-900 mt-2">
                  {matchResult.semanticMatching?.score || 0}%
                </p>

                <p className="text-xs text-slate-500 mt-2">
                  Overall resume-to-job alignment.
                </p>

                {matchResult.semanticMatching?.reason && (
                  <p className="text-xs text-slate-600 leading-5 mt-3">
                    {matchResult.semanticMatching.reason}
                  </p>
                )}

              </div>


              {/* Semantic Skill */}

              <div className="bg-white border border-slate-200 rounded-xl p-4">

                <p className="text-sm font-semibold text-slate-900">
                  Semantic Skill
                </p>

                <p className="text-2xl font-bold text-slate-900 mt-2">
                  {matchResult.semanticSkillMatching?.score || 0}%
                </p>

                <p className="text-xs text-slate-500 mt-2">
                  Skill-level matching.
                </p>

                {matchResult.semanticSkillMatching?.reason && (
                  <p className="text-xs text-slate-600 leading-5 mt-3">
                    {matchResult.semanticSkillMatching.reason}
                  </p>
                )}

              </div>

            </div>


            {/* Improvements */}

            {matchResult.semanticSkillMatching?.improvements?.length > 0 && (

              <div className="bg-white border border-slate-200 rounded-xl p-4 mt-3">

                <p className="text-sm font-semibold text-slate-900">
                  Recommended improvements
                </p>

                <ul className="mt-2 space-y-1">

                  {matchResult.semanticSkillMatching.improvements.map(
                    (item, index) => (
                      <li
                        key={index}
                        className="text-sm text-slate-600"
                      >
                        • {item}
                      </li>
                    )
                  )}

                </ul>

              </div>

            )}

          </section>

        )}


        {/* ======================================
            Improvement Error
        ====================================== */}

        {improvementError && (
          <div className="mt-3 px-4 py-3 bg-red-50 border border-red-100 text-red-600 rounded-lg text-sm">
            {improvementError}
          </div>
        )}


        {/* ======================================
            Improvements
        ====================================== */}

        {improvements && (

          <section className="mt-5 bg-white border border-slate-200 rounded-xl p-5">

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">

              <h2 className="text-lg font-bold text-slate-900">
                Resume Improvements
              </h2>

              {improvements.job?.title && (
                <span className="text-xs text-slate-500">
                  {improvements.job.title}
                </span>
              )}

            </div>


            {improvements.missingSkills?.length > 0 && (

              <div className="mt-4">

                <p className="text-sm font-semibold text-slate-900">
                  Skills to improve
                </p>

                <div className="flex flex-wrap gap-1.5 mt-2">

                  {improvements.missingSkills.map(
                    (skill) => (
                      <span
                        key={skill}
                        className="text-xs text-red-700 bg-red-50 px-2.5 py-1 rounded-md"
                      >
                        {skill}
                      </span>
                    )
                  )}

                </div>

              </div>

            )}


            {improvements.suggestions?.length > 0 && (

              <div className="mt-4 space-y-2">

                {improvements.suggestions.map(
                  (suggestion, index) => (

                    <div
                      key={index}
                      className="border border-slate-100 rounded-lg p-3"
                    >

                      <div className="flex flex-wrap items-center gap-2">

                        <span className="text-[11px] font-semibold text-purple-700 bg-purple-50 px-2 py-1 rounded">
                          {suggestion.type}
                        </span>

                        <p className="text-sm font-semibold text-slate-900">
                          {suggestion.title}
                        </p>

                      </div>

                      <p className="text-sm text-slate-600 leading-5 mt-2">
                        {suggestion.description}
                      </p>

                    </div>

                  )
                )}

              </div>

            )}

          </section>

        )}

      </main>


      {/* ======================================
          Application Modal
      ====================================== */}

      {showApplyModal && (

        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center px-4">

          <div className="w-full max-w-md bg-white rounded-xl border border-slate-200 shadow-xl">

            {!applicationSubmitted ? (

              <>

                <div className="p-5">

                  <div className="flex items-start justify-between gap-4">

                    <div>
                      <h2 className="text-lg font-bold text-slate-900">
                        Apply for this job
                      </h2>

                      <p className="text-sm text-slate-500 mt-1">
                        {job.title} · {job.company}
                      </p>
                    </div>

                    <button
                      onClick={closeApplyModal}
                      disabled={applicationLoading}
                      className="text-xl text-slate-400 hover:text-slate-700"
                    >
                      ×
                    </button>

                  </div>


                  <div className="mt-4 bg-slate-50 border border-slate-200 rounded-lg p-3">

                    <p className="text-sm font-medium text-slate-900">
                      Your latest resume will be submitted
                    </p>

                    <p className="text-xs text-slate-500 mt-1">
                      Make sure your resume is up to date.
                    </p>

                  </div>


                  {applicationError && (
                    <div className="mt-3 bg-red-50 border border-red-100 text-red-600 rounded-lg p-3 text-sm">
                      {applicationError}
                    </div>
                  )}

                </div>


                <div className="px-5 py-4 border-t border-slate-100 flex flex-col-reverse sm:flex-row sm:justify-end gap-2">

                  <button
                    onClick={closeApplyModal}
                    disabled={applicationLoading}
                    className="h-10 px-4 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
                  >
                    Cancel
                  </button>

                  <button
                    onClick={submitApplication}
                    disabled={applicationLoading}
                    className="h-10 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold disabled:opacity-50"
                  >
                    {applicationLoading
                      ? "Submitting..."
                      : "Submit Application"}
                  </button>

                </div>

              </>

            ) : (

              <div className="p-6 text-center">

                <div className="w-11 h-11 mx-auto rounded-full bg-green-50 text-green-600 flex items-center justify-center text-lg">
                  ✓
                </div>

                <h2 className="text-lg font-bold text-slate-900 mt-3">
                  Application submitted
                </h2>

                <p className="text-sm text-slate-500 leading-5 mt-2">
                  Your application has been submitted successfully.
                  If you are shortlisted, the hiring team may contact you.
                </p>

                <button
                  onClick={closeApplyModal}
                  className="mt-4 h-10 px-5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-sm font-semibold"
                >
                  Done
                </button>

              </div>

            )}

          </div>

        </div>

      )}

    </div>
  )
}

export default JobDetails