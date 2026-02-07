import { NextResponse } from 'next/server';
import masterDB from '@/utils/db';

export async function POST() {
  try {
    // Create music_library table in master database
    await masterDB.query(`
      CREATE TABLE IF NOT EXISTS music_library (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        url TEXT NOT NULL,
        file_name VARCHAR(255),
        file_size INTEGER,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Insert default music if table is empty
    const countResult = await masterDB.query('SELECT COUNT(*) FROM music_library');
    const count = parseInt(countResult.rows[0].count);

    if (count === 0) {
      await masterDB.query(`
        INSERT INTO music_library (title, url, file_name) VALUES 
        ('Andmesh - Cinta Luar Biasa', '/audio/andmesh.mp3', 'andmesh.mp3'),
        ('Wedding Song 1', '/audio/wedding1.mp3', 'wedding1.mp3'),
        ('Wedding Song 2', '/audio/wedding2.mp3', 'wedding2.mp3')
      `);
    }

    return NextResponse.json({ 
      message: 'Music library table created successfully',
      totalSongs: count === 0 ? 3 : count
    });
  } catch (error) {
    console.error('Error setting up music library:', error);
    return NextResponse.json({ error: 'Failed to setup music library' }, { status: 500 });
  }
}