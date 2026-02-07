import { NextRequest, NextResponse } from "next/server";
import masterDB, { getClientId } from "@/utils/db";

// POST: Tambah entri ke guestbook
export async function POST(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const clientSlug = searchParams.get('clientSlug');

    if (!clientSlug) {
      return NextResponse.json({ message: "Client slug is required" }, { status: 400 });
    }

    const { name, message } = await req.json();

    // Get client_id from slug (unified database system)
    const clientId = await getClientId(clientSlug);

    if (!clientId) {
      return NextResponse.json({ message: "Client not found" }, { status: 404 });
    }

    if (!name || !message) {
      return NextResponse.json(
        { error: "Name and message are required" },
        { status: 400 }
      );
    }

    const timestamp = new Date().toISOString();

    // Insert into unified guestbook table with client_id
    const result = await masterDB.query(
      `INSERT INTO guestbook (client_id, name, message, timestamp) VALUES ($1, $2, $3, $4) RETURNING *`,
      [clientId, name, message, timestamp]
    );

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error("Error in POST:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// GET: Ambil semua entri guestbook
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

    // Query unified guestbook table filtered by client_id
    const result = await masterDB.query(
      `SELECT * FROM guestbook WHERE client_id = $1 ORDER BY timestamp DESC`,
      [clientId]
    );

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error("Error in GET:", error);
    return NextResponse.json(
      { error: "Failed to fetch entries" },
      { status: 500 }
    );
  }
}
