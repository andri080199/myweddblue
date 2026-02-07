import { NextRequest, NextResponse } from 'next/server';
import masterDB from '@/utils/db';

export async function POST(request: NextRequest) {
  console.log('🎵 Upload music API called');
  
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    console.log('📁 File received:', {
      name: file?.name,
      size: file?.size,
      type: file?.type
    });

    if (!file) {
      console.log('❌ No file uploaded');
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Validate file type
    if (!file.type.startsWith('audio/')) {
      console.log('❌ Invalid file type:', file.type);
      return NextResponse.json({ error: 'Only audio files are allowed' }, { status: 400 });
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      console.log('❌ File too large:', file.size);
      return NextResponse.json({ error: 'File size must be less than 10MB' }, { status: 400 });
    }

    console.log('🔄 Converting file to buffer...');
    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    console.log('✅ Buffer created, size:', buffer.length);

    // Clean filename for title
    const title = file.name.replace(/\.[^/.]+$/, ''); // Remove extension
    console.log('📝 Title:', title);

    // Save to database
    console.log('🔌 Using master database...');
    console.log('🏗️ Creating table if not exists...');
    // Create music_library table if it doesn't exist
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
    console.log('✅ Table ready');

    console.log('💾 Inserting music into database...');
    // Insert music into database
    const result = await masterDB.query(
      `INSERT INTO music_library (title, file_data, file_name, file_size, file_type) 
       VALUES ($1, $2, $3, $4, $5) 
       RETURNING id, title, file_name, file_size, created_at`,
      [title, buffer, file.name, file.size, file.type]
    );
    console.log('✅ Music inserted with ID:', result.rows[0]?.id);

    const musicRecord = result.rows[0];

    // Return public URL that will serve the audio
    const publicUrl = `/api/music-file/${musicRecord.id}`;

    return NextResponse.json({ 
      success: true,
      id: musicRecord.id,
      url: publicUrl,
      filename: file.name,
      originalName: file.name,
      size: file.size,
      type: file.type,
      title: title,
      created_at: musicRecord.created_at
    });

  } catch (error) {
    console.error('❌ Error uploading music:', error);
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : undefined
    });
    
    return NextResponse.json({ 
      error: 'Failed to upload music file',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}