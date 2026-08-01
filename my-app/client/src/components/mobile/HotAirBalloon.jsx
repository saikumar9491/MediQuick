import React from 'react';
import styles from './AnimatedHeroBanner.module.css';

/**
 * HotAirBalloon
 * @param {string} color    - CSS background color for balloon body
 * @param {string} stripeColor - accent stripe color
 * @param {number} delay    - animation delay in seconds
 * @param {object} style    - position styles (top/left/right/bottom)
 */
const HotAirBalloon = ({ color = '#0057FF', stripeColor, delay = 0, style = {} }) => {
  const animStyle = {
    animationDelay: `${delay}s`,
    ...style
  };

  return (
    <div className={styles.balloon} style={animStyle}>
      <div
        className={styles.balloonBody}
        style={{ background: color }}
      >
        {/* Stripe panel */}
        {stripeColor && (
          <div
            style={{
              position: 'absolute',
              left: '35%',
              top: 0,
              width: '28%',
              height: '100%',
              background: stripeColor,
              opacity: 0.45,
            }}
          />
        )}
        <div className={styles.balloonShine} />
      </div>
      <div className={styles.balloonRope} />
      <div className={styles.balloonBasket} />
    </div>
  );
};

export default HotAirBalloon;
