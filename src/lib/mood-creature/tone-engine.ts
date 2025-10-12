import toneBundle from './data/tone-bundle.json';
import { Archetype, ArchetypeType, GeneratedSentence, ToneAdjective, ToneCubePoint } from './types';

export class ToneEngine {
  private static getTier(value: number): 'low' | 'medium' | 'high' {
    if (value <= 33) return 'low';
    if (value <= 66) return 'medium';
    return 'high';
  }

  private static getRandomFromArray<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  private static getWeightedRandom<T extends { weight?: number }>(items: T[]): T {
    const weights = items.map((item) => item.weight || 1);
    const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
    let random = Math.random() * totalWeight;

    for (let i = 0; i < items.length; i++) {
      random -= weights[i];
      if (random <= 0) {
        return items[i];
      }
    }

    return items[items.length - 1];
  }

  public static getArchetype(point: ToneCubePoint): ArchetypeType {
    const { energy, focus, social } = point;

    for (const archetype of toneBundle.archetypes) {
      const [energyMin, energyMax] = archetype.energyRange;
      const [focusMin, focusMax] = archetype.focusRange;
      const [socialMin, socialMax] = archetype.socialRange;

      if (
        energy >= energyMin &&
        energy <= energyMax &&
        focus >= focusMin &&
        focus <= focusMax &&
        social >= socialMin &&
        social <= socialMax
      ) {
        return archetype.name as ArchetypeType;
      }
    }

    return 'Equilibrium';
  }

  public static getAdjective(value: number, axis: 'energy' | 'focus' | 'social'): string {
    const tier = this.getTier(value);
    const adjectives = toneBundle.toneCube[axis].filter((adj: ToneAdjective) => adj.tier === tier);

    if (adjectives.length === 0) {
      return axis;
    }

    return this.getRandomFromArray(adjectives).adjective;
  }

  public static generateSentence(point: ToneCubePoint): GeneratedSentence {
    const archetype = this.getArchetype(point);

    // Get adjectives for each axis
    const energyAdj = this.getAdjective(point.energy, 'energy');
    const focusAdj = this.getAdjective(point.focus, 'focus');
    const socialAdj = this.getAdjective(point.social, 'social');

    // Select templates
    const openingTemplate = this.getWeightedRandom(toneBundle.sentenceTemplates.opening);
    const middleTemplate = this.getWeightedRandom(toneBundle.sentenceTemplates.middle);
    const closingTemplate = this.getWeightedRandom(toneBundle.sentenceTemplates.closing);

    // Replace placeholders
    const opening = openingTemplate.template.replace('{energy}', energyAdj);
    const middle = middleTemplate.template.replace('{focus}', focusAdj);
    const closing = closingTemplate.template.replace('{social}', socialAdj);

    // Combine with proper punctuation
    const full = `${opening}, ${middle}, ${closing}.`;

    return {
      opening,
      middle,
      closing,
      full,
      archetype,
    };
  }

  public static getFlavorPhrase(archetype: ArchetypeType): string {
    const archetypeData = toneBundle.archetypes.find((a: Archetype) => a.name === archetype);

    if (!archetypeData || archetypeData.flavorPacks.length === 0) {
      return '';
    }

    const flavorPackName = this.getRandomFromArray(archetypeData.flavorPacks);
    const flavorPack = toneBundle.flavorPacks[flavorPackName];

    if (!flavorPack || flavorPack.phrases.length === 0) {
      return '';
    }

    return this.getRandomFromArray(flavorPack.phrases);
  }

  public static generateFullSummary(point: ToneCubePoint): string {
    const sentence = this.generateSentence(point);
    const flavorPhrase = this.getFlavorPhrase(sentence.archetype);

    if (flavorPhrase) {
      return `${sentence.full} ${flavorPhrase}.`;
    }

    return sentence.full;
  }

  public static getPrompts() {
    return toneBundle.prompts;
  }

  public static calculateMoodPoint(responses: number[]): ToneCubePoint {
    // Responses are 0-100 values from the sliders
    // Map directly to energy, focus, social
    return {
      energy: Math.round(responses[0] || 50),
      focus: Math.round(responses[1] || 50),
      social: Math.round(responses[2] || 50),
    };
  }

  public static getArchetypeDescription(archetype: ArchetypeType): string {
    const archetypeData = toneBundle.archetypes.find((a: Archetype) => a.name === archetype);
    return archetypeData?.description || '';
  }

  public static getCreatureMood(archetype: ArchetypeType): {
    color: string;
    animation: string;
    expression: string;
  } {
    // Map archetypes to creature visual states
    const moods: Record<ArchetypeType, { color: string; animation: string; expression: string }> = {
      Recharge: {
        color: '#7c8ea3',
        animation: 'slow-breathe',
        expression: 'sleepy',
      },
      Gather: {
        color: '#9b8ec1',
        animation: 'gentle-sway',
        expression: 'thoughtful',
      },
      Flow: {
        color: '#5c9ead',
        animation: 'focused-pulse',
        expression: 'determined',
      },
      Scatter: {
        color: '#f4a261',
        animation: 'bouncy',
        expression: 'playful',
      },
      Bloom: {
        color: '#e76f51',
        animation: 'radiate',
        expression: 'joyful',
      },
      'Focus Forge': {
        color: '#2a9d8f',
        animation: 'steady-pulse',
        expression: 'concentrated',
      },
      'Fog Pulse': {
        color: '#c9ada7',
        animation: 'drift',
        expression: 'dreamy',
      },
      Equilibrium: {
        color: '#8b9dc3',
        animation: 'balanced-breathe',
        expression: 'content',
      },
    };

    return moods[archetype] || moods['Equilibrium'];
  }
}
