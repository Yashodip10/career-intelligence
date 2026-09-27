import { useState } from "react"
import axios from "axios"
import { Link, useNavigate } from "react-router-dom"
import { API_URL } from "../config"

function Login() {
  const navigate = useNavigate()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)


  const handleSubmit = async (e) => {
    e.preventDefault()

    setError("")
    setLoading(true)

    try {

      const response = await axios.post(
        `${API_URL}/api/auth/login`,
        {
          email,
          password
        }
      )


      const {
        token,
        user
      } = response.data


      // Store authentication data

      localStorage.setItem(
        "token",
        token
      )

      localStorage.setItem(
        "user",
        JSON.stringify(user)
      )


      // Redirect based on role

      if (user.role === "admin") {

        navigate("/admin")

      } else {

        navigate("/")

      }

    } catch (error) {

      console.error(
        "Login error:",
        error
      )

      setError(
        error.response?.data?.message ||
        "Login failed"
      )

    } finally {

      setLoading(false)

    }
  }


  return (

    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">

      <div className="bg-white w-full max-w-md rounded-2xl border border-slate-200 shadow-sm p-8">

        <h1 className="text-3xl font-bold text-center text-slate-900">
          Welcome Back
        </h1>

        <p className="text-slate-500 text-center mt-2">
          Login to continue
        </p>


        {error && (

          <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg mt-6 text-sm">
            {error}
          </div>

        )}


        <form
          onSubmit={handleSubmit}
          className="mt-6"
        >

          {/* Email */}

          <label className="block font-medium text-slate-700 mb-2">
            Email
          </label>

          <input
            type="email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            placeholder="Enter your email"
            required
            className="w-full border border-slate-200 rounded-lg px-4 py-3 mb-5 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
          />


          {/* Password */}

          <label className="block font-medium text-slate-700 mb-2">
            Password
          </label>

          <input
            type="password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            placeholder="Enter your password"
            required
            className="w-full border border-slate-200 rounded-lg px-4 py-3 mb-6 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
          />


          {/* Submit */}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition disabled:bg-slate-400"
          >
            {loading
              ? "Logging in..."
              : "Login"}
          </button>

        </form>


        <p className="text-center text-slate-600 mt-6">

          Don't have an account?{" "}

          <Link
            to="/register"
            className="text-blue-600 font-medium hover:underline"
          >
            Register
          </Link>

        </p>

      </div>

    </div>
  )
}

export default Login