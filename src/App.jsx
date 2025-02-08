import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import { ConfigProvider } from 'antd'
import { customTheme } from './theme'
import 'antd/dist/reset.css'
import 'react-toastify/dist/ReactToastify.css'
import { useEffect, useCallback } from 'react'
import Dashboard from './layouts/Dashboard'
import Welcome from './pages/Welcome'
import Projects from './pages/Projects'
import ProjectDetail from './pages/ProjectDetail'
import ProductDetail from './pages/ProductDetail'
import Settings from './pages/Settings'
import SignIn from './pages/SignIn'
import Register from './pages/Register'
import useAuthStore from './stores/authStore'

// Mock data to simulate whether user has projects
const hasProjects = true // Set to true to show projects list

// Add axios interceptor for auth headers
const addAuthHeader = () => {
  const token = localStorage.getItem('token')
  if (token) {
    return {
      'Authorization': `Bearer ${token}`
    }
  }
  return {}
}

export default function App() {
  const { isAuthenticated, initAuth, checkTokenExpiration } = useAuthStore()

  // Initialize auth state
  useEffect(() => {
    initAuth()
  }, [initAuth])

  // Set up token refresh check interval
  useEffect(() => {
    if (isAuthenticated) {
      const interval = setInterval(() => {
        checkTokenExpiration()
      }, 60000) // Check every minute
      return () => clearInterval(interval)
    }
  }, [isAuthenticated, checkTokenExpiration])

  // Add fetch interceptor for auth headers and error handling
  const originalFetch = window.fetch
  window.fetch = async (url, options = {}) => {
    try {
      const authHeaders = addAuthHeader()
      options.headers = {
        ...options.headers,
        ...authHeaders,
      }
      const response = await originalFetch(url, options)

      // Handle 401 Unauthorized globally
      if (response.status === 401) {
        // Try to refresh token
        const refreshResult = await useAuthStore.getState().refreshToken()
        if (!refreshResult) {
          // If refresh failed, redirect to login
          useAuthStore.getState().signOut()
          return response
        }

        // Retry the original request with new token
        const newAuthHeaders = addAuthHeader()
        options.headers = {
          ...options.headers,
          ...newAuthHeaders,
        }
        return originalFetch(url, options)
      }

      return response
    } catch (error) {
      console.error('Fetch error:', error)
      throw error
    }
  }

  if (!isAuthenticated) {
    return (
      <ConfigProvider theme={customTheme}>
        <Router>
          <Routes>
            <Route path="/signin" element={<SignIn />} />
            <Route path="/register" element={<Register />} />
            <Route path="*" element={<Navigate to="/signin" replace />} />
          </Routes>
        </Router>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </ConfigProvider>
    )
  }

  return (
    <ConfigProvider theme={customTheme}>
      <Router>
        <Routes>
          <Route path="/" element={<Dashboard />}>
            <Route index element={<Navigate to="/projects" replace />} />
            <Route path="projects" element={<Projects />} />
            <Route path="projects/new" element={<Welcome />} />
            <Route path="projects/:projectId" element={<ProjectDetail />} />
            <Route path="projects/:projectId/products/:productId" element={<ProductDetail />} />
            <Route path="settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="/projects" replace />} />
          </Route>
        </Routes>
      </Router>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </ConfigProvider>
  )
}
