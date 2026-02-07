import { NextRequest, NextResponse } from 'next/server';
import masterDB from '@/utils/db';

// GET - Mendapatkan daftar musik di library
export async function GET() {
  console.log('🎶 Music library API called');
  try {
    console.log('🏗️ Ensuring table exists...');
    // Ensure table exists
    await masterDB.query(`
      CREATE TABLE IF NOT EXISTS music_library (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        file_data BYTEA NOT NULL,
        file_name VARCHAR(255) NOT NULL,
        file_size INTEGER NOT NULL,
        file_type VARCHAR(100) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    const result = await masterDB.query(
      'SELECT id, title, file_name, file_size, file_type, created_at FROM music_library ORDER BY created_at DESC'
    );

    // Add URL for each music
    const musicWithUrls = result.rows.map(music => ({
      ...music,
      url: `/api/music-file/${music.id}`
    }));
    
    console.log(`✅ Returning ${musicWithUrls.length} music items`);
    return NextResponse.json(musicWithUrls);
  } catch (error) {
    console.error('❌ Error fetching music library:', error);
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
    return NextResponse.json({ 
      error: 'Failed to fetch music library',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// POST - Menambah musik baru ke library (deprecated - use upload-music instead)
export async function POST(request: NextRequest) {
  try {
    const { title, url } = await request.json();

    if (!title || !url) {
      return NextResponse.json({ error: 'Title and URL are required' }, { status: 400 });
    }

    // This method is deprecated - use upload-music instead
    return NextResponse.json({ error: 'This endpoint is deprecated. Use /api/upload-music instead.' }, { status: 400 });
  } catch (error) {
    console.error('Error adding music to library:', error);
    return NextResponse.json({ error: 'Failed to add music to library' }, { status: 500 });
  }
}

// DELETE - Menghapus musik dari library
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Music ID is required' }, { status: 400 });
    }

    const result = await masterDB.query(
      'DELETE FROM music_library WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Music not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Music deleted successfully' });
  } catch (error) {
    console.error('Error deleting music:', error);
    return NextResponse.json({ error: 'Failed to delete music' }, { status: 500 });
  }
}