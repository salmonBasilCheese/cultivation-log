import { useState } from 'react'
import { supabase } from './supa-client'

export default function Login() {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleGoogleLogin = async () => {
    try {
      setLoading(true)
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin
        }
      })
      if (error) throw error
    } catch (error) {
      setMessage('Login failed: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      height: '80vh',
      padding: '1rem'
    }}>
      <div className="card" style={{ maxWidth: '400px', width: '100%', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🌱</h1>
        <h1>Cultivation Log</h1>
        <p style={{ color: 'var(--color-text-sub)', marginBottom: '2rem' }}>
          Record the growth of your green friends.
        </p>

        {message && (
          <div style={{ 
            backgroundColor: '#fee2e2', 
            color: '#b91c1c', 
            padding: '0.75rem', 
            borderRadius: '8px',
            marginBottom: '1rem',
            fontSize: '0.9rem' 
          }}>
            {message}
          </div>
        )}

        <button 
          className="btn-primary" 
          onClick={handleGoogleLogin} 
          disabled={loading}
          style={{ width: '100%', justifyContent: 'center', gap: '10px' }}
        >
          {loading ? 'Please wait...' : 'Continue with Google'}
        </button>
      </div>
    </div>
  )
}
