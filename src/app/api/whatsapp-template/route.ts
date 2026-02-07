import { NextRequest, NextResponse } from 'next/server';
import masterDB, { getClientId } from '@/utils/db';
import { DEFAULT_WHATSAPP_MESSAGE } from '@/utils/whatsappTemplate';

// GET: Get WhatsApp message template
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const clientSlug = searchParams.get('clientSlug');

    if (!clientSlug) {
      return NextResponse.json({ message: "Client slug is required" }, { status: 400 });
    }

    // Get client_id from slug (unified database system)
    const clientId = await getClientId(clientSlug);

    if (!clientId) {
      return NextResponse.json({ message: "Client not found" }, { status: 404 });
    }

    const result = await masterDB.query(
      'SELECT template FROM whatsapp_template WHERE client_id = $1 ORDER BY updated_at DESC LIMIT 1',
      [clientId]
    );

    if (result.rows.length === 0) {
      // Return default template if none exists
      return NextResponse.json({ template: DEFAULT_WHATSAPP_MESSAGE });
    }

    return NextResponse.json({ template: result.rows[0].template });
  } catch (error) {
    console.error('Error fetching WhatsApp template:', error);
    return NextResponse.json(
      { error: 'Failed to fetch template' },
      { status: 500 }
    );
  }
}

// POST: Save WhatsApp message template
export async function POST(req: NextRequest) {
  try {
    const { clientSlug, template } = await req.json();

    if (!clientSlug || !template) {
      return NextResponse.json(
        { message: "Client slug and template are required" },
        { status: 400 }
      );
    }

    // Get client_id from slug (unified database system)
    const clientId = await getClientId(clientSlug);

    if (!clientId) {
      return NextResponse.json({ message: "Client not found" }, { status: 404 });
    }

    // Check if template exists for this client
    const existingTemplate = await masterDB.query(
      'SELECT id FROM whatsapp_template WHERE client_id = $1 LIMIT 1',
      [clientId]
    );

    if (existingTemplate.rows.length > 0) {
      // Update existing template
      await masterDB.query(
        'UPDATE whatsapp_template SET template = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
        [template, existingTemplate.rows[0].id]
      );
    } else {
      // Insert new template
      await masterDB.query(
        'INSERT INTO whatsapp_template (client_id, template) VALUES ($1, $2)',
        [clientId, template]
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Template saved successfully'
    });
  } catch (error) {
    console.error('Error saving WhatsApp template:', error);
    return NextResponse.json(
      { error: 'Failed to save template' },
      { status: 500 }
    );
  }
}