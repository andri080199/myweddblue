import { NextRequest, NextResponse } from 'next/server';
import masterDB from '@/utils/db';

// Table initialization flag (only run once per server start)
let tableInitialized = false;

// Ensure theme_backgrounds table exists (run only once)
async function ensureTable() {
  if (tableInitialized) return;

  await masterDB.query(`
    CREATE TABLE IF NOT EXISTS theme_backgrounds (
      id SERIAL PRIMARY KEY,
      theme_id VARCHAR(100) UNIQUE NOT NULL,
      backgrounds JSONB DEFAULT '{}',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  tableInitialized = true;
}

// GET - Fetch backgrounds for a theme
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const themeId = searchParams.get('themeId');

  try {
    await ensureTable();

    if (themeId) {
      // Get backgrounds for specific theme
      const result = await masterDB.query(
        'SELECT * FROM theme_backgrounds WHERE theme_id = $1',
        [themeId]
      );

      if (result.rows.length > 0) {
        return NextResponse.json({
          success: true,
          themeId: result.rows[0].theme_id,
          backgrounds: result.rows[0].backgrounds || {}
        });
      }

      // Return empty backgrounds if theme not found
      return NextResponse.json({
        success: true,
        themeId,
        backgrounds: {}
      });
    }

    // Get all theme backgrounds
    const result = await masterDB.query(
      'SELECT * FROM theme_backgrounds ORDER BY theme_id'
    );

    return NextResponse.json({
      success: true,
      themes: result.rows.map(row => ({
        themeId: row.theme_id,
        backgrounds: row.backgrounds || {},
        updatedAt: row.updated_at
      }))
    });
  } catch (error) {
    console.error('Error fetching theme backgrounds:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch theme backgrounds' },
      { status: 500 }
    );
  }
}

// POST - Save/Update backgrounds for a theme
export async function POST(req: NextRequest) {
  try {
    await ensureTable();

    const { themeId, sectionId, backgroundUrl, backgrounds } = await req.json();

    if (!themeId) {
      return NextResponse.json(
        { success: false, message: 'Theme ID is required' },
        { status: 400 }
      );
    }

    // If full backgrounds object is provided, save all at once
    if (backgrounds) {
      const result = await masterDB.query(
        `INSERT INTO theme_backgrounds (theme_id, backgrounds, updated_at)
         VALUES ($1, $2, CURRENT_TIMESTAMP)
         ON CONFLICT (theme_id)
         DO UPDATE SET backgrounds = $2, updated_at = CURRENT_TIMESTAMP
         RETURNING *`,
        [themeId, JSON.stringify(backgrounds)]
      );

      return NextResponse.json({
        success: true,
        themeId: result.rows[0].theme_id,
        backgrounds: result.rows[0].backgrounds
      });
    }

    // Update single section background
    if (sectionId) {
      // First, get existing backgrounds
      const existing = await masterDB.query(
        'SELECT backgrounds FROM theme_backgrounds WHERE theme_id = $1',
        [themeId]
      );

      let currentBackgrounds = existing.rows.length > 0
        ? existing.rows[0].backgrounds || {}
        : {};

      // Update the specific section
      if (backgroundUrl) {
        currentBackgrounds[sectionId] = backgroundUrl;
      } else {
        delete currentBackgrounds[sectionId];
      }

      const result = await masterDB.query(
        `INSERT INTO theme_backgrounds (theme_id, backgrounds, updated_at)
         VALUES ($1, $2, CURRENT_TIMESTAMP)
         ON CONFLICT (theme_id)
         DO UPDATE SET backgrounds = $2, updated_at = CURRENT_TIMESTAMP
         RETURNING *`,
        [themeId, JSON.stringify(currentBackgrounds)]
      );

      return NextResponse.json({
        success: true,
        themeId: result.rows[0].theme_id,
        backgrounds: result.rows[0].backgrounds
      });
    }

    return NextResponse.json(
      { success: false, message: 'Either backgrounds object or sectionId is required' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error saving theme backgrounds:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to save theme backgrounds' },
      { status: 500 }
    );
  }
}

// DELETE - Remove background for a section or entire theme
export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const themeId = searchParams.get('themeId');
  const sectionId = searchParams.get('sectionId');

  if (!themeId) {
    return NextResponse.json(
      { success: false, message: 'Theme ID is required' },
      { status: 400 }
    );
  }

  try {
    await ensureTable();

    if (sectionId) {
      // Remove specific section background
      const existing = await masterDB.query(
        'SELECT backgrounds FROM theme_backgrounds WHERE theme_id = $1',
        [themeId]
      );

      if (existing.rows.length > 0) {
        const currentBackgrounds = existing.rows[0].backgrounds || {};
        delete currentBackgrounds[sectionId];

        await masterDB.query(
          `UPDATE theme_backgrounds
           SET backgrounds = $1, updated_at = CURRENT_TIMESTAMP
           WHERE theme_id = $2`,
          [JSON.stringify(currentBackgrounds), themeId]
        );
      }

      return NextResponse.json({ success: true, message: 'Section background removed' });
    }

    // Remove entire theme backgrounds
    await masterDB.query(
      'DELETE FROM theme_backgrounds WHERE theme_id = $1',
      [themeId]
    );

    return NextResponse.json({ success: true, message: 'Theme backgrounds removed' });
  } catch (error) {
    console.error('Error deleting theme backgrounds:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete theme backgrounds' },
      { status: 500 }
    );
  }
}
