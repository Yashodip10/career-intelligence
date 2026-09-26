import { Navigate } from "react-router-dom"

function ProtectedRoute({
  children,
  adminOnly = false,
  userOnly = false
}) {
  const token = localStorage.getItem("token")

  const user = JSON.parse(
    localStorage.getItem("user") || "null"
  )

  // Not logged in
  if (!token || !user) {
    return <Navigate to="/login" replace />
  }

  // Admin-only page
  if (adminOnly && user.role !== "admin") {
    return <Navigate to="/" replace />
  }

  // Candidate-only page
  if (userOnly && user.role !== "user") {
    return <Navigate to="/admin" replace />
  }

  return children
}

export default ProtectedRoute