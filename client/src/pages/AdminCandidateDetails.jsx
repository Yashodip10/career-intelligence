import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import axios from "axios"
import { API_URL } from "../config"

function AdminCandidateDetails() {
  const { id } = useParams()

  const [candidate, setCandidate] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const token = localStorage.getItem("token")

  // ==========================================
  // Fetch Candidate
  // ==========================================

  useEffect(() => {
    fetchCandidate()
  }, [id])

  const fetchCandidate = async () => {
    try {
      setLoading(true)
      setError("")

      const response = await axios.get(
        `${API_URL}/api/admin/candidates/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      setCandidate(response.data.candidate)
    } catch (error) {
      console.error(error)

      setError(
        error.response?.data?.message ||
          "Failed to load candidate"
      )
    } finally {
      setLoading(false)
    }
  }

  // ==========================================
  // Loading
  // ==========================================

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 sm:px-6 py-6 sm:py-8">

        <div className="max-w-7xl mx-auto animate-pulse">

          <div className="h-4 w-32 bg-slate-200 rounded" />

          <div className="h-28 bg-white border border-slate-200 rounded-xl mt-4" />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">

            <div className="lg:col-span-2 h-96 bg-white border border-slate-200 rounded-xl" />

            <div className="h-64 bg-white border border-slate-200 rounded-xl" />

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
      <div className="min-h-screen bg-slate-50">

        <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">

          <Link
            to="/admin/candidates"
            className="text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            ← Back to Candidates
          </Link>

          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
            {error}
          </div>

        </main>

      </div>
    )
  }

  if (!candidate) {
    return null
  }

  // ==========================================
  // Resume Data
  // ==========================================

  const resume = candidate.resume

  const skills =
    resume?.parsedData?.skills || []

  const education =
    resume?.parsedData?.education || []

  const projects =
    resume?.parsedData?.projects || []

  const experience =
    resume?.parsedData?.experience || []

  const certifications =
    resume?.parsedData?.certifications || []

  return (
    <div className="min-h-screen bg-slate-50">

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">

        {/* ==========================================
            Back
        ========================================== */}

        <Link
          to="/admin/candidates"
          className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-700 mb-4"
        >
          ← Back to Candidates
        </Link>


        {/* ==========================================
            Candidate Header
        ========================================== */}

        <section className="bg-white border border-slate-200 rounded-xl overflow-hidden mb-5">

          <div className="p-5">

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">

              {/* Identity */}

              <div className="flex items-center gap-3 min-w-0">

                <div className="w-12 h-12 shrink-0 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center text-lg font-bold">

                  {candidate.name
                    ?.charAt(0)
                    ?.toUpperCase() || "C"}

                </div>

                <div className="min-w-0">

                  <h1 className="text-xl sm:text-2xl font-bold text-slate-900 truncate">
                    {candidate.name}
                  </h1>

                  <p className="text-sm text-slate-500 mt-0.5 truncate">
                    {candidate.email}
                  </p>

                </div>

              </div>


              {/* Quick Stats */}

              <div className="grid grid-cols-2 gap-2 sm:flex">

                <MiniStat
                  label="Interviews"
                  value={
                    candidate.interviews?.length || 0
                  }
                />

                <MiniStat
                  label="Skills"
                  value={skills.length}
                />

              </div>

            </div>

          </div>


          {/* Candidate Meta */}

          <div className="border-t border-slate-100 px-5 py-3 bg-slate-50 flex flex-wrap gap-x-6 gap-y-2">

            <MetaItem
              label="Joined"
              value={
                candidate.createdAt
                  ? new Date(
                      candidate.createdAt
                    ).toLocaleDateString()
                  : "—"
              }
            />

            <MetaItem
              label="Last Login"
              value={
                candidate.lastLoginAt
                  ? new Date(
                      candidate.lastLoginAt
                    ).toLocaleDateString()
                  : "Never"
              }
            />

            <MetaItem
              label="Resume"
              value={
                resume
                  ? "Uploaded"
                  : "Not uploaded"
              }
            />

          </div>

        </section>


        {/* ==========================================
            Main Layout
        ========================================== */}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">


          {/* ========================================
              Left Column
          ======================================== */}

          <div className="lg:col-span-2 space-y-4">

            {/* ======================================
                Resume
            ====================================== */}

            <section className="bg-white border border-slate-200 rounded-xl">

              <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between gap-3">

                <div>

                  <h2 className="text-base font-bold text-slate-900">
                    Resume
                  </h2>

                  <p className="text-xs text-slate-500 mt-0.5">
                    Parsed resume information
                  </p>

                </div>

                {resume && (

                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-full text-[11px] font-semibold">

                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />

                    Uploaded

                  </span>

                )}

              </div>


              <div className="p-5">

                {!resume ? (

                  <EmptyState
                    icon="📄"
                    title="No resume uploaded"
                    text="This candidate has not uploaded a resume yet."
                  />

                ) : (

                  <>

                    {/* File */}

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 p-3 bg-slate-50 border border-slate-100 rounded-lg mb-5">

                      <div className="min-w-0">

                        <p className="text-[11px] uppercase tracking-wide text-slate-400">
                          Resume File
                        </p>

                        <p className="text-sm font-semibold text-slate-800 mt-0.5 truncate">
                          {resume.fileName}
                        </p>

                      </div>

                    </div>


                    {/* Skills */}

                    <ResumeSection
                      title="Skills"
                      items={skills}
                      type="skills"
                    />


                    {/* Education */}

                    <ResumeSection
                      title="Education"
                      items={education}
                    />


                    {/* Projects */}

                    <ResumeSection
                      title="Projects"
                      items={projects}
                    />


                    {/* Experience */}

                    <ResumeSection
                      title="Experience"
                      items={experience}
                    />


                    {/* Certifications */}

                    <ResumeSection
                      title="Certifications"
                      items={certifications}
                    />

                  </>

                )}

              </div>

            </section>


            {/* ======================================
                Interview Activity
            ====================================== */}

            <section className="bg-white border border-slate-200 rounded-xl">

              <div className="px-5 py-4 border-b border-slate-100">

                <h2 className="text-base font-bold text-slate-900">
                  Interview Activity
                </h2>

                <p className="text-xs text-slate-500 mt-0.5">
                  Mock interview history
                </p>

              </div>


              <div className="p-5">

                {!candidate.interviews ||
                candidate.interviews.length === 0 ? (

                  <EmptyState
                    icon="🎯"
                    title="No interviews completed"
                    text="This candidate has not completed a mock interview yet."
                  />

                ) : (

                  <div className="space-y-2">

                    {candidate.interviews.map(
                      (interview, index) => (

                        <div
                          key={
                            interview._id ||
                            index
                          }
                          className="border border-slate-200 rounded-lg p-3.5 hover:bg-slate-50/70 transition"
                        >

                          <div className="flex items-center justify-between gap-4">

                            <div className="min-w-0">

                              <p className="text-sm font-semibold text-slate-900 truncate">
                                {interview.jobTitle ||
                                  "Mock Interview"}
                              </p>

                              {interview.company && (

                                <p className="text-xs text-slate-500 mt-0.5">
                                  {interview.company}
                                </p>

                              )}

                              {interview.createdAt && (

                                <p className="text-[11px] text-slate-400 mt-1.5">
                                  {new Date(
                                    interview.createdAt
                                  ).toLocaleDateString()}
                                </p>

                              )}

                            </div>


                            {typeof interview.totalScore ===
                              "number" && (

                              <div className="shrink-0 text-right">

                                <p className="text-[11px] text-slate-400">
                                  Score
                                </p>

                                <p className="text-lg font-bold text-blue-600">
                                  {interview.totalScore}%
                                </p>

                              </div>

                            )}

                          </div>

                        </div>

                      )
                    )}

                  </div>

                )}

              </div>

            </section>

          </div>


          {/* ========================================
              Right Column
          ======================================== */}

          <div className="space-y-4">

            {/* Candidate Information */}

            <section className="bg-white border border-slate-200 rounded-xl">

              <div className="px-5 py-4 border-b border-slate-100">

                <h2 className="text-base font-bold text-slate-900">
                  Candidate Information
                </h2>

              </div>

              <div className="p-5 space-y-4">

                <InfoItem
                  label="Name"
                  value={candidate.name}
                />

                <InfoItem
                  label="Email"
                  value={candidate.email}
                />

                <InfoItem
                  label="Joined"
                  value={
                    candidate.createdAt
                      ? new Date(
                          candidate.createdAt
                        ).toLocaleDateString()
                      : "—"
                  }
                />

                <InfoItem
                  label="Last Login"
                  value={
                    candidate.lastLoginAt
                      ? new Date(
                          candidate.lastLoginAt
                        ).toLocaleDateString()
                      : "Never"
                  }
                />

              </div>

            </section>


            {/* Skill Summary */}

            <section className="bg-white border border-slate-200 rounded-xl">

              <div className="px-5 py-4 border-b border-slate-100">

                <h2 className="text-base font-bold text-slate-900">
                  Skill Summary
                </h2>

                <p className="text-xs text-slate-500 mt-0.5">
                  Skills detected from the resume
                </p>

              </div>

              <div className="p-5">

                {skills.length === 0 ? (

                  <p className="text-sm text-slate-500">
                    No skills available.
                  </p>

                ) : (

                  <div className="flex flex-wrap gap-1.5">

                    {skills.map(
                      (skill, index) => (

                        <span
                          key={index}
                          className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded-md text-xs font-medium"
                        >
                          {skill}
                        </span>

                      )
                    )}

                  </div>

                )}

              </div>

            </section>


            {/* Resume Status */}

            <section className="bg-slate-900 rounded-xl p-5 text-white">

              <p className="text-[11px] uppercase tracking-wide text-slate-400">
                Resume Status
              </p>

              <h2 className="text-lg font-bold mt-1">
                {resume
                  ? "Resume available"
                  : "No resume uploaded"}
              </h2>

              <p className="text-xs text-slate-400 mt-1.5">
                {resume
                  ? "Resume information has been parsed and is available for review."
                  : "Candidate has not submitted a resume yet."}
              </p>

            </section>

          </div>

        </div>

      </main>

    </div>
  )
}


// ==========================================
// Resume Section
// ==========================================

function ResumeSection({
  title,
  items,
  type
}) {
  if (!items || items.length === 0) {
    return null
  }

  return (
    <div className="mb-5 last:mb-0">

      <h3 className="text-sm font-bold text-slate-900 mb-2.5">
        {title}
      </h3>


      {type === "skills" ? (

        <div className="flex flex-wrap gap-1.5">

          {items.map(
            (item, index) => (

              <span
                key={index}
                className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded-md text-xs font-medium"
              >
                {item}
              </span>

            )
          )}

        </div>

      ) : (

        <div className="space-y-1.5">

          {items.map(
            (item, index) => (

              <div
                key={index}
                className="px-3 py-2.5 bg-slate-50 border border-slate-100 rounded-lg text-xs sm:text-sm text-slate-700"
              >
                {item}
              </div>

            )
          )}

        </div>

      )}

    </div>
  )
}


// ==========================================
// Info Item
// ==========================================

function InfoItem({
  label,
  value
}) {
  return (
    <div>

      <p className="text-[11px] uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p className="text-sm font-medium text-slate-900 mt-0.5 break-words">
        {value || "—"}
      </p>

    </div>
  )
}


// ==========================================
// Mini Stat
// ==========================================

function MiniStat({
  label,
  value
}) {
  return (
    <div className="px-3 py-2.5 bg-slate-50 border border-slate-100 rounded-lg text-center min-w-20">

      <p className="text-[11px] text-slate-400">
        {label}
      </p>

      <p className="text-lg font-bold text-slate-900 mt-0.5">
        {value}
      </p>

    </div>
  )
}


// ==========================================
// Meta Item
// ==========================================

function MetaItem({
  label,
  value
}) {
  return (
    <div className="flex items-center gap-1.5">

      <span className="text-[11px] text-slate-400">
        {label}:
      </span>

      <span className="text-xs font-medium text-slate-600">
        {value}
      </span>

    </div>
  )
}


// ==========================================
// Empty State
// ==========================================

function EmptyState({
  icon,
  title,
  text
}) {
  return (
    <div className="py-8 text-center">

      <div className="w-10 h-10 mx-auto rounded-lg bg-slate-100 flex items-center justify-center text-lg">
        {icon}
      </div>

      <h3 className="text-sm font-semibold text-slate-900 mt-3">
        {title}
      </h3>

      <p className="text-xs text-slate-500 mt-1">
        {text}
      </p>

    </div>
  )
}

export default AdminCandidateDetails