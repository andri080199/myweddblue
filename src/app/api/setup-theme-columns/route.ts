import { NextRequest, NextResponse } from 'next/server';
import masterDB from '@/utils/db';

export async function POST(req: NextRequest) {
  try {
    console.log('🔧 Adding color_theme and background_theme columns to clients table...');
    
    // Add color_theme column
    await masterDB.query(`
      ALTER TABLE clients 
      ADD COLUMN IF NOT EXISTS color_theme VARCHAR(50)
    `);
    
    // Add background_theme column  
    await masterDB.query(`
      ALTER TABLE clients 
      ADD COLUMN IF NOT EXISTS background_theme VARCHAR(50)
    `);
    
    console.log('✅ Theme columns added successfully');
    
    return NextResponse.json({ 
      success: true, 
      message: 'Theme columns added to clients table successfully' 
    });
    
  } catch (error: unknown) {
    console.error('Error adding theme columns:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ 
      success: false, 
      message: `Failed to add theme columns: ${message}` 
    }, { status: 500 });
  }
}