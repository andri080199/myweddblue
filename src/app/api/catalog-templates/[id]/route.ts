import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = 'http://localhost:3001/api/templates';
const API_KEY = '9e9c2c15676b78e30cbd7b11a9abfd3d2354bc4db27c1f0a0b12e3812c67bb61';

/**
 * Proxy GET request to get single template
 * Handles: GET /api/catalog-templates/:id
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const url = `${API_BASE_URL}/${id}`;

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
 * Proxy PUT request to update template
 * Handles: PUT /api/catalog-templates/:id
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const url = `${API_BASE_URL}/${id}`;

    console.log('🔄 Proxying PUT request:', {
      url,
      title: body.title
    });

    const response = await fetch(url, {
      method: 'PUT',
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
    console.error('❌ Proxy PUT error:', error);
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
 * Proxy DELETE request to delete template
 * Handles: DELETE /api/catalog-templates/:id
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const url = `${API_BASE_URL}/${id}`;

    console.log('🔄 Proxying DELETE request:', url);

    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'X-API-Key': API_KEY,
      },
    });

    const data = await response.json();

    console.log('📨 Response from external API:', {
      status: response.status,
      success: data.success
    });

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('❌ Proxy DELETE error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
