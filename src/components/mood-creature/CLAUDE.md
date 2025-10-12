# Mood Creature Luma System CLAUDE.md

## Purpose
Dynamic mood companion system using Lottie animations with accessibility-first design and neurodivergent-friendly interactions.

## Architecture Overview
Compound component pattern integrating Luma character avatars with mood assessment flows. Components dynamically adapt animations, colors, and particle effects based on user energy, focus, and social preferences.

## Key Components

### Core Avatar System
- `LumaCreatureAvatar.tsx:19-216` - Main avatar component with Lottie integration
- `luma-character-config.json:1-406` - Comprehensive animation and behavior configuration
- `MoodCreature2.tsx:42-341` - Compound component with context-based state management

### Animation Configuration
- `luma-character-config.json:9-122` - Animation mappings for mood states
- `luma-character-config.json:123-206` - Dynamic color palettes by archetype and mood
- `luma-character-config.json:227-287` - Accessibility configurations

### Runtime System  
- `luma_animation_schema.json:1-510` - Advanced animation schema with parameter mappings
- `luma-runtime.ts:1-305` - Expression evaluator and state computation engine

## Color System

### Archetype-Based Palettes
- `luma-character-config.json:130-179` - 8 distinct archetype color schemes
- `LumaCreatureAvatar.tsx:31-52` - Dynamic palette selection logic
- Archetypes: recharge, gather, flow, scatter, bloom, focus_forge, fog_pulse, equilibrium

### Mood-Based Colors
- `luma-character-config.json:180-206` - Energy/focus/social state colors
- `LumaCreatureAvatar.tsx:37-49` - Conditional color mapping based on slider values

## Animation System

### Lottie Integration
- Uses `lottie-react` for smooth vector animations
- `public/animations/` - 17 distinct Lottie animation files
- `LumaCreatureAvatar.tsx:60-95` - Async animation loading with fallbacks

### Animation States
- `luma-character-config.json:10-121` - Mapped to mood expressions
- idle, greeting, happy, curious, content, energized, tired, focused, scattered, social, solitary, waiting, processing, success, error

### Advanced Schema System
- `luma_animation_schema.json:100-138` - Parameter mapping with mathematical expressions
- `luma-runtime.ts:210-299` - Runtime evaluation of animation parameters
- Supports: linear interpolation, step functions, clamping, conditional logic

## Accessibility Features

### Reduced Motion Support
- `LumaCreatureAvatar.tsx:97-126` - Static fallback images
- `luma-character-config.json:228-244` - Configurable motion preferences
- Respects `prefers-reduced-motion` media query

### Screen Reader Support
- `luma-character-config.json:245-270` - Comprehensive aria-label descriptions
- `LumaCreatureAvatar.tsx:122,176` - Dynamic aria-label assignment

### Color Accessibility
- `luma-character-config.json:271-287` - Color-blind friendly palettes
- Support for protanopia, deuteranopia, tritanopia

## Performance Optimizations

### Loading Strategy
- `LumaCreatureAvatar.tsx:128-148` - Loading states with animated indicators
- `luma-character-config.json:333-358` - Quality level configurations
- Lazy loading for non-critical animations

### Component Optimization
- `LumaCreatureAvatar.tsx:19` - React.memo for render optimization
- `MoodCreature2.tsx:27-33` - Context to prevent prop drilling
- Compound component pattern for composition flexibility

## Integration Points

### Mood Assessment Flow
- `MoodCreature2.tsx:78-324` - Multi-step mood assessment
- Energy, focus, social sliders with archetype classification
- `hooks/useMoodSubmit` - Data persistence integration

### Particle Effects
- `LumaCreatureAvatar.tsx:181-214` - Dynamic particle systems
- `luma-character-config.json:28-32` - Configurable particle effects
- Conditional rendering based on mood states

### Sound System
- `luma-character-config.json:207-226` - Ambient and interaction sounds
- Audio mapped to energy levels and interactions
- Volume controls and accessibility preferences

## Configuration Options

### Animation Timing
- `luma-character-config.json:12,18,25` - Duration and loop settings
- `luma-character-config.json:327-331` - Global transition configuration

### Behavioral Customization
- `luma-character-config.json:289-331` - Idle variations and reactive behaviors
- Mouse proximity responses and interaction feedback

### User Preferences
- `luma-character-config.json:359-406` - Customization and unlockable content
- Session-based progression system

## Usage Patterns

### Basic Implementation
```tsx
// Reference: MoodCreature2.tsx:90,123,158,193,255,318
<LumaCreatureAvatar 
  mood="greeting" 
  archetype="equilibrium"
  energy={50}
  focus={50} 
  social={50}
  isReducedMotion={false}
/>
```

### Compound Component Flow
```tsx
// Reference: MoodCreature2.tsx:327-340
<MoodCreature>
  <MoodCreature.Flow onComplete={handleComplete} userId={userId} />
</MoodCreature>
```

## File Dependencies

### Core Files
- `LumaCreatureAvatar.tsx` - Main avatar component
- `luma-character-config.json` - Primary configuration
- `MoodCreature2.tsx` - Compound component system
- `mood-creature-enhanced.module.css` - Styling

### Animation Assets
- `public/animations/*.json` - Lottie animation files
- Static fallbacks in `public/images/` (referenced but not created)

### Advanced Runtime
- `luma_animation_schema.json` - Mathematical animation schema
- `luma-runtime.ts` - Expression evaluation engine

### Supporting Components
- `AnimatedSlider.tsx` - Interactive sliders
- `ErrorBoundary.tsx` - Error handling
- `LoadingState.tsx` - Loading indicators
- `hooks/useMoodSubmit.tsx` - Data persistence

## Testing Considerations

- Test reduced motion preferences
- Verify color palette accessibility
- Animation loading error scenarios
- Context provider error boundaries
- Mathematical expression evaluation edge cases

## Future Extensibility

Configuration system designed for:
- Additional archetype definitions
- Custom animation states
- Extended particle effect types
- Progressive unlockable content
- Advanced behavioral patterns