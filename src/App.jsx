import { useState } from 'react'
import GameInhibition from './components/GameInhibition' // המשחק “רק לא האדומים”
import './App.css'

function App() {
  const [mode, setMode] = useState(null) // null | 'inhibition'

  return (
    <div style={{ textAlign: 'center', direction: 'rtl', padding: '30px' }}>
      {!mode && (
        <>
          <h1>ברוכים הבאים לטוקי!</h1>
          <p>בחרו משחק להתחלה:</p>
          <button onClick={() => setMode('inhibition')} style={buttonStyle}>
            🟥 רק לא האדומים!
          </button>
          {/* אפשר להוסיף בעתיד משחקים נוספים */}
        </>
      )}

      {mode === 'inhibition' && <GameInhibition />}
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
