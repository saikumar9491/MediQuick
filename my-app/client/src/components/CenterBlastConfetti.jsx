import React from 'react';
import Lottie from 'lottie-react';

// High-fidelity Center-Blast Confetti Lottie Animation JSON (Center blast particles, ribbons, sparkles)
const centerBlastLottieData = {
  v: "5.7.4",
  fr: 60,
  ip: 0,
  op: 120,
  w: 400,
  h: 400,
  nm: "Center Blast Confetti",
  ddd: 0,
  assets: [],
  layers: Array.from({ length: 45 }).map((_, i) => {
    const angle = (i / 45) * Math.PI * 2 + (Math.random() * 0.15 - 0.075);
    const distance = 95 + (i % 6) * 25;
    const endX = Math.cos(angle) * distance;
    const endY = Math.sin(angle) * distance;
    const colors = [
      [0.98, 0.3, 0.52, 1],  // Rose / Pink
      [0.15, 0.53, 0.96, 1],  // Royal Blue
      [0.06, 0.73, 0.51, 1],  // Emerald Green
      [0.96, 0.62, 0.04, 1],  // Bright Gold / Amber
      [0.54, 0.36, 0.96, 1],  // Violet
      [0.02, 0.71, 0.83, 1],  // Vibrant Cyan
    ];
    const color = colors[i % colors.length];
    const particleType = i % 3; // 0 = circle, 1 = star/diamond, 2 = ribbon rectangle

    return {
      ddd: 0,
      ind: i + 1,
      ty: 4,
      nm: `Particle ${i}`,
      sr: 1,
      ks: {
        o: { a: 1, k: [{ t: 0, s: [100] }, { t: 90, s: [100] }, { t: 115, s: [0] }] },
        r: { a: 1, k: [{ t: 0, s: [0] }, { t: 120, s: [720 * (i % 2 === 0 ? 1 : -1)] }] },
        p: {
          a: 1,
          k: [
            { t: 0, s: [200, 200, 0] },
            { t: 55, s: [200 + endX, 200 + endY, 0] },
            { t: 120, s: [200 + endX * 1.12, 200 + endY * 1.12 + 18, 0] },
          ],
        },
        a: { a: 0, k: [0, 0, 0] },
        s: {
          a: 1,
          k: [
            { t: 0, s: [0, 0, 100] },
            { t: 20, s: [150, 150, 100] },
            { t: 90, s: [100, 100, 100] },
            { t: 120, s: [0, 0, 100] },
          ],
        },
      },
      shapes: [
        {
          ty: 'gr',
          it: [
            particleType === 0
              ? {
                  ty: 'el',
                  p: { a: 0, k: [0, 0] },
                  s: { a: 0, k: [12, 12] },
                }
              : particleType === 1
              ? {
                  ty: 'sr',
                  sy: 1,
                  pt: { a: 0, k: 4 },
                  p: { a: 0, k: [0, 0] },
                  r: { a: 0, k: 0 },
                  ir: { a: 0, k: 4 },
                  is: { a: 0, k: 0 },
                  or: { a: 0, k: 10 },
                  os: { a: 0, k: 0 },
                }
              : {
                  ty: 'rc',
                  p: { a: 0, k: [0, 0] },
                  s: { a: 0, k: [15, 8] },
                  r: { a: 0, k: 3 },
                },
            {
              ty: 'fl',
              c: { a: 0, k: color },
              o: { a: 0, k: 100 },
            },
            {
              ty: 'tr',
              p: { a: 0, k: [0, 0] },
              a: { a: 0, k: [0, 0] },
              s: { a: 0, k: [100, 100] },
              r: { a: 0, k: 0 },
              o: { a: 0, k: 100 },
            },
          ],
        },
      ],
    };
  }),
};

const CenterBlastConfetti = ({ onComplete }) => {
  return (
    <div className="absolute inset-0 pointer-events-none z-50 flex items-center justify-center overflow-visible">
      <div className="w-96 h-96 flex items-center justify-center -translate-y-2">
        <Lottie
          animationData={centerBlastLottieData}
          loop={false}
          autoplay={true}
          onComplete={onComplete}
          style={{ width: '100%', height: '100%' }}
        />
      </div>
    </div>
  );
};

export default CenterBlastConfetti;
