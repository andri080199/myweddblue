import { NextResponse } from 'next/server';
import masterDB from '@/utils/db';

export async function POST() {
  try {
    // Buat tabel client_content untuk menyimpan konten yang bisa diedit
    await masterDB.query(`
      CREATE TABLE IF NOT EXISTS client_content (
        id SERIAL PRIMARY KEY,
        client_slug VARCHAR(255) NOT NULL,
        content_type VARCHAR(50) NOT NULL,
        content_data JSONB NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(client_slug, content_type)
      )
    `);

    // Buat tabel untuk gallery photos
    await masterDB.query(`
      CREATE TABLE IF NOT EXISTS client_gallery (
        id SERIAL PRIMARY KEY,
        client_slug VARCHAR(255) NOT NULL,
        image_url VARCHAR(500) NOT NULL,
        image_order INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Buat index untuk performa
    await masterDB.query(`
      CREATE INDEX IF NOT EXISTS idx_client_content_slug 
      ON client_content(client_slug)
    `);

    await masterDB.query(`
      CREATE INDEX IF NOT EXISTS idx_client_gallery_slug 
      ON client_gallery(client_slug)
    `);

    console.log('✅ Client content tables created successfully');

    return NextResponse.json({ 
      success: true, 
      message: 'Client content database setup completed' 
    });

  } catch (error: any) {
    console.error('Error setting up client content database:', error);
    return NextResponse.json({ 
      success: false, 
      message: error.message 
    }, { status: 500 });
  }
}