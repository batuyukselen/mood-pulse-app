import React, { useEffect, useState } from 'react';
import Confetti from 'react-confetti';

const ConfettiEffect: React.FC = () => {
  const [showConfetti, setShowConfetti] = useState(false);
  const [windowDimensions, setWindowDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    const handleTriggerConfetti = () => {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('triggerConfetti', handleTriggerConfetti);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('triggerConfetti', handleTriggerConfetti);
    };
  }, []);

  return showConfetti ? (
    <Confetti
      width={windowDimensions.width}
      height={windowDimensions.height}
      recycle={false}
      numberOfPieces={200}
      colors={['#5B3DF4', '#FFB400', '#19C37D', '#F43F5E', '#A855F7']}
    />
  ) : null;
};

export default ConfettiEffect;