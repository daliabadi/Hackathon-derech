import { useState } from 'react'
import GameInhibition from './components/GameInhibition'
import AlienOrientation from './components/AlienOrientation'
import RecallThemAll from './components/RecallThemAll' // ✅ הוספת המשחק החדש

function App() {
  const [mode, setMode] = useState(null)

  return (
    <div style={{ textAlign: 'center', padding: '40px', direction: 'rtl' }}>
      {!mode && (
        <>
          <h1>🎮 ברוכים הבאים למשחקי טוקי</h1>
          <p>בחרו משחק:</p>

          <button onClick={() => setMode('inhibition')} style={buttonStyle}>
            🟥 רק לא האדומים!
          </button>

          <button onClick={() => setMode('orientation')} style={buttonStyle}>
            👽 AlienOrientation
          </button>

          <button onClick={() => setMode('recall')} style={buttonStyle}>
            🧠 Recall Them All
          </button>
        </>
      )}

      {mode === 'inhibition' && <GameInhibition />}
      {mode === 'orientation' && <AlienOrientation />}
      {mode === 'recall' && <RecallThemAll />} {/* ✅ זה המשחק החדש */}
    </div>
  )
}

const buttonStyle = {
  padding: '10px 20px',
  fontSize: '18px',
  margin: '10px',
  backgroundColor: '#e0f0ff',
  borderRadius: '10px',
  border: '1px solid #ccc',
  cursor: 'pointer',
}

export default App
