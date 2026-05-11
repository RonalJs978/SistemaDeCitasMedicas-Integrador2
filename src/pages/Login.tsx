import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth, type UserRole } from '../context/AuthContext'
import { User } from 'lucide-react'

// ✅ Importa la imagen correctamente en lugar de usar ruta hardcodeada
import sidebarImage from '../assets/sidebar_12.png'

export default function Login() {
  const [role, setRole] = useState<UserRole>('patient')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { setUser } = useAuth()
  const navigate = useNavigate()

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    const mockUser = {
      id: '1',
      name: 'Usuario Demo',
      email: email,
      role: role,
    }
    setUser(mockUser)
    navigate(`/${role}/schedule`)
  }

  return (
    <div className="flex h-screen w-full bg-white">

      {/* Left Side Image — ✅ ruta corregida con import */}
      <div className="w-1/2 hidden lg:flex items-center justify-center bg-gradient-to-br from-blue-600 to-blue-900">
        <img
          className="w-full h-full object-cover"
          src={sidebarImage}
          alt="AuraHealth"
        />
      </div>



      
      {/* Right Side Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <form onSubmit={handleLogin} className="w-full max-w-md">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Bienvenido</h2>
            <p className="text-sm text-gray-600">Ingrese sus credenciales para poder acceder al sistema</p>
          </div>

          {/* Rol Selector */}
          <div className="mb-6">
            {/* ✅ htmlFor vinculado al id del select */}
            <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
              Selecciona tu rol:
            </label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value as UserRole)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            >
              <option value="patient">Paciente</option>
              <option value="doctor">Doctor</option>
              <option value="admin">Administrador</option>
            </select>
          </div>

          {/* Email Input */}
          <div className="mb-4">
            {/* ✅ htmlFor vinculado al id del input */}
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Correo electrónico
            </label>
            <div className="flex items-center px-4 py-3 border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-blue-500">
              <svg width="16" height="11" viewBox="0 0 16 11" fill="none">
                <path fillRule="evenodd" clipRule="evenodd" d="M0 .55.571 0H15.43l.57.55v9.9l-.571.55H.57L0 10.45zm1.143 1.138V9.9h13.714V1.69l-6.503 4.8h-.697zM13.749 1.1H2.25L8 5.356z" fill="#6B7280"/>
              </svg>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="correo@ejemplo.com"
                className="bg-transparent ml-2 outline-none text-gray-700 placeholder-gray-400 w-full text-sm"
                required
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="mb-6">
            {/* ✅ htmlFor vinculado al id del input */}
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Contraseña
            </label>
            <div className="flex items-center px-4 py-3 border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-blue-500">
              <svg width="13" height="17" viewBox="0 0 13 17" fill="none">
                <path d="M13 8.5c0-.938-.729-1.7-1.625-1.7h-.812V4.25C10.563 1.907 8.74 0 6.5 0S2.438 1.907 2.438 4.25V6.8h-.813C.729 6.8 0 7.562 0 8.5v6.8c0 .938.729 1.7 1.625 1.7h9.75c.896 0 1.625-.762 1.625-1.7zM4.063 4.25c0-1.406 1.093-2.55 2.437-2.55s2.438 1.144 2.438 2.55V6.8H4.061z" fill="#6B7280"/>
              </svg>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="bg-transparent ml-2 outline-none text-gray-700 placeholder-gray-400 w-full text-sm"
                required
              />
            </div>
          </div>

          {/* Remember & Forgot */}
          <div className="flex items-center justify-between mb-6 text-sm text-gray-600">
            <label className="flex items-center gap-2">
              <input type="checkbox" className="rounded" />
              Recuérdame
            </label>
            <a href="#" className="text-blue-600 hover:underline">¿Olvidaste tu contraseña?</a>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition mb-3"
          >
            Ingresar
          </button>

          <hr />

          {/* ✅ <p> reemplazado por <div> — HTML válido */}
          <div className="text-center mt-9">
            <p className="text-sm text-gray-600">¿Es su primera vez en AuraHealth?</p>
            <button
              type="button"
              onClick={() => navigate('/register')}
              className="w-full bg-gray-300 text-blue-700 py-2 rounded-lg font-bold hover:bg-gray-400 transition mt-4 flex items-center justify-center gap-1"
            >
              <User size={20} />
              Registrarte como Paciente
            </button>
          </div>

        </form>
      </div>
    </div>
  )
}