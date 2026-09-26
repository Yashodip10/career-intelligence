import { Link } from "react-router-dom"

function AdminHome() {
  const user = JSON.parse(
    localStorage.getItem("user") || "null"
  )

  return (
    <div className="min-h-screen bg-slate-50">

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">

        {/* ==========================================
            Header
        ========================================== */}

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-7">

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-blue-600 mb-1">
              Administration
            </p>

            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
              Admin Dashboard
            </h1>

            <p className="text-sm text-slate-500 mt-1">
              Welcome back, {user?.name || "Admin"}.
            </p>
          </div>

          <div className="hidden sm:flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-lg">

            <span className="w-2 h-2 rounded-full bg-emerald-500" />

            <span className="text-xs font-medium text-slate-600">
              Admin Access
            </span>

          </div>

        </div>


        {/* ==========================================
            Main Management
        ========================================== */}

        <section>

          <div className="flex items-center justify-between mb-3">

            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Workspace
              </h2>

              <p className="text-xs text-slate-500 mt-0.5">
                Manage the core areas of the platform.
              </p>
            </div>

          </div>


          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

            {/* ======================================
                Job Management
            ====================================== */}

            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">

              <div className="p-5">

                <div className="flex items-start justify-between gap-4">

                  <div className="flex items-center gap-3">

                    <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">

                      <svg
                        width="19"
                        height="19"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <rect
                          x="3"
                          y="5"
                          width="18"
                          height="14"
                          rx="2"
                        />

                        <path d="M8 5V3h8v2" />

                        <path d="M8 12h8" />

                        <path d="M8 15h5" />
                      </svg>

                    </div>

                    <div>

                      <h3 className="text-base font-bold text-slate-900">
                        Job Management
                      </h3>

                      <p className="text-xs text-slate-500 mt-0.5">
                        Manage platform job listings
                      </p>

                    </div>

                  </div>

                </div>


                <p className="text-sm text-slate-500 leading-relaxed mt-5 max-w-lg">
                  Create new opportunities, update existing listings,
                  control job availability and remove outdated positions.
                </p>


                <div className="flex flex-wrap gap-2 mt-5">

                  <Link
                    to="/admin/jobs"
                    className="inline-flex items-center justify-center h-9 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition"
                  >
                    Manage Jobs
                  </Link>

                  <Link
                    to="/jobs"
                    className="inline-flex items-center justify-center h-9 px-4 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-sm font-medium transition"
                  >
                    Preview Jobs
                  </Link>

                </div>

              </div>


              <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between">

                <span className="text-xs text-slate-500">
                  Job listings
                </span>

                <Link
                  to="/admin/jobs"
                  className="text-xs font-semibold text-blue-600 hover:text-blue-700"
                >
                  Open →
                </Link>

              </div>

            </div>


            {/* ======================================
                Candidate Management
            ====================================== */}

            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">

              <div className="p-5">

                <div className="flex items-start justify-between gap-4">

                  <div className="flex items-center gap-3">

                    <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">

                      <svg
                        width="19"
                        height="19"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <circle
                          cx="12"
                          cy="8"
                          r="4"
                        />

                        <path d="M4 21c0-4 3.5-7 8-7s8 3 8 7" />
                      </svg>

                    </div>

                    <div>

                      <h3 className="text-base font-bold text-slate-900">
                        Candidate Management
                      </h3>

                      <p className="text-xs text-slate-500 mt-0.5">
                        Review registered candidates
                      </p>

                    </div>

                  </div>

                </div>


                <p className="text-sm text-slate-500 leading-relaxed mt-5 max-w-lg">
                  View candidate profiles, inspect uploaded resume
                  information and review candidate activity.
                </p>


                <div className="flex flex-wrap gap-2 mt-5">

                  <Link
                    to="/admin/candidates"
                    className="inline-flex items-center justify-center h-9 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-semibold transition"
                  >
                    View Candidates
                  </Link>

                </div>

              </div>


              <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between">

                <span className="text-xs text-slate-500">
                  Candidate profiles
                </span>

                <Link
                  to="/admin/candidates"
                  className="text-xs font-semibold text-emerald-600 hover:text-emerald-700"
                >
                  Open →
                </Link>

              </div>

            </div>

          </div>

        </section>


        {/* ==========================================
            Platform Overview
        ========================================== */}

        <section className="mt-6">

          <div className="bg-white border border-slate-200 rounded-xl">

            <div className="px-5 py-4 border-b border-slate-100">

              <h2 className="text-base font-bold text-slate-900">
                Platform Overview
              </h2>

              <p className="text-xs text-slate-500 mt-0.5">
                Career Intelligence administration areas
              </p>

            </div>


            <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-slate-100">

              {/* Jobs */}

              <Link
                to="/admin/jobs"
                className="group px-5 py-4 hover:bg-slate-50 transition"
              >

                <p className="text-xs text-slate-500">
                  Platform Area
                </p>

                <div className="flex items-center justify-between mt-1">

                  <p className="text-sm font-semibold text-slate-900 group-hover:text-blue-600 transition">
                    Job Listings
                  </p>

                  <span className="text-slate-400 group-hover:text-blue-600 transition">
                    →
                  </span>

                </div>

              </Link>


              {/* Candidates */}

              <Link
                to="/admin/candidates"
                className="group px-5 py-4 hover:bg-slate-50 transition"
              >

                <p className="text-xs text-slate-500">
                  Platform Area
                </p>

                <div className="flex items-center justify-between mt-1">

                  <p className="text-sm font-semibold text-slate-900 group-hover:text-emerald-600 transition">
                    Candidates
                  </p>

                  <span className="text-slate-400 group-hover:text-emerald-600 transition">
                    →
                  </span>

                </div>

              </Link>


              {/* Candidate View */}

              <Link
                to="/jobs"
                className="group px-5 py-4 hover:bg-slate-50 transition"
              >

                <p className="text-xs text-slate-500">
                  Candidate View
                </p>

                <div className="flex items-center justify-between mt-1">

                  <p className="text-sm font-semibold text-slate-900 group-hover:text-blue-600 transition">
                    Browse Jobs
                  </p>

                  <span className="text-slate-400 group-hover:text-blue-600 transition">
                    →
                  </span>

                </div>

              </Link>

            </div>

          </div>

        </section>


        {/* ==========================================
            Admin Information
        ========================================== */}

        <section className="mt-6">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <div className="bg-slate-900 rounded-xl p-5 text-white">

              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
                Career Intelligence
              </p>

              <h2 className="text-lg font-bold mt-2">
                Admin Workspace
              </h2>

              <p className="text-sm text-slate-400 mt-1.5">
                Manage jobs and candidates from a single
                administration workspace.
              </p>

            </div>


            <div className="bg-white border border-slate-200 rounded-xl p-5">

              <div className="flex items-center gap-3">

                <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">

                  <span className="text-sm">
                    ✓
                  </span>

                </div>

                <div>

                  <p className="text-sm font-semibold text-slate-900">
                    System Access
                  </p>

                  <p className="text-xs text-slate-500 mt-0.5">
                    You are signed in as an administrator.
                  </p>

                </div>

              </div>

            </div>

          </div>

        </section>

      </main>

    </div>
  )
}

export default AdminHome