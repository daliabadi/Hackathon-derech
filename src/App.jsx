import { useState } from 'react'
import GameInhibition from './components/GameInhibition'
import AlienOrientation from './components/AlienOrientation'
import RecallThemAll from './components/RecallThemAll' 

function App() {
  const [mode, setMode] = useState(null)

  return (
    <div
      style={{
        height: '100vh',
        width: '100vw',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        direction: 'rtl',
        backgroundColor: '#1a1a1a',
      }}
    >
      <div style={{ textAlign: 'center' }}>
        {!mode && (
          <>
            <h1 style={{ color: 'white' }}>🎮 ברוכים הבאים למשחקי טוקי</h1>
            <p style={{ color: '#ccc', marginBottom: '20px' }}>בחרו משחק:</p>

            <div
              style={{
                display: 'flex',
                gap: '15px',
                flexWrap: 'wrap',
                justifyContent: 'center',
              }}
            >
              <button onClick={() => setMode('recall')} style={buttonStyle}>
                Recall Them All 🧠
              </button>

              <button onClick={() => setMode('alien')} style={buttonStyle}>
                AlienOrientation 👽
              </button>

              <button onClick={() => setMode('inhibition')} style={buttonStyle}>
                רק לא האדומים! 🟥
              </button>
            </div>
          </>
        )}

        {mode === 'inhibition' && <GameInhibition />}
        {mode === 'alien' && <AlienOrientation />}
        {mode === 'recall' && <RecallThemAll />}
      </div>
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
