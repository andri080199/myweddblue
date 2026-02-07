import { NextRequest, NextResponse } from 'next/server';
import masterDB, { getClientId } from '@/utils/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const clientSlug = searchParams.get('clientSlug');

    if (!clientSlug) {
      return NextResponse.json({ error: 'Client slug is required' }, { status: 400 });
    }

    // Get client_id from slug (unified database system)
    const clientId = await getClientId(clientSlug);

    if (!clientId) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 });
    }

    const result = await masterDB.query(
      'SELECT * FROM client_gallery WHERE client_id = $1 ORDER BY image_order ASC, created_at ASC',
      [clientId]
    );

    return NextResponse.json(result.rows);
  } catch (error: any) {
    console.error('Error fetching client gallery:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { clientSlug, imageUrl, imageOrder } = await request.json();

    if (!clientSlug || !imageUrl) {
      return NextResponse.json(
        { error: 'Client slug and image URL are required' },
        { status: 400 }
      );
    }

    // Get client_id from slug (unified database system)
    const clientId = await getClientId(clientSlug);

    if (!clientId) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 });
    }

    // Check if client already has 10 images
    const countResult = await masterDB.query(
      'SELECT COUNT(*) FROM client_gallery WHERE client_id = $1',
      [clientId]
    );

    const imageCount = parseInt(countResult.rows[0].count);
    if (imageCount >= 10) {
      return NextResponse.json(
        { error: 'Maximum 10 images allowed per client' },
        { status: 400 }
      );
    }

    const result = await masterDB.query(`
      INSERT INTO client_gallery (client_id, image_url, image_order)
      VALUES ($1, $2, $3)
      RETURNING *
    `, [clientId, imageUrl, imageOrder || 0]);

    return NextResponse.json(result.rows[0]);
  } catch (error: any) {
    console.error('Error saving gallery image:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const clientSlug = searchParams.get('clientSlug');
    const imageId = searchParams.get('imageId');

    if (!clientSlug || !imageId) {
      return NextResponse.json(
        { error: 'Client slug and image ID are required' },
        { status: 400 }
      );
    }

    // Get client_id from slug (unified database system)
    const clientId = await getClientId(clientSlug);

    if (!clientId) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 });
    }

    await masterDB.query(
      'DELETE FROM client_gallery WHERE id = $1 AND client_id = $2',
      [imageId, clientId]
    );

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting gallery image:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}