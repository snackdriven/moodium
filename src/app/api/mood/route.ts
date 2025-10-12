import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import * as schema from '@/lib/db/schema';
import { ToneEngine } from '@/lib/mood-creature/tone-engine';
import { z } from 'zod';

// Request validation schema
const moodSubmissionSchema = z.object({
  energyLevel: z.number().min(0).max(100),
  focusLevel: z.number().min(0).max(100),
  socialLevel: z.number().min(0).max(100),
  responses: z.array(z.number()).length(3),
  userId: z.string().uuid().optional(),
});

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();
    
    // Validate request
    const validatedData = moodSubmissionSchema.parse(body);
    
    // Calculate mood point from responses
    const moodPoint = {
      energy: validatedData.energyLevel,
      focus: validatedData.focusLevel,
      social: validatedData.socialLevel,
    };
    
    // Generate archetype and summary
    const archetype = ToneEngine.getArchetype(moodPoint);
    const summary = ToneEngine.generateFullSummary(moodPoint);
    
    // Get prompts used (from the tone engine)
    const prompts = ToneEngine.getPrompts();
    
    // Prepare entry for database
    const moodEntry = {
      userId: validatedData.userId || null,
      energyLevel: validatedData.energyLevel,
      focusLevel: validatedData.focusLevel,
      socialLevel: validatedData.socialLevel,
      archetype: archetype,
      prompts: prompts,
      responses: validatedData.responses,
      generatedSummary: summary,
    };
    
    // Save to database if configured
    let savedEntry = null;
    if (db) {
      const result = await db
        .insert(schema.moodEntries)
        .values(moodEntry)
        .returning();
      savedEntry = result[0];
    } else {
      // If database is not configured, return mock response
      savedEntry = {
        ...moodEntry,
        id: crypto.randomUUID(),
        createdAt: new Date(),
      };
    }
    
    // Return success response
    return NextResponse.json({
      success: true,
      data: {
        id: savedEntry.id,
        archetype: savedEntry.archetype,
        summary: savedEntry.generatedSummary,
        createdAt: savedEntry.createdAt,
        moodPoint,
        creatureMood: ToneEngine.getCreatureMood(archetype),
      },
    });
  } catch (error) {
    console.error('Error processing mood submission:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { success: false, error: 'Failed to process mood submission' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Get user ID from query params
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      );
    }
    
    // Get user's mood entries from database
    if (db) {
      const entries = await db
        .select()
        .from(schema.moodEntries)
        .where(schema.moodEntries.userId.eq(userId))
        .orderBy(schema.moodEntries.createdAt.desc())
        .limit(10);
      
      return NextResponse.json({
        success: true,
        data: entries,
      });
    } else {
      // If database is not configured, return empty array
      return NextResponse.json({
        success: true,
        data: [],
      });
    }
  } catch (error) {
    console.error('Error fetching mood entries:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch mood entries' },
      { status: 500 }
    );
  }
}