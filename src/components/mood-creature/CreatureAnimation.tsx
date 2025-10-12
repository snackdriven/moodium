'use client';

import styles from './mood-creature.module.css';

interface CreatureAnimationProps {
  mood: {
    color: string;
    animation: string;
    expression: string;
  };
  step: string;
}

export function CreatureAnimation({ mood, step }: CreatureAnimationProps) {
  return (
    <div 
      className={styles.creature}
      style={{ 
        '--creature-color': mood.color,
        '--animation-type': mood.animation
      } as React.CSSProperties}
      data-expression={mood.expression}
      data-step={step}
    >
      <svg
        viewBox="0 0 200 200"
        className={styles.creatureSvg}
        aria-hidden="true"
      >
        <circle
          cx="100"
          cy="100"
          r="60"
          fill="currentColor"
          className={styles.creatureBody}
        />
        
        <circle
          cx="80"
          cy="90"
          r="8"
          fill="#000"
          className={styles.creatureEye}
        />
        <circle
          cx="120"
          cy="90"
          r="8"
          fill="#000"
          className={styles.creatureEye}
        />
        
        {mood.expression === 'sleepy' && (
          <line
            x1="70"
            y1="90"
            x2="90"
            y2="90"
            stroke="#000"
            strokeWidth="2"
            className={styles.sleepyEye}
          />
        )}
        
        {mood.expression === 'joyful' && (
          <path
            d="M 75 115 Q 100 130 125 115"
            fill="none"
            stroke="#000"
            strokeWidth="3"
            className={styles.smile}
          />
        )}
        
        {(mood.expression === 'content' || mood.expression === 'thoughtful') && (
          <path
            d="M 80 115 Q 100 120 120 115"
            fill="none"
            stroke="#000"
            strokeWidth="2"
            className={styles.smile}
          />
        )}
        
        {step === 'greeting' && (
          <g className={styles.wave}>
            <ellipse
              cx="150"
              cy="100"
              rx="15"
              ry="25"
              fill="currentColor"
              transform="rotate(-30 150 100)"
            />
          </g>
        )}
      </svg>
    </div>
  );
}