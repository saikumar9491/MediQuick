import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Check } from 'lucide-react';

const MyntraFlowerCelebration = ({ onClose }) => {
  const containerRef = useRef(null);
  const petalsRef = useRef([]);
  const centerCheckRef = useRef(null);
  const sparklesRef = useRef([]);
  const textRef = useRef(null);
  const cardRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          // Auto close celebration overlay after 2.8 seconds
          gsap.to(containerRef.current, {
            opacity: 0,
            scale: 0.95,
            duration: 0.5,
            delay: 1.8,
            ease: 'power2.inOut',
            onComplete: onClose,
          });
        },
      });

      // 1. Initial State
      gsap.set(cardRef.current, { scale: 0.8, opacity: 0 });
      gsap.set(petalsRef.current, { scale: 0, transformOrigin: '50% 100%' });
      gsap.set(centerCheckRef.current, { scale: 0, rotation: -45 });
      gsap.set(sparklesRef.current, { scale: 0, opacity: 0 });
      gsap.set(textRef.current, { y: 20, opacity: 0 });

      // 2. Card entrance
      tl.to(cardRef.current, {
        scale: 1,
        opacity: 1,
        duration: 0.4,
        ease: 'back.out(1.5)',
      });

      // 3. Flower Petals Bloom Animation (Myntra Lotus Bloom effect)
      tl.to(
        petalsRef.current,
        {
          scale: 1,
          duration: 0.7,
          stagger: 0.05,
          ease: 'back.out(2)',
        },
        '-=0.1'
      );

      // 4. Center Check Badge Pop
      tl.to(
        centerCheckRef.current,
        {
          scale: 1,
          rotation: 0,
          duration: 0.5,
          ease: 'elastic.out(1.2, 0.4)',
        },
        '-=0.4'
      );

      // 5. Particle Burst Radiating outwards
      sparklesRef.current.forEach((sparkle, i) => {
        const angle = (i / sparklesRef.current.length) * Math.PI * 2;
        const distance = 70 + Math.random() * 40;
        const x = Math.cos(angle) * distance;
        const y = Math.sin(angle) * distance;

        tl.to(
          sparkle,
          {
            x,
            y,
            scale: Math.random() * 0.8 + 0.6,
            opacity: 1,
            duration: 0.6,
            ease: 'power3.out',
          },
          '-=0.5'
        );

        tl.to(
          sparkle,
          {
            opacity: 0,
            scale: 0,
            duration: 0.3,
            ease: 'power2.in',
          },
          '-=0.2'
        );
      });

      // 6. Text Fade In
      tl.to(
        textRef.current,
        {
          y: 0,
          opacity: 1,
          duration: 0.4,
          ease: 'power2.out',
        },
        '-=0.5'
      );
    }, containerRef);

    return () => ctx.revert();
  }, [onClose]);

  const petalColors = [
    '#3B82F6', // Blue
    '#10B981', // Emerald
    '#F59E0B', // Amber
    '#EC4899', // Pink
    '#8B5CF6', // Purple
    '#06B6D4', // Cyan
    '#F43F5E', // Rose
    '#6366F1', // Indigo
  ];

  return (
    <div
      ref={containerRef}
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-md cursor-pointer px-4"
    >
      <div
        ref={cardRef}
        className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl border border-slate-100 flex flex-col items-center justify-center relative overflow-hidden"
      >
        {/* Soft background ambient glow */}
        <div className="absolute w-40 h-40 bg-blue-100 rounded-full blur-3xl opacity-60 -top-10 -left-10 pointer-events-none" />
        <div className="absolute w-40 h-40 bg-emerald-100 rounded-full blur-3xl opacity-60 -bottom-10 -right-10 pointer-events-none" />

        {/* Flower Canvas / SVG Art */}
        <div className="relative w-44 h-44 flex items-center justify-center my-4">
          {/* Confetti particles */}
          {Array.from({ length: 16 }).map((_, i) => (
            <div
              key={`sparkle-${i}`}
              ref={(el) => (sparklesRef.current[i] = el)}
              className="absolute w-2.5 h-2.5 rounded-full pointer-events-none"
              style={{
                backgroundColor: petalColors[i % petalColors.length],
                left: '50%',
                top: '50%',
              }}
            />
          ))}

          {/* SVG Blooming Flower Petals */}
          <svg className="w-40 h-40 absolute" viewBox="0 0 100 100">
            {petalColors.map((color, i) => {
              const rotation = i * 45;
              return (
                <g key={`petal-${i}`} transform={`rotate(${rotation} 50 50)`}>
                  <path
                    ref={(el) => (petalsRef.current[i] = el)}
                    d="M50,50 C42,25 45,8 50,2 C55,8 58,25 50,50 Z"
                    fill={color}
                    opacity="0.85"
                  />
                </g>
              );
            })}
          </svg>

          {/* Center Check Icon Badge */}
          <div
            ref={centerCheckRef}
            className="relative z-10 w-16 h-16 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 text-white flex items-center justify-center shadow-lg shadow-emerald-500/30 border-4 border-white"
          >
            <Check size={32} strokeWidth={3} />
          </div>
        </div>

        {/* Success Text */}
        <div ref={textRef} className="space-y-1.5 mt-2">
          <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-wider">
            Order Confirmed
          </span>
          <h3 className="text-xl font-bold text-slate-800 tracking-tight">Order Placed Successfully!</h3>
          <p className="text-xs text-slate-400">
            Your items are being packed & will be delivered soon.
          </p>
        </div>
      </div>
    </div>
  );
};

export default MyntraFlowerCelebration;
