import React from 'react';
import styles from './AnimatedHeroBanner.module.css';

/**
 * RotatingHealthIcon
 * Decorative right-side illustration — a two-ring system with
 * health emoji icons orbiting a central medicine cross symbol.
 * Pure CSS rotation, no JS.
 */
const RotatingHealthIcon = () => {
  // Icon orbit positions: angle in degrees → (x, y) offset from center
  // Ring radius ≈ 54px from center of 160px container
  const orbitIcons = [
    { emoji: '💊', deg: 0   },
    { emoji: '🌿', deg: 90  },
    { emoji: '❤️', deg: 180 },
    { emoji: '💧', deg: 270 },
  ];

  const cx = 80; // half of 160px
  const r  = 54; // orbit radius

  return (
    <div className={styles.healthRingWrapper}>
      {/* Outer dashed ring (rotates slowly CW) */}
      <div className={styles.healthRingOuter} />

      {/* Inner ring (rotates CCW) */}
      <div className={styles.healthRingInner} />

      {/* Static icons on orbit path (the ring rotates, icons counter-rotate to stay upright) */}
      {orbitIcons.map(({ emoji, deg }) => {
        const rad = (deg * Math.PI) / 180;
        const x = cx + r * Math.cos(rad) - 14; // -14 = half icon width
        const y = cx + r * Math.sin(rad) - 14;
        return (
          <div
            key={deg}
            className={styles.healthIcon}
            style={{
              left: `${x}px`,
              top:  `${y}px`,
              position: 'absolute',
            }}
          >
            {emoji}
          </div>
        );
      })}

      {/* Center cross / plus symbol */}
      <div className={styles.healthRingCenter}>
        <svg
          width="32"
          height="32"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          {/* Plus / health cross */}
          <rect x="12" y="2"  width="8" height="28" rx="4" fill="#FF6B00" opacity="0.6" />
          <rect x="2"  y="12" width="28" height="8" rx="4" fill="#FF6B00" opacity="0.6" />
        </svg>
      </div>
    </div>
  );
};

export default RotatingHealthIcon;
