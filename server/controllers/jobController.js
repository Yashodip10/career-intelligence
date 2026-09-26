const Job = require("../models/Job")


// ==========================================
// Create Job
// ==========================================

const createJob = async (req, res) => {

  try {

    const {
      title,
      company,
      location,
      jobType,
      experience,
      skills,
      description,
      applyLink,
      source,
      postedAt,
      expiresAt,
      isActive
    } = req.body


    if (
      !title ||
      !company ||
      !location ||
      !description ||
      !applyLink
    ) {

      return res.status(400).json({
        message:
          "Please provide all required job details"
      })

    }


    const job = await Job.create({

      title,
      company,
      location,
      jobType,
      experience,
      skills,
      description,
      applyLink,

      source:
        source || "Admin",

      postedAt:
        postedAt || Date.now(),

      expiresAt:
        expiresAt || null,

      isActive:
        isActive !== undefined
          ? isActive
          : true

    })


    res.status(201).json({

      message:
        "Job created successfully",

      job

    })

  }

  catch (error) {

    res.status(500).json({

      message:
        "Server error",

      error:
        error.message

    })

  }

}


// ==========================================
// Get Jobs
// ==========================================

const getJobs = async (req, res) => {

  try {

    const {

      search = "",

      location = "",

      jobType = "",

      experience = "",

      skill = "",

      sort = "latest",

      page = 1,

      limit = 10

    } = req.query


    // ----------------------------------------
    // Build query
    // ----------------------------------------

    const query = {

      isActive: true

    }


    // ----------------------------------------
    // Search
    // ----------------------------------------

    if (search.trim()) {

      query.$or = [

        {
          title: {
            $regex: search.trim(),
            $options: "i"
          }
        },

        {
          company: {
            $regex: search.trim(),
            $options: "i"
          }
        },

        {
          description: {
            $regex: search.trim(),
            $options: "i"
          }
        },

        {
          skills: {
            $regex: search.trim(),
            $options: "i"
          }
        }

      ]

    }


    // ----------------------------------------
    // Location filter
    // ----------------------------------------

    if (location.trim()) {

      query.location = {
        $regex: location.trim(),
        $options: "i"
      }

    }


    // ----------------------------------------
    // Job type
    // ----------------------------------------

    if (jobType.trim()) {

      query.jobType = jobType

    }


    // ----------------------------------------
    // Experience
    // ----------------------------------------

    if (experience.trim()) {

      query.experience = {
        $regex: experience.trim(),
        $options: "i"
      }

    }


    // ----------------------------------------
    // Skill
    // ----------------------------------------

    if (skill.trim()) {

      query.skills = {
        $regex: skill.trim(),
        $options: "i"
      }

    }


    // ----------------------------------------
    // Sorting
    // ----------------------------------------

    let sortOption = {
      postedAt: -1
    }


    if (sort === "oldest") {

      sortOption = {
        postedAt: 1
      }

    }


    if (sort === "company") {

      sortOption = {
        company: 1
      }

    }


    // ----------------------------------------
    // Pagination
    // ----------------------------------------

    const currentPage =
      Math.max(parseInt(page) || 1, 1)

    const jobsPerPage =
      Math.min(
        Math.max(parseInt(limit) || 10, 1),
        50
      )

    const skip =
      (currentPage - 1) * jobsPerPage


    // ----------------------------------------
    // Remove expired jobs
    // ----------------------------------------

    query.$and = [

      {
        $or: [
          {
            expiresAt: null
          },
          {
            expiresAt: {
              $gt: new Date()
            }
          }
        ]
      }

    ]


    // ----------------------------------------
    // Get jobs
    // ----------------------------------------

    const totalJobs =
      await Job.countDocuments(query)


    const jobs =
      await Job.find(query)
        .sort(sortOption)
        .skip(skip)
        .limit(jobsPerPage)


    const totalPages =
      Math.ceil(
        totalJobs / jobsPerPage
      )


    // ----------------------------------------
    // Response
    // ----------------------------------------

    res.json({

      count:
        jobs.length,

      totalJobs,

      currentPage,

      totalPages,

      jobs

    })

  }

  catch (error) {

    console.error(
      "Get jobs error:",
      error.message
    )


    res.status(500).json({

      message:
        "Server error",

      error:
        error.message

    })

  }

}


// ==========================================
// Get Job By ID
// ==========================================

const getJobById = async (req, res) => {

  try {

    const job =
      await Job.findById(
        req.params.id
      )


    if (!job) {

      return res.status(404).json({

        message:
          "Job not found"

      })

    }


    res.json({
      job
    })

  }

  catch (error) {

    res.status(500).json({

      message:
        "Server error",

      error:
        error.message

    })

  }

}

const updateJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)

    if (!job) {
      return res.status(404).json({
        message: "Job not found"
      })
    }

    const {
      title,
      company,
      location,
      jobType,
      experience,
      skills,
      description,
      applyLink,
      source,
      postedAt,
      expiresAt,
      isActive
    } = req.body

    job.title = title ?? job.title
    job.company = company ?? job.company
    job.location = location ?? job.location
    job.jobType = jobType ?? job.jobType
    job.experience = experience ?? job.experience
    job.skills = skills ?? job.skills
    job.description = description ?? job.description
    job.applyLink = applyLink ?? job.applyLink
    job.source = source ?? job.source
    job.postedAt = postedAt ?? job.postedAt
    job.expiresAt = expiresAt ?? job.expiresAt

    if (isActive !== undefined) {
      job.isActive = isActive
    }

    const updatedJob = await job.save()

    res.json({
      message: "Job updated successfully",
      job: updatedJob
    })
  } catch (error) {
    console.error("Update job error:", error.message)

    res.status(500).json({
      message: "Server error",
      error: error.message
    })
  }
}


const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)

    if (!job) {
      return res.status(404).json({
        message: "Job not found"
      })
    }

    await Job.findByIdAndDelete(req.params.id)

    res.json({
      message: "Job deleted successfully"
    })
  } catch (error) {
    console.error("Delete job error:", error.message)

    res.status(500).json({
      message: "Server error",
      error: error.message
    })
  }
}


const toggleJobStatus = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)

    if (!job) {
      return res.status(404).json({
        message: "Job not found"
      })
    }

    job.isActive = !job.isActive

    await job.save()

    res.json({
      message: job.isActive
        ? "Job activated successfully"
        : "Job deactivated successfully",
      job
    })
  } catch (error) {
    console.error(
      "Toggle job status error:",
      error.message
    )

    res.status(500).json({
      message: "Server error",
      error: error.message
    })
  }
}

const getAdminJobs = async (req, res) => {
  try {
    const {
      search = "",
      status = ""
    } = req.query

    const query = {}

    if (search.trim()) {
      query.$or = [
        {
          title: {
            $regex: search.trim(),
            $options: "i"
          }
        },
        {
          company: {
            $regex: search.trim(),
            $options: "i"
          }
        },
        {
          location: {
            $regex: search.trim(),
            $options: "i"
          }
        }
      ]
    }

    if (status === "active") {
      query.isActive = true
    }

    if (status === "inactive") {
      query.isActive = false
    }

    const jobs = await Job.find(query)
      .sort({ postedAt: -1, createdAt: -1 })

    const totalJobs = jobs.length

    const activeJobs = jobs.filter(
      (job) => job.isActive
    ).length

    const inactiveJobs = jobs.filter(
      (job) => !job.isActive
    ).length

    res.json({
      totalJobs,
      activeJobs,
      inactiveJobs,
      jobs
    })
  } catch (error) {
    console.error(
      "Get admin jobs error:",
      error.message
    )

    res.status(500).json({
      message: "Server error",
      error: error.message
    })
  }
}


module.exports = {
  createJob,
  getJobs,
  getJobById,
  getAdminJobs,
  updateJob,
  deleteJob,
  toggleJobStatus
}