import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import axios from "axios"

function AdminCandidates() {
  const [candidates, setCandidates] = useState([])

  const [stats, setStats] = useState({
    totalCandidates: 0,
    totalResumes: 0,
    totalInterviews: 0,
    activeCandidates: 0
  })

  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const token = localStorage.getItem("token")

  // ==========================================
  // Fetch Candidates + Stats
  // ==========================================

  useEffect(() => {
    fetchCandidates()
    fetchStats()
  }, [])

  const fetchCandidates = async () => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/api/admin/candidates",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      setCandidates(response.data.candidates || [])
    } catch (error) {
      console.error(error)

      setError(
        error.response?.data?.message ||
          "Failed to load candidates"
      )
    }
  }

  const fetchStats = async () => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/api/admin/candidates/stats",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      setStats(response.data || {})
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  // ==========================================
  // Search
  // ==========================================

  const filteredCandidates = candidates.filter(
    (candidate) => {
      const searchText = search
        .toLowerCase()
        .trim()

      if (!searchText) {
        return true
      }

      return (
        candidate.name
          ?.toLowerCase()
          .includes(searchText) ||
        candidate.email
          ?.toLowerCase()
          .includes(searchText)
      )
    }
  )

  // ==========================================
  // Loading
  // ==========================================

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 sm:px-6 py-6 sm:py-8">

        <div className="max-w-7xl mx-auto animate-pulse">

          <div className="h-7 w-56 bg-slate-200 rounded" />

          <div className="h-4 w-72 bg-slate-200 rounded mt-3" />

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-6">

            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="h-24 bg-white border border-slate-200 rounded-xl"
              />
            ))}

          </div>

          <div className="h-14 bg-white border border-slate-200 rounded-xl mt-5" />

          <div className="h-64 bg-white border border-slate-200 rounded-xl mt-4" />

        </div>

      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">

        {/* ==========================================
            Header
        ========================================== */}

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">

          <div>

            <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600 mb-1">
              Candidate Management
            </p>

            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
              Candidates
            </h1>

            <p className="text-sm text-slate-500 mt-1">
              Review registered candidates and their career activity.
            </p>

          </div>

          <Link
            to="/admin"
            className="inline-flex items-center justify-center h-9 px-3 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition"
          >
            ← Dashboard
          </Link>

        </div>


        {/* ==========================================
            Statistics
        ========================================== */}

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">

          <StatCard
            title="Candidates"
            value={stats.totalCandidates}
            type="blue"
          />

          <StatCard
            title="Resumes"
            value={stats.totalResumes}
            type="emerald"
          />

          <StatCard
            title="Interviews"
            value={stats.totalInterviews}
            type="purple"
          />

          <StatCard
            title="Active"
            value={stats.activeCandidates}
            type="amber"
          />

        </div>


        {/* ==========================================
            Main Candidate Section
        ========================================== */}

        <section className="bg-white border border-slate-200 rounded-xl overflow-hidden">

          {/* Toolbar */}

          <div className="px-4 sm:px-5 py-4 border-b border-slate-200">

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

              <div>

                <h2 className="text-base font-bold text-slate-900">
                  Registered Candidates
                </h2>

                <p className="text-xs text-slate-500 mt-0.5">
                  {filteredCandidates.length} candidate
                  {filteredCandidates.length !== 1
                    ? "s"
                    : ""}
                </p>

              </div>

              <div className="w-full sm:w-72">

                <input
                  type="text"
                  placeholder="Search name or email..."
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                  className="w-full h-10 px-3 text-sm bg-slate-50 border border-slate-200 rounded-lg outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition"
                />

              </div>

            </div>

          </div>


          {/* Error */}

          {error && (
            <div className="m-4 px-4 py-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}


          {/* Empty */}

          {filteredCandidates.length === 0 ? (

            <div className="px-5 py-12 text-center">

              <div className="w-10 h-10 mx-auto rounded-lg bg-slate-100 text-slate-400 flex items-center justify-center text-lg">
                👤
              </div>

              <h3 className="text-base font-semibold text-slate-900 mt-3">
                No candidates found
              </h3>

              <p className="text-sm text-slate-500 mt-1">
                Try changing your search.
              </p>

            </div>

          ) : (

            <>

              {/* ====================================
                  Desktop Table
              ==================================== */}

              <div className="hidden lg:block overflow-x-auto">

                <table className="w-full">

                  <thead className="bg-slate-50 border-b border-slate-200">

                    <tr>

                      <th className="text-left px-5 py-3 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                        Candidate
                      </th>

                      <th className="text-left px-5 py-3 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                        Resume
                      </th>

                      <th className="text-left px-5 py-3 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                        Skills
                      </th>

                      <th className="text-left px-5 py-3 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                        Interviews
                      </th>

                      <th className="text-left px-5 py-3 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                        Joined
                      </th>

                      <th className="text-right px-5 py-3 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                        Action
                      </th>

                    </tr>

                  </thead>


                  <tbody className="divide-y divide-slate-100">

                    {filteredCandidates.map(
                      (candidate) => (

                        <tr
                          key={candidate.id}
                          className="hover:bg-slate-50/70 transition"
                        >

                          {/* Candidate */}

                          <td className="px-5 py-4">

                            <div className="flex items-center gap-3">

                              <div className="w-9 h-9 shrink-0 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center text-sm font-bold">
                                {candidate.name
                                  ?.charAt(0)
                                  ?.toUpperCase() || "C"}
                              </div>

                              <div className="min-w-0">

                                <p className="text-sm font-semibold text-slate-900 truncate max-w-48">
                                  {candidate.name ||
                                    "Unknown"}
                                </p>

                                <p className="text-xs text-slate-500 truncate max-w-52">
                                  {candidate.email}
                                </p>

                              </div>

                            </div>

                          </td>


                          {/* Resume */}

                          <td className="px-5 py-4">

                            {candidate.resumeUploaded ? (

                              <div>

                                <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700">

                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />

                                  Uploaded

                                </span>

                                {candidate.resumeFileName && (
                                  <p className="text-xs text-slate-400 mt-1 max-w-32 truncate">
                                    {candidate.resumeFileName}
                                  </p>
                                )}

                              </div>

                            ) : (

                              <span className="inline-flex px-2 py-1 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-500">
                                Not uploaded
                              </span>

                            )}

                          </td>


                          {/* Skills */}

                          <td className="px-5 py-4">

                            {candidate.skills?.length > 0 ? (

                              <div className="flex flex-wrap gap-1 max-w-64">

                                {candidate.skills
                                  .slice(0, 3)
                                  .map(
                                    (
                                      skill,
                                      index
                                    ) => (

                                      <span
                                        key={index}
                                        className="px-2 py-1 bg-blue-50 text-blue-700 rounded-md text-[11px] font-medium"
                                      >
                                        {skill}
                                      </span>

                                    )
                                  )}

                                {candidate.skills
                                  .length > 3 && (

                                  <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded-md text-[11px] font-medium">
                                    +
                                    {candidate.skills
                                      .length - 3}
                                  </span>

                                )}

                              </div>

                            ) : (

                              <span className="text-xs text-slate-400">
                                No skills
                              </span>

                            )}

                          </td>


                          {/* Interviews */}

                          <td className="px-5 py-4">

                            <span className="text-sm font-semibold text-slate-900">
                              {candidate.interviewCount || 0}
                            </span>

                          </td>


                          {/* Joined */}

                          <td className="px-5 py-4 text-xs text-slate-500">

                            {candidate.createdAt
                              ? new Date(
                                  candidate.createdAt
                                ).toLocaleDateString()
                              : "—"}

                          </td>


                          {/* Action */}

                          <td className="px-5 py-4 text-right">

                            <Link
                              to={`/admin/candidates/${candidate.id}`}
                              className="inline-flex items-center justify-center h-8 px-3 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition"
                            >
                              View
                            </Link>

                          </td>

                        </tr>

                      )
                    )}

                  </tbody>

                </table>

              </div>


              {/* ====================================
                  Mobile Cards
              ==================================== */}

              <div className="lg:hidden divide-y divide-slate-100">

                {filteredCandidates.map(
                  (candidate) => (

                    <div
                      key={candidate.id}
                      className="p-4"
                    >

                      {/* Candidate Header */}

                      <div className="flex items-start justify-between gap-3">

                        <div className="flex items-center gap-3 min-w-0">

                          <div className="w-10 h-10 shrink-0 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center text-sm font-bold">
                            {candidate.name
                              ?.charAt(0)
                              ?.toUpperCase() || "C"}
                          </div>

                          <div className="min-w-0">

                            <p className="text-sm font-semibold text-slate-900 truncate">
                              {candidate.name ||
                                "Unknown"}
                            </p>

                            <p className="text-xs text-slate-500 truncate">
                              {candidate.email}
                            </p>

                          </div>

                        </div>

                        <Link
                          to={`/admin/candidates/${candidate.id}`}
                          className="h-8 px-3 shrink-0 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold flex items-center"
                        >
                          View
                        </Link>

                      </div>


                      {/* Candidate Details */}

                      <div className="grid grid-cols-2 gap-3 mt-4">

                        <div>

                          <p className="text-[11px] text-slate-400 uppercase tracking-wide">
                            Resume
                          </p>

                          <p className="text-xs font-medium text-slate-700 mt-1">

                            {candidate.resumeUploaded
                              ? "Uploaded"
                              : "Not uploaded"}

                          </p>

                        </div>


                        <div>

                          <p className="text-[11px] text-slate-400 uppercase tracking-wide">
                            Interviews
                          </p>

                          <p className="text-xs font-medium text-slate-700 mt-1">
                            {candidate.interviewCount || 0}
                          </p>

                        </div>


                        <div>

                          <p className="text-[11px] text-slate-400 uppercase tracking-wide">
                            Joined
                          </p>

                          <p className="text-xs font-medium text-slate-700 mt-1">

                            {candidate.createdAt
                              ? new Date(
                                  candidate.createdAt
                                ).toLocaleDateString()
                              : "—"}

                          </p>

                        </div>


                        <div>

                          <p className="text-[11px] text-slate-400 uppercase tracking-wide">
                            Skills
                          </p>

                          <p className="text-xs font-medium text-slate-700 mt-1">
                            {candidate.skills?.length || 0}
                          </p>

                        </div>

                      </div>


                      {/* Skills */}

                      {candidate.skills?.length > 0 && (

                        <div className="flex flex-wrap gap-1.5 mt-3">

                          {candidate.skills
                            .slice(0, 5)
                            .map(
                              (skill, index) => (

                                <span
                                  key={index}
                                  className="px-2 py-1 bg-blue-50 text-blue-700 rounded-md text-[11px]"
                                >
                                  {skill}
                                </span>

                              )
                            )}

                          {candidate.skills.length > 5 && (

                            <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded-md text-[11px]">
                              +
                              {candidate.skills.length - 5}
                            </span>

                          )}

                        </div>

                      )}

                    </div>

                  )
                )}

              </div>

            </>

          )}

        </section>

      </main>

    </div>
  )
}


// ==========================================
// Statistics Card
// ==========================================

function StatCard({
  title,
  value,
  type
}) {
  const styles = {
    blue: {
      icon: "bg-blue-50 text-blue-600",
      value: "text-slate-900"
    },

    emerald: {
      icon: "bg-emerald-50 text-emerald-600",
      value: "text-emerald-700"
    },

    purple: {
      icon: "bg-purple-50 text-purple-600",
      value: "text-purple-700"
    },

    amber: {
      icon: "bg-amber-50 text-amber-600",
      value: "text-amber-700"
    }
  }

  const style =
    styles[type] || styles.blue

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4">

      <div className="flex items-center justify-between gap-3">

        <div>

          <p className="text-xs text-slate-500">
            {title}
          </p>

          <p
            className={`text-2xl font-bold mt-1 ${style.value}`}
          >
            {value ?? 0}
          </p>

        </div>

        <div
          className={`w-9 h-9 rounded-lg flex items-center justify-center ${style.icon}`}
        >
          <span className="text-sm">
            ●
          </span>
        </div>

      </div>

    </div>
  )
}

export default AdminCandidates