import { NextRequest, NextResponse } from 'next/server';
import masterDB from '@/utils/db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const clientSlug = searchParams.get('clientSlug');

    if (!clientSlug) {
      return NextResponse.json({ message: "Client slug is required" }, { status: 400 });
    }

    const result = await masterDB.query(
      'SELECT unified_theme_id FROM clients WHERE slug = $1',
      [clientSlug]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ message: "Client not found" }, { status: 404 });
    }

    const client = result.rows[0];
    const themeId = client.unified_theme_id;

    if (!themeId) {
      return NextResponse.json({
        message: "Client has no theme assigned"
      }, { status: 404 });
    }

    // Fetch the complete unified theme
    const themeResult = await masterDB.query(
      'SELECT * FROM unified_themes WHERE theme_id = $1',
      [themeId]
    );

    if (themeResult.rows.length === 0) {
      return NextResponse.json({
        message: "Theme not found"
      }, { status: 404 });
    }

    const theme = themeResult.rows[0];

    return NextResponse.json({
      themeId: theme.theme_id,
      themeData: {
        theme_id: theme.theme_id,
        theme_name: theme.theme_name,
        description: theme.description,
        is_builtin: theme.is_builtin,
        colors: theme.colors,
        custom_styles: theme.custom_styles,
        backgrounds: theme.backgrounds,
        ornaments: theme.ornaments,
      }
    });

  } catch (error) {
    console.error("Error fetching client theme:", error);
    return NextResponse.json({ message: "Error fetching client theme" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { clientSlug, unifiedThemeId } = await req.json();

    if (!clientSlug) {
      return NextResponse.json({ message: "Client slug is required" }, { status: 400 });
    }

    if (!unifiedThemeId) {
      return NextResponse.json({ message: "Unified theme ID is required" }, { status: 400 });
    }

    // Verify theme exists
    const themeCheck = await masterDB.query(
      'SELECT theme_id, theme_name FROM unified_themes WHERE theme_id = $1',
      [unifiedThemeId]
    );

    if (themeCheck.rows.length === 0) {
      return NextResponse.json({
        message: `Theme "${unifiedThemeId}" not found`
      }, { status: 404 });
    }

    // Update client's theme
    await masterDB.query(
      'UPDATE clients SET unified_theme_id = $1 WHERE slug = $2',
      [unifiedThemeId, clientSlug]
    );

    const themeName = themeCheck.rows[0].theme_name;

    return NextResponse.json({
      success: true,
      message: `Theme updated to "${themeName}" successfully`,
      themeId: unifiedThemeId,
      themeName
    });

  } catch (error) {
    console.error("Error updating client theme:", error);
    return NextResponse.json({ message: "Error updating client theme" }, { status: 500 });
  }
}
