import { NextRequest, NextResponse } from 'next/server';
import masterDB from '@/utils/db';

// Table initialization flag (only run once per server start)
let tableInitialized = false;

// Server-side cache for background theme list (5 minute TTL)
let backgroundThemesCache: any = null;
let cacheTimestamp = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Ensure custom_background_themes table exists (run only once)
async function ensureTable() {
  if (tableInitialized) return;

  await masterDB.query(`
    CREATE TABLE IF NOT EXISTS custom_background_themes (
      id SERIAL PRIMARY KEY,
      theme_id VARCHAR(100) UNIQUE NOT NULL,
      theme_name VARCHAR(255) NOT NULL,
      description VARCHAR(500),
      backgrounds JSONB DEFAULT '{}',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await masterDB.query(`
    CREATE INDEX IF NOT EXISTS idx_custom_background_themes_theme_id
    ON custom_background_themes(theme_id)
  `);

  tableInitialized = true;
}

// GET - Fetch all custom background themes or a specific one
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const themeId = searchParams.get('themeId');

  try {
    await ensureTable();

    if (themeId) {
      // Get specific background theme (always includes backgrounds for single fetch)
      const result = await masterDB.query(
        'SELECT * FROM custom_background_themes WHERE theme_id = $1',
        [themeId]
      );

      if (result.rows.length > 0) {
        return NextResponse.json({
          success: true,
          theme: {
            themeId: result.rows[0].theme_id,
            themeName: result.rows[0].theme_name,
            description: result.rows[0].description,
            backgrounds: result.rows[0].backgrounds,
            createdAt: result.rows[0].created_at,
            updatedAt: result.rows[0].updated_at
          }
        });
      }

      return NextResponse.json(
        { success: false, message: 'Background theme not found' },
        { status: 404 }
      );
    }

    // Get all custom background themes - with server-side caching
    const now = Date.now();
    const forceRefresh = searchParams.get('refresh') === 'true';
    const includeBackgrounds = searchParams.get('includeBackgrounds') === 'true';

    // Return cached data if still valid and not force refresh
    if (!forceRefresh && backgroundThemesCache && now - cacheTimestamp < CACHE_DURATION) {
      return NextResponse.json(backgroundThemesCache);
    }

    // Fetch from database - include all necessary fields to extract thumbnail
    const result = await masterDB.query(
      includeBackgrounds
        ? 'SELECT * FROM custom_background_themes ORDER BY created_at DESC'
        : 'SELECT id, theme_id, theme_name, description, backgrounds, created_at, updated_at FROM custom_background_themes ORDER BY created_at DESC'
    );

    const responseData = {
      success: true,
      themes: result.rows.map(row => {
        // Extract thumbnail (hero image or first available background)
        let thumbnail = null;
        if (row.backgrounds) {
          if (row.backgrounds.hero) {
            thumbnail = row.backgrounds.hero;
          } else {
            const keys = Object.keys(row.backgrounds);
            if (keys.length > 0) {
              thumbnail = row.backgrounds[keys[0]];
            }
          }
        }

        return {
          themeId: row.theme_id,
          themeName: row.theme_name,
          description: row.description,
          thumbnail, // Add this field
          backgrounds: includeBackgrounds ? row.backgrounds : undefined,
          createdAt: row.created_at,
          updatedAt: row.updated_at
        };
      })
    };

    // Update cache
    backgroundThemesCache = responseData;
    cacheTimestamp = now;

    return NextResponse.json(responseData);
  } catch (error) {
    console.error('Error fetching custom background themes:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch background themes' },
      { status: 500 }
    );
  }
}

// POST - Create new custom background theme
export async function POST(req: NextRequest) {
  try {
    await ensureTable();

    const { themeId, themeName, description, backgrounds } = await req.json();

    if (!themeId || !themeName) {
      return NextResponse.json(
        { success: false, message: 'Theme ID and name are required' },
        { status: 400 }
      );
    }

    // Check if theme ID already exists
    const existing = await masterDB.query(
      'SELECT id FROM custom_background_themes WHERE theme_id = $1',
      [themeId]
    );

    if (existing.rows.length > 0) {
      return NextResponse.json(
        { success: false, message: 'Background theme ID already exists' },
        { status: 400 }
      );
    }

    // Insert new background theme
    const result = await masterDB.query(
      `INSERT INTO custom_background_themes (theme_id, theme_name, description, backgrounds, updated_at)
       VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP)
       RETURNING *`,
      [
        themeId,
        themeName,
        description || '',
        JSON.stringify(backgrounds || {})
      ]
    );

    // Invalidate cache
    backgroundThemesCache = null;
    cacheTimestamp = 0;

    return NextResponse.json({
      success: true,
      theme: {
        themeId: result.rows[0].theme_id,
        themeName: result.rows[0].theme_name,
        description: result.rows[0].description,
        backgrounds: result.rows[0].backgrounds
      }
    });
  } catch (error) {
    console.error('Error creating custom background theme:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create background theme' },
      { status: 500 }
    );
  }
}

// PUT - Update existing custom background theme
export async function PUT(req: NextRequest) {
  try {
    await ensureTable();

    const { themeId, themeName, description, backgrounds, sectionId, backgroundUrl } = await req.json();

    if (!themeId) {
      return NextResponse.json(
        { success: false, message: 'Theme ID is required' },
        { status: 400 }
      );
    }

    // If updating a single section background
    if (sectionId) {
      // Get existing backgrounds
      const existing = await masterDB.query(
        'SELECT backgrounds FROM custom_background_themes WHERE theme_id = $1',
        [themeId]
      );

      if (existing.rows.length === 0) {
        return NextResponse.json(
          { success: false, message: 'Background theme not found' },
          { status: 404 }
        );
      }

      const currentBackgrounds = existing.rows[0].backgrounds || {};

      // Update the specific section
      if (backgroundUrl) {
        currentBackgrounds[sectionId] = backgroundUrl;
      } else {
        delete currentBackgrounds[sectionId];
      }

      const result = await masterDB.query(
        `UPDATE custom_background_themes
         SET backgrounds = $1, updated_at = CURRENT_TIMESTAMP
         WHERE theme_id = $2
         RETURNING *`,
        [JSON.stringify(currentBackgrounds), themeId]
      );

      // Invalidate cache
      backgroundThemesCache = null;
      cacheTimestamp = 0;

      return NextResponse.json({
        success: true,
        theme: {
          themeId: result.rows[0].theme_id,
          themeName: result.rows[0].theme_name,
          description: result.rows[0].description,
          backgrounds: result.rows[0].backgrounds
        }
      });
    }

    // Full update
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

    if (backgrounds) {
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
      `UPDATE custom_background_themes
       SET ${updates.join(', ')}
       WHERE theme_id = $${paramCount}
       RETURNING *`,
      values
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Background theme not found' },
        { status: 404 }
      );
    }

    // Invalidate cache
    backgroundThemesCache = null;
    cacheTimestamp = 0;

    return NextResponse.json({
      success: true,
      theme: {
        themeId: result.rows[0].theme_id,
        themeName: result.rows[0].theme_name,
        description: result.rows[0].description,
        backgrounds: result.rows[0].backgrounds
      }
    });
  } catch (error) {
    console.error('Error updating custom background theme:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update background theme' },
      { status: 500 }
    );
  }
}

// DELETE - Remove custom background theme
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

    // If deleting a specific section background
    if (sectionId) {
      const existing = await masterDB.query(
        'SELECT backgrounds FROM custom_background_themes WHERE theme_id = $1',
        [themeId]
      );

      if (existing.rows.length === 0) {
        return NextResponse.json(
          { success: false, message: 'Background theme not found' },
          { status: 404 }
        );
      }

      const currentBackgrounds = existing.rows[0].backgrounds || {};
      delete currentBackgrounds[sectionId];

      await masterDB.query(
        `UPDATE custom_background_themes
         SET backgrounds = $1, updated_at = CURRENT_TIMESTAMP
         WHERE theme_id = $2`,
        [JSON.stringify(currentBackgrounds), themeId]
      );

      // Invalidate cache
      backgroundThemesCache = null;
      cacheTimestamp = 0;

      return NextResponse.json({
        success: true,
        message: 'Section background removed'
      });
    }

    // Delete entire background theme
    const result = await masterDB.query(
      'DELETE FROM custom_background_themes WHERE theme_id = $1 RETURNING *',
      [themeId]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Background theme not found' },
        { status: 404 }
      );
    }

    // Invalidate cache
    backgroundThemesCache = null;
    cacheTimestamp = 0;

    return NextResponse.json({
      success: true,
      message: 'Background theme deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting custom background theme:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete background theme' },
      { status: 500 }
    );
  }
}
