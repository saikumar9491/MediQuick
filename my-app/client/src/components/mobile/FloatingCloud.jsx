import React from 'react';
import styles from './AnimatedHeroBanner.module.css';

/**
 * FloatingCloud
 * @param {object} style   - position styles (top/left/right)
 * @param {number} delay   - animation-delay in seconds
 * @param {number} scale   - size multiplier (CSS scale transform)
 */
const FloatingCloud = ({ style = {}, delay = 0, scale = 1 }) => {
  return (
    <div
      className={styles.cloud}
      style={{
        animationDelay: `${delay}s`,
        transform: `scale(${scale})`,
        transformOrigin: 'left center',
        ...style
      }}
    >
      <div className={styles.cloudShape} />
    </div>
  );
};

export default FloatingCloud;
