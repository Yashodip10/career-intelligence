const express = require("express")

const {
  getCandidates,
  getCandidateStats,
  getCandidateById
} = require("../controllers/adminCandidateController")

const protect = require("../middleware/authMiddleware")
const adminOnly = require("../middleware/adminMiddleware")

const router = express.Router()

router.get(
  "/stats",
  protect,
  adminOnly,
  getCandidateStats
)

router.get(
  "/",
  protect,
  adminOnly,
  getCandidates
)

router.get(
  "/:id",
  protect,
  adminOnly,
  getCandidateById
)

module.exports = router