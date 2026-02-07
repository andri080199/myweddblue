import { NextRequest, NextResponse } from 'next/server';
import masterDB from '@/utils/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: 'Music ID is required' }, { status: 400 });
    }

    // Get music file from database
    const result = await masterDB.query(
      'SELECT file_data, file_name, file_type FROM music_library WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Music file not found' }, { status: 404 });
    }

    const { file_data, file_name, file_type } = result.rows[0];

    // Return the music file with proper headers
    return new NextResponse(file_data, {
      headers: {
        'Content-Type': file_type,
        'Content-Disposition': `inline; filename="${file_name}"`,
        'Cache-Control': 'public, max-age=86400', // Cache for 1 day
      },
    });

  } catch (error) {
    console.error('Error serving music file:', error);
    return NextResponse.json({ 
      error: 'Failed to serve music file' 
    }, { status: 500 });
  }
}