import { useEffect, useState } from "react"
import axios from "axios"

function Resume() {
  const [resume, setResume] = useState(null)
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [selectedFile, setSelectedFile] = useState(null)

  // ==========================================
  // Fetch Resume
  // ==========================================

  const fetchResume = async () => {
    try {
      setLoading(true)
      setError("")

      const token = localStorage.getItem("token")

      const response = await axios.get(
        "http://127.0.0.1:8000/api/resumes/me",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      setResume(response.data.resume)
    } catch (error) {
      if (error.response?.status === 404) {
        setResume(null)
        setError("No resume uploaded yet")
      } else {
        setError("Failed to load resume")
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchResume()
  }, [])

  // ==========================================
  // File Selection
  // ==========================================

  const handleFileChange = (e) => {
    const file = e.target.files[0]

    setSuccess("")
    setError("")

    if (!file) {
      setSelectedFile(null)
      return
    }

    if (file.type !== "application/pdf") {
      setError("Please select a PDF file.")
      setSelectedFile(null)
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("PDF file must be smaller than 5 MB.")
      setSelectedFile(null)
      return
    }

    setSelectedFile(file)
  }

  // ==========================================
  // Upload Resume
  // ==========================================

  const handleUpload = async () => {
    if (!selectedFile) {
      setError("Please select a PDF resume first.")
      return
    }

    try {
      setUploading(true)
      setError("")
      setSuccess("")

      const token = localStorage.getItem("token")

      const formData = new FormData()

      formData.append("resume", selectedFile)

      const response = await axios.post(
        "http://127.0.0.1:8000/api/resumes/upload",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      setResume(response.data.resume)
      setSelectedFile(null)

      setSuccess(
        "Resume updated and parsed successfully."
      )

      const input =
        document.getElementById("resumeFile")

      if (input) {
        input.value = ""
      }

    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to upload resume."
      )
    } finally {
      setUploading(false)
    }
  }

  // ==========================================
  // Loading
  // ==========================================

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-6">

        <div className="max-w-5xl mx-auto animate-pulse">

          <div className="h-7 w-40 bg-slate-200 rounded" />

          <div className="h-4 w-64 bg-slate-200 rounded mt-3" />

          <div className="h-40 bg-white border border-slate-200 rounded-xl mt-6" />

          <div className="h-40 bg-white border border-slate-200 rounded-xl mt-4" />

        </div>

      </div>
    )
  }

  const data = resume?.parsedData

  return (
    <div className="min-h-screen bg-slate-50">

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">

        {/* ==================================
            Header
        ================================== */}

        <div className="mb-5">

          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
            My Resume
          </h1>

          {resume && (
            <p className="text-sm text-slate-500 mt-1 break-all">
              {resume.fileName}
            </p>
          )}

        </div>


        {/* ==================================
            Update Resume
        ================================== */}

        <section className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6">

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

            <div>

              <h2 className="text-lg font-semibold text-slate-900">
                Update Resume
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                PDF only · Maximum 5 MB
              </p>

            </div>

            {resume && (
              <span className="text-xs font-medium text-green-700 bg-green-50 border border-green-100 px-2.5 py-1 rounded-full self-start sm:self-auto">
                Resume uploaded
              </span>
            )}

          </div>


          {/* File Input */}

          <div className="mt-4">

            <input
              id="resumeFile"
              type="file"
              accept=".pdf,application/pdf"
              onChange={handleFileChange}
              className="block w-full text-sm text-slate-600

                file:mr-3
                file:h-10
                file:px-4
                file:rounded-lg
                file:border-0
                file:bg-blue-50
                file:text-blue-700
                file:font-semibold
                hover:file:bg-blue-100

                cursor-pointer
              "
            />

          </div>


          {/* Selected File */}

          {selectedFile && (

            <div className="mt-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5">

              <div className="min-w-0">

                <p className="text-sm font-medium text-slate-800 truncate">
                  {selectedFile.name}
                </p>

                <p className="text-xs text-slate-500 mt-0.5">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>

              </div>

            </div>

          )}


          {/* Upload Button */}

          <button
            onClick={handleUpload}
            disabled={!selectedFile || uploading}
            className="mt-4 h-10 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold disabled:bg-slate-300 disabled:cursor-not-allowed transition"
          >
            {uploading
              ? "Updating..."
              : "Update Resume"}
          </button>

        </section>


        {/* ==================================
            Messages
        ================================== */}

        {error && (

          <div className="mt-3 px-4 py-3 bg-red-50 border border-red-100 text-red-600 rounded-lg text-sm">
            {error}
          </div>

        )}

        {success && (

          <div className="mt-3 px-4 py-3 bg-green-50 border border-green-100 text-green-700 rounded-lg text-sm">
            {success}
          </div>

        )}


        {/* ==================================
            No Resume
        ================================== */}

        {!resume && (

          <section className="mt-4 bg-white border border-slate-200 rounded-xl p-6 text-center">

            <h2 className="text-lg font-semibold text-slate-900">
              No Resume Uploaded
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              Upload your resume to get job matching and recommendations.
            </p>

          </section>

        )}


        {/* ==================================
            Parsed Resume
        ================================== */}

        {resume && data && (

          <div className="mt-5 space-y-4">


            {/* ==================================
                Personal Information
            ================================== */}

            <section className="bg-white border border-slate-200 rounded-xl p-5">

              <h2 className="text-lg font-semibold text-slate-900">
                Personal Information
              </h2>

              <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3">

                <div>
                  <p className="text-xs text-slate-500">
                    Name
                  </p>

                  <p className="text-sm font-medium text-slate-900 mt-1">
                    {data.name || "Not detected"}
                  </p>
                </div>


                <div className="min-w-0">

                  <p className="text-xs text-slate-500">
                    Email
                  </p>

                  <p className="text-sm font-medium text-slate-900 mt-1 break-all">
                    {data.email || "Not detected"}
                  </p>

                </div>


                <div>

                  <p className="text-xs text-slate-500">
                    Phone
                  </p>

                  <p className="text-sm font-medium text-slate-900 mt-1">
                    {data.phone || "Not detected"}
                  </p>

                </div>

              </div>

            </section>


            {/* ==================================
                Skills
            ================================== */}

            <section className="bg-white border border-slate-200 rounded-xl p-5">

              <h2 className="text-lg font-semibold text-slate-900">
                Skills
              </h2>

              {data.skills?.length === 0 ? (

                <p className="text-sm text-slate-500 mt-3">
                  No skills detected.
                </p>

              ) : (

                <div className="flex flex-wrap gap-1.5 mt-3">

                  {data.skills.map((skill) => (

                    <span
                      key={skill}
                      className="text-xs font-medium text-blue-700 bg-blue-50 border border-blue-100 px-2.5 py-1 rounded-md"
                    >
                      {skill}
                    </span>

                  ))}

                </div>

              )}

            </section>


            {/* ==================================
                Education + Experience
            ================================== */}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

              {/* Education */}

              <section className="bg-white border border-slate-200 rounded-xl p-5">

                <h2 className="text-lg font-semibold text-slate-900">
                  Education
                </h2>

                {data.education?.length === 0 ? (

                  <p className="text-sm text-slate-500 mt-3">
                    No education information detected.
                  </p>

                ) : (

                  <div className="mt-3 space-y-2">

                    {data.education.map(
                      (item, index) => (

                        <div
                          key={index}
                          className="text-sm text-slate-700 leading-5"
                        >
                          {item}
                        </div>

                      )
                    )}

                  </div>

                )}

              </section>


              {/* Experience */}

              <section className="bg-white border border-slate-200 rounded-xl p-5">

                <h2 className="text-lg font-semibold text-slate-900">
                  Experience
                </h2>

                {data.experience?.length === 0 ? (

                  <p className="text-sm text-slate-500 mt-3">
                    No experience information detected.
                  </p>

                ) : (

                  <div className="mt-3 space-y-2">

                    {data.experience.map(
                      (item, index) => (

                        <div
                          key={index}
                          className="text-sm text-slate-700 leading-5"
                        >
                          {item}
                        </div>

                      )
                    )}

                  </div>

                )}

              </section>

            </div>


            {/* ==================================
                Projects + Certifications
            ================================== */}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

              {/* Projects */}

              <section className="bg-white border border-slate-200 rounded-xl p-5">

                <h2 className="text-lg font-semibold text-slate-900">
                  Projects
                </h2>

                {data.projects?.length === 0 ? (

                  <p className="text-sm text-slate-500 mt-3">
                    No projects detected.
                  </p>

                ) : (

                  <div className="mt-3 space-y-2">

                    {data.projects.map(
                      (item, index) => (

                        <div
                          key={index}
                          className="text-sm text-slate-700 leading-5"
                        >
                          {item}
                        </div>

                      )
                    )}

                  </div>

                )}

              </section>


              {/* Certifications */}

              <section className="bg-white border border-slate-200 rounded-xl p-5">

                <h2 className="text-lg font-semibold text-slate-900">
                  Certifications
                </h2>

                {data.certifications?.length === 0 ? (

                  <p className="text-sm text-slate-500 mt-3">
                    No certifications detected.
                  </p>

                ) : (

                  <div className="mt-3 space-y-2">

                    {data.certifications.map(
                      (item, index) => (

                        <div
                          key={index}
                          className="text-sm text-slate-700 leading-5"
                        >
                          {item}
                        </div>

                      )
                    )}

                  </div>

                )}

              </section>

            </div>

          </div>

        )}

      </main>

    </div>
  )
}

export default Resume