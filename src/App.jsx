import { useState, useEffect } from 'react'
import Auth from './components/Auth'
import TaskList from './components/TaskList'
import { LogOut, User } from 'lucide-react'

const API_URL = 'https://task-master-pro-api-v2kt.onrender.com/api'

function App() {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('token'))
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (token) {
      fetchUser()
    } else {
      setLoading(false)
    }
  }, [token])

  const fetchUser = async () => {
    try {
      const response = await fetch(`${API_URL}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const userData = await response.json()
        setUser(userData)
      } else {
        localStorage.removeItem('token')
        setToken(null)
      }
    } catch (error) {
      console.error('Error fetching user:', error)
      localStorage.removeItem('token')
      setToken(null)
    } finally {
      setLoading(false)
    }
  }

  const handleAuthSuccess = (authToken, userData) => {
    localStorage.setItem('token', authToken)
    setToken(authToken)
    setUser(userData)
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    setToken(null)
    setUser(null)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse-slow">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/30 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute top-1/2 -left-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
        <div className="absolute -bottom-40 right-1/3 w-80 h-80 bg-pink-500/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative z-10">
        {!user ? (
          <Auth onAuthSuccess={handleAuthSuccess} />
        ) : (
          <div className="container mx-auto px-4 py-8">
            {/* Header */}
            <div className="max-w-6xl mx-auto mb-8">
              <div className="glass rounded-2xl p-6 flex items-center justify-between animate-slide-up">
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    Task Master Pro
                  </h1>
                  <p className="text-white/60 mt-1">Organize your life, one task at a time</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="flex items-center gap-2 text-white/80">
                      <User size={20} />
                      <span className="font-medium">{user.name}</span>
                    </div>
                    <p className="text-sm text-white/50">{user.email}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="glass glass-hover px-4 py-2 rounded-xl flex items-center gap-2 text-white/80 hover:text-white"
                  >
                    <LogOut size={18} />
                    Logout
                  </button>
                </div>
              </div>
            </div>

            {/* Task List */}
            <TaskList token={token} />
          </div>
        )}
      </div>
    </div>
  )
}

export default App