import { useState } from 'react'

function App() {
  const [selected, setSelected] = useState(null)
  const correctAnswer = 'מים'
  const options = ['מים', 'ספר', 'סוס']

  return (
    <div style={{ textAlign: 'center', marginTop: '100px', direction: 'rtl' }}>
      <h1>השלם את המשפט:</h1>
      <p style={{ fontSize: '24px' }}>הילדה שותה ___</p>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '20px' }}>
        {options.map(option => (
          <button
            key={option}
            onClick={() => setSelected(option)}
            style={{
              padding: '10px 20px',
              fontSize: '18px',
              cursor: 'pointer',
              backgroundColor: '#f0f0f0',
              border: '1px solid #ccc',
              borderRadius: '10px'
            }}
          >
            {option}
          </button>
        ))}
      </div>

      {selected && (
        <div style={{ marginTop: '30px', fontSize: '20px' }}>
          {selected === correctAnswer ? '✅ תשובה נכונה!' : '❌ נסה שוב'}
        </div>
      )}
    </div>
  )
}

export default App
