import { useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"

function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()

  const [menuOpen, setMenuOpen] = useState(false)

  const token = localStorage.getItem("token")

  const user = JSON.parse(
    localStorage.getItem("user") || "null"
  )

  const isAdmin = user?.role === "admin"

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    setMenuOpen(false)
    navigate("/login")
  }

  const isActive = (paths) => {
    if (!Array.isArray(paths)) {
      paths = [paths]
    }

    return paths.includes(location.pathname)
  }

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-slate-200">

      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        <div className="h-16 flex items-center justify-between gap-4">

          {/* ==========================================
              Brand
          ========================================== */}

          <Link
            to={isAdmin ? "/admin" : "/"}
            onClick={() => setMenuOpen(false)}
            className="flex items-center gap-2 shrink-0 group"
          >

            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-sm group-hover:bg-blue-700 transition">
              C
            </div>

            <div>

              <p className="text-sm sm:text-base font-bold text-slate-900 leading-none">
                Career Intelligence<span className="text-blue-600">™</span>
              </p>

              <p className="hidden sm:block text-[10px] text-slate-400 mt-1">
                AI-powered career platform
              </p>

            </div>

          </Link>


          {/* ==========================================
              Desktop Navigation
          ========================================== */}

          <div className="hidden md:flex items-center gap-1 sm:gap-2">

            {!token ? (

              <>
                <Link
                  to="/login"
                  className="h-9 px-3 flex items-center text-sm font-medium text-slate-600 hover:text-blue-600 transition"
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  className="h-9 px-4 flex items-center bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition"
                >
                  Register
                </Link>
              </>

            ) : isAdmin ? (

              <>
                <NavLink
                  to="/admin"
                  active={isActive("/admin")}
                >
                  Dashboard
                </NavLink>

                <NavLink
                  to="/admin/jobs"
                  active={isActive("/admin/jobs")}
                >
                  Jobs
                </NavLink>

                <NavLink
                  to="/admin/candidates"
                  active={isActive("/admin/candidates")}
                >
                  Candidates
                </NavLink>

                <UserBadge
                  user={user}
                  label="Admin"
                />

                <LogoutButton
                  onClick={handleLogout}
                />
              </>

            ) : (

              <>
                <NavLink
                  to="/jobs"
                  active={isActive([
                    "/",
                    "/jobs"
                  ])}
                >
                  Jobs
                </NavLink>

                <NavLink
                  to="/recommended-jobs"
                  active={isActive(
                    "/recommended-jobs"
                  )}
                >
                  Recommended Jobs
                </NavLink>

                <NavLink
                  to="/resume"
                  active={isActive("/resume")}
                >
                  Resume
                </NavLink>

                <UserBadge
                  user={user}
                />

                <LogoutButton
                  onClick={handleLogout}
                />
              </>

            )}

          </div>


          {/* ==========================================
              Mobile Menu Button
          ========================================== */}

          <button
            type="button"
            onClick={() =>
              setMenuOpen((current) => !current)
            }
            className="md:hidden w-9 h-9 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 flex items-center justify-center transition"
            aria-label="Toggle navigation menu"
            aria-expanded={menuOpen}
          >

            {menuOpen ? (

              <svg
                width="19"
                height="19"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <path d="M6 6l12 12" />
                <path d="M18 6L6 18" />
              </svg>

            ) : (

              <svg
                width="19"
                height="19"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <path d="M4 6h16" />
                <path d="M4 12h16" />
                <path d="M4 18h16" />
              </svg>

            )}

          </button>

        </div>


        {/* ==========================================
            Mobile Navigation
        ========================================== */}

        {menuOpen && (

          <div className="md:hidden border-t border-slate-100 py-3">

            {!token ? (

              <div className="flex flex-col gap-1">

                <MobileNavLink
                  to="/login"
                  active={isActive("/login")}
                  onClick={() =>
                    setMenuOpen(false)
                  }
                >
                  Login
                </MobileNavLink>

                <MobileNavLink
                  to="/register"
                  active={isActive("/register")}
                  onClick={() =>
                    setMenuOpen(false)
                  }
                >
                  Register
                </MobileNavLink>

              </div>

            ) : isAdmin ? (

              <div className="flex flex-col gap-1">

                <MobileNavLink
                  to="/admin"
                  active={isActive("/admin")}
                  onClick={() =>
                    setMenuOpen(false)
                  }
                >
                  Dashboard
                </MobileNavLink>

                <MobileNavLink
                  to="/admin/jobs"
                  active={isActive("/admin/jobs")}
                  onClick={() =>
                    setMenuOpen(false)
                  }
                >
                  Manage Jobs
                </MobileNavLink>

                <MobileNavLink
                  to="/admin/candidates"
                  active={isActive(
                    "/admin/candidates"
                  )}
                  onClick={() =>
                    setMenuOpen(false)
                  }
                >
                  Candidates
                </MobileNavLink>

                <div className="border-t border-slate-100 mt-2 pt-3">

                  <div className="flex items-center px-3 py-2">

                    <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-700 flex items-center justify-center text-xs font-bold mr-2">
                      {user?.name
                        ?.charAt(0)
                        ?.toUpperCase() || "A"}
                    </div>

                    <div className="min-w-0">

                      <p className="text-sm font-medium text-slate-800 truncate">
                        {user?.name || "Admin"}
                      </p>

                      <p className="text-[11px] text-slate-400">
                        Administrator
                      </p>

                    </div>

                  </div>

                  <button
                    onClick={handleLogout}
                    className="w-full h-9 mt-2 px-3 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-sm font-medium text-left transition"
                  >
                    Logout
                  </button>

                </div>

              </div>

            ) : (

              <div className="flex flex-col gap-1">

                <MobileNavLink
                  to="/jobs"
                  active={isActive([
                    "/",
                    "/jobs"
                  ])}
                  onClick={() =>
                    setMenuOpen(false)
                  }
                >
                  Jobs
                </MobileNavLink>

                <MobileNavLink
                  to="/recommended-jobs"
                  active={isActive(
                    "/recommended-jobs"
                  )}
                  onClick={() =>
                    setMenuOpen(false)
                  }
                >
                  Recommended Jobs
                </MobileNavLink>

                <MobileNavLink
                  to="/resume"
                  active={isActive("/resume")}
                  onClick={() =>
                    setMenuOpen(false)
                  }
                >
                  My Resume
                </MobileNavLink>

                <div className="border-t border-slate-100 mt-2 pt-3">

                  <div className="flex items-center px-3 py-2">

                    <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-700 flex items-center justify-center text-xs font-bold mr-2">
                      {user?.name
                        ?.charAt(0)
                        ?.toUpperCase() || "U"}
                    </div>

                    <div className="min-w-0">

                      <p className="text-sm font-medium text-slate-800 truncate">
                        {user?.name || "User"}
                      </p>

                      <p className="text-[11px] text-slate-400">
                        Candidate
                      </p>

                    </div>

                  </div>

                  <button
                    onClick={handleLogout}
                    className="w-full h-9 mt-2 px-3 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-sm font-medium text-left transition"
                  >
                    Logout
                  </button>

                </div>

              </div>

            )}

          </div>

        )}

      </div>

    </nav>
  )
}


/* ==========================================
   Desktop Navigation Link
========================================== */

function NavLink({
  to,
  active,
  children
}) {
  return (
    <Link
      to={to}
      className={`h-9 px-2.5 sm:px-3 flex items-center rounded-lg text-sm transition ${
        active
          ? "bg-blue-50 text-blue-700 font-semibold"
          : "text-slate-600 hover:bg-slate-50 hover:text-blue-600"
      }`}
    >
      {children}
    </Link>
  )
}


/* ==========================================
   Mobile Navigation Link
========================================== */

function MobileNavLink({
  to,
  active,
  onClick,
  children
}) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className={`h-10 px-3 flex items-center rounded-lg text-sm transition ${
        active
          ? "bg-blue-50 text-blue-700 font-semibold"
          : "text-slate-600 hover:bg-slate-50"
      }`}
    >
      {children}
    </Link>
  )
}


/* ==========================================
   User Badge
========================================== */

function UserBadge({
  user,
  label
}) {
  return (
    <div className="hidden lg:flex items-center ml-2 pl-3 border-l border-slate-200">

      <div className="w-7 h-7 rounded-full bg-blue-50 text-blue-700 flex items-center justify-center text-xs font-bold mr-2">
        {user?.name
          ?.charAt(0)
          ?.toUpperCase() || "U"}
      </div>

      <span className="text-sm text-slate-600 max-w-28 truncate">
        {user?.name || label || "User"}
      </span>

    </div>
  )
}


/* ==========================================
   Logout Button
========================================== */

function LogoutButton({
  onClick
}) {
  return (
    <button
      onClick={onClick}
      className="h-9 px-3 ml-1 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-sm font-medium transition"
    >
      Logout
    </button>
  )
}

export default Navbar