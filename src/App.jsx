import { useState } from 'react'
import GameInhibition from './components/GameInhibition'
import AlienOrientation from './components/AlienOrientation'
import RecallThemAll from './components/RecallThemAll'

function App() {
  const [mode, setMode] = useState(null)

  if (mode === 'inhibition') return <GameInhibition />
  if (mode === 'alien') return <AlienOrientation />
  if (mode === 'recall') return <RecallThemAll onExit={() => setMode(null)} />

  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100vw',
        direction: 'rtl',
        fontFamily: 'Varela Round, Alef, sans-serif',
        color: '#333',
        padding: '40px 20px',
        boxSizing: 'border-box',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        position: 'relative',
        backgroundImage: 'url("/space_bgrnd.png")',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
      }}
    >
      {/* Light overlay */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          backgroundColor: 'rgba(6, 16, 24, 0.89)',
          zIndex: 0,
        }}
      />

      {/* 👤 Username box */}
      <div
        style={{
          position: 'absolute',
          top: '40px',
          left: '100px',
          backgroundColor: '#ffffffcc',
          color: '#004d40',
          padding: '10px 20px',
          borderRadius: '20px',
          fontSize: '18px',
          fontWeight: 'bold',
          zIndex: 2,
        }}
      > <div>מחובר לפרופיל של: רייצ'ל גרין 🚀</div>
        <div>🕒 סשן אחרון לפני: 12 יום</div>
        <div>🎂 קבוצת גיל: 6-5</div>
        <div>🏫 גן: שקד</div>
       </div>
   
      {/* Main content */}
      <div
        style={{
          maxWidth: '800px',
          width: '100%',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <h1 style={{ fontSize: '38px', color: '#b6e8ff', marginBottom: '30px' }}>
           💫ברוכים הבאים לגלקסיה שלנו,
        </h1>

        <p style={{ fontSize: '32px', color: '#b6e8ff', marginBottom: '30px' }}>
          אפי החייזר מחכה לכם!
        </p>

        <GameCard
          title="🔁 זיכרון חזותי בסדר מופתי"
          description="צפו בחייזרים וחזרו על סדר הצבעים שבו הופיעו!"
          onClick={() => setMode('recall')}
        />

        <GameCard
          title="👀 שימו לב לכיוון"
          description="לחצו על החייזר לפי הכיוון שבו הופיע."
          onClick={() => setMode('alien')}
        />

        <GameCard
          title="🟥 רק לא האדומים!"
          description="טוקי אוהב רק את הכוכבים הכחולים – הימנעו מהאדומים!"
          onClick={() => setMode('inhibition')}
        />
      </div>
    </div>
  )
}

const GameCard = ({ title, description, onClick }) => (
  <div
    style={{
      backgroundColor: '#ffe9ae',
      padding: '24px',
      borderRadius: '20px',
      marginBottom: '20px',
      textAlign: 'center',
      boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
    }}
  >
    <h3 style={{ fontSize: '32px', margin: '0 0 10px', color: '#00796b' }}>{title}</h3>
    <p style={{ fontSize: '25px', marginBottom: '16px', color: '#555' }}>{description}</p>
    <button
      onClick={onClick}
      style={{
        backgroundColor: '#4dd0e1',
        color: '#004d40',
        padding: '10px 20px',
        border: 'none',
        borderRadius: '30px',
        cursor: 'pointer',
        fontSize: '20px',
        fontWeight: 'bold',
        boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
      }}
    >
      🎲 שחק עכשיו
    </button>
  </div>
)

export default App
