import { useEffect, useState, useRef } from 'react'
import AlienCard from './AlienCard'

const alienColors = ['blue', 'green', 'pink', 'orange']
const orientations = ['normal', 'flipped']

const getSequenceLength = (round) => {
  if (round === 1) return 2
  if (round === 2) return 3
  return 4
}

const generateSequence = (length) => {
  const shuffledColors = [...alienColors].sort(() => Math.random() - 0.5)
  return Array.from({ length }).map((_, i) => ({
    color: shuffledColors[i % shuffledColors.length],
    orientation: orientations[Math.floor(Math.random() * orientations.length)],
  }))
}

const TOTAL_ROUNDS = 3

const RecallThemAll = ({ onExit }) => {
  const [round, setRound] = useState(1)
  const [phase, setPhase] = useState('view')
  const [sequence, setSequence] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)

  const [responses, setResponses] = useState([])
  const [orderAnswers, setOrderAnswers] = useState([])
  const [showOrderFeedback, setShowOrderFeedback] = useState(false)

  const [matchResults, setMatchResults] = useState([])
  const [orderResults, setOrderResults] = useState([])

  const [matchScore, setMatchScore] = useState(0)
  const [orderScore, setOrderScore] = useState(0)

  const [reactionTimes, setReactionTimes] = useState([])
  const matchPhaseStartTime = useRef(null)

  const sequenceLength = getSequenceLength(round)

  useEffect(() => {
    const newSeq = generateSequence(sequenceLength)
    setSequence(newSeq)
    setCurrentIndex(0)
    setPhase('view')
    setResponses([])
    setOrderAnswers([])
    setShowOrderFeedback(false)

    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        const next = prev + 1

        if (next >= newSeq.length) {
          clearInterval(interval)
          setTimeout(() => {
            matchPhaseStartTime.current = performance.now()
            setPhase('match')
          }, 1000)
        }

        return next
      })
    }, 2000)

    return () => clearInterval(interval)
  }, [round])

  const handleMatch = (color, selectedOrientation) => {
    const correct = sequence.find((alien) => alien.color === color)?.orientation
    const reactionTime = ((performance.now() - matchPhaseStartTime.current) / 1000).toFixed(2)
    setReactionTimes((prev) => [...prev, parseFloat(reactionTime)])

    const newResponse = { color, selectedOrientation, correct, reactionTime }
    setResponses((prev) => [...prev, newResponse])
    setMatchResults((prev) => [...prev, newResponse])

    if (responses.length + 1 === sequence.length) {
      const allCorrect = [...responses, newResponse].every(r => r.selectedOrientation === r.correct)
      if (allCorrect) setMatchScore(prev => prev + 1)

      setTimeout(() => setPhase('order'), 1000)
    }
  }

  const handleOrder = (selectedColor) => {
    setOrderAnswers((prev) => {
      const newAnswers = [...prev, selectedColor]

      if (newAnswers.length === sequence.length && !showOrderFeedback) {
        setShowOrderFeedback(true)

        const expected = sequence.map((s) => s.color)
        const selected = newAnswers
        const result = { expected, selected }

        setOrderResults((prev) => [...prev, result])

        const allCorrect = expected.every((color, i) => color === selected[i])
        if (allCorrect) setOrderScore((prev) => prev + 1)

        setTimeout(() => {
          if (round < TOTAL_ROUNDS) setRound(round + 1)
          else setPhase('summary')
        }, 2000)
      }

      return newAnswers
    })
  }

  if (phase === 'summary') {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        width: '100vw',
        backgroundColor: '#0a0513',
        direction: 'rtl',
        padding: '30px',
        boxSizing: 'border-box',
      }}>
        <div style={{ textAlign: 'center', color: 'white' }}>
          <h1>✨ סיימת את המשחק!</h1>
          <p>כל הכבוד על ההשתתפות!</p>
          <h3>📊 ביצועים:</h3>
          <p>תשובות נכונות (כיוונים): {matchScore} מתוך {TOTAL_ROUNDS}</p>
          <p>תשובות נכונות (סדר): {orderScore} מתוך {TOTAL_ROUNDS}</p>
          <p>זמן תגובה ממוצע: {
            reactionTimes.length
              ? (reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length).toFixed(2)
              : '—'
          } שניות</p>

          <button onClick={onExit} style={{
            marginTop: '30px',
            padding: '10px 24px',
            fontSize: '18px',
            backgroundColor: '#dde0ff',
            color: '#000066',
            border: 'none',
            borderRadius: '10px',
            cursor: 'pointer'
          }}>
            🔙 חזרה לתפריט הראשי
          </button>
        </div>
      </div>
    )
  }

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        height: '100vh',
        width: '100vw',
        backgroundColor: '#0a0513',
        direction: 'rtl',
        padding: '30px',
        boxSizing: 'border-box',
      }}
    >
      <div style={{ textAlign: 'center', width: '100%', maxWidth: '800px', color: 'white' }}>
        {phase !== 'summary' && (
          <button
            onClick={() => setPhase('summary')}
            style={{
              position: 'absolute',
              top: '20px',
              left: '20px',
              padding: '8px 16px',
              fontSize: '16px',
              backgroundColor: '#ffcccc',
              color: '#660000',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              zIndex: 10,
            }}
          >
            דלג לסיכום
          </button>
        )}

        <h2>🎮 Recall Them All - שלב {round} מתוך {TOTAL_ROUNDS}</h2>

        {phase === 'view' && sequence[currentIndex] && (
          <>
            <p>הסתכל/י טוב!</p>
            <AlienCard {...sequence[currentIndex]} size={200} />
          </>
        )}

        {phase === 'match' && (
          <>
            <h3>בחר את הכיוון של כל חייזר</h3>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '30px', marginTop: '20px' }}>
              {sequence.map(({ color }, index) => {
                const alreadySelected = responses.find((r) => r.color === color)

                const handleClick = (orientation) => {
                  if (!alreadySelected) handleMatch(color, orientation)
                }

                const selected = alreadySelected?.selectedOrientation
                const correct = alreadySelected?.correct

                return (
                  <div key={index} style={{ display: 'flex', gap: '20px' }}>
                    {['normal', 'flipped'].map((orientation) => {
                      let borderColor = 'transparent'
                      if (selected === orientation) {
                        borderColor = selected === correct ? 'green' : 'red'
                      } else if (correct === orientation && selected && selected !== correct) {
                        borderColor = 'green'
                      }

                      return (
                        <div
                          key={orientation}
                          onClick={() => handleClick(orientation)}
                          style={{
                            border: `4px solid ${borderColor}`,
                            borderRadius: '10px',
                            padding: '4px',
                            width: '140px',
                            height: '140px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: alreadySelected ? 'default' : 'pointer',
                          }}
                        >
                          <AlienCard color={color} orientation={orientation} size={120} />
                        </div>
                      )
                    })}
                  </div>
                )
              })}
            </div>
          </>
        )}

        {phase === 'order' && (
          <>
            <h3>באיזה סדר הופיעו החייזרים לפי הצבע?</h3>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap' }}>
              {alienColors.map((color) => {
                const indexInAnswer = orderAnswers.indexOf(color)
                const correctIndex = sequence.findIndex((s) => s.color === color)
                const userPicked = indexInAnswer !== -1

                let borderColor = 'transparent'
                let labelNumber = ''

                if (showOrderFeedback && correctIndex !== -1) {
                  borderColor = 'green'
                  labelNumber = correctIndex + 1
                } else if (userPicked) {
                  borderColor = '#3399ff'
                  labelNumber = indexInAnswer + 1
                }

                return (
                  <div
                    key={color}
                    onClick={() => {
                      if (!showOrderFeedback && !userPicked) handleOrder(color)
                    }}
                    style={{
                      cursor: showOrderFeedback || userPicked ? 'default' : 'pointer',
                      border: `4px solid ${borderColor}`,
                      borderRadius: '10px',
                      padding: '4px',
                      width: '120px',
                      height: '120px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      position: 'relative',
                    }}
                  >
                    <AlienCard color={color} orientation="normal" size={100} />
                    {labelNumber && (
                      <div
                        style={{
                          position: 'absolute',
                          top: '4px',
                          left: '4px',
                          backgroundColor: borderColor,
                          color: 'white',
                          borderRadius: '50%',
                          width: '24px',
                          height: '24px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '14px',
                          fontWeight: 'bold',
                        }}
                      >
                        {labelNumber}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default RecallThemAll
