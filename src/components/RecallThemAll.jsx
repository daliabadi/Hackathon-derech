import { useEffect, useState } from 'react';
import AlienCard from './AlienCard';

const alienColors = ['blue', 'green', 'pink', 'orange'];
const orientations = ['normal', 'flipped'];

const getSequenceLength = (round) => {
  if (round <= 2) return 2;
  if (round <= 4) return 3;
  return 4;
};

const generateSequence = (length) => {
  const shuffledColors = [...alienColors].sort(() => Math.random() - 0.5);
  return Array.from({ length }).map((_, i) => ({
    color: shuffledColors[i % shuffledColors.length],
    orientation: orientations[Math.floor(Math.random() * orientations.length)],
  }));
};

const RecallThemAll = () => {
  const [round, setRound] = useState(1);
  const [phase, setPhase] = useState('view'); // 'view' | 'match' | 'order' | 'summary'
  const [sequence, setSequence] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [responses, setResponses] = useState([]);
  const [orderAnswers, setOrderAnswers] = useState([]);

  const sequenceLength = getSequenceLength(round);

  useEffect(() => {
    const newSeq = generateSequence(sequenceLength);
    setSequence(newSeq);
    setCurrentIndex(0);
    setPhase('view');

    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        if (prev + 1 >= newSeq.length) {
          clearInterval(interval);
          setTimeout(() => setPhase('match'), 1000);
        }
        return prev + 1;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [round]);

  const handleMatch = (color, selectedOrientation) => {
    const correct = sequence.find((alien) => alien.color === color)?.orientation;
    setResponses((prev) => [...prev, { color, selectedOrientation, correct }]);

    if (responses.length + 1 === sequence.length) {
      setTimeout(() => setPhase('order'), 500);
    }
  };

  const handleOrder = (selectedColor) => {
    setOrderAnswers((prev) => {
      const newAnswers = [...prev, selectedColor];
      if (newAnswers.length === sequence.length) {
        // End of round
        setTimeout(() => {
          if (round < 6) {
            setRound(round + 1);
            setResponses([]);
            setOrderAnswers([]);
          } else {
            setPhase('summary');
          }
        }, 1000);
      }
      return newAnswers;
    });
  };

  if (phase === 'summary') {
    return (
      <div style={{ textAlign: 'center' }}>
        <h1>✨ סיימת את המשחק!</h1>
        <p>כל הכבוד על ההשתתפות!</p>
      </div>
    );
  }

  return (
    <div style={{ textAlign: 'center', direction: 'rtl', padding: '30px' }}>
      <h2>🎮 Recall Them All - סבב {round} מתוך 6</h2>

      {phase === 'view' && sequence[currentIndex] && (
        <>
          <p>הסתכל/י טוב!</p>
          <AlienCard {...sequence[currentIndex]} size={200} />
        </>
      )}

      {phase === 'match' && (
  <>
    <h3>לאיזה כיוון היה כל חייזר?</h3>
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
      {sequence.map(({ color }, index) => (
        <div key={index}>
          <p>חייזר בצבע: {color}</p>
          <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
            <div onClick={() => handleMatch(color, 'normal')} style={{ cursor: 'pointer' }}>
              <AlienCard color={color} orientation="normal" size={120} />
              <p>⬆ רגיל</p>
            </div>
            <div onClick={() => handleMatch(color, 'flipped')} style={{ cursor: 'pointer' }}>
              <AlienCard color={color} orientation="flipped" size={120} />
              <p>🔄 הפוך</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  </>
)}


      {phase === 'order' && (
        <>
          <h3>באיזה סדר הופיעו החייזרים לפי הצבע?</h3>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap' }}>
            {alienColors.map((color) => (
              <div key={color} onClick={() => handleOrder(color)} style={{ cursor: 'pointer' }}>
                <AlienCard color={color} orientation="normal" size={100} />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default RecallThemAll;
