import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { AuthProvider, useAuth } from './AuthProvider'
import { supabase } from './supa-client'
import Login from './Login'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import CropDetail from './pages/CropDetail'

// 🔐 Secure Route Wrapper
// Only lets users in if they have a session
const PrivateRoute = () => {
  const { user } = useAuth()
  return user ? <Outlet /> : <Navigate to="/login" replace />
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route element={<PrivateRoute />}>
            <Route element={<Layout />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/crops/:cropId" element={<CropDetail />} />
              <Route path="/add" element={<div className="card">Coming Soon: Camera Feature</div>} />
              <Route path="/settings" element={
                <div className="card">
                  <h2>Settings</h2>
                  <p style={{marginBottom: '1rem'}}>Manage your account and preferences.</p>
                  <button 
                    className="btn-primary" 
                    style={{backgroundColor: 'var(--color-text-sub)'}}
                    onClick={() => supabase.auth.signOut()}
                  >
                    Sign Out
                  </button>
                </div>
              } />
            </Route>
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  )
}

export default App
