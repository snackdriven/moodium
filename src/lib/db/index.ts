import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

import { serverEnv } from '@/lib/env/server';
import * as schema from './schema';

const connectionString = serverEnv.DATABASE_URL || '';

// Disable if no DATABASE_URL is provided (for builds)
const isConfigured = !!connectionString;

// Create postgres connection only if configured
const queryClient = isConfigured ? postgres(connectionString) : null;

// Create drizzle instance only if configured
export const db = isConfigured && queryClient ? drizzle(queryClient, { schema }) : null;

export { schema };
