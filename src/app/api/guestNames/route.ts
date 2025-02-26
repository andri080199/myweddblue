import { NextRequest, NextResponse } from "next/server";
import getDBConnection from "@/utils/db"; // Import koneksi database

// **GET: Ambil semua tamu**
export async function GET() {
  try {
    const db = await getDBConnection();
    const guests = await db.all("SELECT * FROM guest_names");

    return NextResponse.json(guests);
  } catch (error) {
    console.error("Gagal mengambil data tamu:", error);
    return NextResponse.json(
      { message: "Gagal mengambil data tamu" },
      { status: 500 }
    );
  }
}

// **POST: Tambah tamu baru**
export async function POST(req: NextRequest) {
  try {
    const { guestName } = await req.json();

    if (!guestName) {
      return NextResponse.json(
        { message: "Nama tamu harus diisi" },
        { status: 400 }
      );
    }

    const url = `/themes/tema01/${encodeURIComponent(guestName)}`;
    const db = await getDBConnection();
    const result = await db.run(
      "INSERT INTO guest_names (name, url) VALUES (?, ?)",
      guestName,
      url
    );

    const newGuest = {
      id: result.lastID,
      name: guestName,
      url,
    };

    return NextResponse.json(newGuest);
  } catch (error) {
    console.error("Gagal menambah tamu:", error);
    return NextResponse.json(
      { message: "Gagal menambah tamu" },
      { status: 500 }
    );
  }
}

// **DELETE: Hapus tamu berdasarkan ID**
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const guestId = searchParams.get("guestId");

    if (!guestId) {
      return NextResponse.json(
        { message: "ID tamu tidak ditemukan" },
        { status: 400 }
      );
    }

    const db = await getDBConnection();
    const result = await db.run("DELETE FROM guest_names WHERE id = ?", guestId);

    if (result.changes === 0) {
      return NextResponse.json(
        { message: "Tamu tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Tamu berhasil dihapus" });
  } catch (error) {
    console.error("Gagal menghapus tamu:", error);
    return NextResponse.json(
      { message: "Gagal menghapus tamu" },
      { status: 500 }
    );
  }
}
