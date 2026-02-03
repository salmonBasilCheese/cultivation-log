import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../supa-client'

export default function CropDetail() {
  const { cropId } = useParams()
  const navigate = useNavigate()
  
  const [crop, setCrop] = useState(null)
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)
  
  // Form State
  const [isAdding, setIsAdding] = useState(false)
  const [logDate, setLogDate] = useState(new Date().toISOString().split('T')[0])
  const [weather, setWeather] = useState('Sunny')
  const [temp, setTemp] = useState('')
  const [isWatered, setIsWatered] = useState(false)
  const [notes, setNotes] = useState('')
  const [selectedFile, setSelectedFile] = useState(null)
  const [uploading, setUploading] = useState(false)

  const [editingId, setEditingId] = useState(null)

  useEffect(() => {
    fetchCropAndLogs()
  }, [cropId])

  const fetchCropAndLogs = async () => {
    try {
      setLoading(true)
      // 1. Get Crop Details (Cover)
      const { data: cropData, error: cropError } = await supabase
        .from('crops')
        .select('*')
        .eq('id', cropId)
        .single()
      
      if (cropError) throw cropError
      setCrop(cropData)

      // 2. Get Logs (Pages)
      const { data: logsData, error: logsError } = await supabase
        .from('cultivation_logs')
        .select('*')
        .eq('crop_id', cropId)
        .order('log_date', { ascending: false }) // Newest first
      
      if (logsError) throw logsError
      setLogs(logsData)

    } catch (error) {
      console.error('Error:', error.message)
    } finally {
      setLoading(false)
    }
  }

  // 🗑️ Delete Log
  const handleDeleteLog = async (id) => {
    if (!window.confirm('Are you sure you want to delete this log?')) return

    try {
      const { error } = await supabase
        .from('cultivation_logs')
        .delete()
        .eq('id', id)

      if (error) throw error
      fetchCropAndLogs()
    } catch (error) {
      alert('Error deleting log: ' + error.message)
    }
  }

  // ✏️ Edit Log (Setup Form)
  const handleEditLog = (log) => {
    setEditingId(log.id)
    setLogDate(log.log_date)
    setWeather(log.weather || 'Sunny')
    setTemp(log.temperature !== null ? log.temperature : '')
    setIsWatered(log.is_watered)
    setNotes(log.notes || '')
    // Photo handling is tricky (we keep existing unless new one selected)
    setIsAdding(true) // Open form
  }

  const handleSaveLog = async (e) => {
    e.preventDefault()
    setUploading(true)

    try {
      let photoUrl = null

      // A. Upload Photo (if exists)
      if (selectedFile) {
        const fileExt = selectedFile.name.split('.').pop()
        const fileName = `${Math.random()}.${fileExt}`
        const filePath = `${cropId}/${fileName}`

        const { error: uploadError } = await supabase.storage
          .from('crop_images')
          .upload(filePath, selectedFile)

        if (uploadError) throw uploadError

        // Get Public URL
        const { data: { publicUrl } } = supabase.storage
          .from('crop_images')
          .getPublicUrl(filePath)
        
        photoUrl = publicUrl
      }

      // B. Database Operation
      const { data: { user } } = await supabase.auth.getUser()
      
      const payload = {
        crop_id: cropId,
        user_id: user.id, // 🔑 Sign for RLS
        log_date: logDate,
        weather,
        temperature: temp === '' ? null : parseFloat(temp),
        is_watered: isWatered,
        notes,
      }

      // Only update photo_url if a new photo was uploaded
      if (photoUrl) {
        payload.photo_url = photoUrl
      }

      let error
      if (editingId) {
        // UPDATE
        const { error: updateError } = await supabase
          .from('cultivation_logs')
          .update(payload)
          .eq('id', editingId)
        error = updateError
      } else {
        // INSERT
        const { error: insertError } = await supabase
          .from('cultivation_logs')
          .insert([payload])
        error = insertError
      }

      if (error) throw error

      // Reset & Refresh
      setIsAdding(false)
      setEditingId(null) // Clear edit mode
      setNotes('')
      setTemp('') 
      setSelectedFile(null)
      fetchCropAndLogs()

    } catch (error) {
      alert('Error saving log: ' + error.message)
    } finally {
      setUploading(false)
    }
  }

  const cancelEdit = () => {
    setIsAdding(false)
    setEditingId(null)
    setNotes('')
    setTemp('')
    setSelectedFile(null)
  }

  if (loading) return <div style={{padding:'2rem', textAlign:'center'}}>Loading...</div>
  if (!crop) return <div style={{padding:'2rem'}}>Crop not found</div>

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
        <button 
          onClick={() => navigate('/')} 
          style={{ background:'none', border:'none', fontSize:'1.5rem', cursor:'pointer' }}
        >
          ←
        </button>
        <h1 style={{ margin: 0, fontSize: '1.5rem' }}>{crop.emoji} {crop.name}</h1>
      </div>

      {/* Add Log Button */}
      {!isAdding && (
        <button 
          className="btn-primary" 
          style={{ width: '100%', marginBottom: '1rem' }}
          onClick={() => {
            setEditingId(null) // Ensure fresh start
            setLogDate(new Date().toISOString().split('T')[0])
            setTemp('')
            setNotes('')
            setIsAdding(true)
          }}
        >
          📝 Write Diary
        </button>
      )}

      {/* Add/Edit Log Form */}
      {isAdding && (
        <form onSubmit={handleSaveLog} className="card" style={{ marginBottom: '2rem', border: '2px solid var(--color-primary)' }}>
          <h3 style={{ marginTop: 0 }}>{editingId ? 'Edit Entry' : 'New Entry'}</h3>
          
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display:'block', fontSize:'0.9rem', color:'var(--color-text-sub)' }}>Date</label>
            <input 
              type="date" 
              required 
              value={logDate} 
              onChange={e => setLogDate(e.target.value)}
              style={{ width:'100%', padding:'0.5rem', borderRadius:'8px', border:'1px solid #ddd' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <label style={{ display:'block', fontSize:'0.9rem', color:'var(--color-text-sub)' }}>Weather</label>
              <select 
                value={weather} 
                onChange={e => setWeather(e.target.value)}
                style={{ width:'100%', padding:'0.5rem', borderRadius:'8px', border:'1px solid #ddd' }}
              >
                <option>Sunny</option>
                <option>Cloudy</option>
                <option>Rainy</option>
                <option>Windy</option>
              </select>
            </div>
            <div>
              <label style={{ display:'block', fontSize:'0.9rem', color:'var(--color-text-sub)' }}>Temp (°C)</label>
              <input 
                type="number" 
                value={temp} 
                onChange={e => setTemp(e.target.value)}
                placeholder="25"
                onWheel={(e) => e.target.blur()} // 🛑 Prevent mouse wheel from changing value
                style={{ width:'100%', padding:'0.5rem', borderRadius:'8px', border:'1px solid #ddd' }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '1rem', display:'flex', alignItems:'center', gap:'0.5rem' }}>
            <input 
              type="checkbox" 
              id="watered" 
              checked={isWatered} 
              onChange={e => setIsWatered(e.target.checked)}
              style={{ width:'20px', height:'20px' }}
            />
            <label htmlFor="watered">Did you water it? 💧</label>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display:'block', fontSize:'0.9rem', color:'var(--color-text-sub)' }}>Photo</label>
            {editingId && <div style={{fontSize:'0.8rem', color:'#666', marginBottom:'4px'}}>*(Leave empty to keep current photo)*</div>}
            <input 
              type="file" 
              accept="image/*"
              onChange={e => setSelectedFile(e.target.files[0])}
              style={{ width:'100%' }}
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display:'block', fontSize:'0.9rem', color:'var(--color-text-sub)' }}>Notes</label>
            <textarea 
              value={notes} 
              onChange={e => setNotes(e.target.value)}
              rows="3"
              style={{ width:'100%', padding:'0.5rem', borderRadius:'8px', border:'1px solid #ddd' }}
              placeholder="Grew 2cm today!"
            />
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
            <button 
              type="button" 
              onClick={cancelEdit}
              style={{ padding:'0.5rem 1rem', background:'none', border:'none', cursor:'pointer', color:'#666' }}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn-primary" 
              disabled={uploading}
            >
              {uploading ? 'Saving...' : (editingId ? 'Update Entry' : 'Save Entry')}
            </button>
          </div>
        </form>
      )}

      {/* Timeline */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {logs.map(log => (
          <div key={log.id} className="card" style={{ position: 'relative', overflow: 'hidden' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize:'0.9rem', color:'var(--color-text-sub)' }}>
              <span>📅 {log.log_date}</span>
              <span>
                {log.weather === 'Sunny' && '☀️'}
                {log.weather === 'Cloudy' && '☁️'}
                {log.weather === 'Rainy' && '☔'}
                {log.weather === 'Windy' && '🍃'}
                <span style={{ marginLeft: '8px' }}>
                  {log.temperature !== null ? `${log.temperature}°C` : <span style={{opacity:0.5}}>--°C</span>}
                </span>
              </span>
            </div>
            
            {log.photo_url && (
              <div style={{ margin: '0 -1rem 1rem -1rem', maxHeight: '300px', overflow: 'hidden' }}>
                <img src={log.photo_url} alt="Log" style={{ width: '100%', objectFit: 'cover' }} />
              </div>
            )}

            <p style={{ whiteSpace: 'pre-wrap', margin: '0 0 0.5rem 0' }}>{log.notes}</p>
            
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
              {log.is_watered ? (
                <div style={{ 
                  display: 'inline-block', 
                  background: '#e0f2fe', 
                  color: '#0284c7', 
                  padding: '0.2rem 0.6rem', 
                  borderRadius: '99px', 
                  fontSize: '0.8rem',
                  fontWeight: '600'
                }}>
                  Watered 💧
                </div>
              ) : <div></div>}
              
              <div style={{ display: 'flex', gap: '8px' }}>
                <button 
                  onClick={() => handleEditLog(log)}
                  style={{ background:'none', border:'none', cursor:'pointer', fontSize:'0.9rem', padding:'4px', opacity: 0.6 }}
                  title="Edit"
                >
                  ✏️
                </button>
                <button 
                  onClick={() => handleDeleteLog(log.id)}
                  style={{ background:'none', border:'none', cursor:'pointer', fontSize:'0.9rem', padding:'4px', opacity: 0.6 }}
                  title="Delete"
                >
                  🗑️
                </button>
              </div>
            </div>
          </div>
        ))}

        {logs.length === 0 && !isAdding && (
          <div style={{ textAlign: 'center', color: 'var(--color-text-sub)', padding: '2rem' }}>
            No logs yet. Start writing!
          </div>
        )}
      </div>
    </div>
  )
}
