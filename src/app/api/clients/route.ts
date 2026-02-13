import { NextRequest, NextResponse } from 'next/server';
import masterDB from '@/utils/db';

// GET: Get all clients or single client by slug
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get('slug');

    // If slug parameter provided, return single client
    if (slug) {
      const result = await masterDB.query(`
        SELECT
          id,
          slug,
          slug as name,
          '' as email,
          unified_theme_id,
          created_at
        FROM clients
        WHERE slug = $1
      `, [slug]);

      if (result.rows.length === 0) {
        return NextResponse.json({ message: "Client not found" }, { status: 404 });
      }

      return NextResponse.json(result.rows[0]);
    }

    // Otherwise, return all clients
    const result = await masterDB.query(`
      SELECT
        id,
        slug,
        slug as name,
        '' as email,
        unified_theme_id,
        created_at
      FROM clients
      ORDER BY created_at DESC
    `);

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error("Error fetching clients:", error);
    return NextResponse.json({ message: "Error fetching clients" }, { status: 500 });
  }
}

// DELETE: Delete a client
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const clientId = searchParams.get('id');

    if (!clientId) {
      return NextResponse.json({ message: "Client ID is required" }, { status: 400 });
    }

    // Get client info first
    const clientResult = await masterDB.query(
      'SELECT slug FROM clients WHERE id = $1',
      [clientId]
    );

    if (clientResult.rows.length === 0) {
      return NextResponse.json({ message: "Client not found" }, { status: 404 });
    }

    const { slug } = clientResult.rows[0];

    // Delete client record - CASCADE will automatically delete all related data
    // (rsvp, guestbook, guest_names, client_content, client_gallery, whatsapp_template)
    await masterDB.query('DELETE FROM clients WHERE id = $1', [clientId]);

    console.log(`✅ Client ${slug} and all related data deleted successfully (CASCADE)`);
    return NextResponse.json({
      success: true,
      message: `Client ${slug} and all related data deleted successfully`
    });

  } catch (error) {
    console.error("Error deleting client:", error);
    return NextResponse.json({ message: "Error deleting client" }, { status: 500 });
  }
}