import { useState } from "react"
import axios from "axios"
import { Link, useNavigate } from "react-router-dom"
import { API_URL } from "../config"

function Register() {
  const navigate = useNavigate()

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()

    setError("")
    setLoading(true)

    try {
      await axios.post(
        `${API_URL}/api/auth/register`,
        {
          name,
          email,
          password
        }
      )

      navigate("/login")
    } catch (error) {
      setError(
        error.response?.data?.message ||
        "Registration failed"
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">

      <div className="bg-white w-full max-w-md rounded-lg shadow p-8">

        <h1 className="text-3xl font-bold text-center">
          Create Account
        </h1>

        <p className="text-gray-500 text-center mt-2">
          Start your career journey
        </p>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded mt-6">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="mt-6"
        >

          {/* Name */}
          <label className="block font-medium mb-2">
            Name
          </label>

          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            required
            className="w-full border rounded px-4 py-2 mb-4"
          />

          {/* Email */}
          <label className="block font-medium mb-2">
            Email
          </label>

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            className="w-full border rounded px-4 py-2 mb-4"
          />

          {/* Password */}
          <label className="block font-medium mb-2">
            Password
          </label>

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
            className="w-full border rounded px-4 py-2 mb-6"
          />

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
          >
            {loading ? "Creating Account..." : "Register"}
          </button>

        </form>

        <p className="text-center text-gray-600 mt-6">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-blue-600 font-medium"
          >
            Login
          </Link>
        </p>

      </div>

    </div>
  )
}

export default Register