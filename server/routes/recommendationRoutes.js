const express = require("express")

const {
  getRecommendedJobs
} = require("../controllers/recommendationController")

const protect = require("../middleware/authMiddleware")

const router = express.Router()


router.get(
  "/",
  protect,
  getRecommendedJobs
)


module.exports = router