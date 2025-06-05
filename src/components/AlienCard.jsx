// AlienCard.jsx
import React from 'react'

// ייבוא התמונות של החייזרים לפי צבע
import blueAlien from '../assets/blue_alien.png'
import greenAlien from '../assets/green_alien.png'
import orangeAlien from '../assets/orange_alien.png'
import pinkAlien from '../assets/pink_alien.png'

// מילון לקישור בין הצבעים לתמונות
const alienImages = {
  blue: blueAlien,
  green: greenAlien,
  orange: orangeAlien,
  pink: pinkAlien,
}

// קומפוננטת חייזר
const AlienCard = ({ color, orientation = 'normal', size = 150 }) => {
  const transform = orientation === 'flipped' ? 'rotate(180deg)' : 'none'

  return (
    <img
      src={alienImages[color]}
      alt={`alien-${color}`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        transform,
        transition: 'transform 0.3s ease',
      }}
    />
  )
}

export default AlienCard
