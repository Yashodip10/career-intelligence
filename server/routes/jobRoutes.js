const express = require("express")

const {
  createJob,
  getJobs,
  getJobById,
  getAdminJobs,
  updateJob,
  deleteJob,
  toggleJobStatus
} = require("../controllers/jobController")

const protect = require("../middleware/authMiddleware")
const adminOnly = require("../middleware/adminMiddleware")

const router = express.Router()


// =====================================================
// Admin Routes
// =====================================================

router.get(
  "/admin",
  protect,
  adminOnly,
  getAdminJobs
)

router.post(
  "/",
  protect,
  adminOnly,
  createJob
)

router.put(
  "/:id",
  protect,
  adminOnly,
  updateJob
)

router.delete(
  "/:id",
  protect,
  adminOnly,
  deleteJob
)

router.patch(
  "/:id/toggle",
  protect,
  adminOnly,
  toggleJobStatus
)


// =====================================================
// Public Routes
// =====================================================

router.get("/", getJobs)

router.get("/:id", getJobById)


module.exports = router