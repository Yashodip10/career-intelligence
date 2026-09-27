import { BrowserRouter, Routes, Route } from "react-router-dom"

import Navbar from "./components/Navbar"
import Footer from "./components/Footer"

import RecommendedJobs from "./pages/RecommendedJobs"
import Jobs from "./pages/Jobs"
import JobDetails from "./pages/JobDetails"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Resume from "./pages/Resume"
import MockInterview from "./pages/MockInterview"
import InterviewResult from "./pages/InterviewResult"

import AdminJobs from "./pages/AdminJobs"
import AdminHome from "./pages/AdminHome"
import AdminCandidates from "./pages/AdminCandidates"
import AdminCandidateDetails from "./pages/AdminCandidateDetails"

import ProtectedRoute from "./components/ProtectedRoute"
import MyApplications from "./pages/MyApplications"
import MyInterviews from "./pages/MyInterviews"


function HomePage() {

  const user = JSON.parse(
    localStorage.getItem("user") || "null"
  )

  if (user?.role === "admin") {
    return <AdminHome />
  }

  return <Jobs />
}


function App() {

  return (

    <BrowserRouter>

      <Navbar />

      <Routes>

        {/* ============================================
            Home
        ============================================ */}

        <Route
          path="/"
          element={<HomePage />}
        />

<Route
  path="/my-applications"
  element={
    <ProtectedRoute userOnly>
      <MyApplications />
    </ProtectedRoute>
  }
/>

        {/* ============================================
            Public / Candidate Jobs
        ============================================ */}

        <Route
          path="/jobs"
          element={<Jobs />}
        />

        <Route
          path="/jobs/:id"
          element={<JobDetails />}
        />


        {/* ============================================
            Authentication
        ============================================ */}

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />


        {/* ============================================
            Candidate Resume
        ============================================ */}

        <Route
          path="/resume"
          element={
            <ProtectedRoute userOnly>
              <Resume />
            </ProtectedRoute>
          }
        />


        {/* ============================================
            Recommended Jobs
        ============================================ */}

        <Route
          path="/recommended-jobs"
          element={
            <ProtectedRoute userOnly>
              <RecommendedJobs />
            </ProtectedRoute>
          }
        />


        {/* ============================================
            Mock Interview
        ============================================ */}

        <Route
          path="/mock-interview"
          element={
            <ProtectedRoute userOnly>
              <MockInterview />
            </ProtectedRoute>
          }
        />

        <Route
          path="/interview-result"
          element={
            <ProtectedRoute userOnly>
              <InterviewResult />
            </ProtectedRoute>
          }
        />

<Route
  path="/my-interviews"
  element={
    <ProtectedRoute userOnly>
      <MyInterviews />
    </ProtectedRoute>
  }
/>

<Route
  path="/my-applications"
  element={
    <ProtectedRoute userOnly>
      <MyApplications />
    </ProtectedRoute>
  }
/>

<Route
  path="/my-interviews"
  element={
    <ProtectedRoute userOnly>
      <MyInterviews />
    </ProtectedRoute>
  }
/>

        {/* ============================================
            Admin Dashboard
        ============================================ */}

        <Route
          path="/admin"
          element={
            <ProtectedRoute adminOnly>
              <AdminHome />
            </ProtectedRoute>
          }
        />


        {/* ============================================
            Admin Job Management
        ============================================ */}

        <Route
          path="/admin/jobs"
          element={
            <ProtectedRoute adminOnly>
              <AdminJobs />
            </ProtectedRoute>
          }
        />


        {/* ============================================
            Admin Candidate Management
        ============================================ */}

        <Route
          path="/admin/candidates"
          element={
            <ProtectedRoute adminOnly>
              <AdminCandidates />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/candidates/:id"
          element={
            <ProtectedRoute adminOnly>
              <AdminCandidateDetails />
            </ProtectedRoute>
          }
        />

      </Routes>


      {/* ============================================
          Global Footer
      ============================================ */}

      <Footer />

    </BrowserRouter>
  )
}

export default App