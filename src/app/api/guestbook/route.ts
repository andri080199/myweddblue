import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

interface GuestEntry {
  name: string;
  message: string;
  timestamp: string;
}

const GUESTBOOK_PATH = path.join(process.cwd(), "public", "data", "guestbook.json");

export async function POST(req: Request) {
  try {
    const body: GuestEntry = await req.json();

    if (!body.name || !body.message) {
      return NextResponse.json(
        { error: "Name and message are required" },
        { status: 400 }
      );
    }

    const timestamp = new Date().toISOString();
    const newEntry: GuestEntry = { ...body, timestamp };

    let guestbookEntries: GuestEntry[] = [];
    try {
      const fileData = await fs.readFile(GUESTBOOK_PATH, "utf-8");
      guestbookEntries = JSON.parse(fileData);
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error reading guestbook.json:", error.message);
      } else {
        console.error("Unknown error occurred while reading guestbook.json:", error);
      }
    }

    guestbookEntries.push(newEntry);

    try {
      await fs.writeFile(GUESTBOOK_PATH, JSON.stringify(guestbookEntries, null, 2), "utf-8");
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error writing to guestbook.json:", error.message);
      } else {
        console.error("Unknown error occurred while writing to guestbook.json:", error);
      }
      return NextResponse.json(
        { error: "Failed to save entry" },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: "Guest entry added successfully" });
  } catch (error) {
    if (error instanceof Error) {
      console.error("Unexpected error in POST handler:", error.message);
    } else {
      console.error("Unknown error occurred in POST handler:", error);
    }
    return NextResponse.json(
      { error: "Internal Server Error", details: (error as Error).message || "Unknown error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const data = await fs.readFile(GUESTBOOK_PATH, "utf-8");
    const entries = JSON.parse(data);
    return NextResponse.json(entries);
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error reading guestbook.json:", error.message);
    } else {
      console.error("Unknown error occurred while reading guestbook.json:", error);
    }
    return NextResponse.json(
      { error: "Failed to fetch entries" },
      { status: 500 }
    );
  }
}
