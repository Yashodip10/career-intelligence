const express = require("express")

const {
  getMyProfile
} = require("../controllers/candidateProfileController")

const protect = require("../middleware/authMiddleware")

const router = express.Router()

router.get(
  "/me",
  protect,
  getMyProfile
)

module.exports = router