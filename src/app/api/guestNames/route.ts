import { NextRequest, NextResponse } from "next/server";
import masterDB, { getClientId } from "@/utils/db";

// GET
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
      `SELECT * FROM guest_names WHERE client_id = $1 ORDER BY id DESC`,
      [clientId]
    );
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error("Gagal mengambil data tamu:", error);
    return NextResponse.json({ message: "Gagal mengambil data tamu" }, { status: 500 });
  }
}

// POST
export async function POST(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const clientSlug = searchParams.get('clientSlug');

    if (!clientSlug) {
      return NextResponse.json({ message: "Client slug is required" }, { status: 400 });
    }

    const guests = await req.json();

    // Get client_id from slug (unified database system)
    const clientId = await getClientId(clientSlug);

    if (!clientId) {
      return NextResponse.json({ message: "Client not found" }, { status: 404 });
    }

    if (!Array.isArray(guests) || guests.length === 0) {
      return NextResponse.json({ message: "Data tamu tidak valid" }, { status: 400 });
    }

    const values = guests
      .filter(g => g.guestName && g.guestName.trim() !== "")
      .map(g => [clientId, g.guestName.trim(), '', `/undangan/${clientSlug}/${encodeURIComponent(g.guestName.trim())}`]);

    if (values.length === 0) {
      return NextResponse.json({ message: "Tidak ada data valid untuk ditambahkan" }, { status: 400 });
    }

    const queryText = `
      INSERT INTO guest_names (client_id, name, phone, url)
      VALUES ${values.map((_, i) => `($${i * 4 + 1}, $${i * 4 + 2}, $${i * 4 + 3}, $${i * 4 + 4})`).join(", ")}
      RETURNING *;
    `;

    const flatValues = values.flat();
    const result = await masterDB.query(queryText, flatValues);

    return NextResponse.json({
      message: `${result.rowCount} tamu berhasil ditambahkan`,
      data: result.rows
    });
  } catch (error) {
    console.error("Gagal menambahkan tamu:", error);
    return NextResponse.json({ message: "Gagal menambah tamu" }, { status: 500 });
  }
}
