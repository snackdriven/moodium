'use client';

import { motion } from 'framer-motion';
import { memo } from 'react';

import styles from './mood-creature-enhanced.module.css';

interface CreatureAvatarProps {
  mood?: string;
  color?: string;
}

export const CreatureAvatar = memo(function CreatureAvatar({
  mood = 'content',
  color = '#8b9dc3',
}: CreatureAvatarProps) {
  const getAnimation = () => {
    switch (mood) {
      case 'greeting':
      case 'happy':
        return {
          scale: [1, 1.05, 1],
          rotate: [-2, 2, -2],
        };
      case 'questioning':
      case 'curious':
        return {
          y: [0, -5, 0],
        };
      case 'waiting':
        return {
          scale: [1, 1.02, 1],
        };
      default:
        return {
          scale: [1, 1.01, 1],
        };
    }
  };

  const eyeAnimation = {
    scaleY: [1, 0.1, 1],
    transition: {
      duration: 0.2,
      times: [0, 0.5, 1],
      repeat: Infinity,
      repeatDelay: 5,
    },
  };

  return (
    <motion.div
      className={styles.creatureWrapper}
      animate={getAnimation()}
      transition={{
        duration: 3,
        repeat: Infinity,
        repeatType: 'reverse',
        ease: 'easeInOut',
      }}
    >
      <svg viewBox="0 0 200 200" className={styles.creatureSvg} aria-hidden="true" style={{ color }}>
        {/* Glow effect */}
        <defs>
          <radialGradient id="glow">
            <stop offset="0%" stopColor={color} stopOpacity="0.3" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </radialGradient>
        </defs>

        <motion.circle
          cx="100"
          cy="100"
          r="90"
          fill="url(#glow)"
          initial={{ scale: 0.8 }}
          animate={{ scale: [0.8, 1.2, 0.8] }}
          transition={{ duration: 4, repeat: Infinity }}
        />

        {/* Body */}
        <motion.circle cx="100" cy="100" r="60" fill="currentColor" whileHover={{ scale: 1.05 }} />

        {/* Eyes */}
        <motion.circle cx="80" cy="90" r="8" fill="#000" animate={eyeAnimation} />
        <motion.circle cx="120" cy="90" r="8" fill="#000" animate={eyeAnimation} />

        {/* Expression */}
        {(mood === 'happy' || mood === 'greeting') && (
          <motion.path
            d="M 75 115 Q 100 130 125 115"
            fill="none"
            stroke="#000"
            strokeWidth="3"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.5 }}
          />
        )}

        {(mood === 'content' || mood === 'waiting') && (
          <motion.path d="M 80 115 Q 100 120 120 115" fill="none" stroke="#000" strokeWidth="2" strokeLinecap="round" />
        )}

        {(mood === 'curious' || mood === 'questioning') && (
          <motion.ellipse
            cx="100"
            cy="115"
            rx="8"
            ry="12"
            fill="#000"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3 }}
          />
        )}
      </svg>
    </motion.div>
  );
});
