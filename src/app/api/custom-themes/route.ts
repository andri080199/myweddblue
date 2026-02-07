import { NextRequest, NextResponse } from 'next/server';
import masterDB from '@/utils/db';

// Table initialization flag (only run once per server start)
let tableInitialized = false;

// Ensure custom_themes table exists (run only once)
async function ensureTable() {
  if (tableInitialized) return;

  await masterDB.query(`
    CREATE TABLE IF NOT EXISTS custom_themes (
      id SERIAL PRIMARY KEY,
      theme_id VARCHAR(100) UNIQUE NOT NULL,
      theme_name VARCHAR(255) NOT NULL,
      description VARCHAR(500),
      colors JSONB NOT NULL,
      backgrounds JSONB DEFAULT '{}',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  tableInitialized = true;
}

// Server-side cache for theme list (5 minute TTL)
let themesCache: any = null;
let cacheTimestamp = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// GET - Fetch all custom themes or a specific one
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const themeId = searchParams.get('themeId');

  try {
    await ensureTable();

    if (themeId) {
      // Get specific theme
      const result = await masterDB.query(
        'SELECT * FROM custom_themes WHERE theme_id = $1',
        [themeId]
      );

      if (result.rows.length > 0) {
        return NextResponse.json({
          success: true,
          theme: {
            themeId: result.rows[0].theme_id,
            themeName: result.rows[0].theme_name,
            description: result.rows[0].description,
            colors: result.rows[0].colors,
            backgrounds: result.rows[0].backgrounds,
            createdAt: result.rows[0].created_at,
            updatedAt: result.rows[0].updated_at
          }
        });
      }

      return NextResponse.json(
        { success: false, message: 'Theme not found' },
        { status: 404 }
      );
    }

    // Get all custom themes - with server-side caching
    const now = Date.now();
    const forceRefresh = searchParams.get('refresh') === 'true';
    const includeBackgrounds = searchParams.get('includeBackgrounds') === 'true';

    // Return cached data if still valid and not force refresh
    if (!forceRefresh && themesCache && now - cacheTimestamp < CACHE_DURATION) {
      return NextResponse.json(themesCache);
    }

    // Fetch from database - exclude backgrounds for better performance
    const result = await masterDB.query(
      includeBackgrounds
        ? 'SELECT * FROM custom_themes ORDER BY created_at DESC'
        : 'SELECT id, theme_id, theme_name, description, colors, created_at, updated_at FROM custom_themes ORDER BY created_at DESC'
    );

    const responseData = {
      success: true,
      themes: result.rows.map(row => ({
        themeId: row.theme_id,
        themeName: row.theme_name,
        description: row.description,
        colors: row.colors,
        backgrounds: includeBackgrounds ? row.backgrounds : undefined,
        createdAt: row.created_at,
        updatedAt: row.updated_at
      }))
    };

    // Update cache
    themesCache = responseData;
    cacheTimestamp = now;

    return NextResponse.json(responseData);
  } catch (error) {
    console.error('Error fetching custom themes:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch themes' },
      { status: 500 }
    );
  }
}

// POST - Create new custom theme
export async function POST(req: NextRequest) {
  try {
    await ensureTable();

    const { themeId, themeName, description, colors, backgrounds } = await req.json();

    if (!themeId || !themeName || !colors) {
      return NextResponse.json(
        { success: false, message: 'Theme ID, name, and colors are required' },
        { status: 400 }
      );
    }

    // Check if theme ID already exists
    const existing = await masterDB.query(
      'SELECT id FROM custom_themes WHERE theme_id = $1',
      [themeId]
    );

    if (existing.rows.length > 0) {
      return NextResponse.json(
        { success: false, message: 'Theme ID already exists' },
        { status: 400 }
      );
    }

    // Insert new theme
    const result = await masterDB.query(
      `INSERT INTO custom_themes (theme_id, theme_name, description, colors, backgrounds, updated_at)
       VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP)
       RETURNING *`,
      [
        themeId,
        themeName,
        description || '',
        JSON.stringify(colors),
        JSON.stringify(backgrounds || {})
      ]
    );

    // Invalidate cache
    themesCache = null;
    cacheTimestamp = 0;

    return NextResponse.json({
      success: true,
      theme: result.rows[0]
    });
  } catch (error) {
    console.error('Error creating custom theme:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create theme' },
      { status: 500 }
    );
  }
}

// PUT - Update existing custom theme
export async function PUT(req: NextRequest) {
  try {
    await ensureTable();

    const { themeId, themeName, description, colors, backgrounds } = await req.json();

    if (!themeId) {
      return NextResponse.json(
        { success: false, message: 'Theme ID is required' },
        { status: 400 }
      );
    }

    // Build update query dynamically
    const updates: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    if (themeName) {
      updates.push(`theme_name = $${paramCount++}`);
      values.push(themeName);
    }

    if (description !== undefined) {
      updates.push(`description = $${paramCount++}`);
      values.push(description);
    }

    if (colors) {
      updates.push(`colors = $${paramCount++}`);
      values.push(JSON.stringify(colors));
    }

    if (backgrounds !== undefined) {
      updates.push(`backgrounds = $${paramCount++}`);
      values.push(JSON.stringify(backgrounds));
    }

    if (updates.length === 0) {
      return NextResponse.json(
        { success: false, message: 'No fields to update' },
        { status: 400 }
      );
    }

    updates.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(themeId);

    const result = await masterDB.query(
      `UPDATE custom_themes
       SET ${updates.join(', ')}
       WHERE theme_id = $${paramCount}
       RETURNING *`,
      values
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Theme not found' },
        { status: 404 }
      );
    }

    // Invalidate cache
    themesCache = null;
    cacheTimestamp = 0;

    return NextResponse.json({
      success: true,
      theme: result.rows[0]
    });
  } catch (error) {
    console.error('Error updating custom theme:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update theme' },
      { status: 500 }
    );
  }
}

// DELETE - Remove custom theme
export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const themeId = searchParams.get('themeId');

  if (!themeId) {
    return NextResponse.json(
      { success: false, message: 'Theme ID is required' },
      { status: 400 }
    );
  }

  try {
    await ensureTable();

    const result = await masterDB.query(
      'DELETE FROM custom_themes WHERE theme_id = $1 RETURNING *',
      [themeId]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Theme not found' },
        { status: 404 }
      );
    }

    // Invalidate cache
    themesCache = null;
    cacheTimestamp = 0;

    return NextResponse.json({
      success: true,
      message: 'Theme deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting custom theme:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete theme' },
      { status: 500 }
    );
  }
}
