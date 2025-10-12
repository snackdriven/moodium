'use client';

import { motion, useMotionValue, useTransform } from 'framer-motion';
import { memo, useEffect } from 'react';

import styles from './mood-creature-enhanced.module.css';

interface AnimatedSliderProps {
  value: number;
  onChange: (value: number) => void;
  lowLabel: string;
  highLabel: string;
  lowEmoji: string;
  highEmoji: string;
  ariaLabel: string;
}

export const AnimatedSlider = memo(function AnimatedSlider({
  value,
  onChange,
  lowLabel,
  highLabel,
  lowEmoji,
  highEmoji,
  ariaLabel,
}: AnimatedSliderProps) {
  const motionValue = useMotionValue(value);
  const background = useTransform(
    motionValue,
    [0, 100],
    [
      'linear-gradient(90deg, #7c8ea3 0%, #9b8ec1 50%, #e76f51 100%)',
      'linear-gradient(90deg, #e76f51 0%, #f4a261 50%, #2a9d8f 100%)',
    ]
  );

  useEffect(() => {
    motionValue.set(value);
  }, [value, motionValue]);

  return (
    <motion.div
      className={styles.animatedSliderContainer}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className={styles.sliderLabels}>
        <motion.span
          className={styles.sliderLabel}
          animate={{ scale: value < 30 ? 1.1 : 1 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          <span className={styles.emoji}>{lowEmoji}</span>
          <span className={styles.labelText}>{lowLabel}</span>
        </motion.span>

        <motion.span
          className={styles.sliderLabel}
          animate={{ scale: value > 70 ? 1.1 : 1 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          <span className={styles.labelText}>{highLabel}</span>
          <span className={styles.emoji}>{highEmoji}</span>
        </motion.span>
      </div>

      <div className={styles.sliderTrack}>
        <motion.div
          className={styles.sliderFill}
          style={{ background }}
          animate={{ width: `${value}%` }}
          transition={{ type: 'spring', stiffness: 100, damping: 20 }}
        />

        <input
          type="range"
          min={0}
          max={100}
          value={value}
          onChange={(e) => {
            const newValue = parseInt(e.target.value);
            onChange(newValue);
            motionValue.set(newValue);
          }}
          className={styles.sliderInput}
          aria-label={ariaLabel}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={value}
        />

        <motion.div
          className={styles.sliderThumb}
          animate={{ left: `${value}%` }}
          transition={{ type: 'spring', stiffness: 100, damping: 20 }}
          whileHover={{ scale: 1.2 }}
          whileDrag={{ scale: 1.3 }}
        >
          <motion.div
            className={styles.thumbPulse}
            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.div>
      </div>

      <motion.div className={styles.sliderValue} initial={{ scale: 0 }} animate={{ scale: 1 }} key={value}>
        {value}
      </motion.div>
    </motion.div>
  );
});
