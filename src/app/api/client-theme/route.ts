import { NextRequest, NextResponse } from 'next/server';
import masterDB from '@/utils/db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const clientSlug = searchParams.get('clientSlug');
    
    if (!clientSlug) {
      return NextResponse.json({ message: "Client slug is required" }, { status: 400 });
    }
    
    const result = await masterDB.query(
      'SELECT theme, color_theme, background_theme FROM clients WHERE slug = $1',
      [clientSlug]
    );
    
    if (result.rows.length === 0) {
      return NextResponse.json({ message: "Client not found" }, { status: 404 });
    }
    
    const client = result.rows[0];
    
    // Support for new composed theme system
    if (client.color_theme && client.background_theme) {
      return NextResponse.json({ 
        colorTheme: client.color_theme,
        backgroundTheme: client.background_theme,
        isComposed: true
      });
    }
    
    // Check if client has theme + background_theme combination
    if (client.background_theme) {
      return NextResponse.json({ 
        theme: client.theme || 'original',
        backgroundTheme: client.background_theme,
        isComposed: false
      });
    }
    
    // Backward compatibility with legacy theme system  
    const theme = client.theme || 'original';
    return NextResponse.json({ theme, isComposed: false });
    
  } catch (error) {
    console.error("Error fetching client theme:", error);
    return NextResponse.json({ message: "Error fetching client theme" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { clientSlug, colorTheme, backgroundTheme, legacyTheme } = await req.json();
    
    if (!clientSlug) {
      return NextResponse.json({ message: "Client slug is required" }, { status: 400 });
    }

    if (colorTheme && backgroundTheme) {
      // Update with new composed theme system
      await masterDB.query(
        'UPDATE clients SET color_theme = $1, background_theme = $2, theme = NULL WHERE slug = $3',
        [colorTheme, backgroundTheme, clientSlug]
      );
      
      return NextResponse.json({ 
        success: true, 
        message: "Theme updated successfully",
        colorTheme,
        backgroundTheme
      });
    } else if (legacyTheme) {
      // Update with legacy theme system
      await masterDB.query(
        'UPDATE clients SET theme = $1, color_theme = NULL, background_theme = NULL WHERE slug = $2',
        [legacyTheme, clientSlug]
      );
      
      return NextResponse.json({ 
        success: true, 
        message: "Theme updated successfully",
        theme: legacyTheme
      });
    } else {
      return NextResponse.json({ message: "Either colorTheme+backgroundTheme or legacyTheme is required" }, { status: 400 });
    }
    
  } catch (error) {
    console.error("Error updating client theme:", error);
    return NextResponse.json({ message: "Error updating client theme" }, { status: 500 });
  }
}