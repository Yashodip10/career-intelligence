const express = require("express")

const {
  matchResumeWithJob
} = require("../controllers/matchController")

const protect = require("../middleware/authMiddleware")

const router = express.Router()

router.get(
  "/job/:jobId",
  protect,
  matchResumeWithJob
)

module.exports = router