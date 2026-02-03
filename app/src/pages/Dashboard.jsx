import { useEffect, useState } from 'react'
import { supabase } from '../supa-client'
import { Link } from 'react-router-dom'

export default function Dashboard() {
  const [crops, setCrops] = useState([])
  const [loading, setLoading] = useState(true)
  const [isCreating, setIsCreating] = useState(false)
  const [newCropName, setNewCropName] = useState('')

  // 🌱 Load the "Album Shelf"
  useEffect(() => {
    fetchCrops()
  }, [])

  const fetchCrops = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('crops')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      setCrops(data)
    } catch (error) {
      console.error('Error fetching crops:', error.message)
    } finally {
      setLoading(false)
    }
  }

  // 📝 Create a new "Album"
  const handleCreateCrop = async (e) => {
    e.preventDefault()
    if (!newCropName.trim()) return

    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      const { error } = await supabase
        .from('crops')
        .insert([{ 
          name: newCropName, 
          emoji: '🌱',
          user_id: user.id // 🔑 Must sign our name for RLS!
        }]) 

      if (error) throw error
      
      setNewCropName('')
      setIsCreating(false)
      fetchCrops() // Refresh the shelf
    } catch (error) {
      alert('Error creating crop: ' + error.message)
    }
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h2>My Crops</h2>
        <button 
          onClick={() => setIsCreating(!isCreating)} 
          className="btn-primary"
          style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}
        >
          {isCreating ? 'Cancel' : '+ New Crop'}
        </button>
      </div>

      {/* Basic "Add Crop" Form - Appearing like a drawer */}
      {isCreating && (
        <form onSubmit={handleCreateCrop} className="card" style={{ marginBottom: '1.5rem', animation: 'fadeIn 0.3s' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Name your crop</label>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <input 
              type="text" 
              value={newCropName}
              onChange={(e) => setNewCropName(e.target.value)}
              placeholder="e.g., Mini Tomato"
              style={{ 
                flex: 1, 
                padding: '0.8rem', 
                borderRadius: '8px', 
                border: '1px solid #ddd',
                fontSize: '1rem' 
              }}
              autoFocus
            />
            <button type="submit" className="btn-primary">Add</button>
          </div>
        </form>
      )}

      {loading ? (
        <p>Loading your green friends...</p>
      ) : crops.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem 1rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🍃</div>
          <h3>No crops yet</h3>
          <p style={{ color: 'var(--color-text-sub)' }}>Start your cultivation journey by adding your first crop.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '1rem' }}>
          {crops.map((crop) => (
            <Link 
              to={`/crops/${crop.id}`} 
              key={crop.id} 
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <div className="card" style={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                textAlign: 'center',
                transition: 'transform 0.2s',
                cursor: 'pointer'
              }}>
                <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>{crop.emoji}</div>
                <div style={{ fontWeight: '600', fontSize: '1.1rem' }}>{crop.name}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--color-text-sub)', marginTop: 'auto', paddingTop: '0.5rem' }}>
                  Started {new Date(crop.created_at).toLocaleDateString()}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
