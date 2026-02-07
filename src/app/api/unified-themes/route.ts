import { NextRequest, NextResponse } from 'next/server';
import masterDB from '@/utils/db';

/**
 * GET /api/unified-themes
 *
 * Fetch all unified themes or a single theme by ID
 *
 * Query params:
 * - themeId: string (optional) - Get specific theme
 * - includeOrnaments: boolean (optional) - Include ornament count in list view
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const themeId = searchParams.get('themeId');
    const includeOrnaments = searchParams.get('includeOrnaments') === 'true';

    // Get single theme by ID
    if (themeId) {
      const result = await masterDB.query(
        `SELECT * FROM unified_themes WHERE theme_id = $1`,
        [themeId]
      );

      if (result.rows.length === 0) {
        return NextResponse.json(
          { success: false, error: 'Theme not found' },
          { status: 404 }
        );
      }

      const theme = result.rows[0];

      return NextResponse.json({
        success: true,
        theme: {
          theme_id: theme.theme_id,
          theme_name: theme.theme_name,
          description: theme.description,
          is_builtin: theme.is_builtin,
          colors: theme.colors,
          custom_styles: theme.custom_styles,
          backgrounds: theme.backgrounds,
          ornaments: theme.ornaments,
          created_at: theme.created_at,
          updated_at: theme.updated_at,
        }
      });
    }

    // Get all themes
    const result = await masterDB.query(
      `SELECT
        theme_id, theme_name, description, is_builtin,
        colors, custom_styles, backgrounds, ornaments,
        created_at, updated_at
      FROM unified_themes
      ORDER BY is_builtin DESC, theme_id ASC`
    );

    const themes = result.rows.map(theme => {
      const themeData: any = {
        theme_id: theme.theme_id,
        theme_name: theme.theme_name,
        description: theme.description,
        is_builtin: theme.is_builtin,
        colors: theme.colors,
        custom_styles: theme.custom_styles,
        backgrounds: theme.backgrounds,
        created_at: theme.created_at,
        updated_at: theme.updated_at,
      };

      if (includeOrnaments) {
        const ornamentCount = theme.ornaments?.ornaments?.length || 0;
        const backgroundCount = Object.keys(theme.backgrounds || {}).length;
        const colorCount = Object.keys(theme.colors || {}).length;

        themeData.stats = {
          ornament_count: ornamentCount,
          background_count: backgroundCount,
          color_count: colorCount,
        };
      }

      return themeData;
    });

    return NextResponse.json({
      success: true,
      themes,
      count: themes.length,
    });
  } catch (error) {
    console.error('Error fetching unified themes:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch themes' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/unified-themes
 *
 * Create a new unified theme
 *
 * Body:
 * - theme_id: string (required)
 * - theme_name: string (required)
 * - description: string (optional)
 * - colors: object (required)
 * - custom_styles: object (optional)
 * - backgrounds: object (optional)
 * - ornaments: object (optional, defaults to empty array)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      theme_id,
      theme_name,
      description = '',
      colors,
      custom_styles = {},
      backgrounds = {},
      ornaments = { ornaments: [] },
    } = body;

    // Validation
    if (!theme_id || !theme_name) {
      return NextResponse.json(
        { success: false, error: 'theme_id and theme_name are required' },
        { status: 400 }
      );
    }

    if (!colors || typeof colors !== 'object') {
      return NextResponse.json(
        { success: false, error: 'colors object is required' },
        { status: 400 }
      );
    }

    // Check if theme_id already exists
    const existingCheck = await masterDB.query(
      `SELECT theme_id FROM unified_themes WHERE theme_id = $1`,
      [theme_id]
    );

    if (existingCheck.rows.length > 0) {
      return NextResponse.json(
        { success: false, error: 'Theme ID already exists' },
        { status: 409 }
      );
    }

    // Insert new theme
    const result = await masterDB.query(
      `INSERT INTO unified_themes (
        theme_id, theme_name, description, is_builtin,
        colors, custom_styles, backgrounds, ornaments,
        created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())
      RETURNING *`,
      [
        theme_id,
        theme_name,
        description,
        false, // Custom themes are not built-in
        JSON.stringify(colors),
        JSON.stringify(custom_styles),
        JSON.stringify(backgrounds),
        JSON.stringify(ornaments),
      ]
    );

    const theme = result.rows[0];

    return NextResponse.json({
      success: true,
      message: `Theme "${theme_name}" created successfully`,
      theme: {
        theme_id: theme.theme_id,
        theme_name: theme.theme_name,
        description: theme.description,
        is_builtin: theme.is_builtin,
        colors: theme.colors,
        custom_styles: theme.custom_styles,
        backgrounds: theme.backgrounds,
        ornaments: theme.ornaments,
      },
    });
  } catch (error) {
    console.error('Error creating unified theme:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create theme' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/unified-themes?themeId=xxx
 *
 * Update an existing unified theme
 *
 * Body: Can include any of these fields to update
 * - theme_name: string
 * - description: string
 * - colors: object
 * - custom_styles: object
 * - backgrounds: object
 * - ornaments: object
 */
export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const themeId = searchParams.get('themeId');

    if (!themeId) {
      return NextResponse.json(
        { success: false, error: 'themeId is required' },
        { status: 400 }
      );
    }

    const body = await request.json();

    // Check if theme exists
    const existingTheme = await masterDB.query(
      `SELECT theme_id, is_builtin FROM unified_themes WHERE theme_id = $1`,
      [themeId]
    );

    if (existingTheme.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Theme not found' },
        { status: 404 }
      );
    }

    // Build update query dynamically
    const updates: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (body.theme_name !== undefined) {
      updates.push(`theme_name = $${paramIndex++}`);
      values.push(body.theme_name);
    }

    if (body.description !== undefined) {
      updates.push(`description = $${paramIndex++}`);
      values.push(body.description);
    }

    if (body.colors !== undefined) {
      updates.push(`colors = $${paramIndex++}`);
      values.push(JSON.stringify(body.colors));
    }

    if (body.custom_styles !== undefined) {
      updates.push(`custom_styles = $${paramIndex++}`);
      values.push(JSON.stringify(body.custom_styles));
    }

    if (body.backgrounds !== undefined) {
      updates.push(`backgrounds = $${paramIndex++}`);
      values.push(JSON.stringify(body.backgrounds));
    }

    if (body.ornaments !== undefined) {
      updates.push(`ornaments = $${paramIndex++}`);
      values.push(JSON.stringify(body.ornaments));
    }

    if (updates.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No fields to update' },
        { status: 400 }
      );
    }

    // Always update updated_at
    updates.push(`updated_at = NOW()`);

    // Add themeId as last parameter
    values.push(themeId);

    const updateQuery = `
      UPDATE unified_themes
      SET ${updates.join(', ')}
      WHERE theme_id = $${paramIndex}
      RETURNING *
    `;

    const result = await masterDB.query(updateQuery, values);
    const theme = result.rows[0];

    return NextResponse.json({
      success: true,
      message: `Theme "${theme.theme_name}" updated successfully`,
      theme: {
        theme_id: theme.theme_id,
        theme_name: theme.theme_name,
        description: theme.description,
        is_builtin: theme.is_builtin,
        colors: theme.colors,
        custom_styles: theme.custom_styles,
        backgrounds: theme.backgrounds,
        ornaments: theme.ornaments,
        updated_at: theme.updated_at,
      },
    });
  } catch (error) {
    console.error('Error updating unified theme:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update theme' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/unified-themes?themeId=xxx
 *
 * Delete a custom theme (built-in themes are protected)
 */
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const themeId = searchParams.get('themeId');

    if (!themeId) {
      return NextResponse.json(
        { success: false, error: 'themeId is required' },
        { status: 400 }
      );
    }

    // Check if theme exists and is not built-in
    const themeCheck = await masterDB.query(
      `SELECT theme_id, theme_name, is_builtin FROM unified_themes WHERE theme_id = $1`,
      [themeId]
    );

    if (themeCheck.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Theme not found' },
        { status: 404 }
      );
    }

    const theme = themeCheck.rows[0];

    if (theme.is_builtin) {
      return NextResponse.json(
        { success: false, error: 'Cannot delete built-in theme' },
        { status: 403 }
      );
    }

    // Check if any clients are using this theme
    const clientsUsingTheme = await masterDB.query(
      `SELECT COUNT(*) as count FROM clients WHERE unified_theme_id = $1`,
      [themeId]
    );

    const clientCount = parseInt(clientsUsingTheme.rows[0].count);

    if (clientCount > 0) {
      return NextResponse.json(
        {
          success: false,
          error: `Cannot delete theme: ${clientCount} client(s) are using this theme`
        },
        { status: 409 }
      );
    }

    // Delete theme
    await masterDB.query(
      `DELETE FROM unified_themes WHERE theme_id = $1`,
      [themeId]
    );

    return NextResponse.json({
      success: true,
      message: `Theme "${theme.theme_name}" deleted successfully`,
    });
  } catch (error) {
    console.error('Error deleting unified theme:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete theme' },
      { status: 500 }
    );
  }
}
