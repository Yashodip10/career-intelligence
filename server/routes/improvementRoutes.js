const express = require("express")

const {
  getResumeImprovements
} = require("../controllers/improvementController")

const protect = require("../middleware/authMiddleware")

const router = express.Router()

router.get(
  "/job/:jobId",
  protect,
  getResumeImprovements
)

module.exports = router