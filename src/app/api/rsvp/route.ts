import { NextRequest, NextResponse } from "next/server";
import masterDB, { getClientId } from "@/utils/db";

interface RSVPRequest {
  name: string;
  isAttending: boolean | string | number; // Bisa dikirim sebagai string atau number dari form
}

// POST: Tambah RSVP Baru
export async function POST(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const clientSlug = searchParams.get('clientSlug');

    if (!clientSlug) {
      return NextResponse.json({ message: "Client slug is required" }, { status: 400 });
    }

    const { name, isAttending }: RSVPRequest = await req.json();

    // Get client_id from slug (unified database system)
    const clientId = await getClientId(clientSlug);

    if (!clientId) {
      return NextResponse.json({ message: "Client not found" }, { status: 404 });
    }

    console.log(`✏️ POST RSVP - Client: ${clientSlug}, Name: ${name}`);

    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return NextResponse.json({ message: "Name is required" }, { status: 400 });
    }

    // Konversi input isAttending ke boolean eksplisit
    const isAttendingBool =
      isAttending === true ||
      isAttending === "true" ||
      isAttending === 1 ||
      isAttending === "1";

    const responseDate = new Date().toISOString();

    const result = await masterDB.query(
      `INSERT INTO rsvp (client_id, name, isattending, responsedate)
       VALUES ($1, $2, $3, $4)
       RETURNING id, name, isattending AS "isAttending", responsedate AS "responseDate"`,
      [clientId, name.trim(), isAttendingBool, responseDate]
    );

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error("Error handling RSVP:", error);
    return NextResponse.json({ message: "Error processing RSVP" }, { status: 500 });
  }
}

// GET: Ambil semua RSVP
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

    console.log(`🔍 GET RSVP - Client: ${clientSlug}`);

    const result = await masterDB.query(`
      SELECT
        id,
        name,
        isattending AS "isAttending",
        responsedate AS "responseDate"
      FROM rsvp
      WHERE client_id = $1
      ORDER BY responsedate DESC
    `, [clientId]);

    console.log(`📊 Found ${result.rows.length} records for client ${clientSlug}`);

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error("Error fetching RSVP data - Full error:", error);
    console.error("Error message:", error instanceof Error ? error.message : 'Unknown error');
    console.error("Error stack:", error instanceof Error ? error.stack : 'No stack trace');
    return NextResponse.json({
      message: "Error fetching RSVP data",
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
