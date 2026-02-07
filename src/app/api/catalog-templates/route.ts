import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = 'http://localhost:3001/api/templates';
const API_KEY = '9e9c2c15676b78e30cbd7b11a9abfd3d2354bc4db27c1f0a0b12e3812c67bb61';

/**
 * Proxy GET request to catalog templates API
 * Handles: GET /api/catalog-templates?page=1&limit=12&category=modern&badge=Populer
 */
export async function GET(request: NextRequest) {
  try {
    // Get query params from request
    const searchParams = request.nextUrl.searchParams;
    const queryString = searchParams.toString();

    const url = queryString ? `${API_BASE_URL}?${queryString}` : API_BASE_URL;

    console.log('🔄 Proxying GET request:', url);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('❌ Proxy GET error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

/**
 * Proxy POST request to create template
 * Handles: POST /api/catalog-templates
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    console.log('🔄 Proxying POST request to create template:', {
      url: API_BASE_URL,
      title: body.title,
      category: body.category
    });

    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': API_KEY,
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    console.log('📨 Response from external API:', {
      status: response.status,
      success: data.success
    });

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('❌ Proxy POST error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
