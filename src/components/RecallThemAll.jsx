import { useEffect, useState } from 'react'
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

const RecallThemAll = () => {
  const [round, setRound] = useState(1)
  const [phase, setPhase] = useState('view')
  const [sequence, setSequence] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [responses, setResponses] = useState([])
  const [orderAnswers, setOrderAnswers] = useState([])
  const [showOrderFeedback, setShowOrderFeedback] = useState(false)

  const [matchResults, setMatchResults] = useState([])
  const [orderResults, setOrderResults] = useState([])

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
        if (prev + 1 >= newSeq.length) {
          clearInterval(interval)
          setTimeout(() => setPhase('match'), 1000)
        }
        return prev + 1
      })
    }, 2000)

    return () => clearInterval(interval)
  }, [round])

  const handleMatch = (color, selectedOrientation) => {
    const correct = sequence.find((alien) => alien.color === color)?.orientation
    const reactionTime = performance.now()
    const newResponse = { color, selectedOrientation, correct, reactionTime: (reactionTime / 1000).toFixed(2) }
    setResponses((prev) => [...prev, newResponse])
    setMatchResults((prev) => [...prev, newResponse])

    if (responses.length + 1 === sequence.length) {
      setTimeout(() => setPhase('order'), 1000)
    }
  }

  const handleOrder = (selectedColor) => {
    setOrderAnswers((prev) => {
      const newAnswers = [...prev, selectedColor]
      if (newAnswers.length === sequence.length) {
        setShowOrderFeedback(true)
        const result = {
          expected: sequence.map((s) => s.color),
          selected: newAnswers,
        }
        setOrderResults((prev) => [...prev, result])

        setTimeout(() => {
          if (round < TOTAL_ROUNDS) {
            setRound(round + 1)
          } else {
            setPhase('summary')
          }
        }, 2000)
      }
      return newAnswers
    })
  }

  if (phase === 'summary') {
    const totalCorrectMatches = matchResults.filter(r => r.selectedOrientation === r.correct).length
    const avgReactionTime = (matchResults.reduce((sum, r) => sum + parseFloat(r.reactionTime), 0) / matchResults.length).toFixed(2)
    const orderAccuracy = orderResults.map(({ expected, selected }) => {
      return expected.filter((color, i) => color === selected[i]).length
    })
    const totalOrderCorrect = orderAccuracy.reduce((a, b) => a + b, 0)

    return (
      <div style={{ textAlign: 'center' }}>
        <h1>✨ סיימת את המשחק!</h1>
        <p>כל הכבוד על ההשתתפות!</p>

        <h3>📊 ביצועים:</h3>
        <p>נכונים בשלב 2 (כיוונים): {totalCorrectMatches} מתוך {matchResults.length}</p>
        <p>זמן תגובה ממוצע: {avgReactionTime} שניות</p>
        <p>נכונים בשלב 3 (סדר): {totalOrderCorrect} מתוך {orderResults.length * 4}</p>
      </div>
    )
  }

  return (
    <div style={{ textAlign: 'center', direction: 'rtl', padding: '30px' }}>
      <h2>🎮 Recall Them All - שלב {round} מתוך {TOTAL_ROUNDS}</h2>

      {phase === 'view' && sequence[currentIndex] && (
        <>
          <p>הסתכל/י טוב!</p>
          <AlienCard {...sequence[currentIndex]} size={200} />
        </>
      )}

      {phase === 'match' && (
        <>
          <h3 style={{ color: 'white' }}>בחר את הכיוון של כל חייזר</h3>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '30px', marginTop: '20px' }}>
            {sequence.map(({ color }, index) => {
              const alreadySelected = responses.find((r) => r.color === color)
              const handleClick = (orientation) => {
                if (!alreadySelected) {
                  const correct = sequence.find((a) => a.color === color)?.orientation
                  const reactionTime = performance.now()
                  const newResponse = {
                    color,
                    selectedOrientation: orientation,
                    correct,
                    reactionTime: (reactionTime / 1000).toFixed(2),
                  }
                  setResponses((prev) => [...prev, newResponse])
                  setMatchResults((prev) => [...prev, newResponse])
                  if (responses.length + 1 === sequence.length) {
                    setTimeout(() => setPhase('order'), 1000)
                  }
                }
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
                          boxSizing: 'border-box',
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
                    if (!showOrderFeedback && !userPicked) {
                      handleOrder(color)
                    }
                  }}
                  style={{
                    cursor: showOrderFeedback || userPicked ? 'default' : 'pointer',
                    border: `4px solid ${borderColor}`,
                    borderRadius: '10px',
                    padding: '4px',
                    boxSizing: 'border-box',
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
  )
}

export default RecallThemAll
