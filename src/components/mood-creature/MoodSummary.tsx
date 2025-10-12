'use client';

import styles from './mood-creature.module.css';

interface MoodSummaryProps {
  summary: string;
  archetype: string;
}

export function MoodSummary({ summary, archetype }: MoodSummaryProps) {
  return (
    <div className={styles.summaryContainer}>
      <div className={styles.summaryText}>
        <p className={styles.mainSummary}>{summary}</p>
        {archetype && (
          <p className={styles.archetypeLabel}>
            Archetype: <span className={styles.archetypeName}>{archetype}</span>
          </p>
        )}
      </div>
      
      <div className={styles.summaryVisual}>
        <div className={styles.moodGradient} data-archetype={archetype} />
      </div>
    </div>
  );
}