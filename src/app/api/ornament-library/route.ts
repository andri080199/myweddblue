import { NextRequest, NextResponse } from 'next/server';
import masterDB from '@/utils/db';

/**
 * GET /api/ornament-library
 * Fetch all ornaments or single ornament by ID
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const ornamentId = searchParams.get('id');
  const category = searchParams.get('category');

  try {
    let query = 'SELECT * FROM ornament_library';
    const params: any[] = [];

    // Filter by ID
    if (ornamentId) {
      query = 'SELECT * FROM ornament_library WHERE id = $1';
      params.push(ornamentId);
    }
    // Filter by category
    else if (category && category !== 'all') {
      query = 'SELECT * FROM ornament_library WHERE category = $1 ORDER BY created_at DESC';
      params.push(category);
    }
    // All ornaments
    else {
      query = 'SELECT * FROM ornament_library ORDER BY created_at DESC';
    }

    const result = await masterDB.query(query, params);

    // Single ornament
    if (ornamentId) {
      if (result.rows.length === 0) {
        return NextResponse.json(
          { success: false, error: 'Ornament not found' },
          { status: 404 }
        );
      }
      return NextResponse.json({ success: true, ornament: result.rows[0] });
    }

    // Multiple ornaments
    return NextResponse.json({ success: true, ornaments: result.rows });
  } catch (error) {
    console.error('Error fetching ornament library:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch ornament library' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/ornament-library
 * Upload new ornament to library
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { ornament_name, ornament_image, category = 'general' } = body;

    if (!ornament_name || !ornament_image) {
      return NextResponse.json(
        { success: false, error: 'Ornament name and image are required' },
        { status: 400 }
      );
    }

    // Validate base64 image
    if (!ornament_image.startsWith('data:image/')) {
      return NextResponse.json(
        { success: false, error: 'Invalid image format. Must be base64 data URI' },
        { status: 400 }
      );
    }

    // Calculate file size (approximate)
    const base64Length = ornament_image.split(',')[1]?.length || 0;
    const fileSizeBytes = Math.floor((base64Length * 3) / 4);

    // Check file size (max 500KB)
    const maxSize = 500 * 1024; // 500KB
    if (fileSizeBytes > maxSize) {
      return NextResponse.json(
        { success: false, error: `Image too large. Max size is ${maxSize / 1024}KB` },
        { status: 400 }
      );
    }

    // Get image dimensions (from base64 - this is approximate, actual parsing would need canvas)
    // For now, we'll set default dimensions
    const imageWidth = null;
    const imageHeight = null;

    // Insert into database
    const query = `
      INSERT INTO ornament_library
      (ornament_name, ornament_image, category, file_size, image_width, image_height)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;

    const result = await masterDB.query(query, [
      ornament_name,
      ornament_image,
      category,
      fileSizeBytes,
      imageWidth,
      imageHeight,
    ]);

    return NextResponse.json({
      success: true,
      message: `Ornament "${ornament_name}" uploaded successfully`,
      ornament: result.rows[0],
    });
  } catch (error) {
    console.error('Error uploading ornament:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to upload ornament' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/ornament-library
 * Update ornament (name or category only, not image)
 */
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ornament_name, category } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Ornament ID is required' },
        { status: 400 }
      );
    }

    // Build dynamic update query
    const updates: string[] = [];
    const params: any[] = [];
    let paramIndex = 1;

    if (ornament_name) {
      updates.push(`ornament_name = $${paramIndex++}`);
      params.push(ornament_name);
    }

    if (category) {
      updates.push(`category = $${paramIndex++}`);
      params.push(category);
    }

    if (updates.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No fields to update' },
        { status: 400 }
      );
    }

    updates.push(`updated_at = CURRENT_TIMESTAMP`);
    params.push(id);

    const query = `
      UPDATE ornament_library
      SET ${updates.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING *
    `;

    const result = await masterDB.query(query, params);

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Ornament not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Ornament updated successfully',
      ornament: result.rows[0],
    });
  } catch (error) {
    console.error('Error updating ornament:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update ornament' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/ornament-library
 * Delete ornament from library
 */
export async function DELETE(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const ornamentId = searchParams.get('id');

  if (!ornamentId) {
    return NextResponse.json(
      { success: false, error: 'Ornament ID is required' },
      { status: 400 }
    );
  }

  try {
    const query = 'DELETE FROM ornament_library WHERE id = $1 RETURNING *';
    const result = await masterDB.query(query, [ornamentId]);

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Ornament not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Ornament deleted successfully',
      ornament: result.rows[0],
    });
  } catch (error) {
    console.error('Error deleting ornament:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete ornament' },
      { status: 500 }
    );
  }
}
