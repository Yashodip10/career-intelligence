import { useEffect, useState } from "react"
import axios from "axios"
import { Link } from "react-router-dom"
import { API_URL } from "../config"

function Jobs() {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  // Search inputs
  const [searchInput, setSearchInput] = useState("")
  const [locationInput, setLocationInput] = useState("")
  const [skillInput, setSkillInput] = useState("")

  // Applied filters
  const [search, setSearch] = useState("")
  const [locationFilter, setLocationFilter] = useState("")
  const [skillFilter, setSkillFilter] = useState("")
  const [jobTypeFilter, setJobTypeFilter] = useState("")
  const [experienceFilter, setExperienceFilter] = useState("")
  const [sort, setSort] = useState("latest")

  // Pagination
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalJobs, setTotalJobs] = useState(0)

  // ==========================================
  // Fetch Jobs
  // ==========================================

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true)
        setError("")

        const params = new URLSearchParams()

        if (search.trim()) {
          params.append("search", search.trim())
        }

        if (locationFilter.trim()) {
          params.append("location", locationFilter.trim())
        }

        if (jobTypeFilter) {
          params.append("jobType", jobTypeFilter)
        }

        if (experienceFilter) {
          params.append("experience", experienceFilter)
        }

        if (skillFilter.trim()) {
          params.append("skill", skillFilter.trim())
        }

        params.append("sort", sort)
        params.append("page", page)
        params.append("limit", 9)

      

const response = await axios.get(
  `${API_URL}/api/jobs?${params.toString()}`
)

        setJobs(response.data.jobs || [])
        setTotalJobs(response.data.totalJobs || 0)
        setTotalPages(response.data.totalPages || 1)
      } catch (error) {
        console.error("Fetch jobs error:", error)

        setJobs([])
        setTotalJobs(0)
        setTotalPages(1)
        setError("Failed to load jobs. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    fetchJobs()
  }, [
    search,
    locationFilter,
    jobTypeFilter,
    experienceFilter,
    skillFilter,
    sort,
    page
  ])

  // ==========================================
  // Search
  // ==========================================

  const applySearch = () => {
    setSearch(searchInput)
    setLocationFilter(locationInput)
    setSkillFilter(skillInput)
    setPage(1)
  }

  const handleSearchKeyDown = (event) => {
    if (event.key === "Enter") {
      applySearch()
    }
  }

  // ==========================================
  // Reset
  // ==========================================

  const resetFilters = () => {
    setSearchInput("")
    setLocationInput("")
    setSkillInput("")

    setSearch("")
    setLocationFilter("")
    setSkillFilter("")
    setJobTypeFilter("")
    setExperienceFilter("")
    setSort("latest")

    setPage(1)
  }

  // ==========================================
  // Helpers
  // ==========================================

  const activeFilterCount = [
    search,
    locationFilter,
    skillFilter,
    jobTypeFilter,
    experienceFilter
  ].filter(Boolean).length

  const getCompanyInitial = (company) => {
    if (!company) return "C"

    return company
      .trim()
      .charAt(0)
      .toUpperCase()
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

    const minutes = Math.floor(
      difference / (1000 * 60)
    )

    const hours = Math.floor(
      difference / (1000 * 60 * 60)
    )

    const days = Math.floor(
      difference / (1000 * 60 * 60 * 24)
    )

    if (minutes < 60) {
      return minutes <= 1
        ? "Just now"
        : `${minutes} min ago`
    }

    if (hours < 24) {
      return hours === 1
        ? "1 hour ago"
        : `${hours} hours ago`
    }

    if (days < 7) {
      return days === 1
        ? "Yesterday"
        : `${days} days ago`
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
      <div className="min-h-screen bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">

          <div className="animate-pulse">

            <div className="h-7 bg-slate-200 rounded w-48 mb-6" />

            <div className="h-12 bg-white border border-slate-200 rounded-xl mb-4" />

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">

              {[1, 2, 3, 4, 5, 6].map((item) => (
                <div
                  key={item}
                  className="bg-white border border-slate-200 rounded-xl p-5"
                >
                  <div className="flex gap-3">
                    <div className="w-10 h-10 bg-slate-200 rounded-lg" />

                    <div className="flex-1">
                      <div className="h-4 bg-slate-200 rounded w-3/4 mb-2" />
                      <div className="h-3 bg-slate-200 rounded w-1/2" />
                    </div>
                  </div>

                  <div className="h-3 bg-slate-200 rounded w-full mt-5" />
                  <div className="h-3 bg-slate-200 rounded w-2/3 mt-2" />

                  <div className="flex gap-2 mt-5">
                    <div className="h-6 w-14 bg-slate-200 rounded" />
                    <div className="h-6 w-16 bg-slate-200 rounded" />
                  </div>
                </div>
              ))}

            </div>
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

        <div className="bg-white border border-slate-200 rounded-xl p-6 w-full max-w-sm text-center">

          <div className="w-10 h-10 mx-auto rounded-full bg-red-50 text-red-600 flex items-center justify-center font-bold">
            !
          </div>

          <h2 className="text-lg font-semibold text-slate-900 mt-3">
            Unable to load jobs
          </h2>

          <p className="text-sm text-slate-500 mt-1">
            {error}
          </p>

          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition"
          >
            Try Again
          </button>

        </div>

      </div>
    )
  }

  // ==========================================
  // Main
  // ==========================================

  return (
    <div className="min-h-screen bg-slate-50">

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-5 sm:py-7">

        {/* ==============================
            Header
        ============================== */}

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-5">

          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
              Find your next job
            </h1>

            <p className="text-sm text-slate-500 mt-1">
              {totalJobs} {totalJobs === 1 ? "job" : "jobs"} available
            </p>
          </div>

          {activeFilterCount > 0 && (
            <button
              onClick={resetFilters}
              className="self-start sm:self-auto text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              Clear filters
            </button>
          )}

        </div>


        {/* ==============================
            Search
        ============================== */}

        <section className="bg-white border border-slate-200 rounded-xl p-3 sm:p-4 mb-5">

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-2.5">

            {/* Search input */}

            <div className="lg:col-span-5 relative">

              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">

                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="11" cy="11" r="7" />
                  <path d="m20 20-4-4" />
                </svg>

              </div>

              <input
                type="text"
                placeholder="Search jobs, companies or skills"
                value={searchInput}
                onChange={(e) =>
                  setSearchInput(e.target.value)
                }
                onKeyDown={handleSearchKeyDown}
                className="w-full h-11 pl-10 pr-3 bg-slate-50 border border-slate-200 rounded-lg outline-none text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition"
              />

            </div>


            {/* Location */}

            <div className="lg:col-span-3 relative">

              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">

                <svg
                  width="17"
                  height="17"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
                  <circle cx="12" cy="10" r="2.5" />
                </svg>

              </div>

              <select
                value={locationInput}
                onChange={(e) =>
                  setLocationInput(e.target.value)
                }
                className="w-full h-11 pl-10 pr-8 bg-slate-50 border border-slate-200 rounded-lg outline-none text-sm text-slate-700 appearance-none cursor-pointer focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition"
              >
                <option value="">All Locations</option>
                <option value="Pune">Pune</option>
                <option value="Mumbai">Mumbai</option>
                <option value="Nashik">Nashik</option>
                <option value="Bangalore">Bangalore</option>
                <option value="Hyderabad">Hyderabad</option>
                <option value="Chennai">Chennai</option>
                <option value="Delhi / NCR">Delhi / NCR</option>
                <option value="Noida">Noida</option>
                <option value="Gurgaon">Gurgaon</option>
                <option value="Ahmedabad">Ahmedabad</option>
                <option value="Remote">Remote</option>
              </select>

            </div>


            {/* Search */}

            <button
              onClick={applySearch}
              className="lg:col-span-2 h-11 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition"
            >
              Search
            </button>


            {/* Clear */}

            <button
              onClick={resetFilters}
              className="lg:col-span-2 h-11 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-sm font-medium transition"
            >
              Clear
            </button>

          </div>

        </section>


        {/* ==============================
            Filters
        ============================== */}

        <div className="flex flex-col lg:flex-row gap-2.5 mb-6">

          <select
            value={jobTypeFilter}
            onChange={(e) => {
              setJobTypeFilter(e.target.value)
              setPage(1)
            }}
            className="h-10 px-3 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
          >
            <option value="">All Job Types</option>
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Internship">Internship</option>
            <option value="Contract">Contract</option>
          </select>


          <select
            value={experienceFilter}
            onChange={(e) => {
              setExperienceFilter(e.target.value)
              setPage(1)
            }}
            className="h-10 px-3 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
          >
            <option value="">All Experience</option>
            <option value="Fresher">Fresher</option>
            <option value="0-1">0-1 Years</option>
            <option value="1-3">1-3 Years</option>
            <option value="3-5">3-5 Years</option>
          </select>


          <select
            value={sort}
            onChange={(e) => {
              setSort(e.target.value)
              setPage(1)
            }}
            className="h-10 px-3 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
          >
            <option value="latest">Latest Posted</option>
            <option value="oldest">Oldest Posted</option>
            <option value="company">Company Name</option>
          </select>


          <div className="flex-1 flex gap-2">

            <input
              type="text"
              placeholder="Filter by skill — React, Java, Python"
              value={skillInput}
              onChange={(e) =>
                setSkillInput(e.target.value)
              }
              onKeyDown={handleSearchKeyDown}
              className="flex-1 min-w-0 h-10 px-3 bg-white border border-slate-200 rounded-lg outline-none text-sm text-slate-700 placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
            />

            <button
              onClick={applySearch}
              className="h-10 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-sm font-semibold transition"
            >
              Apply
            </button>

          </div>

        </div>


        {/* ==============================
            Results
        ============================== */}

        <div className="flex items-center justify-between mb-4">

          <div>

            <h2 className="text-lg font-bold text-slate-900">
              Latest jobs
            </h2>

            <p className="text-xs text-slate-500 mt-0.5">
              {totalJobs} {totalJobs === 1 ? "result" : "results"}
            </p>

          </div>

        </div>


        {/* ==============================
            Empty
        ============================== */}

        {jobs.length === 0 && (

          <div className="bg-white border border-slate-200 rounded-xl p-8 sm:p-10 text-center">

            <div className="w-12 h-12 mx-auto rounded-xl bg-slate-100 flex items-center justify-center text-slate-400">

              <svg
                width="23"
                height="23"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-4-4" />
              </svg>

            </div>

            <h3 className="text-lg font-semibold text-slate-900 mt-4">
              No jobs found
            </h3>

            <p className="text-sm text-slate-500 mt-1">
              Try changing your search or filters.
            </p>

            <button
              onClick={resetFilters}
              className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition"
            >
              Clear Filters
            </button>

          </div>

        )}


        {/* ==============================
            Job Cards
        ============================== */}

        {jobs.length > 0 && (

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">

            {jobs.map((job) => (

              <article
                key={job._id}
                className="group bg-white border border-slate-200 rounded-xl p-4 sm:p-5 hover:border-blue-200 hover:shadow-md transition flex flex-col"
              >

                {/* Job heading */}

                <div className="flex items-start gap-3">

                  <div className="w-10 h-10 shrink-0 rounded-lg bg-blue-50 text-blue-700 border border-blue-100 flex items-center justify-center font-bold">
                    {getCompanyInitial(job.company)}
                  </div>

                  <div className="min-w-0 flex-1">

                    <div className="flex items-start justify-between gap-2">

                      <h3 className="font-semibold text-slate-900 leading-tight group-hover:text-blue-600 transition">
                        {job.title}
                      </h3>

                    </div>

                    <p className="text-sm text-slate-600 mt-1 truncate">
                      {job.company}
                    </p>

                  </div>

                </div>


                {/* Meta */}

                <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 mt-4 text-xs text-slate-500">

                  <span className="inline-flex items-center gap-1">

                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
                      <circle cx="12" cy="10" r="2.5" />
                    </svg>

                    {job.location}

                  </span>

                  <span>•</span>

                  <span>{job.jobType}</span>

                  <span>•</span>

                  <span>{job.experience || "Fresher"}</span>

                </div>


                {/* Skills */}

                <div className="flex flex-wrap gap-1.5 mt-4">

                  {(job.skills || [])
                    .slice(0, 4)
                    .map((skill) => (

                      <span
                        key={skill}
                        className="text-[11px] font-medium text-slate-600 bg-slate-100 px-2 py-1 rounded-md"
                      >
                        {skill}
                      </span>

                    ))}

                  {(job.skills || []).length > 4 && (

                    <span className="text-[11px] text-slate-400 px-1 py-1">
                      +{job.skills.length - 4}
                    </span>

                  )}

                </div>


                {/* Footer */}

                <div className="mt-5 pt-3 border-t border-slate-100">

                  <div className="flex items-center justify-between mb-3">

                    <span className="text-[11px] text-slate-400">
                      {getPostedText(
                        job.postedAt || job.createdAt
                      )}
                    </span>

                    <span className="text-[11px] text-slate-400 truncate max-w-32">
                      {job.source || "Career Intelligence"}
                    </span>

                  </div>

                 <div className="flex">

  <Link
    to={`/jobs/${job._id}`}
    className="w-full h-10 flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition"
  >
    View Job
  </Link>

</div>

                </div>

              </article>

            ))}

          </div>

        )}


        {/* ==============================
            Pagination
        ============================== */}

        {totalPages > 1 && (

          <div className="flex items-center justify-center gap-2 mt-7">

            <button
              onClick={() =>
                setPage((current) =>
                  Math.max(current - 1, 1)
                )
              }
              disabled={page === 1}
              className="h-9 px-3 border border-slate-200 bg-white rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              ← Previous
            </button>


            <span className="h-9 px-3 flex items-center bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-600">
              {page} / {totalPages}
            </span>


            <button
              onClick={() =>
                setPage((current) =>
                  Math.min(
                    current + 1,
                    totalPages
                  )
                )
              }
              disabled={page === totalPages}
              className="h-9 px-3 border border-slate-200 bg-white rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              Next →
            </button>

          </div>

        )}

      </main>

    </div>
  )
}

export default Jobs