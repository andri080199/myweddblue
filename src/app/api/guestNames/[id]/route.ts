import { NextRequest, NextResponse } from "next/server";
import masterDB, { getClientId } from "@/utils/db";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { searchParams } = new URL(req.url);
  const clientSlug = searchParams.get('clientSlug');

  if (!id) {
    return NextResponse.json({ message: "ID tidak ditemukan" }, { status: 400 });
  }

  if (!clientSlug) {
    return NextResponse.json({ message: "Client slug is required" }, { status: 400 });
  }

  try {
    // Get client_id from slug (unified database system)
    const clientId = await getClientId(clientSlug);

    if (!clientId) {
      return NextResponse.json({ message: "Client not found" }, { status: 404 });
    }

    await masterDB.query(
      `DELETE FROM guest_names WHERE id = $1 AND client_id = $2`,
      [id, clientId]
    );
    return NextResponse.json({ message: "Tamu berhasil dihapus" });
  } catch (error) {
    console.error("Gagal menghapus tamu:", error);
    return NextResponse.json({ message: "Gagal menghapus tamu" }, { status: 500 });
  }
}
