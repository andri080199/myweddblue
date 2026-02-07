import { NextRequest, NextResponse } from 'next/server';
import pool from '@/utils/db';

export async function POST(req: NextRequest) {
  const { clientSlug } = await req.json();

  if (!clientSlug) {
    return NextResponse.json({ success: false, message: 'Client slug is required' }, { status: 400 });
  }

  const dbName = `client_${clientSlug.replace(/-/g, '_')}_db`;

  try {
    console.log(`Fixing tables for: ${dbName}`);

    // Create schema if it doesn't exist
    await pool.query(`CREATE SCHEMA IF NOT EXISTS ${dbName}`);

    // Create client_content table if it doesn't exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS ${dbName}.client_content (
        id SERIAL PRIMARY KEY,
        content_type VARCHAR(100) NOT NULL,
        content_data JSONB NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(content_type)
      )
    `);

    // Create client_gallery table if it doesn't exist  
    await pool.query(`
      CREATE TABLE IF NOT EXISTS ${dbName}.client_gallery (
        id SERIAL PRIMARY KEY,
        image_url TEXT NOT NULL,
        image_order INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log(`✅ Tables fixed successfully for ${dbName}`);

    return NextResponse.json({ 
      success: true, 
      message: `Tables fixed successfully for ${clientSlug}` 
    });

  } catch (error: unknown) {
    console.error('Error fixing client tables:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}