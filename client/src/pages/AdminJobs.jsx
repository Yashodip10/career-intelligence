import { useEffect, useState } from "react"
import axios from "axios"

function AdminJobs() {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const [search, setSearch] = useState("")
  const [status, setStatus] = useState("")

  const [showForm, setShowForm] = useState(false)
  const [editingJob, setEditingJob] = useState(null)

  const [formLoading, setFormLoading] = useState(false)

  const [stats, setStats] = useState({
    totalJobs: 0,
    activeJobs: 0,
    inactiveJobs: 0
  })

  const [form, setForm] = useState({
    title: "",
    company: "",
    location: "",
    jobType: "Full-time",
    experience: "Fresher",
    skills: "",
    description: "",
    applyLink: "",
    source: "Career Intelligence",
    expiresAt: ""
  })

  // ==========================================
  // Token
  // ==========================================

  const getToken = () => {
    return localStorage.getItem("token")
  }

  // ==========================================
  // Fetch Jobs
  // ==========================================

  const fetchJobs = async () => {
    try {
      setLoading(true)
      setError("")

      const token = getToken()

      const response = await axios.get(
        "http://127.0.0.1:8000/api/jobs/admin",
        {
          params: {
            search,
            status
          },
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      setJobs(response.data.jobs || [])

      setStats({
        totalJobs: response.data.totalJobs || 0,
        activeJobs: response.data.activeJobs || 0,
        inactiveJobs: response.data.inactiveJobs || 0
      })
    } catch (error) {
      console.error("Admin jobs error:", error)

      setError(
        error.response?.data?.message ||
          "Failed to load jobs"
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchJobs()
  }, [search, status])

  // ==========================================
  // Form Helpers
  // ==========================================

  const handleChange = (event) => {
    const {
      name,
      value
    } = event.target

    setForm((current) => ({
      ...current,
      [name]: value
    }))
  }

  const resetForm = () => {
    setForm({
      title: "",
      company: "",
      location: "",
      jobType: "Full-time",
      experience: "Fresher",
      skills: "",
      description: "",
      applyLink: "",
      source: "Career Intelligence",
      expiresAt: ""
    })

    setEditingJob(null)
  }

  // ==========================================
  // Open Add Form
  // ==========================================

  const openAddForm = () => {
    resetForm()
    setShowForm(true)
  }

  // ==========================================
  // Open Edit Form
  // ==========================================

  const openEditForm = (job) => {
    setEditingJob(job)

    setForm({
      title: job.title || "",
      company: job.company || "",
      location: job.location || "",
      jobType: job.jobType || "Full-time",
      experience: job.experience || "Fresher",
      skills: (job.skills || []).join(", "),
      description: job.description || "",
      applyLink: job.applyLink || "",
      source: job.source || "Career Intelligence",
      expiresAt: job.expiresAt
        ? new Date(job.expiresAt)
            .toISOString()
            .split("T")[0]
        : ""
    })

    setShowForm(true)
  }

  // ==========================================
  // Submit Form
  // ==========================================

  const handleSubmit = async (event) => {
    event.preventDefault()

    try {
      setFormLoading(true)

      const token = getToken()

      const jobData = {
        title: form.title.trim(),
        company: form.company.trim(),
        location: form.location.trim(),
        jobType: form.jobType,
        experience: form.experience,

        skills: form.skills
          .split(",")
          .map((skill) => skill.trim())
          .filter(Boolean),

        description: form.description.trim(),
        applyLink: form.applyLink.trim(),

        source:
          form.source.trim() ||
          "Career Intelligence",

        expiresAt: form.expiresAt
          ? new Date(
              form.expiresAt
            ).toISOString()
          : null
      }

      if (editingJob) {
        await axios.put(
          `http://127.0.0.1:8000/api/jobs/${editingJob._id}`,
          jobData,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )
      } else {
        await axios.post(
          "http://127.0.0.1:8000/api/jobs",
          jobData,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )
      }

      setShowForm(false)
      resetForm()

      await fetchJobs()
    } catch (error) {
      console.error(
        "Save job error:",
        error
      )

      alert(
        error.response?.data?.message ||
          "Failed to save job"
      )
    } finally {
      setFormLoading(false)
    }
  }

  // ==========================================
  // Toggle Status
  // ==========================================

  const toggleStatus = async (job) => {
    try {
      const token = getToken()

      await axios.patch(
        `http://127.0.0.1:8000/api/jobs/${job._id}/toggle`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      await fetchJobs()
    } catch (error) {
      console.error(
        "Toggle job error:",
        error
      )

      alert(
        error.response?.data?.message ||
          "Failed to change job status"
      )
    }
  }

  // ==========================================
  // Delete Job
  // ==========================================

  const deleteJob = async (job) => {
    const confirmed = window.confirm(
      `Delete "${job.title}" at ${job.company}?`
    )

    if (!confirmed) {
      return
    }

    try {
      const token = getToken()

      await axios.delete(
        `http://127.0.0.1:8000/api/jobs/${job._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      await fetchJobs()
    } catch (error) {
      console.error(
        "Delete job error:",
        error
      )

      alert(
        error.response?.data?.message ||
          "Failed to delete job"
      )
    }
  }

  // ==========================================
  // Loading
  // ==========================================

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 sm:px-6 py-6">

        <div className="max-w-7xl mx-auto animate-pulse">

          <div className="h-7 w-48 bg-slate-200 rounded" />

          <div className="h-4 w-64 bg-slate-200 rounded mt-3" />

          <div className="grid grid-cols-3 gap-3 mt-6">

            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-24 bg-white border border-slate-200 rounded-xl"
              />
            ))}

          </div>

          <div className="h-14 bg-white border border-slate-200 rounded-xl mt-4" />

          <div className="h-72 bg-white border border-slate-200 rounded-xl mt-4" />

        </div>

      </div>
    )
  }

  // ==========================================
  // Main
  // ==========================================

  return (
    <div className="min-h-screen bg-slate-50">

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">

        {/* ==================================
            Header
        ================================== */}

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">

          <div>

            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
              Job Management
            </h1>

            <p className="text-sm text-slate-500 mt-1">
              {stats.totalJobs} jobs · {stats.activeJobs} active
            </p>

          </div>

          <button
            onClick={openAddForm}
            className="w-full sm:w-auto h-10 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition"
          >
            + Add New Job
          </button>

        </div>


        {/* ==================================
            Stats
        ================================== */}

        <div className="grid grid-cols-3 gap-3 mb-5">

          <div className="bg-white border border-slate-200 rounded-xl p-4">

            <p className="text-xs sm:text-sm text-slate-500">
              Total
            </p>

            <p className="text-2xl font-bold text-slate-900 mt-1">
              {stats.totalJobs}
            </p>

          </div>


          <div className="bg-white border border-slate-200 rounded-xl p-4">

            <p className="text-xs sm:text-sm text-slate-500">
              Active
            </p>

            <p className="text-2xl font-bold text-emerald-600 mt-1">
              {stats.activeJobs}
            </p>

          </div>


          <div className="bg-white border border-slate-200 rounded-xl p-4">

            <p className="text-xs sm:text-sm text-slate-500">
              Inactive
            </p>

            <p className="text-2xl font-bold text-slate-500 mt-1">
              {stats.inactiveJobs}
            </p>

          </div>

        </div>


        {/* ==================================
            Search
        ================================== */}

        <div className="bg-white border border-slate-200 rounded-xl p-3 mb-5">

          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">

            <input
              type="text"
              placeholder="Search title, company or location..."
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              className="md:col-span-3 h-10 px-3 text-sm bg-slate-50 border border-slate-200 rounded-lg outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition"
            />

            <select
              value={status}
              onChange={(event) =>
                setStatus(event.target.value)
              }
              className="h-10 px-3 text-sm bg-slate-50 border border-slate-200 rounded-lg outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition"
            >

              <option value="">
                All Status
              </option>

              <option value="active">
                Active
              </option>

              <option value="inactive">
                Inactive
              </option>

            </select>

          </div>

        </div>


        {/* ==================================
            Error
        ================================== */}

        {error && (

          <div className="bg-red-50 border border-red-100 text-red-600 rounded-lg px-4 py-3 mb-5 text-sm">
            {error}
          </div>

        )}


        {/* ==================================
            Jobs
        ================================== */}

        {jobs.length === 0 ? (

          <div className="bg-white border border-slate-200 rounded-xl p-8 sm:p-10 text-center">

            <h2 className="text-lg font-semibold text-slate-900">
              No jobs found
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              Add a job listing to get started.
            </p>

            <button
              onClick={openAddForm}
              className="mt-4 h-10 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold"
            >
              Add Job
            </button>

          </div>

        ) : (

          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">

            {/* Desktop Header */}

            <div className="hidden lg:grid grid-cols-12 gap-4 px-5 py-3 bg-slate-50 border-b border-slate-200 text-[11px] font-semibold uppercase tracking-wide text-slate-500">

              <div className="col-span-4">
                Job
              </div>

              <div className="col-span-2">
                Location
              </div>

              <div className="col-span-2">
                Type
              </div>

              <div className="col-span-1">
                Status
              </div>

              <div className="col-span-3 text-right">
                Actions
              </div>

            </div>


            {/* Rows */}

            {jobs.map((job) => (

              <div
                key={job._id}
                className="px-4 sm:px-5 py-4 border-b border-slate-100 last:border-b-0 hover:bg-slate-50/70 transition"
              >

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 lg:gap-4 items-center">

                  {/* Job */}

                  <div className="lg:col-span-4">

                    <div className="flex items-center gap-3">

                      <div className="w-9 h-9 shrink-0 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center text-sm font-bold">
                        {job.company
                          ?.charAt(0)
                          ?.toUpperCase() || "C"}
                      </div>

                      <div className="min-w-0">

                        <h3 className="text-sm font-semibold text-slate-900 truncate">
                          {job.title}
                        </h3>

                        <p className="text-xs text-slate-500 mt-0.5 truncate">
                          {job.company}
                        </p>

                      </div>

                    </div>

                  </div>


                  {/* Location */}

                  <div className="lg:col-span-2">

                    <p className="text-sm text-slate-600">
                      {job.location}
                    </p>

                  </div>


                  {/* Type */}

                  <div className="lg:col-span-2">

                    <span className="text-sm text-slate-600">
                      {job.jobType}
                    </span>

                    <p className="text-xs text-slate-400 mt-0.5">
                      {job.experience}
                    </p>

                  </div>


                  {/* Status */}

                  <div className="lg:col-span-1">

                    {job.isActive ? (

                      <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-full">

                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />

                        Active

                      </span>

                    ) : (

                      <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-1 rounded-full">

                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />

                        Inactive

                      </span>

                    )}

                  </div>


                  {/* Actions */}

                  <div className="lg:col-span-3 flex flex-wrap gap-2 pt-2 border-t border-slate-100 lg:border-0 lg:pt-0 lg:justify-end">

                    <button
                      onClick={() =>
                        openEditForm(job)
                      }
                      className="h-9 px-3 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 rounded-lg text-xs sm:text-sm font-medium transition"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() =>
                        toggleStatus(job)
                      }
                      className={`h-9 px-3 rounded-lg text-xs sm:text-sm font-medium transition ${
                        job.isActive
                          ? "border border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100"
                          : "border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                      }`}
                    >
                      {job.isActive
                        ? "Deactivate"
                        : "Activate"}
                    </button>

                    <button
                      onClick={() =>
                        deleteJob(job)
                      }
                      className="h-9 px-3 border border-red-200 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-xs sm:text-sm font-medium transition"
                    >
                      Delete
                    </button>

                  </div>

                </div>

              </div>

            ))}

          </div>

        )}

      </main>


      {/* ==========================================
          Add / Edit Modal
      ========================================== */}

      {showForm && (

        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">

          <div className="bg-white w-full max-w-3xl max-h-[94vh] overflow-y-auto rounded-xl shadow-xl">

            {/* Modal Header */}

            <div className="sticky top-0 z-10 bg-white border-b border-slate-200 px-4 sm:px-5 py-4 flex items-center justify-between">

              <div className="min-w-0">

                <h2 className="text-lg font-semibold text-slate-900">
                  {editingJob
                    ? "Edit Job"
                    : "Add New Job"}
                </h2>

                <p className="text-xs text-slate-500 mt-0.5">
                  {editingJob
                    ? "Update job details."
                    : "Create a new job listing."}
                </p>

              </div>

              <button
                onClick={() => {
                  setShowForm(false)
                  resetForm()
                }}
                className="w-8 h-8 shrink-0 rounded-lg hover:bg-slate-100 text-slate-500 text-xl flex items-center justify-center"
                aria-label="Close"
              >
                ×
              </button>

            </div>


            {/* Form */}

            <form
              onSubmit={handleSubmit}
              className="p-4 sm:p-5 space-y-4"
            >

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                {/* Title */}

                <div>

                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Job Title
                  </label>

                  <input
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    required
                    placeholder="React Developer"
                    className="w-full h-10 px-3 text-sm border border-slate-200 rounded-lg outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                  />

                </div>


                {/* Company */}

                <div>

                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Company
                  </label>

                  <input
                    name="company"
                    value={form.company}
                    onChange={handleChange}
                    required
                    placeholder="Tech Solutions"
                    className="w-full h-10 px-3 text-sm border border-slate-200 rounded-lg outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                  />

                </div>


                {/* Location */}

                <div>

                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Location
                  </label>

                  <input
                    name="location"
                    value={form.location}
                    onChange={handleChange}
                    required
                    placeholder="Pune"
                    className="w-full h-10 px-3 text-sm border border-slate-200 rounded-lg outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                  />

                </div>


                {/* Job Type */}

                <div>

                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Job Type
                  </label>

                  <select
                    name="jobType"
                    value={form.jobType}
                    onChange={handleChange}
                    className="w-full h-10 px-3 text-sm border border-slate-200 rounded-lg outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                  >

                    <option value="Full-time">
                      Full-time
                    </option>

                    <option value="Part-time">
                      Part-time
                    </option>

                    <option value="Internship">
                      Internship
                    </option>

                    <option value="Contract">
                      Contract
                    </option>

                  </select>

                </div>


                {/* Experience */}

                <div>

                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Experience
                  </label>

                  <select
                    name="experience"
                    value={form.experience}
                    onChange={handleChange}
                    className="w-full h-10 px-3 text-sm border border-slate-200 rounded-lg outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                  >

                    <option value="Fresher">
                      Fresher
                    </option>

                    <option value="0-1">
                      0-1 Years
                    </option>

                    <option value="1-3">
                      1-3 Years
                    </option>

                    <option value="3-5">
                      3-5 Years
                    </option>

                  </select>

                </div>


                {/* Skills */}

                <div>

                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Skills
                  </label>

                  <input
                    name="skills"
                    value={form.skills}
                    onChange={handleChange}
                    placeholder="React, JavaScript, Git"
                    className="w-full h-10 px-3 text-sm border border-slate-200 rounded-lg outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                  />

                  <p className="text-[11px] text-slate-400 mt-1">
                    Separate skills with commas.
                  </p>

                </div>


                {/* Apply Link */}

                <div>

                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Apply Link
                  </label>

                  <input
                    name="applyLink"
                    value={form.applyLink}
                    onChange={handleChange}
                    required
                    placeholder="https://company.com/jobs/123"
                    className="w-full h-10 px-3 text-sm border border-slate-200 rounded-lg outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                  />

                </div>


                {/* Source */}

                <div>

                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Source
                  </label>

                  <input
                    name="source"
                    value={form.source}
                    onChange={handleChange}
                    placeholder="Company Website"
                    className="w-full h-10 px-3 text-sm border border-slate-200 rounded-lg outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                  />

                </div>


                {/* Expiry */}

                <div>

                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Expiry Date
                  </label>

                  <input
                    type="date"
                    name="expiresAt"
                    value={form.expiresAt}
                    onChange={handleChange}
                    className="w-full h-10 px-3 text-sm border border-slate-200 rounded-lg outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                  />

                </div>

              </div>


              {/* Description */}

              <div>

                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Job Description
                </label>

                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  required
                  rows="5"
                  placeholder="Describe the role, responsibilities and requirements..."
                  className="w-full px-3 py-3 text-sm border border-slate-200 rounded-lg outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 resize-none"
                />

              </div>


              {/* Actions */}

              <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 pt-3 border-t border-slate-100">

                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false)
                    resetForm()
                  }}
                  className="w-full sm:w-auto h-10 px-4 border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={formLoading}
                  className="w-full sm:w-auto h-10 px-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg text-sm font-semibold"
                >
                  {formLoading
                    ? "Saving..."
                    : editingJob
                      ? "Update Job"
                      : "Create Job"}
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  )
}

export default AdminJobs