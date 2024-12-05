import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

interface RSVPRequest {
  name: string;
  isAttending: boolean;
}

// Fungsi untuk menangani request
export async function POST(req: NextRequest) {
  try {
    const body: RSVPRequest = await req.json();

    if (!body.name) {
      return NextResponse.json(
        { message: "Name is required" },
        { status: 400 }
      );
    }

    // Path ke file JSON
    const filePath = path.join(process.cwd(), "public", "data", "guests.json");

    // Membaca data dari file JSON
    const fileData = await fs.readFile(filePath, "utf-8");
    const guests = JSON.parse(fileData);

    // Menambahkan data baru
    const newGuest = {
      id: guests.length + 1, // ID otomatis berdasarkan jumlah data
      name: body.name,
      isAttending: body.isAttending,
      responseDate: new Date().toISOString(),
    };

    guests.push(newGuest);

    // Menulis kembali data ke file JSON
    await fs.writeFile(filePath, JSON.stringify(guests, null, 2), "utf-8");

    return NextResponse.json({ message: "RSVP recorded successfully", newGuest });
  } catch (error) {
    console.error("Error handling RSVP:", error);
    return NextResponse.json(
      { message: "Error processing RSVP" },
      { status: 500 }
    );
  }
}
