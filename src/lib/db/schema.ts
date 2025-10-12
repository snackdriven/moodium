import { pgTable, uuid, integer, varchar, jsonb, text, timestamp, pgEnum, check } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

// Define archetype enum
export const archetypeEnum = pgEnum('archetype', [
  'Recharge',
  'Gather',
  'Flow',
  'Scatter',
  'Bloom',
  'Focus Forge',
  'Fog Pulse',
  'Equilibrium'
]);

// Mood entries table
export const moodEntries = pgTable('mood_entries', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id'),
  energyLevel: integer('energy_level').notNull(),
  focusLevel: integer('focus_level').notNull(),
  socialLevel: integer('social_level').notNull(),
  archetype: varchar('archetype', { length: 50 }).notNull(),
  prompts: jsonb('prompts').notNull(),
  responses: jsonb('responses').notNull(),
  generatedSummary: text('generated_summary').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => {
  return {
    energyCheck: check('energy_check', sql`${table.energyLevel} >= 0 AND ${table.energyLevel} <= 100`),
    focusCheck: check('focus_check', sql`${table.focusLevel} >= 0 AND ${table.focusLevel} <= 100`),
    socialCheck: check('social_check', sql`${table.socialLevel} >= 0 AND ${table.socialLevel} <= 100`),
  };
});

// Type inference for TypeScript
export type MoodEntry = typeof moodEntries.$inferSelect;
export type NewMoodEntry = typeof moodEntries.$inferInsert;