import { NextResponse } from "next/server";
import getDBConnection from "@/utils/db";

export async function POST(req: Request) {
  try {
    const { name, message } = await req.json();

    if (!name || !message) {
      return NextResponse.json(
        { error: "Name and message are required" },
        { status: 400 }
      );
    }

    const timestamp = new Date().toISOString();
    const db = await getDBConnection();
    
    const result = await db.run(
      "INSERT INTO guestbook (name, message, timestamp) VALUES (?, ?, ?)",
      [name, message, timestamp]
    );

    return NextResponse.json({
      id: result.lastID,
      name,
      message,
      timestamp,
    });
  } catch (error) {
    console.error("Error in POST:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const db = await getDBConnection();
    const guestbookEntries = await db.all("SELECT * FROM guestbook ORDER BY timestamp DESC");

    return NextResponse.json(guestbookEntries);
  } catch (error) {
    console.error("Error in GET:", error);
    return NextResponse.json(
      { error: "Failed to fetch entries" },
      { status: 500 }
    );
  }
}
