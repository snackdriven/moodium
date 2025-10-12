'use client';

import styles from './mood-creature.module.css';

interface SensorySliderProps {
  value: number;
  onChange: (value: number) => void;
  lowLabel: string;
  highLabel: string;
  lowEmoji: string;
  highEmoji: string;
  ariaLabel: string;
}

export function SensorySlider({
  value,
  onChange,
  lowLabel,
  highLabel,
  lowEmoji,
  highEmoji,
  ariaLabel
}: SensorySliderProps) {
  return (
    <div className={styles.sliderContainer}>
      <div className={styles.sliderLabels}>
        <span className={styles.sliderLabel}>
          <span className={styles.emoji}>{lowEmoji}</span>
          <span className={styles.labelText}>{lowLabel}</span>
        </span>
        <span className={styles.sliderLabel}>
          <span className={styles.labelText}>{highLabel}</span>
          <span className={styles.emoji}>{highEmoji}</span>
        </span>
      </div>
      
      <input
        type="range"
        min={0}
        max={100}
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value))}
        className={styles.slider}
        aria-label={ariaLabel}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={value}
      />
      
      <div className={styles.sliderTicks}>
        <span className={styles.tick} style={{ left: '0%' }} />
        <span className={styles.tick} style={{ left: '25%' }} />
        <span className={styles.tick} style={{ left: '50%' }} />
        <span className={styles.tick} style={{ left: '75%' }} />
        <span className={styles.tick} style={{ left: '100%' }} />
      </div>
    </div>
  );
}