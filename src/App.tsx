// src/App.tsx
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import { Navbar, Sidebar } from './components'
import { ProtectedRoute } from './components/ProtectedRoute'
import Login from './pages/Login'

// Pacientes
import PatientSchedule from './pages/patient/Schedule'
import PatientHistory from './pages/patient/History'
import PatientExams from './pages/patient/Exams'
import PatientSupport from './pages/patient/Support'

// Doctores
import DoctorPatients from './pages/doctor/Patients'
import DoctorAppointments from './pages/doctor/Appointments'
import DoctorReports from './pages/doctor/Reports'
import DoctorSettings from './pages/doctor/Settings'

// Admin
import AdminDashboard from './pages/admin/Dashboard'
import AdminUsers from './pages/admin/Users'
import AdminReports from './pages/admin/Reports'
import AdminSettings from './pages/admin/Settings'
import SidebarDoctor from './components/SidebarDoctor'
import SidebarAdmin from './components/SidebarAdmin'

function App() {
  const { isAuthenticated, user } = useAuth()

  // Si no está autenticado, solo mostrar Login
  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    )
  }

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
            path="/patient/exams"
            element={
              <ProtectedRoute allowedRoles={['patient']}>
                <PatientExams />
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
            path="/doctor/patients"
            element={
              <ProtectedRoute allowedRoles={['doctor']}>
                <DoctorPatients />
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
            path="/doctor/reports"
            element={
              <ProtectedRoute allowedRoles={['doctor']}>
                <DoctorReports />
              </ProtectedRoute>
            }
          />
          <Route
            path="/doctor/settings"
            element={
              <ProtectedRoute allowedRoles={['doctor']}>
                <DoctorSettings />
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
            path="/admin/settings"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminSettings />
              </ProtectedRoute>
            }
          />

          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </main>
    </div>
  )
}

export default App