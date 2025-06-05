// GameInhibition.jsx
import React, { useState, useEffect } from 'react'
import FallingStar from './FallingStar'

const generateRandomStar = () => {
  const colors = ['blue', 'red']
  const color = colors[Math.floor(Math.random() * 2)]
  const x = Math.floor(Math.random() * window.innerWidth * 0.8)
  return {
    id: Date.now() + Math.random(),
    color,
    x,
    appearedAt: Date.now(),
  }
}

const GameInhibition = () => {
  const [stars, setStars] = useState([])
  const [results, setResults] = useState([])
  const [gameOver, setGameOver] = useState(false)

  useEffect(() => {
    const gameDuration = 30000 // 30 seconds
    const startTime = Date.now()

    const starInterval = setInterval(() => {
      if (Date.now() - startTime > gameDuration) {
        clearInterval(starInterval)
        setGameOver(true)
        return
      }

      const newStar = generateRandomStar()
      setStars(prev => [...prev, newStar])

      // Remove after 3s if not clicked
      setTimeout(() => {
        setStars(prev => prev.filter(s => s.id !== newStar.id))
      }, 3000)
    }, 1000)

    return () => clearInterval(starInterval)
  }, [])

  const handleStarClick = (id) => {
    const clickedStar = stars.find(s => s.id === id)
    if (!clickedStar) return

    const clickedAt = Date.now()
    const reactionTime = (clickedAt - clickedStar.appearedAt) / 1000

    setResults(prev => [
      ...prev,
      {
        ...clickedStar,
        clickedAt,
        reactionTime,
        isCorrect: clickedStar.color === 'blue',
      },
    ])

    setStars(prev => prev.filter(s => s.id !== id))
  }

  return (
    <div style={{ position: 'relative', width: '100%', height: '100vh', overflow: 'hidden' }}>
      {!gameOver && <p style={{ textAlign: 'center', fontSize: '20px' }}>טוקי אוהב רק כחולים! האדומים עלולים לפוצץ את בלון המשאלות!</p>}

      {stars.map(star => (
        <FallingStar key={star.id} {...star} onClick={handleStarClick} />
      ))}

      {gameOver && (
        <div style={{ textAlign: 'center', marginTop: '100px' }}>
          <h2>סיום!</h2>
          <p>כחולים נכונים: {results.filter(r => r.isCorrect).length}</p>
          <p>לחיצות שגויות (על אדומים): {results.filter(r => !r.isCorrect).length}</p>
          <p>זמן תגובה ממוצע: {
            results.length > 0
              ? (results.reduce((sum, r) => sum + r.reactionTime, 0) / results.length).toFixed(2)
              : 0
          } שניות</p>
        </div>
      )}
    </div>
  )
}

export default GameInhibition
    