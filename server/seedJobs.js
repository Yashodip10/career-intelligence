const mongoose = require("mongoose")
require("dotenv").config()

const Job = require("./models/Job")

const jobs = [
  {
    title: "React Developer",
    company: "TechNova Solutions",
    location: "Pune",
    jobType: "Full-time",
    experience: "Fresher",
    skills: ["React", "JavaScript", "HTML", "CSS"],
    description:
      "Build responsive web applications using React and JavaScript. Work with the development team to implement user interfaces and integrate APIs.",
    applyLink: "https://example.com/react-developer",
    source: "Demo Data",
    postedAt: new Date("2026-09-26"),
    isActive: true
  },

  {
    title: "MERN Stack Developer",
    company: "CodeSphere Technologies",
    location: "Mumbai",
    jobType: "Full-time",
    experience: "Fresher",
    skills: ["React", "Node.js", "Express", "MongoDB"],
    description:
      "Develop full-stack web applications using the MERN stack. Work on frontend components, REST APIs and MongoDB-based applications.",
    applyLink: "https://example.com/mern-developer",
    source: "Demo Data",
    postedAt: new Date("2026-09-25"),
    isActive: true
  },

  {
    title: "Full Stack Developer",
    company: "WebCore Labs",
    location: "Bangalore",
    jobType: "Full-time",
    experience: "0-1",
    skills: ["React", "Node.js", "SQL", "REST API"],
    description:
      "Work on modern full-stack applications and REST APIs. Collaborate with frontend and backend developers to deliver scalable web solutions.",
    applyLink: "https://example.com/full-stack-developer",
    source: "Demo Data",
    postedAt: new Date("2026-09-24"),
    isActive: true
  },

  {
    title: "Junior React Developer",
    company: "PixelCraft Technologies",
    location: "Pune",
    jobType: "Full-time",
    experience: "Fresher",
    skills: ["React", "JavaScript", "Tailwind CSS"],
    description:
      "Create responsive interfaces using React and Tailwind CSS. Assist the team in developing reusable frontend components.",
    applyLink: "https://example.com/junior-react",
    source: "Demo Data",
    postedAt: new Date("2026-09-23"),
    isActive: true
  },

  {
    title: "Node.js Developer",
    company: "BackendWorks",
    location: "Hyderabad",
    jobType: "Full-time",
    experience: "Fresher",
    skills: ["Node.js", "Express", "MongoDB", "REST API"],
    description:
      "Develop backend services and REST APIs using Node.js and Express. Work with MongoDB and integrate frontend applications.",
    applyLink: "https://example.com/node-developer",
    source: "Demo Data",
    postedAt: new Date("2026-09-22"),
    isActive: true
  },

  {
    title: "Software Developer",
    company: "NextGen Systems",
    location: "Mumbai",
    jobType: "Full-time",
    experience: "Fresher",
    skills: ["Java", "SQL", "JavaScript", "OOP"],
    description:
      "Develop and maintain software applications using Java and SQL. Candidates should have a good understanding of object-oriented programming.",
    applyLink: "https://example.com/software-developer",
    source: "Demo Data",
    postedAt: new Date("2026-09-21"),
    isActive: true
  },

  {
    title: "Java Full Stack Developer",
    company: "EnterpriseSoft",
    location: "Pune",
    jobType: "Full-time",
    experience: "0-1",
    skills: ["Java", "Spring Boot", "React", "MySQL"],
    description:
      "Develop enterprise web applications using Java, Spring Boot and React. Work with relational databases and REST APIs.",
    applyLink: "https://example.com/java-full-stack",
    source: "Demo Data",
    postedAt: new Date("2026-09-20"),
    isActive: true
  },

  {
    title: "Backend Developer",
    company: "CloudStack Labs",
    location: "Bangalore",
    jobType: "Full-time",
    experience: "0-1",
    skills: ["Node.js", "Express", "MongoDB", "Git"],
    description:
      "Build backend services, APIs and database integrations. Work with the engineering team to develop reliable server-side applications.",
    applyLink: "https://example.com/backend-developer",
    source: "Demo Data",
    postedAt: new Date("2026-09-19"),
    isActive: true
  },

  {
    title: "Web Developer",
    company: "DigitalWave",
    location: "Nashik",
    jobType: "Full-time",
    experience: "Fresher",
    skills: ["HTML", "CSS", "JavaScript", "React"],
    description:
      "Develop responsive websites and frontend applications. Work with designers and developers to create user-friendly web experiences.",
    applyLink: "https://example.com/web-developer",
    source: "Demo Data",
    postedAt: new Date("2026-09-18"),
    isActive: true
  },

  {
    title: "Software Engineer - Entry Level",
    company: "InnovateSoft",
    location: "Chennai",
    jobType: "Full-time",
    experience: "Fresher",
    skills: ["Java", "DSA", "SQL", "OOP"],
    description:
      "Join the software engineering team as an entry-level developer. Solve programming problems and contribute to production applications.",
    applyLink: "https://example.com/software-engineer",
    source: "Demo Data",
    postedAt: new Date("2026-09-17"),
    isActive: true
  },

  {
    title: "React and Node.js Developer",
    company: "AppForge Technologies",
    location: "Bangalore",
    jobType: "Full-time",
    experience: "0-1",
    skills: ["React", "Node.js", "REST API", "JavaScript"],
    description:
      "Build frontend interfaces and backend APIs using React and Node.js. Participate in feature development and application testing.",
    applyLink: "https://example.com/react-node",
    source: "Demo Data",
    postedAt: new Date("2026-09-16"),
    isActive: true
  },

  {
    title: "Full Stack Developer Intern",
    company: "StartupHub",
    location: "Remote",
    jobType: "Internship",
    experience: "Fresher",
    skills: ["React", "Node.js", "MongoDB", "JavaScript"],
    description:
      "Work on real-world web application features as a full-stack development intern. Learn frontend, backend and database development.",
    applyLink: "https://example.com/full-stack-intern",
    source: "Demo Data",
    postedAt: new Date("2026-09-15"),
    isActive: true
  },

  {
    title: "Junior Java Developer",
    company: "JavaWorks Technologies",
    location: "Hyderabad",
    jobType: "Full-time",
    experience: "Fresher",
    skills: ["Java", "Spring Boot", "MySQL", "REST API"],
    description:
      "Develop backend applications using Java and Spring Boot. Work with MySQL and REST APIs in an agile development environment.",
    applyLink: "https://example.com/junior-java",
    source: "Demo Data",
    postedAt: new Date("2026-09-14"),
    isActive: true
  },

  {
    title: "Python Developer",
    company: "DataBridge Labs",
    location: "Ahmedabad",
    jobType: "Full-time",
    experience: "Fresher",
    skills: ["Python", "SQL", "REST API", "Git"],
    description:
      "Develop Python-based applications and APIs. Work with SQL databases and contribute to backend development projects.",
    applyLink: "https://example.com/python-developer",
    source: "Demo Data",
    postedAt: new Date("2026-09-13"),
    isActive: true
  },

  {
    title: "QA Automation Engineer",
    company: "QualityFirst Systems",
    location: "Chennai",
    jobType: "Full-time",
    experience: "Fresher",
    skills: ["Java", "Selenium", "SQL", "Testing"],
    description:
      "Create automated test cases and support software quality assurance activities using Java and Selenium.",
    applyLink: "https://example.com/qa-automation",
    source: "Demo Data",
    postedAt: new Date("2026-09-12"),
    isActive: true
  },

  {
    title: "Cloud and DevOps Intern",
    company: "CloudOrbit",
    location: "Remote",
    jobType: "Internship",
    experience: "Fresher",
    skills: ["AWS", "Linux", "Docker", "Git"],
    description:
      "Assist with cloud infrastructure and deployment activities. Learn AWS, Linux, Docker and CI/CD practices.",
    applyLink: "https://example.com/cloud-devops",
    source: "Demo Data",
    postedAt: new Date("2026-09-11"),
    isActive: true
  },

  {
    title: "Data Analyst - Fresher",
    company: "InsightWorks",
    location: "Gurgaon",
    jobType: "Full-time",
    experience: "Fresher",
    skills: ["Python", "SQL", "Excel", "Data Analysis"],
    description:
      "Analyze business data and prepare reports using Python, SQL and Excel. Support data-driven decision making.",
    applyLink: "https://example.com/data-analyst",
    source: "Demo Data",
    postedAt: new Date("2026-09-10"),
    isActive: true
  },

  {
    title: "UI Developer",
    company: "DesignTech Labs",
    location: "Noida",
    jobType: "Full-time",
    experience: "Fresher",
    skills: ["HTML", "CSS", "JavaScript", "React"],
    description:
      "Build responsive user interfaces from design specifications using modern frontend technologies.",
    applyLink: "https://example.com/ui-developer",
    source: "Demo Data",
    postedAt: new Date("2026-09-09"),
    isActive: true
  },

  {
    title: "Frontend Developer",
    company: "InterfaceLabs",
    location: "Mumbai",
    jobType: "Full-time",
    experience: "0-1",
    skills: ["React", "JavaScript", "HTML", "CSS", "Git"],
    description:
      "Develop modern frontend applications using React. Work with designers and backend engineers to deliver responsive interfaces.",
    applyLink: "https://example.com/frontend-developer",
    source: "Demo Data",
    postedAt: new Date("2026-09-08"),
    isActive: true
  },

  {
    title: "MERN Stack Intern",
    company: "WebLaunch",
    location: "Pune",
    jobType: "Internship",
    experience: "Fresher",
    skills: ["MongoDB", "Express", "React", "Node.js"],
    description:
      "Assist in building full-stack web applications using the MERN stack. Suitable for students and recent graduates.",
    applyLink: "https://example.com/mern-intern",
    source: "Demo Data",
    postedAt: new Date("2026-09-07"),
    isActive: true
  },

  {
    title: "Software Developer Intern",
    company: "TechBridge",
    location: "Delhi / NCR",
    jobType: "Internship",
    experience: "Fresher",
    skills: ["Java", "Python", "SQL", "Git"],
    description:
      "Assist software engineers in developing and testing applications. Opportunity to work with multiple programming technologies.",
    applyLink: "https://example.com/software-intern",
    source: "Demo Data",
    postedAt: new Date("2026-09-06"),
    isActive: true
  },

  {
    title: "Frontend Developer",
    company: "RemoteCode Labs",
    location: "Remote",
    jobType: "Full-time",
    experience: "Fresher",
    skills: ["React", "JavaScript", "Tailwind CSS", "REST API"],
    description:
      "Build responsive web interfaces for remote product teams. Work with React, Tailwind CSS and REST APIs.",
    applyLink: "https://example.com/remote-frontend",
    source: "Demo Data",
    postedAt: new Date("2026-09-05"),
    isActive: true
  },

  {
    title: "Associate Software Engineer",
    company: "TechEdge Systems",
    location: "Delhi / NCR",
    jobType: "Full-time",
    experience: "Fresher",
    skills: ["Java", "DSA", "SQL", "Git"],
    description:
      "Join the engineering team as an associate software engineer and contribute to application development and testing.",
    applyLink: "https://example.com/associate-engineer",
    source: "Demo Data",
    postedAt: new Date("2026-09-04"),
    isActive: true
  }
]


// ==========================================
// Seed Jobs
// ==========================================

const seedJobs = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error(
        "MONGO_URI is missing from .env"
      )
    }

    await mongoose.connect(
      process.env.MONGO_URI
    )

    console.log("MongoDB connected")

    // Remove only our demo jobs.
    // Real/admin-created jobs are NOT touched.
    await Job.deleteMany({
      source: "Demo Data"
    })

    const insertedJobs =
      await Job.insertMany(jobs)

    console.log(
      `${insertedJobs.length} demo jobs added successfully`
    )

    await mongoose.disconnect()

    console.log("MongoDB disconnected")

    process.exit(0)

  } catch (error) {

    console.error(
      "Failed to seed jobs:",
      error.message
    )

    await mongoose.disconnect()

    process.exit(1)
  }
}

seedJobs()