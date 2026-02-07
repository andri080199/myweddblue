import { NextRequest, NextResponse } from 'next/server';
import masterDB from '@/utils/db';
import { OrnamentsData, GetOrnamentsResponse, SaveOrnamentsResponse } from '@/types/ornament';

/**
 * GET - Fetch ornaments for a catalog template
 * Query params: templateId (required)
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const templateId = searchParams.get('templateId');

    if (!templateId) {
      return NextResponse.json<GetOrnamentsResponse>(
        { success: false, data: { ornaments: [] }, error: 'Template ID is required' },
        { status: 400 }
      );
    }

    const templateIdInt = parseInt(templateId);
    if (isNaN(templateIdInt)) {
      return NextResponse.json<GetOrnamentsResponse>(
        { success: false, data: { ornaments: [] }, error: 'Invalid template ID' },
        { status: 400 }
      );
    }

    console.log('📡 Fetching ornaments for template ID:', templateIdInt);

    // Fetch from template_ornaments table
    const result = await masterDB.query(
      `SELECT ornaments_data FROM template_ornaments WHERE template_id = $1`,
      [templateIdInt]
    );

    const ornamentsData: OrnamentsData = result.rows[0]?.ornaments_data || { ornaments: [] };

    console.log('✅ Template ornaments fetched:', {
      templateId: templateIdInt,
      count: ornamentsData.ornaments.length
    });

    return NextResponse.json<GetOrnamentsResponse>({
      success: true,
      data: ornamentsData
    });

  } catch (error) {
    console.error('❌ Error fetching template ornaments:', error);
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
 * POST - Save/update ornaments for a catalog template (upsert)
 * Body: { templateId, ornaments }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { templateId, ornaments } = body;

    if (!templateId) {
      return NextResponse.json<SaveOrnamentsResponse>(
        { success: false, error: 'Template ID is required' },
        { status: 400 }
      );
    }

    if (!Array.isArray(ornaments)) {
      return NextResponse.json<SaveOrnamentsResponse>(
        { success: false, error: 'Ornaments must be an array' },
        { status: 400 }
      );
    }

    const templateIdInt = parseInt(templateId);
    if (isNaN(templateIdInt)) {
      return NextResponse.json<SaveOrnamentsResponse>(
        { success: false, error: 'Invalid template ID' },
        { status: 400 }
      );
    }

    console.log('💾 Saving ornaments for template ID:', {
      templateId: templateIdInt,
      count: ornaments.length
    });

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

    // Upsert into template_ornaments table
    await masterDB.query(
      `INSERT INTO template_ornaments (template_id, ornaments_data, updated_at)
       VALUES ($1, $2, NOW())
       ON CONFLICT (template_id)
       DO UPDATE SET ornaments_data = $2, updated_at = NOW()`,
      [templateIdInt, JSON.stringify(ornamentsData)]
    );

    console.log('✅ Template ornaments saved successfully:', {
      templateId: templateIdInt,
      count: ornaments.length
    });

    return NextResponse.json<SaveOrnamentsResponse>({
      success: true,
      message: `Successfully saved ${ornaments.length} ornament(s) for template ${templateIdInt}`
    });

  } catch (error) {
    console.error('❌ Error saving template ornaments:', error);
    return NextResponse.json<SaveOrnamentsResponse>(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
