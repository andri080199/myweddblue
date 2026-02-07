import { NextRequest, NextResponse } from 'next/server';
import masterDB from '@/utils/db';

// Helper function to ensure password column exists
async function ensurePasswordColumn() {
  try {
    await masterDB.query(`
      ALTER TABLE clients
      ADD COLUMN IF NOT EXISTS password VARCHAR(255) DEFAULT 'client123'
    `);
  } catch (error) {
    // Column might already exist, ignore error
    console.log('Password column check:', error);
  }
}

// POST: Verify client login
export async function POST(req: NextRequest) {
  try {
    const { slug, password } = await req.json();

    if (!slug || !password) {
      return NextResponse.json(
        { success: false, message: 'Slug dan password diperlukan' },
        { status: 400 }
      );
    }

    // Ensure password column exists
    await ensurePasswordColumn();

    // Check if client exists and password matches
    const result = await masterDB.query(
      'SELECT id, slug, password FROM clients WHERE slug = $1',
      [slug]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Client tidak ditemukan' },
        { status: 404 }
      );
    }

    const client = result.rows[0];

    // Compare password (plain text for now)
    // If password is null/undefined in DB, use default 'client123'
    const storedPassword = client.password || 'client123';
    if (storedPassword !== password) {
      return NextResponse.json(
        { success: false, message: 'Password salah' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Login berhasil',
      client: {
        id: client.id,
        slug: client.slug
      }
    });

  } catch (error) {
    console.error('Error authenticating client:', error);
    return NextResponse.json(
      { success: false, message: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
}

// GET: Check if client exists (for login page)
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get('slug');

    if (!slug) {
      return NextResponse.json(
        { success: false, message: 'Slug diperlukan' },
        { status: 400 }
      );
    }

    const result = await masterDB.query(
      'SELECT id, slug FROM clients WHERE slug = $1',
      [slug]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, exists: false, message: 'Client tidak ditemukan' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      exists: true,
      client: {
        id: result.rows[0].id,
        slug: result.rows[0].slug
      }
    });

  } catch (error) {
    console.error('Error checking client:', error);
    return NextResponse.json(
      { success: false, message: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
}
