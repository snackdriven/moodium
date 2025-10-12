'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { createContext, ReactNode, useContext, useState } from 'react';

import { AnimatedSlider } from './AnimatedSlider';
import { LumaCreatureAvatar } from './LumaCreatureAvatar';
import { ErrorBoundary } from './ErrorBoundary';
import { useMoodSubmit, useOptimisticMood } from './hooks/useMoodSubmit';
import { LoadingState } from './LoadingState';
import styles from './mood-creature-enhanced.module.css';

// Compound Component Pattern with Context
interface MoodContextValue {
  energy: number;
  focus: number;
  social: number;
  setEnergy: (v: number) => void;
  setFocus: (v: number) => void;
  setSocial: (v: number) => void;
  step: string;
  setStep: (s: string) => void;
  notes: string;
  setNotes: (s: string) => void;
}

const MoodContext = createContext<MoodContextValue | undefined>(undefined);

const useMoodContext = () => {
  const context = useContext(MoodContext);
  if (!context) throw new Error('useMoodContext must be used within MoodCreature');
  return context;
};

// Root Component with Provider
interface MoodCreatureRootProps {
  children: ReactNode;
  onComplete?: (data: any) => void;
  userId?: string;
}

export function MoodCreature({ children }: MoodCreatureRootProps) {
  const [step, setStep] = useState('greeting');
  const [energy, setEnergy] = useState(50);
  const [focus, setFocus] = useState(50);
  const [social, setSocial] = useState(50);
  const [notes, setNotes] = useState('');

  const value = {
    energy,
    focus,
    social,
    setEnergy,
    setFocus,
    setSocial,
    step,
    setStep,
    notes,
    setNotes,
  };

  return (
    <ErrorBoundary>
      <MoodContext.Provider value={value}>
        <motion.div
          className={styles.container}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {children}
        </motion.div>
      </MoodContext.Provider>
    </ErrorBoundary>
  );
}

// Greeting Step
MoodCreature.Greeting = function Greeting() {
  const { setStep } = useMoodContext();

  return (
    <motion.div
      className={styles.greeting}
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -20, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
    >
      <LumaCreatureAvatar mood="greeting" />
      <motion.h2 initial={{ scale: 0.9 }} animate={{ scale: 1 }} transition={{ delay: 0.2 }}>
        Hey friend! Wanna check in together?
      </motion.h2>
      <motion.div
        className={styles.actions}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <button onClick={() => setStep('energy')} className={styles.primaryButton}>
          Yeah
        </button>
        <button onClick={() => setStep('complete')} className={styles.secondaryButton}>
          Maybe later
        </button>
      </motion.div>
    </motion.div>
  );
};

// Energy Step
MoodCreature.Energy = function Energy() {
  const { energy, setEnergy, setStep } = useMoodContext();

  return (
    <motion.div
      className={styles.prompt}
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -100, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
    >
      <LumaCreatureAvatar mood="questioning" energy={energy} />
      <h2>Are you more ☁️ low-tide or ✨ starlit today?</h2>
      <AnimatedSlider
        value={energy}
        onChange={setEnergy}
        lowLabel="low-tide"
        highLabel="starlit"
        lowEmoji="☁️"
        highEmoji="✨"
        ariaLabel="Energy level, from resting to energetic"
      />
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setStep('focus')}
        className={styles.primaryButton}
      >
        Next
      </motion.button>
    </motion.div>
  );
};

// Focus Step
MoodCreature.Focus = function Focus() {
  const { focus, setFocus, setStep } = useMoodContext();

  return (
    <motion.div
      className={styles.prompt}
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -100, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
    >
      <LumaCreatureAvatar mood="curious" energy={energy} focus={focus} />
      <h2>Is your mind more like misty clouds or a clear shelf?</h2>
      <AnimatedSlider
        value={focus}
        onChange={setFocus}
        lowLabel="misty clouds"
        highLabel="clear shelf"
        lowEmoji="🌫️"
        highEmoji="🔮"
        ariaLabel="Focus level, from unfocused to intensely focused"
      />
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setStep('social')}
        className={styles.primaryButton}
      >
        Next
      </motion.button>
    </motion.div>
  );
};

// Social Step
MoodCreature.Social = function Social() {
  const { social, setSocial, setStep } = useMoodContext();

  return (
    <motion.div
      className={styles.prompt}
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -100, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
    >
      <LumaCreatureAvatar mood="waiting" energy={energy} focus={focus} social={social} />
      <h2>Would you rather curl up in your fort or dance in the kitchen?</h2>
      <AnimatedSlider
        value={social}
        onChange={setSocial}
        lowLabel="cozy fort"
        highLabel="kitchen dance"
        lowEmoji="🏰"
        highEmoji="🌻"
        ariaLabel="Social desire, from solitary to expressive connection"
      />
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setStep('summary')}
        className={styles.primaryButton}
      >
        Next
      </motion.button>
    </motion.div>
  );
};

// Summary Step with Notes
MoodCreature.Summary = function Summary({ onComplete, userId }: { onComplete?: (data: any) => void; userId?: string }) {
  const { energy, focus, social, notes, setNotes, setStep } = useMoodContext();
  const { archetype, summary, creatureMood } = useOptimisticMood(energy, focus, social);
  const { mutate, isPending } = useMoodSubmit();

  const handleSave = () => {
    mutate(
      {
        energyLevel: energy,
        focusLevel: focus,
        socialLevel: social,
        responses: [energy, focus, social],
        userId,
        notes: notes || undefined,
      },
      {
        onSuccess: (data) => {
          setStep('complete');
          if (onComplete) {
            onComplete({
              ...data.data,
              notes,
              saved: true,
            });
          }
        },
      }
    );
  };

  return (
    <motion.div
      className={styles.summary}
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.9, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
    >
      <LumaCreatureAvatar mood={creatureMood.expression} archetype={archetype} energy={energy} focus={focus} social={social} />

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className={styles.summaryContent}
      >
        <p className={styles.mainSummary}>{summary}</p>
        <p className={styles.archetypeLabel}>
          Feeling: <span className={styles.archetypeName}>{archetype}</span>
        </p>
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className={styles.notesSection}
      >
        <label htmlFor="mood-notes">Any thoughts to add? (optional)</label>
        <textarea
          id="mood-notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="How are things going..."
          className={styles.notesInput}
          rows={3}
        />
      </motion.div>

      <motion.div
        className={styles.actions}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSave}
          disabled={isPending}
          className={styles.primaryButton}
        >
          {isPending ? 'Saving...' : 'Log mood'}
        </motion.button>
        <button onClick={() => setStep('complete')} className={styles.secondaryButton}>
          Skip
        </button>
      </motion.div>
    </motion.div>
  );
};

// Complete Step
MoodCreature.Complete = function Complete() {
  return (
    <motion.div
      className={styles.farewell}
      initial={{ scale: 1.1, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
    >
      <LumaCreatureAvatar mood="happy" />
      <motion.h2 initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
        Thanks for checking in — see you tomorrow, pal.
      </motion.h2>
    </motion.div>
  );
};

// Flow Controller
MoodCreature.Flow = function Flow({ onComplete, userId }: { onComplete?: (data: any) => void; userId?: string }) {
  const { step } = useMoodContext();

  return (
    <AnimatePresence mode="wait">
      {step === 'greeting' && <MoodCreature.Greeting key="greeting" />}
      {step === 'energy' && <MoodCreature.Energy key="energy" />}
      {step === 'focus' && <MoodCreature.Focus key="focus" />}
      {step === 'social' && <MoodCreature.Social key="social" />}
      {step === 'summary' && <MoodCreature.Summary key="summary" onComplete={onComplete} userId={userId} />}
      {step === 'complete' && <MoodCreature.Complete key="complete" />}
    </AnimatePresence>
  );
};
