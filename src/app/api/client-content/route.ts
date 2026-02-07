import { NextRequest, NextResponse } from 'next/server';
import masterDB, { getClientId } from '@/utils/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const clientSlug = searchParams.get('clientSlug');
    const contentType = searchParams.get('contentType');

    if (!clientSlug) {
      return NextResponse.json({ error: 'Client slug is required' }, { status: 400 });
    }

    // Get client_id from slug (unified database system)
    const clientId = await getClientId(clientSlug);

    if (!clientId) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 });
    }

    let query = 'SELECT * FROM client_content WHERE client_id = $1';
    const params: any[] = [clientId];

    if (contentType) {
      query += ' AND content_type = $2';
      params.push(contentType);
    }

    const result = await masterDB.query(query, params);

    return NextResponse.json(result.rows);
  } catch (error: any) {
    console.error('Error fetching client content:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { clientSlug, contentType, contentData } = await request.json();

    if (!clientSlug || !contentType || !contentData) {
      return NextResponse.json(
        { error: 'Client slug, content type, and content data are required' },
        { status: 400 }
      );
    }

    // Get client_id from slug (unified database system)
    const clientId = await getClientId(clientSlug);

    if (!clientId) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 });
    }

    // Upsert (insert or update)
    const result = await masterDB.query(`
      INSERT INTO client_content (client_id, content_type, content_data, updated_at)
      VALUES ($1, $2, $3, CURRENT_TIMESTAMP)
      ON CONFLICT (client_id, content_type)
      DO UPDATE SET
        content_data = EXCLUDED.content_data,
        updated_at = CURRENT_TIMESTAMP
      RETURNING *
    `, [clientId, contentType, JSON.stringify(contentData)]);

    return NextResponse.json(result.rows[0]);
  } catch (error: any) {
    console.error('Error saving client content:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const clientSlug = searchParams.get('clientSlug');
    const contentType = searchParams.get('contentType');

    if (!clientSlug || !contentType) {
      return NextResponse.json(
        { error: 'Client slug and content type are required' },
        { status: 400 }
      );
    }

    // Get client_id from slug (unified database system)
    const clientId = await getClientId(clientSlug);

    if (!clientId) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 });
    }

    await masterDB.query(
      'DELETE FROM client_content WHERE client_id = $1 AND content_type = $2',
      [clientId, contentType]
    );

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting client content:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}