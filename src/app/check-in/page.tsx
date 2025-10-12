'use client';

import { MoodCreature } from '@/components/mood-creature/MoodCreature2';

export default function CheckInPage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <MoodCreature onComplete={(data) => console.log('Mood logged:', data)}>
        <MoodCreature.Flow />
      </MoodCreature>
    </main>
  );
}
