import { useEffect, useState } from 'react'
import AlienImage from './AlienImage'

const orientations = ['normal', 'mirror', 'rotate90', 'rotate180']

const AlienOrientation = () => {
  const [phase, setPhase] = useState('show')
  const [correctOrientation, setCorrectOrientation] = useState(null)
  const [options, setOptions] = useState([])
  const [startTime, setStartTime] = useState(null)
  const [selected, setSelected] = useState(null)
  const [reactionTime, setReactionTime] = useState(null)

  useEffect(() => {
    const chosen = orientations[Math.floor(Math.random() * orientations.length)]
    setCorrectOrientation(chosen)

    const shuffled = [...orientations].sort(() => Math.random() - 0.5)
    if (!shuffled.includes(chosen)) shuffled[0] = chosen
    setOptions(shuffled)

    const timer = setTimeout(() => {
      setPhase('choose')
      setStartTime(Date.now())
    }, 6000)

    return () => clearTimeout(timer)
  }, [])

  const handleSelect = (orientation) => {
    const time = (Date.now() - startTime) / 1000
    setSelected(orientation)
    setReactionTime(time)
    setPhase('result')
  }

  return (
    <div style={{ textAlign: 'center', padding: '40px', direction: 'rtl' }}>
      <h1>👽 AlienOrientation</h1>

      {phase === 'show' && (
        <>
          <h2>תסתכלו טוב על טוקי!</h2>
          <AlienImage orientation={correctOrientation} size={200} />
        </>
      )}

      {phase === 'choose' && (
        <>
          <h2>איזה טוקי ראית קודם?</h2>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap' }}>
            {options.map((opt, i) => (
              <div key={i} onClick={() => handleSelect(opt)} style={{ cursor: 'pointer' }}>
                <AlienImage orientation={opt} size={100} />
              </div>
            ))}
          </div>
        </>
      )}

      {phase === 'result' && (
        <>
          <h2>{selected === correctOrientation ? '✅ כל הכבוד!' : '❌ נסה שוב בפעם הבאה'}</h2>
          <p>בחירה שלך: {selected}</p>
          <p>הכיוון הנכון היה: {correctOrientation}</p>
          <p>זמן תגובה: {reactionTime.toFixed(2)} שניות</p>
        </>
      )}
    </div>
  )
}

export default AlienOrientation
