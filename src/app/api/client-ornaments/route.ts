import { NextRequest, NextResponse } from 'next/server';
import masterDB, { getClientId } from '@/utils/db';
import { OrnamentsData, GetOrnamentsResponse, SaveOrnamentsResponse } from '@/types/ornament';

/**
 * GET - Fetch all ornaments for a client
 * Query params: clientSlug
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const clientSlug = searchParams.get('clientSlug');

    if (!clientSlug) {
      return NextResponse.json<GetOrnamentsResponse>(
        { success: false, data: { ornaments: [] }, error: 'Client slug is required' },
        { status: 400 }
      );
    }

    console.log('📡 Fetching ornaments for client:', clientSlug);

    // Get client_id from slug
    const clientId = await getClientId(clientSlug);

    if (!clientId) {
      return NextResponse.json<GetOrnamentsResponse>(
        { success: false, data: { ornaments: [] }, error: 'Client not found' },
        { status: 404 }
      );
    }

    // Fetch from client_content where content_type = 'ornaments'
    const result = await masterDB.query(
      `SELECT content_data FROM client_content
       WHERE client_id = $1 AND content_type = 'ornaments'`,
      [clientId]
    );

    const ornamentsData: OrnamentsData = result.rows[0]?.content_data || { ornaments: [] };

    console.log('✅ Ornaments fetched:', {
      clientSlug,
      count: ornamentsData.ornaments.length
    });

    return NextResponse.json<GetOrnamentsResponse>({
      success: true,
      data: ornamentsData
    });

  } catch (error) {
    console.error('❌ Error fetching ornaments:', error);
    return NextResponse.json<GetOrnamentsResponse>(
      {
        success: false,
        data: { ornaments: [] },
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

/**
 * POST - Create/Update ornaments (upsert pattern)
 * Body: { clientSlug, ornaments }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { clientSlug, ornaments } = body;

    if (!clientSlug) {
      return NextResponse.json<SaveOrnamentsResponse>(
        { success: false, error: 'Client slug is required' },
        { status: 400 }
      );
    }

    if (!Array.isArray(ornaments)) {
      return NextResponse.json<SaveOrnamentsResponse>(
        { success: false, error: 'Ornaments must be an array' },
        { status: 400 }
      );
    }

    console.log('💾 Saving ornaments for client:', {
      clientSlug,
      count: ornaments.length
    });

    // Get client_id from slug
    const clientId = await getClientId(clientSlug);

    if (!clientId) {
      return NextResponse.json<SaveOrnamentsResponse>(
        { success: false, error: 'Client not found' },
        { status: 404 }
      );
    }

    // Validate ornament data structure
    for (const ornament of ornaments) {
      if (!ornament.id || !ornament.section || !ornament.image) {
        return NextResponse.json<SaveOrnamentsResponse>(
          {
            success: false,
            error: `Invalid ornament data: ${JSON.stringify(ornament).substring(0, 100)}`
          },
          { status: 400 }
        );
      }
    }

    const ornamentsData: OrnamentsData = { ornaments };

    // Upsert into client_content
    await masterDB.query(
      `INSERT INTO client_content (client_id, content_type, content_data)
       VALUES ($1, 'ornaments', $2)
       ON CONFLICT (client_id, content_type)
       DO UPDATE SET content_data = $2, updated_at = NOW()`,
      [clientId, JSON.stringify(ornamentsData)]
    );

    console.log('✅ Ornaments saved successfully:', {
      clientSlug,
      count: ornaments.length
    });

    return NextResponse.json<SaveOrnamentsResponse>({
      success: true,
      message: `Successfully saved ${ornaments.length} ornament(s)`
    });

  } catch (error) {
    console.error('❌ Error saving ornaments:', error);
    return NextResponse.json<SaveOrnamentsResponse>(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
