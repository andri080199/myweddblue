import { NextRequest, NextResponse } from 'next/server';
import masterDB from '@/utils/db';

export async function POST(req: NextRequest) {
  const { clientSlug } = await req.json();

  if (!clientSlug) {
    return NextResponse.json({ success: false, message: 'Client slug is required' }, { status: 400 });
  }

  const dbName = `client_${clientSlug.replace(/-/g, '_')}_db`;

  try {
    console.log(`Setting up database for: ${clientSlug}`);

    // Check if client exists
    const existingClient = await masterDB.query(
      'SELECT id FROM clients WHERE slug = $1',
      [clientSlug]
    );

    if (existingClient.rows.length === 0) {
      return NextResponse.json({ success: false, message: 'Client not found' }, { status: 404 });
    }

    // Create database if it doesn't exist
    try {
      await masterDB.query(`CREATE DATABASE ${dbName}`);
      console.log(`Database ${dbName} created`);
    } catch (error: any) {
      if (error.code === '42P04') { // database already exists
        console.log(`Database ${dbName} already exists`);
      } else {
        throw error;
      }
    }
    
    // Setup tables in client database
    const { Pool } = require('pg');
    const clientDB = new Pool({
      connectionString: process.env.DATABASE_URL?.replace(/\/[^/]*$/, `/${dbName}`),
    });

    // Create all required tables
    await clientDB.query(`
      CREATE TABLE IF NOT EXISTS rsvp (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        isattending BOOLEAN NOT NULL,
        responsedate TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await clientDB.query(`
      CREATE TABLE IF NOT EXISTS guestbook (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await clientDB.query(`
      CREATE TABLE IF NOT EXISTS guest_names (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        phone VARCHAR(50) NOT NULL,
        url VARCHAR(500),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await clientDB.query(`
      CREATE TABLE IF NOT EXISTS client_content (
        id SERIAL PRIMARY KEY,
        content_type VARCHAR(100) NOT NULL,
        content_data JSONB NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(content_type)
      )
    `);

    await clientDB.query(`
      CREATE TABLE IF NOT EXISTS client_gallery (
        id SERIAL PRIMARY KEY,
        image_url TEXT NOT NULL,
        image_order INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await clientDB.query(`
      CREATE TABLE IF NOT EXISTS whatsapp_template (
        id SERIAL PRIMARY KEY,
        template TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await clientDB.end();

    console.log(`✅ Database setup completed for ${clientSlug}`);

    return NextResponse.json({ 
      success: true, 
      message: `Database setup completed for ${clientSlug}` 
    });

  } catch (error: any) {
    console.error('Error setting up database:', error);
    return NextResponse.json({ 
      success: false, 
      message: error.message 
    }, { status: 500 });
  }
}

// SQL untuk setup tabel di template database (jalankan manual):
/*
-- Koneksi ke template_client_db dan jalankan:

CREATE TABLE IF NOT EXISTS rsvp (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  isattending BOOLEAN NOT NULL,
  responsedate TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS guestbook (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS guest_names (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  url VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
*/