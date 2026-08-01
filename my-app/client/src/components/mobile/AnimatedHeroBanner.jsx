/**
 * AnimatedHeroBanner.jsx
 * ─────────────────────────────────────────────────────────────
 * Animated festive hero banner for MediQuick mobile homepage.
 * MOBILE ONLY — rendered below 768px.
 * ─────────────────────────────────────────────────────────────
 * Data source: GET /api/banners?placement=mobile-homepage&targetDevice=mobile
 * Falls back to default "Your health, delivered" content if no active banner.
 *
 * All animations are pure CSS (see AnimatedHeroBanner.module.css).
 * Respects prefers-reduced-motion.
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './AnimatedHeroBanner.module.css';
import HotAirBalloon  from './HotAirBalloon';
import FloatingCloud  from './FloatingCloud';
import RotatingHealthIcon from './RotatingHealthIcon';
import { API_BASE } from '../../utils/apiConfig';

/* ── Default banner shown when no active campaign ── */
const DEFAULT_BANNER = {
  badgeText : 'MEDIQUICK',
  headline  : 'Your Health, Delivered',
  subtext   : 'Medicines, lab tests & doctor consults — at your doorstep.',
  ctaUrl    : '/medicines',
  ctaLabel  : 'Shop Now',
  isDefault : true,
};

/* ── Sparkle positions (static, decorative) ── */
const SPARKLES = [
  { top: '14%', left: '52%', delay: 0     },
  { top: '60%', left: '58%', delay: 0.6   },
  { top: '22%', left: '40%', delay: 1.1   },
  { top: '72%', left: '46%', delay: 1.7   },
];

/* ── Confetti dots config ── */
const CONFETTI = [
  { left: '22%', color: '#0057FF', duration: 3.5, delay: 0    },
  { left: '35%', color: '#FF6B00', duration: 4.2, delay: 0.8  },
  { left: '48%', color: '#16A34A', duration: 3.8, delay: 1.5  },
  { left: '60%', color: '#FBBF24', duration: 4.6, delay: 0.3  },
  { left: '72%', color: '#EC4899', duration: 3.2, delay: 1.1  },
];

const AnimatedHeroBanner = () => {
  const [banner, setBanner] = useState(null);
  const [loading, setLoading] = useState(true);

  /* ── Fetch active mobile-homepage hero banner ── */
  useEffect(() => {
    let cancelled = false;

    const fetchBanner = async () => {
      try {
        const res = await fetch(
          `${API_BASE}/api/banners?placement=mobile-homepage&targetDevice=mobile`
        );
        if (res.ok) {
          const data = await res.json();
          const list = Array.isArray(data) ? data : (data?.banners || []);
          const active = list.find(
            b =>
              (b.placement === 'mobile-homepage' || b.category === 'mobile-hero-animated') &&
              (b.status === 'active' || b.isActive !== false) &&
              (b.targetDevice === 'mobile' || b.targetDevice === 'both' || !b.targetDevice)
          );
          if (!cancelled) setBanner(active || DEFAULT_BANNER);
        } else {
          if (!cancelled) setBanner(DEFAULT_BANNER);
        }
      } catch {
        if (!cancelled) setBanner(DEFAULT_BANNER);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchBanner();
    return () => { cancelled = true; };
  }, []);

  if (loading) {
    /* Skeleton — same warm gradient, no flicker */
    return (
      <div
        className={styles.banner}
        style={{ opacity: 0.55, background: 'linear-gradient(135deg,#FFF3E0,#FFE0B2,#FFCC80)' }}
        aria-hidden="true"
      />
    );
  }

  if (!banner) return null;

  const {
    badgeText = 'SPECIAL OFFER',
    headline  = 'Your Health, Delivered',
    subtext   = 'Medicines & more, delivered fast.',
    ctaUrl    = '/medicines',
    ctaLabel  = 'Shop Now',
  } = banner;

  /* Split headline to apply superscript to ordinal suffixes like ST, ND, RD, TH */
  const renderHeadline = (text) => {
    const parts = text.split(/(\d+(?:ST|ND|RD|TH)\b)/gi);
    return parts.map((part, i) => {
      const match = part.match(/^(\d+)(ST|ND|RD|TH)$/i);
      if (match) {
        return (
          <React.Fragment key={i}>
            {match[1]}
            <sup className={styles.headlineSup}>{match[2].toUpperCase()}</sup>
          </React.Fragment>
        );
      }
      return <React.Fragment key={i}>{part}</React.Fragment>;
    });
  };

  return (
    <div
      className={styles.banner}
      role="banner"
      aria-label={`${badgeText}: ${headline}`}
    >
      {/* ── Radial glow bg ── */}
      <div className={styles.bannerGlow} aria-hidden="true" />

      {/* ══════════ ANIMATED BACKGROUND LAYER ══════════ */}

      {/* Clouds */}
      <FloatingCloud style={{ top: '8%',  left: '28%' }} delay={0}   scale={0.85} />
      <FloatingCloud style={{ top: '55%', left: '38%' }} delay={2.2} scale={0.65} />
      <FloatingCloud style={{ top: '20%', right: '52%' }} delay={4}   scale={0.55} />

      {/* Hot-air balloons */}
      {/* Blue balloon — left-far */}
      <HotAirBalloon
        color="#93C5FD"
        stripeColor="#0057FF"
        delay={0}
        style={{ top: '10%', left: '3%' }}
      />
      {/* Orange balloon — right-mid */}
      <HotAirBalloon
        color="#FED7AA"
        stripeColor="#FF6B00"
        delay={1.2}
        style={{ top: '5%', left: '42%' }}
      />
      {/* Green balloon — right-far (partially hidden) */}
      <HotAirBalloon
        color="#BBF7D0"
        stripeColor="#16A34A"
        delay={2.4}
        style={{ top: '15%', right: '30%' }}
      />

      {/* Sparkles */}
      {SPARKLES.map((s, i) => (
        <div
          key={i}
          className={styles.sparkle}
          style={{ top: s.top, left: s.left, animationDelay: `${s.delay}s` }}
          aria-hidden="true"
        >
          <span className={styles.sparkleStar}>✦</span>
        </div>
      ))}

      {/* Confetti dots */}
      {CONFETTI.map((c, i) => (
        <div
          key={i}
          className={styles.confettiDot}
          style={{
            left: c.left,
            top: '-8px',
            background: c.color,
            animationDuration: `${c.duration}s`,
            animationDelay: `${c.delay}s`,
          }}
          aria-hidden="true"
        />
      ))}

      {/* ══════════ RIGHT-SIDE ILLUSTRATION ══════════ */}
      <RotatingHealthIcon />

      {/* ══════════ MAIN CONTENT ══════════ */}
      <div className={styles.contentLayer}>
        {/* Campaign badge */}
        <div className={styles.badge}>
          <span className={styles.badgeDot} aria-hidden="true" />
          {badgeText}
        </div>

        {/* Headline with ordinal superscript */}
        <h2 className={styles.headline}>
          {renderHeadline(headline)}
        </h2>

        {/* Subtext */}
        <p className={styles.subtext}>{subtext}</p>

        {/* CTA Button */}
        <Link to={ctaUrl} className={styles.ctaButton} aria-label={`${ctaLabel} — ${headline}`}>
          <span>{ctaLabel}</span>
          <span className={styles.ctaArrow} aria-hidden="true">→</span>
        </Link>
      </div>
    </div>
  );
};

export default AnimatedHeroBanner;
