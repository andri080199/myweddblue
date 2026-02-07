import { NextRequest, NextResponse } from 'next/server';
import masterDB from '@/utils/db';

// Table initialization flag (only run once per server start)
let tableInitialized = false;

// Server-side cache for color theme list (5 minute TTL)
let colorThemesCache: any = null;
let cacheTimestamp = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Ensure custom_color_themes table exists (run only once)
async function ensureTable() {
  if (tableInitialized) return;

  await masterDB.query(`
    CREATE TABLE IF NOT EXISTS custom_color_themes (
      id SERIAL PRIMARY KEY,
      theme_id VARCHAR(100) UNIQUE NOT NULL,
      theme_name VARCHAR(255) NOT NULL,
      description VARCHAR(500),
      colors JSONB NOT NULL,
      custom_styles JSONB DEFAULT '{}',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await masterDB.query(`
    CREATE INDEX IF NOT EXISTS idx_custom_color_themes_theme_id
    ON custom_color_themes(theme_id)
  `);

  tableInitialized = true;
}

// GET - Fetch all custom color themes or a specific one
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const themeId = searchParams.get('themeId');

  try {
    await ensureTable();

    if (themeId) {
      // Get specific color theme
      const result = await masterDB.query(
        'SELECT * FROM custom_color_themes WHERE theme_id = $1',
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
            customStyles: result.rows[0].custom_styles,
            createdAt: result.rows[0].created_at,
            updatedAt: result.rows[0].updated_at
          }
        });
      }

      return NextResponse.json(
        { success: false, message: 'Color theme not found' },
        { status: 404 }
      );
    }

    // Get all custom color themes - with server-side caching
    const now = Date.now();
    const forceRefresh = searchParams.get('refresh') === 'true';

    // Return cached data if still valid and not force refresh
    if (!forceRefresh && colorThemesCache && now - cacheTimestamp < CACHE_DURATION) {
      return NextResponse.json(colorThemesCache);
    }

    // Fetch from database
    const result = await masterDB.query(
      'SELECT * FROM custom_color_themes ORDER BY created_at DESC'
    );

    const responseData = {
      success: true,
      themes: result.rows.map(row => ({
        themeId: row.theme_id,
        themeName: row.theme_name,
        description: row.description,
        colors: row.colors,
        customStyles: row.custom_styles,
        createdAt: row.created_at,
        updatedAt: row.updated_at
      }))
    };

    // Update cache
    colorThemesCache = responseData;
    cacheTimestamp = now;

    return NextResponse.json(responseData);
  } catch (error) {
    console.error('Error fetching custom color themes:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch color themes' },
      { status: 500 }
    );
  }
}

// POST - Create new custom color theme
export async function POST(req: NextRequest) {
  try {
    await ensureTable();

    const { themeId, themeName, description, colors, customStyles } = await req.json();

    if (!themeId || !themeName || !colors) {
      return NextResponse.json(
        { success: false, message: 'Theme ID, name, and colors are required' },
        { status: 400 }
      );
    }

    // Validate colors object has required fields
    const requiredColorFields = ['primary', 'primarylight', 'darkprimary', 'textprimary', 'gold', 'lightblue', 'secondary', 'accent'];
    const missingFields = requiredColorFields.filter(field => !colors[field]);

    if (missingFields.length > 0) {
      return NextResponse.json(
        { success: false, message: `Missing required color fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    // Check if theme ID already exists
    const existing = await masterDB.query(
      'SELECT id FROM custom_color_themes WHERE theme_id = $1',
      [themeId]
    );

    if (existing.rows.length > 0) {
      return NextResponse.json(
        { success: false, message: 'Color theme ID already exists' },
        { status: 400 }
      );
    }

    // Generate custom styles if not provided
    const defaultStyles = {
      borderRadius: '1rem',
      boxShadow: `0 4px 6px -1px rgba(${hexToRgb(colors.primary)}, 0.1)`,
      gradient: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.primarylight} 100%)`
    };

    // Insert new color theme
    const result = await masterDB.query(
      `INSERT INTO custom_color_themes (theme_id, theme_name, description, colors, custom_styles, updated_at)
       VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP)
       RETURNING *`,
      [
        themeId,
        themeName,
        description || '',
        JSON.stringify(colors),
        JSON.stringify(customStyles || defaultStyles)
      ]
    );

    // Invalidate cache
    colorThemesCache = null;
    cacheTimestamp = 0;

    return NextResponse.json({
      success: true,
      theme: {
        themeId: result.rows[0].theme_id,
        themeName: result.rows[0].theme_name,
        description: result.rows[0].description,
        colors: result.rows[0].colors,
        customStyles: result.rows[0].custom_styles
      }
    });
  } catch (error) {
    console.error('Error creating custom color theme:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create color theme' },
      { status: 500 }
    );
  }
}

// PUT - Update existing custom color theme
export async function PUT(req: NextRequest) {
  try {
    await ensureTable();

    const { themeId, themeName, description, colors, customStyles } = await req.json();

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

    if (customStyles) {
      updates.push(`custom_styles = $${paramCount++}`);
      values.push(JSON.stringify(customStyles));
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
      `UPDATE custom_color_themes
       SET ${updates.join(', ')}
       WHERE theme_id = $${paramCount}
       RETURNING *`,
      values
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Color theme not found' },
        { status: 404 }
      );
    }

    // Invalidate cache
    colorThemesCache = null;
    cacheTimestamp = 0;

    return NextResponse.json({
      success: true,
      theme: {
        themeId: result.rows[0].theme_id,
        themeName: result.rows[0].theme_name,
        description: result.rows[0].description,
        colors: result.rows[0].colors,
        customStyles: result.rows[0].custom_styles
      }
    });
  } catch (error) {
    console.error('Error updating custom color theme:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update color theme' },
      { status: 500 }
    );
  }
}

// DELETE - Remove custom color theme
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
      'DELETE FROM custom_color_themes WHERE theme_id = $1 RETURNING *',
      [themeId]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Color theme not found' },
        { status: 404 }
      );
    }

    // Invalidate cache
    colorThemesCache = null;
    cacheTimestamp = 0;

    return NextResponse.json({
      success: true,
      message: 'Color theme deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting custom color theme:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete color theme' },
      { status: 500 }
    );
  }
}

// Helper function to convert hex color to RGB
function hexToRgb(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (result) {
    const r = parseInt(result[1], 16);
    const g = parseInt(result[2], 16);
    const b = parseInt(result[3], 16);
    return `${r}, ${g}, ${b}`;
  }
  return '0, 0, 0';
}
