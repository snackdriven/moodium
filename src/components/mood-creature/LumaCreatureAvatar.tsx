'use client';

import { motion } from 'framer-motion';
import Lottie from 'lottie-react';
import { memo, useEffect, useState, useMemo } from 'react';

import lumaConfig from './luma-character-config.json';
import styles from './mood-creature-enhanced.module.css';

interface LumaCreatureAvatarProps {
  mood?: string;
  archetype?: string;
  energy?: number;
  focus?: number;
  social?: number;
  isReducedMotion?: boolean;
}

export const LumaCreatureAvatar = memo(function LumaCreatureAvatar({
  mood = 'content',
  archetype = 'equilibrium',
  energy = 50,
  focus = 50,
  social = 50,
  isReducedMotion = false,
}: LumaCreatureAvatarProps) {
  const [animationData, setAnimationData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Get color palette based on archetype or mood
  const colorPalette = useMemo(() => {
    if (archetype && lumaConfig.color_palettes.archetypes[archetype as keyof typeof lumaConfig.color_palettes.archetypes]) {
      return lumaConfig.color_palettes.archetypes[archetype as keyof typeof lumaConfig.color_palettes.archetypes];
    }
    
    // Determine mood-based color
    if (energy > 70) {
      return lumaConfig.color_palettes.mood_based.high_energy;
    } else if (energy < 30) {
      return lumaConfig.color_palettes.mood_based.low_energy;
    } else if (focus > 70) {
      return lumaConfig.color_palettes.mood_based.focused;
    } else if (focus < 30) {
      return lumaConfig.color_palettes.mood_based.scattered;
    } else if (social > 70) {
      return lumaConfig.color_palettes.mood_based.social;
    } else if (social < 30) {
      return lumaConfig.color_palettes.mood_based.solitary;
    }
    
    return lumaConfig.color_palettes.default;
  }, [archetype, energy, focus, social]);

  // Get animation config for current mood
  const animationConfig = useMemo(() => {
    const moodKey = mood.toLowerCase().replace(' ', '_');
    return lumaConfig.animations[moodKey as keyof typeof lumaConfig.animations] || lumaConfig.animations.idle;
  }, [mood]);

  // Load animation data
  useEffect(() => {
    if (isReducedMotion && lumaConfig.accessibility.reduced_motion.use_static_images) {
      setIsLoading(false);
      return;
    }

    // Load the animation file
    const loadAnimation = async () => {
      try {
        // Get the animation path from config based on mood
        const moodKey = mood.toLowerCase().replace(' ', '_');
        const moodConfig = lumaConfig.animations[moodKey as keyof typeof lumaConfig.animations] || lumaConfig.animations.idle;
        const animationPath = moodConfig.lottie || '/animations/luma-placeholder.json';
        
        const response = await fetch(animationPath);
        const data = await response.json();
        setAnimationData(data);
      } catch (error) {
        console.error('Failed to load animation:', error);
        // Fallback to placeholder
        try {
          const fallbackResponse = await fetch('/animations/luma-placeholder.json');
          const fallbackData = await fallbackResponse.json();
          setAnimationData(fallbackData);
        } catch (fallbackError) {
          console.error('Failed to load fallback animation:', fallbackError);
          setAnimationData(null);
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadAnimation();
  }, [mood, isReducedMotion]);

  // Accessibility: Use static fallback for reduced motion
  if (isReducedMotion && lumaConfig.accessibility.reduced_motion.use_static_images) {
    const staticImage = lumaConfig.accessibility.reduced_motion.static_fallbacks[mood as keyof typeof lumaConfig.accessibility.reduced_motion.static_fallbacks] 
      || lumaConfig.accessibility.reduced_motion.static_fallbacks.idle;
    
    return (
      <motion.div
        className={styles.creatureWrapper}
        style={{
          '--primary-color': colorPalette.primary,
          '--glow-color': colorPalette.glow || colorPalette.primary,
        } as React.CSSProperties}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div 
          className={styles.creatureSvg}
          style={{
            width: 200,
            height: 200,
            backgroundColor: colorPalette.primary,
            borderRadius: '50%',
            boxShadow: `0 0 30px ${colorPalette.glow || colorPalette.primary}`,
          }}
          aria-label={lumaConfig.accessibility.screen_reader.descriptions[mood as keyof typeof lumaConfig.accessibility.screen_reader.descriptions] || 'Luma creature'}
        />
      </motion.div>
    );
  }

  // Loading state
  if (isLoading || !animationData) {
    return (
      <div className={styles.creatureWrapper}>
        <div className={styles.loadingCreature}>
          <motion.div
            className={styles.loadingDot}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: 0,
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className={styles.creatureWrapper}
      style={{
        '--primary-color': colorPalette.primary,
        '--glow-color': colorPalette.glow || colorPalette.primary,
      } as React.CSSProperties}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div
        style={{
          filter: `drop-shadow(0 0 20px ${colorPalette.glow || colorPalette.primary})`,
          width: 200,
          height: 200,
        }}
      >
        <Lottie
          animationData={animationData}
          loop={animationConfig.loop}
          autoplay={animationConfig.autoplay}
          style={{
            width: '100%',
            height: '100%',
          }}
          aria-label={lumaConfig.accessibility.screen_reader.descriptions[mood as keyof typeof lumaConfig.accessibility.screen_reader.descriptions] || 'Luma creature animation'}
        />
      </div>
      
      {/* Particle effects for certain moods */}
      {mood === 'happy' && animationConfig.particle_effects && (
        <motion.div
          className="particles"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {Array.from({ length: animationConfig.particle_effects.count }).map((_, i) => (
            <motion.div
              key={i}
              style={{
                position: 'absolute',
                width: 4,
                height: 4,
                backgroundColor: animationConfig.particle_effects.color,
                borderRadius: '50%',
                top: '50%',
                left: '50%',
              }}
              animate={{
                x: [0, (Math.random() - 0.5) * 200],
                y: [0, (Math.random() - 0.5) * 200],
                opacity: [1, 0],
              }}
              transition={{
                duration: 2,
                delay: i * 0.1,
                repeat: Infinity,
                repeatDelay: 1,
              }}
            />
          ))}
        </motion.div>
      )}
    </motion.div>
  );
});