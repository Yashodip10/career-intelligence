import { useEffect, useState } from "react"
import axios from "axios"
import { Link } from "react-router-dom"
import { API_URL } from "../config"

function Recommendations() {
  const [recommendations, setRecommendations] = useState([])
  const [resumeSkills, setResumeSkills] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchRecommendations = async () => {
      const token = localStorage.getItem("token")

      if (!token) {
        setError("Please login to view job recommendations")
        setLoading(false)
        return
      }

      try {
        const response = await axios.get(
          `${API_URL}/api/recommendations` ,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )

        setRecommendations(
          response.data.recommendations
        )

        setResumeSkills(
          response.data.resumeSkills
        )
      } catch (error) {
        setError(
          error.response?.data?.message ||
          "Failed to load recommendations"
        )
      } finally {
        setLoading(false)
      }
    }

    fetchRecommendations()
  }, [])

  if (loading) {
    return (
      <p className="p-6">
        Finding suitable jobs...
      </p>
    )
  }

  if (error) {
    return (
      <p className="p-6 text-red-500">
        {error}
      </p>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      <div className="max-w-6xl mx-auto">

        <h1 className="text-3xl font-bold">
          Recommended Jobs
        </h1>

        <p className="text-gray-600 mt-2">
          Jobs ranked according to the skills detected
          in your resume.
        </p>


        {/* Resume Skills */}

        <div className="bg-white rounded-lg shadow p-5 mt-6">

          <h2 className="text-xl font-semibold">
            Your Resume Skills
          </h2>

          <div className="flex flex-wrap gap-2 mt-3">

            {resumeSkills.map((skill) => (
              <span
                key={skill}
                className="bg-blue-100 text-blue-700 px-3 py-1 rounded"
              >
                {skill}
              </span>
            ))}

          </div>

        </div>


        {/* Recommendations */}

        <div className="mt-8">

          <h2 className="text-2xl font-bold mb-5">
            Jobs For You
          </h2>

          {recommendations.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-gray-600">
                No jobs available for recommendation.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">

              {recommendations.map((job) => (
                <div
                  key={job.id}
                  className="bg-white rounded-lg shadow p-6"
                >

                  <div className="flex justify-between gap-4">

                    <div>

                      <h3 className="text-xl font-semibold">
                        {job.title}
                      </h3>

                      <p className="text-gray-700 mt-1">
                        {job.company}
                      </p>

                      <p className="text-gray-500 mt-1">
                        {job.location}
                      </p>

                    </div>

                    <div className="text-right">

                      <p className="text-2xl font-bold text-green-600">
                        {job.score}%
                      </p>

                      <p className="text-sm text-gray-500">
                        Match
                      </p>

                    </div>

                  </div>


                  <p className="text-sm text-gray-500 mt-3">
                    {job.jobType} · {job.experience}
                  </p>


                  {/* Skills */}

                  <div className="flex flex-wrap gap-2 mt-4">

                    {job.skills.map((skill) => (
                      <span
                        key={skill}
                        className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-sm"
                      >
                        {skill}
                      </span>
                    ))}

                  </div>


                  {/* Matched Skills */}

                  {job.matchedSkills.length > 0 && (
                    <div className="mt-5">

                      <p className="font-semibold">
                        Matched Skills
                      </p>

                      <div className="flex flex-wrap gap-2 mt-2">

                        {job.matchedSkills.map(
                          (skill) => (
                            <span
                              key={skill}
                              className="bg-green-100 text-green-700 px-2 py-1 rounded text-sm"
                            >
                              {skill}
                            </span>
                          )
                        )}

                      </div>

                    </div>
                  )}


                  {/* Missing Skills */}

                  {job.missingSkills.length > 0 && (
                    <div className="mt-4">

                      <p className="font-semibold">
                        Missing Skills
                      </p>

                      <div className="flex flex-wrap gap-2 mt-2">

                        {job.missingSkills.map(
                          (skill) => (
                            <span
                              key={skill}
                              className="bg-red-100 text-red-700 px-2 py-1 rounded text-sm"
                            >
                              {skill}
                            </span>
                          )
                        )}

                      </div>

                    </div>
                  )}


                  <Link
                    to={`/jobs/${job.id}`}
                    className="inline-block mt-5 bg-blue-600 text-white px-4 py-2 rounded"
                  >
                    View Job
                  </Link>

                </div>
              ))}

            </div>
          )}

        </div>

      </div>

    </div>
  )
}

export default Recommendations