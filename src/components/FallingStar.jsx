// FallingStar.jsx
import React from 'react'

const FallingStar = ({ id, color, x, onClick }) => {
  return (
    <div
      onClick={() => onClick(id)}
      style={{
        position: 'absolute',
        top: 0,
        left: `${x}px`,
        fontSize: '40px',
        animation: 'fall 5s linear forwards',
        cursor: 'pointer',
        userSelect: 'none',
      }}
    >
      {color === 'blue' ? '⭐' : '❌'}
    </div>
  )
}

export default FallingStar
