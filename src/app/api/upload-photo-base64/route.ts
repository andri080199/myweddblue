import { NextRequest, NextResponse } from 'next/server';
import masterDB, { getClientId } from '@/utils/db';

// POST: Upload photo as base64
export async function POST(request: NextRequest) {
  try {
    const { clientSlug, photoType, imageData, oldPhotoData } = await request.json();

    if (!clientSlug || !photoType || !imageData) {
      return NextResponse.json({
        error: 'Client slug, photo type, and image data are required'
      }, { status: 400 });
    }

    // Validate base64 image
    if (!imageData.startsWith('data:image/')) {
      return NextResponse.json({
        error: 'Invalid image format'
      }, { status: 400 });
    }

    // Get client_id from slug (unified database system)
    const clientId = await getClientId(clientSlug);

    if (!clientId) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 });
    }

    // Update or create content record in unified table
    const existingRecord = await masterDB.query(
      'SELECT * FROM client_content WHERE client_id = $1 AND content_type = $2',
      [clientId, 'couple_info']
    );

    if (existingRecord.rows.length > 0) {
      // Update existing record
      const existingData = existingRecord.rows[0].content_data || {};
      const updatedData = { ...existingData, [photoType]: imageData };

      await masterDB.query(
        'UPDATE client_content SET content_data = $1, updated_at = CURRENT_TIMESTAMP WHERE client_id = $2 AND content_type = $3',
        [updatedData, clientId, 'couple_info']
      );
    } else {
      // Insert new record
      const contentData = { [photoType]: imageData };
      await masterDB.query(
        'INSERT INTO client_content (client_id, content_type, content_data) VALUES ($1, $2, $3)',
        [clientId, 'couple_info', contentData]
      );
    }

    return NextResponse.json({
      success: true,
      imageData,
      message: 'Photo uploaded and saved to database successfully'
    });

  } catch (error) {
    console.error('Error uploading photo:', error);
    return NextResponse.json({
      error: 'Failed to upload photo',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// DELETE: Remove photo
export async function DELETE(request: NextRequest) {
  try {
    const { clientSlug, photoType } = await request.json();

    if (!clientSlug || !photoType) {
      return NextResponse.json({
        error: 'Client slug and photo type are required'
      }, { status: 400 });
    }

    // Get client_id from slug (unified database system)
    const clientId = await getClientId(clientSlug);

    if (!clientId) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 });
    }

    // Get existing record from unified table
    const existingRecord = await masterDB.query(
      'SELECT * FROM client_content WHERE client_id = $1 AND content_type = $2',
      [clientId, 'couple_info']
    );

    if (existingRecord.rows.length > 0) {
      const existingData = existingRecord.rows[0].content_data || {};
      delete existingData[photoType]; // Remove the photo field

      await masterDB.query(
        'UPDATE client_content SET content_data = $1, updated_at = CURRENT_TIMESTAMP WHERE client_id = $2 AND content_type = $3',
        [existingData, clientId, 'couple_info']
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Photo removed successfully'
    });

  } catch (error) {
    console.error('Error removing photo:', error);
    return NextResponse.json({
      error: 'Failed to remove photo',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}