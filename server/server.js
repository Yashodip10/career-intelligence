require("dotenv").config()
const express = require("express")
const cors = require("cors")
const dotenv = require("dotenv")

const connectDB = require("./config/db")
const authRoutes = require("./routes/authRoutes")
const jobRoutes = require("./routes/jobRoutes")
const resumeRoutes = require("./routes/resumeRoutes")
const matchRoutes = require("./routes/matchRoutes") 
const improvementRoutes = require("./routes/improvementRoutes")
const recommendationRoutes = require("./routes/recommendationRoutes")
const interviewRoutes = require("./routes/interviewRoutes")
const adminCandidateRoutes = require("./routes/adminCandidateRoutes")
const candidateProfileRoutes = require("./routes/candidateProfileRoutes")
const applicationRoutes = require("./routes/applicationRoutes")
const app = express()
const fs = require("fs")
const path = require("path")
// Connect to MongoDB
connectDB()

// Middleware
const uploadsDir = path.join(__dirname, "uploads")

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true })
}
app.use(cors())
app.use(express.json())
app.use("/api/auth", authRoutes)
app.use("/api/jobs", jobRoutes)
app.use("/api/resumes", resumeRoutes)
app.use("/api/matches", matchRoutes)
app.use("/api/improvements", improvementRoutes)
app.use(
  "/api/recommendations",
  recommendationRoutes
)
app.use(
  "/api/interviews",
  interviewRoutes
)
app.use("/api/admin/candidates", adminCandidateRoutes)
app.use(
  "/api/candidate-profile",
  candidateProfileRoutes
)

app.use(
  "/api/applications",
  applicationRoutes
)
// Test route
app.get("/", (req, res) => {
  res.json({
    message: "Career Intelligence API is running"
  })
})

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})