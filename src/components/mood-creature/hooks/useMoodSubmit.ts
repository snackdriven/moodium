import { useMutation, useQueryClient } from '@tanstack/react-query';

import { ToneEngine } from '@/lib/mood-creature/tone-engine';

interface MoodSubmitData {
  energyLevel: number;
  focusLevel: number;
  socialLevel: number;
  responses: number[];
  userId?: string;
  notes?: string;
}

interface MoodResponse {
  success: boolean;
  data: {
    id: string;
    archetype: string;
    summary: string;
    createdAt: string;
    moodPoint: {
      energy: number;
      focus: number;
      social: number;
    };
    creatureMood: {
      color: string;
      animation: string;
      expression: string;
    };
  };
}

export function useMoodSubmit() {
  const queryClient = useQueryClient();

  return useMutation<MoodResponse, Error, MoodSubmitData>({
    mutationFn: async (data) => {
      const response = await fetch('/api/mood', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to submit mood');
      }

      return response.json();
    },
    onSuccess: (data) => {
      // Invalidate mood history queries
      queryClient.invalidateQueries({ queryKey: ['moods'] });

      // Optimistically update the latest mood
      queryClient.setQueryData(['latest-mood'], data.data);
    },
    onError: (error) => {
      console.error('Mood submission failed:', error);
    },
  });
}

export function useOptimisticMood(energy: number, focus: number, social: number) {
  // Generate preview data immediately for optimistic UI
  const moodPoint = { energy, focus, social };
  const archetype = ToneEngine.getArchetype(moodPoint);
  const summary = ToneEngine.generateFullSummary(moodPoint);
  const creatureMood = ToneEngine.getCreatureMood(archetype);

  return {
    archetype,
    summary,
    creatureMood,
    moodPoint,
  };
}
