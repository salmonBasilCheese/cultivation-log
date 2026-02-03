import { Outlet, NavLink } from 'react-router-dom'
import { useAuth } from '../AuthProvider'

export default function Layout() {
  const { session } = useAuth()
  
  // Style for the active link (visual feedback)
  const navStyle = ({ isActive }) => ({
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textDecoration: 'none',
    color: isActive ? 'var(--color-primary)' : 'var(--color-text-sub)',
    fontWeight: isActive ? '600' : '400',
    fontSize: '0.8rem',
    gap: '4px',
    transition: 'color 0.2s ease'
  })

  return (
    <div style={{ paddingBottom: '80px' /* Space for bottom nav */ }}>
      {/* Header */}
      <header style={{
        padding: '1rem',
        borderBottom: '1px solid #eee',
        background: 'rgba(255,255,255,0.8)',
        backdropFilter: 'blur(10px)',
        position: 'sticky',
        top: 0,
        zIndex: 10,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <h1 style={{ margin: 0, fontSize: '1.2rem' }}>🌱 Cultivation Log</h1>
        <div style={{ 
          width: '32px', 
          height: '32px', 
          borderRadius: '50%', 
          overflow: 'hidden', 
          border: '2px solid var(--color-accent)' 
        }}>
          {session?.user?.user_metadata?.avatar_url && (
            <img 
              src={session.user.user_metadata.avatar_url} 
              alt="User" 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          )}
        </div>
      </header>

      {/* Main Content Area */}
      <main style={{ padding: '1rem', maxWidth: '800px', margin: '0 auto' }}>
        <Outlet />
      </main>

      {/* Mobile Bottom Navigation */}
      <nav style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: '64px',
        backgroundColor: 'var(--color-bg-card)',
        borderTop: '1px solid #eee',
        display: 'flex',
        justifyContent: 'space-around',
        zIndex: 100,
        boxShadow: '0 -2px 10px rgba(0,0,0,0.05)'
      }}>
        <NavLink to="/" style={navStyle} end>
          <span style={{ fontSize: '1.2rem' }}>🌿</span>
          Crops
        </NavLink>
        <NavLink to="/add" style={navStyle}>
          <span style={{ fontSize: '1.2rem' }}>📷</span>
          Record
        </NavLink>
        <NavLink to="/settings" style={navStyle}>
          <span style={{ fontSize: '1.2rem' }}>⚙️</span>
          Settings
        </NavLink>
      </nav>
    </div>
  )
}
