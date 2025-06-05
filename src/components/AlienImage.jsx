import alienSrc from '../assets/alien_noback.png'

const AlienImage = ({ orientation = 'normal', size = 150 }) => {
  let transform = ''

  switch (orientation) {
    case 'mirror':
      transform = 'scaleX(-1)'
      break
    case 'rotate90':
      transform = 'rotate(90deg)'
      break
    case 'rotate180':
      transform = 'rotate(180deg)'
      break
    default:
      transform = 'none'
  }

  return (
    <img
      src={alienSrc}
      alt="alien"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        transform,
        transition: 'transform 0.3s ease',
      }}
    />
  )
}

export default AlienImage
