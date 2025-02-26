import { NextRequest, NextResponse } from "next/server";
import getDBConnection from "@/utils/db";

interface RSVPRequest {
  name: string;
  isAttending: boolean;
}

// **POST: Menambahkan RSVP Baru**
export async function POST(req: NextRequest) {
  try {
    const { name, isAttending }: RSVPRequest = await req.json();

    if (!name) {
      return NextResponse.json(
        { message: "Name is required" },
        { status: 400 }
      );
    }

    const responseDate = new Date().toISOString();
    const db = await getDBConnection();

    const result = await db.run(
      "INSERT INTO rsvp (name, isAttending, responseDate) VALUES (?, ?, ?)",
      [name, isAttending, responseDate]
    );

    return NextResponse.json({
      id: result.lastID,
      name,
      isAttending,
      responseDate,
    });
  } catch (error) {
    console.error("Error handling RSVP:", error);
    return NextResponse.json(
      { message: "Error processing RSVP" },
      { status: 500 }
    );
  }
}

// **GET: Mengambil Semua RSVP**
export async function GET() {
  try {
    const db = await getDBConnection();
    const guests = await db.all("SELECT * FROM rsvp ORDER BY responseDate DESC");

    return NextResponse.json(guests);
  } catch (error) {
    console.error("Error fetching RSVP data:", error);
    return NextResponse.json(
      { message: "Error fetching RSVP data" },
      { status: 500 }
    );
  }
}
