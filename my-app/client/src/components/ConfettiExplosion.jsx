import React, { useState, useEffect } from 'react';
import ReactConfetti from 'react-confetti';

const ConfettiExplosion = () => {
  const [dimensions, setDimensions] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1200,
    height: typeof window !== 'undefined' ? window.innerHeight : 800,
  });
  const [recycle, setRecycle] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    window.addEventListener('resize', handleResize);

    // Stop generating new confetti pieces after 4 seconds so particles clear naturally
    const timer = setTimeout(() => {
      setRecycle(false);
    }, 4000);

    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timer);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      <ReactConfetti
        width={dimensions.width}
        height={dimensions.height}
        numberOfPieces={450}
        recycle={recycle}
        gravity={0.2}
        tweenDuration={7000}
      />
    </div>
  );
};

export default ConfettiExplosion;
