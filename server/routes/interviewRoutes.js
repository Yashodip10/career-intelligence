const express = require("express")

const {
  startInterview,
  submitInterview,
  getMyInterviews
} = require("../controllers/interviewController")

const protect = require("../middleware/authMiddleware")

const router = express.Router()


// Start a new AI mock interview
router.post(
  "/start/:jobId",
  protect,
  startInterview
)

// Get completed interviews of logged-in candidate

router.get(
  "/my",
  protect,
  getMyInterviews
)

// Submit answers and evaluate the interview
router.post(
  "/:interviewId/submit",
  protect,
  submitInterview
)


module.exports = router