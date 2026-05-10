// src/App.tsx
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import { Navbar, Sidebar } from './components'
import Login from './pages/Login'
import Register from './pages/Register'
import {ProtectedRoute} from './components/ProtectedRoute'

// Pacientes
import PatientSchedule from './pages/Patient/Schedule'
import PatientHistory from './pages/Patient/MedicHistory'
import PatientConfig from './pages/Patient/Config'
import PatientSupport from './pages/Patient/Suport'

// Doctores
import DoctorAvailability from './pages/Doctor/DoctorAvailability'
import DoctorAppointments from './pages/Doctor/AppointmentsCenter'
import DoctorProfileEdit from './pages/Doctor/DoctorProfileEdit'
import DoctorNotifications from './pages/Doctor/NotificationsCenter'

// Admin
import AdminDashboard from './pages/Administrator/Dashboard'
import AdminUsers from './pages/Administrator/DoctorList'
import AdminReports from './pages/Administrator/DoctorManager' 


import SidebarDoctor from './components/SidebarDoctor'
import SidebarAdmin from './components/SidebarAdmin'

function App() {
  <Routes>
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />
  </Routes>
  
  const { isAuthenticated, user } = useAuth()

  // rutas protegidas
  {isAuthenticated && (
    <>
      {/* PACIENTES */}
      <Route
        path="/patient/schedule"
        element={
          <ProtectedRoute allowedRoles={['patient']}>
            <PatientSchedule />
          </ProtectedRoute>
        }
      />
      {

      }
    </>
  )}
  return (
    <div className="flex h-screen bg-gray-50">
      <Navbar />
      
      {user?.role === 'patient' && <Sidebar/>}
      {user?.role === 'doctor' && <SidebarDoctor />}
      {user?.role === 'admin' && <SidebarAdmin />}

      <main className="flex-1 ml-64 mt-16 p-8">
        <Routes>
          {/* RUTAS PACIENTES */}
          <Route
            path="/patient/schedule"
            element={
              <ProtectedRoute allowedRoles={['patient']}>
                <PatientSchedule />
              </ProtectedRoute>
            }
          />
          <Route
            path="/patient/history"
            element={
              <ProtectedRoute allowedRoles={['patient']}>
                <PatientHistory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/patient/config"
            element={
              <ProtectedRoute allowedRoles={['patient']}>
                <PatientConfig />
              </ProtectedRoute>
            }
          />
          <Route
            path="/patient/support"
            element={
              <ProtectedRoute allowedRoles={['patient']}>
                <PatientSupport />
              </ProtectedRoute>
            }
          />

          {/* RUTAS DOCTORES */}
          <Route
            path="/doctor/availability"
            element={
              <ProtectedRoute allowedRoles={['doctor']}>
                <DoctorAvailability />
              </ProtectedRoute>
            }
          />
          <Route
            path="/doctor/appointments"
            element={
              <ProtectedRoute allowedRoles={['doctor']}>
                <DoctorAppointments />
              </ProtectedRoute>
            }
          />
          <Route
            path="/doctor/editprofile"
            element={
              <ProtectedRoute allowedRoles={['doctor']}>
                <DoctorProfileEdit />
              </ProtectedRoute>
            }
          />
          <Route
            path="/doctor/notifications"
            element={
              <ProtectedRoute allowedRoles={['doctor']}>
                <DoctorNotifications />
              </ProtectedRoute>
            }
          />

          {/* RUTAS ADMIN */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminUsers />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/reports"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminReports />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/register"
            element={
              <Register/>
            }
          />


          <Route 
            path="/" 
              element={
                <Navigate to="/login" replace />} />
          </Routes>
      </main>
    </div>
  )
}

export default App