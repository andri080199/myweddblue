import { NextRequest, NextResponse } from 'next/server';
import masterDB from '@/utils/db';

/**
 * Validate animation configuration
 */
function validateAnimation(animation?: any): boolean {
  if (!animation) return true; // Optional field

  const validTypes = ['none', 'sway', 'float', 'rotate', 'pulse', 'bounce', 'sway-float', 'rotate-float'];
  const validSpeeds = ['slow', 'normal', 'fast'];

  if (animation.type && !validTypes.includes(animation.type)) return false;
  if (animation.speed && !validSpeeds.includes(animation.speed)) return false;
  if (animation.intensity != null && (animation.intensity < 0.1 || animation.intensity > 1)) return false;
  if (animation.delay != null && (animation.delay < 0 || animation.delay > 5)) return false;

  return true;
}

/**
 * GET /api/unified-themes/ornaments?themeId=xxx
 *
 * Fetch ornaments for a specific unified theme
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const themeId = searchParams.get('themeId');

    if (!themeId) {
      return NextResponse.json(
        { success: false, error: 'themeId is required' },
        { status: 400 }
      );
    }

    const result = await masterDB.query(
      `SELECT ornaments FROM unified_themes WHERE theme_id = $1`,
      [themeId]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Theme not found' },
        { status: 404 }
      );
    }

    const ornaments = result.rows[0].ornaments?.ornaments || [];

    return NextResponse.json({
      success: true,
      themeId,
      ornaments,
      count: ornaments.length,
    });
  } catch (error) {
    console.error('Error fetching ornaments:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch ornaments' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/unified-themes/ornaments
 *
 * Update ornaments for a unified theme
 *
 * Body:
 * - themeId: string (required)
 * - ornaments: array (required) - Array of ornament objects
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { themeId, ornaments } = body;

    // Validation
    if (!themeId) {
      return NextResponse.json(
        { success: false, error: 'themeId is required' },
        { status: 400 }
      );
    }

    if (!Array.isArray(ornaments)) {
      return NextResponse.json(
        { success: false, error: 'ornaments must be an array' },
        { status: 400 }
      );
    }

    // Validate each ornament has required fields
    for (const ornament of ornaments) {
      if (!ornament.id || !ornament.section || !ornament.image) {
        return NextResponse.json(
          {
            success: false,
            error: 'Each ornament must have id, section, and image fields'
          },
          { status: 400 }
        );
      }

      // Validate animation configuration if present
      if (!validateAnimation(ornament.animation)) {
        return NextResponse.json(
          {
            success: false,
            error: 'Invalid animation configuration'
          },
          { status: 400 }
        );
      }
    }

    // Check if theme exists
    const themeCheck = await masterDB.query(
      `SELECT theme_id FROM unified_themes WHERE theme_id = $1`,
      [themeId]
    );

    if (themeCheck.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Theme not found' },
        { status: 404 }
      );
    }

    // Update ornaments
    const result = await masterDB.query(
      `UPDATE unified_themes
       SET ornaments = $1, updated_at = NOW()
       WHERE theme_id = $2
       RETURNING theme_name`,
      [JSON.stringify({ ornaments }), themeId]
    );

    const themeName = result.rows[0].theme_name;

    return NextResponse.json({
      success: true,
      message: `Successfully updated ${ornaments.length} ornament(s) for theme "${themeName}"`,
      themeId,
      ornamentCount: ornaments.length,
    });
  } catch (error) {
    console.error('Error updating ornaments:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update ornaments' },
      { status: 500 }
    );
  }
}
