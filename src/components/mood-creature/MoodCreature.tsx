'use client';

import { useState } from 'react';
import { CreatureAnimation } from './CreatureAnimation';
import { SensorySlider } from './SensorySlider';
import { MoodSummary } from './MoodSummary';
import styles from './mood-creature.module.css';

interface MoodCreatureProps {
  onComplete?: (data: any) => void;
  userId?: string;
}

export function MoodCreature({ onComplete, userId }: MoodCreatureProps) {
  const [step, setStep] = useState<'greeting' | 'energy' | 'focus' | 'social' | 'summary' | 'complete'>('greeting');
  const [energy, setEnergy] = useState(50);
  const [focus, setFocus] = useState(50);
  const [social, setSocial] = useState(50);
  const [summary, setSummary] = useState<string>('');
  const [archetype, setArchetype] = useState<string>('');
  const [creatureMood, setCreatureMood] = useState<any>(null);
  const [saving, setSaving] = useState(false);

  const handleNext = () => {
    const steps: typeof step[] = ['greeting', 'energy', 'focus', 'social', 'summary', 'complete'];
    const currentIndex = steps.indexOf(step);
    if (currentIndex < steps.length - 1) {
      const nextStep = steps[currentIndex + 1];
      setStep(nextStep);
      
      if (nextStep === 'summary') {
        generateSummary();
      }
    }
  };

  const handleSkip = () => {
    setStep('complete');
    if (onComplete) {
      onComplete({ skipped: true });
    }
  };

  const generateSummary = async () => {
    setSaving(true);
    try {
      const response = await fetch('/api/mood', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          energyLevel: energy,
          focusLevel: focus,
          socialLevel: social,
          responses: [energy, focus, social],
          userId
        })
      });

      const data = await response.json();
      if (data.success) {
        setSummary(data.data.summary);
        setArchetype(data.data.archetype);
        setCreatureMood(data.data.creatureMood);
      }
    } catch (error) {
      console.error('Error generating summary:', error);
      setSummary("We're feeling steady today, thoughts gathering.");
    } finally {
      setSaving(false);
    }
  };

  const handleSave = () => {
    setStep('complete');
    if (onComplete) {
      onComplete({
        energy,
        focus,
        social,
        summary,
        archetype,
        saved: true
      });
    }
  };

  return (
    <div className={styles.container}>
      <CreatureAnimation 
        mood={creatureMood || { color: '#8b9dc3', animation: 'balanced-breathe', expression: 'content' }}
        step={step}
      />

      <div className={styles.content}>
        {step === 'greeting' && (
          <div className={styles.greeting}>
            <h2>Hey friend! Wanna check in together?</h2>
            <div className={styles.actions}>
              <button onClick={handleNext} className={styles.primaryButton}>
                Yeah
              </button>
              <button onClick={handleSkip} className={styles.secondaryButton}>
                Maybe later
              </button>
            </div>
          </div>
        )}

        {step === 'energy' && (
          <div className={styles.prompt}>
            <h2>Are you more ☁️ low-tide or ✨ starlit today?</h2>
            <SensorySlider
              value={energy}
              onChange={setEnergy}
              lowLabel="low-tide"
              highLabel="starlit"
              lowEmoji="☁️"
              highEmoji="✨"
              ariaLabel="Energy level, from resting to energetic"
            />
            <div className={styles.actions}>
              <button onClick={handleNext} className={styles.primaryButton}>
                Next
              </button>
            </div>
          </div>
        )}

        {step === 'focus' && (
          <div className={styles.prompt}>
            <h2>Is your mind more like misty clouds or a clear shelf?</h2>
            <SensorySlider
              value={focus}
              onChange={setFocus}
              lowLabel="misty clouds"
              highLabel="clear shelf"
              lowEmoji="🌫️"
              highEmoji="🔮"
              ariaLabel="Focus level, from unfocused to intensely focused"
            />
            <div className={styles.actions}>
              <button onClick={handleNext} className={styles.primaryButton}>
                Next
              </button>
            </div>
          </div>
        )}

        {step === 'social' && (
          <div className={styles.prompt}>
            <h2>Would you rather curl up in your fort or dance in the kitchen?</h2>
            <SensorySlider
              value={social}
              onChange={setSocial}
              lowLabel="cozy fort"
              highLabel="kitchen dance"
              lowEmoji="🏰"
              highEmoji="🌻"
              ariaLabel="Social desire, from solitary to expressive connection"
            />
            <div className={styles.actions}>
              <button onClick={handleNext} className={styles.primaryButton} disabled={saving}>
                {saving ? 'Thinking...' : 'Next'}
              </button>
            </div>
          </div>
        )}

        {step === 'summary' && (
          <div className={styles.summary}>
            <MoodSummary 
              summary={summary}
              archetype={archetype}
            />
            <div className={styles.actions}>
              <button onClick={handleSave} className={styles.primaryButton}>
                Log mood
              </button>
              <button onClick={handleSkip} className={styles.secondaryButton}>
                Skip
              </button>
            </div>
          </div>
        )}

        {step === 'complete' && (
          <div className={styles.farewell}>
            <h2>Thanks for checking in — see you tomorrow, pal.</h2>
          </div>
        )}
      </div>
    </div>
  );
}