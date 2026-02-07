import { NextRequest, NextResponse } from 'next/server';
import masterDB from '@/utils/db';

// Helper function to ensure password column exists
async function ensurePasswordColumn() {
  try {
    await masterDB.query(`
      ALTER TABLE clients
      ADD COLUMN IF NOT EXISTS password VARCHAR(255) DEFAULT 'client123'
    `);
  } catch (error) {
    // Column might already exist, ignore error
    console.log('Password column check:', error);
  }
}

// Generate random 4-character alphanumeric suffix
function generateRandomSuffix(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 4; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Generate unique slug by appending random suffix if duplicate exists
async function generateUniqueSlug(baseSlug: string): Promise<string> {
  // First, check if the base slug is available
  const existingClient = await masterDB.query(
    'SELECT id FROM clients WHERE slug = $1',
    [baseSlug]
  );

  if (existingClient.rows.length === 0) {
    // Base slug is available, use it
    return baseSlug;
  }

  // Base slug exists, generate unique slug with random suffix
  let attempts = 0;
  const maxAttempts = 10;

  while (attempts < maxAttempts) {
    const suffix = generateRandomSuffix();
    const uniqueSlug = `${baseSlug}-${suffix}`;

    const checkUnique = await masterDB.query(
      'SELECT id FROM clients WHERE slug = $1',
      [uniqueSlug]
    );

    if (checkUnique.rows.length === 0) {
      return uniqueSlug;
    }

    attempts++;
  }

  // Fallback: use timestamp if all attempts fail
  return `${baseSlug}-${Date.now().toString(36).slice(-4)}`;
}

export async function POST(req: NextRequest) {
  const {
    slug,
    theme, // Legacy: bundled theme
    colorTheme, // New: separate color theme
    backgroundTheme, // New: separate background theme
    password = 'client123'
  } = await req.json();

  if (!slug) {
    return NextResponse.json({ success: false, message: 'Slug is required' }, { status: 400 });
  }

  try {
    // Ensure password column exists before inserting
    await ensurePasswordColumn();

    // Generate unique slug (adds suffix if duplicate)
    const finalSlug = await generateUniqueSlug(slug);

    // ✅ NEW UNIFIED SYSTEM: All clients in single database
    // No more separate databases per client!
    console.log(`✅ Creating client in unified database: ${finalSlug}`);

    // Insert client record in master database
    // NEW SYSTEM: Always use color_theme + background_theme if provided
    if (colorTheme && backgroundTheme) {
      await masterDB.query(
        'INSERT INTO clients (slug, color_theme, background_theme, password) VALUES ($1, $2, $3, $4)',
        [finalSlug, colorTheme, backgroundTheme, password]
      );
      console.log(`✅ Client ${finalSlug} created with themes: ${colorTheme} + ${backgroundTheme}`);
    }
    // LEGACY SYSTEM: Use theme + optional background_theme
    else if (theme) {
      if (backgroundTheme && backgroundTheme !== 'original') {
        await masterDB.query(
          'INSERT INTO clients (slug, theme, background_theme, password) VALUES ($1, $2, $3, $4)',
          [finalSlug, theme, backgroundTheme, password]
        );
        console.log(`✅ Client ${finalSlug} created with legacy themes: ${theme} + ${backgroundTheme}`);
      } else {
        await masterDB.query(
          'INSERT INTO clients (slug, theme, password) VALUES ($1, $2, $3)',
          [finalSlug, theme, password]
        );
        console.log(`✅ Client ${finalSlug} created with legacy theme: ${theme}`);
      }
    }
    // FALLBACK: Default to original
    else {
      await masterDB.query(
        'INSERT INTO clients (slug, color_theme, background_theme, password) VALUES ($1, $2, $3, $4)',
        [finalSlug, 'original', 'original', password]
      );
      console.log(`✅ Client ${finalSlug} created with default themes: original + original`);
    }

    // NOTE: All client data (rsvp, guestbook, content, gallery) will be stored
    // in unified tables with client_id foreign keys in the master database

    // Return success with the final slug (may differ from input if suffix was added)
    return NextResponse.json({
      success: true,
      slug: finalSlug,
      wasModified: finalSlug !== slug // Indicate if slug was modified
    });
  } catch (error: unknown) {
    console.error('Error creating client:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
