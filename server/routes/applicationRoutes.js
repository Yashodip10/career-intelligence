const express = require("express")

const {
  applyForJob,
  getMyJobApplication,
  getMyApplications
} = require("../controllers/applicationController")

const protect = require("../middleware/authMiddleware")

const router = express.Router()


// Apply for a job
router.post(
  "/:jobId",
  protect,
  applyForJob
)


// Check application status for a job
router.get(
  "/job/:jobId",
  protect,
  getMyJobApplication
)


// Get all applications of logged-in candidate
router.get(
  "/my",
  protect,
  getMyApplications
)


module.exports = router