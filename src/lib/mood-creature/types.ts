export interface ToneCubePoint {
  energy: number; // 0-100
  focus: number;  // 0-100
  social: number; // 0-100
}

export interface ToneAdjective {
  adjective: string;
  tier: 'low' | 'medium' | 'high';
}

export interface ToneCube {
  energy: ToneAdjective[];
  focus: ToneAdjective[];
  social: ToneAdjective[];
}

export type ArchetypeType = 
  | 'Recharge'
  | 'Gather'
  | 'Flow'
  | 'Scatter'
  | 'Bloom'
  | 'Focus Forge'
  | 'Fog Pulse'
  | 'Equilibrium';

export interface Archetype {
  name: ArchetypeType;
  energyRange: [number, number];
  focusRange: [number, number];
  socialRange: [number, number];
  flavorPacks: string[];
  description: string;
}

export interface SentenceTemplate {
  template: string;
  categories: ('energy' | 'focus' | 'social' | 'archetype')[];
  weight?: number;
}

export interface ToneBundle {
  toneCube: ToneCube;
  archetypes: Archetype[];
  sentenceTemplates: {
    opening: SentenceTemplate[];
    middle: SentenceTemplate[];
    closing: SentenceTemplate[];
  };
  flavorPacks: {
    [key: string]: {
      phrases: string[];
      weight?: number;
    };
  };
}

export interface MoodPrompt {
  question: string;
  lowOption: {
    emoji: string;
    label: string;
    description?: string;
  };
  highOption: {
    emoji: string;
    label: string;
    description?: string;
  };
}

export interface MoodEntry {
  id?: string;
  userId?: string;
  energy: number;
  focus: number;
  social: number;
  archetype: ArchetypeType;
  prompts: MoodPrompt[];
  responses: number[];
  generatedSummary: string;
  createdAt?: Date;
}

export interface GeneratedSentence {
  opening: string;
  middle: string;
  closing: string;
  full: string;
  archetype: ArchetypeType;
}