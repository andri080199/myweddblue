// API Client for Catalog Templates
// Uses Next.js API proxy to avoid CORS issues
// Proxy: /api/catalog-templates -> http://localhost:3001/api/templates

const API_BASE_URL = '/api/catalog-templates';
const API_KEY = '9e9c2c15676b78e30cbd7b11a9abfd3d2354bc4db27c1f0a0b12e3812c67bb61';

export interface CatalogTemplate {
  id: number;
  title: string;
  description: string;
  category: string;
  price: string;
  url: string;
  badge: string | null;
  image_base64: string;
  created_at: string;
  updated_at: string;
}

export interface PaginationInfo {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface TemplatesResponse {
  success: boolean;
  data: {
    catalogs: CatalogTemplate[];
    pagination: PaginationInfo;
  };
}

export interface SingleTemplateResponse {
  success: boolean;
  data: CatalogTemplate;
  error?: string;
}

export interface CreateTemplateData {
  title: string;
  description: string;
  category: string;
  price: string;
  url: string;
  badge?: string | null;
  image_base64: string;
}

export interface UpdateTemplateData {
  title?: string;
  description?: string;
  category?: string;
  price?: string;
  url?: string;
  badge?: string | null;
  image_base64?: string;
}

/**
 * Get all templates with optional filtering
 */
export async function getTemplates(params?: {
  category?: string;
  badge?: string;
  page?: number;
  limit?: number;
}): Promise<TemplatesResponse> {
  try {
    const queryParams = new URLSearchParams();

    if (params?.category) queryParams.append('category', params.category);
    if (params?.badge) queryParams.append('badge', params.badge);
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());

    const url = queryParams.toString()
      ? `${API_BASE_URL}?${queryParams.toString()}`
      : API_BASE_URL;

    console.log('📡 Calling API:', {
      url,
      method: 'GET',
      params
    });

    const response = await fetch(url);

    console.log('📡 Response received:', {
      status: response.status,
      statusText: response.statusText,
      ok: response.ok
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ API returned error:', {
        status: response.status,
        body: errorText
      });

      return {
        success: false,
        data: {
          catalogs: [],
          pagination: {
            total: 0,
            page: params?.page || 1,
            limit: params?.limit || 12,
            totalPages: 0
          }
        }
      };
    }

    const result = await response.json();
    console.log('✅ Templates fetched successfully:', {
      count: result.data?.catalogs?.length || 0,
      total: result.data?.pagination?.total || 0
    });
    return result;

  } catch (error) {
    console.error('❌ Fetch exception:', error);

    return {
      success: false,
      data: {
        catalogs: [],
        pagination: {
          total: 0,
          page: params?.page || 1,
          limit: params?.limit || 12,
          totalPages: 0
        }
      }
    };
  }
}

/**
 * Get single template by ID
 */
export async function getTemplate(id: number): Promise<SingleTemplateResponse> {
  try {
    console.log('📡 Fetching template:', {
      url: `${API_BASE_URL}/${id}`,
      method: 'GET',
      templateId: id
    });

    const response = await fetch(`${API_BASE_URL}/${id}`);

    console.log('📡 Response received:', {
      status: response.status,
      statusText: response.statusText,
      ok: response.ok
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ API returned error:', {
        status: response.status,
        body: errorText
      });

      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { error: errorText || response.statusText };
      }

      return {
        success: false,
        data: null as any,
        error: errorData.error || errorData.message || `HTTP ${response.status}: ${response.statusText}`
      };
    }

    const result = await response.json();
    console.log('✅ Template fetched successfully:', result);
    return result;

  } catch (error) {
    console.error('❌ Fetch exception:', error);

    if (error instanceof TypeError && error.message.includes('fetch')) {
      return {
        success: false,
        data: null as any,
        error: `Network error: Cannot connect to ${API_BASE_URL}. Please ensure the API server is running on port 3001.`
      };
    }

    return {
      success: false,
      data: null as any,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

/**
 * Create new template
 */
export async function createTemplate(data: CreateTemplateData): Promise<SingleTemplateResponse> {
  try {
    console.log('📡 Calling API:', {
      url: API_BASE_URL,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': API_KEY ? `${API_KEY.substring(0, 10)}...` : 'NOT SET'
      }
    });

    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': API_KEY,
      },
      body: JSON.stringify(data),
    });

    console.log('📡 Response received:', {
      status: response.status,
      statusText: response.statusText,
      ok: response.ok,
      headers: Object.fromEntries(response.headers.entries())
    });

    // Check if response is ok
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ API returned error:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText
      });

      // Try to parse as JSON, fallback to text
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { error: errorText || response.statusText };
      }

      return {
        success: false,
        data: null as any,
        error: errorData.error || errorData.message || `HTTP ${response.status}: ${response.statusText}`
      };
    }

    const result = await response.json();
    console.log('✅ API Success:', result);
    return result;

  } catch (error) {
    console.error('❌ Fetch exception:', error);

    if (error instanceof TypeError && error.message.includes('fetch')) {
      return {
        success: false,
        data: null as any,
        error: `Network error: Cannot connect to ${API_BASE_URL}. Please ensure the API server is running on port 3001.`
      };
    }

    return {
      success: false,
      data: null as any,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

/**
 * Update existing template
 */
export async function updateTemplate(id: number, data: UpdateTemplateData): Promise<SingleTemplateResponse> {
  try {
    console.log('📡 Updating template:', {
      url: `${API_BASE_URL}/${id}`,
      method: 'PUT',
      templateId: id
    });

    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': API_KEY,
      },
      body: JSON.stringify(data),
    });

    console.log('📡 Response received:', {
      status: response.status,
      statusText: response.statusText,
      ok: response.ok
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ API returned error:', {
        status: response.status,
        body: errorText
      });

      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { error: errorText || response.statusText };
      }

      return {
        success: false,
        data: null as any,
        error: errorData.error || errorData.message || `HTTP ${response.status}: ${response.statusText}`
      };
    }

    const result = await response.json();
    console.log('✅ Template updated successfully:', result);
    return result;

  } catch (error) {
    console.error('❌ Update exception:', error);

    if (error instanceof TypeError && error.message.includes('fetch')) {
      return {
        success: false,
        data: null as any,
        error: `Network error: Cannot connect to ${API_BASE_URL}. Please ensure the API server is running on port 3001.`
      };
    }

    return {
      success: false,
      data: null as any,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

/**
 * Delete template
 */
export async function deleteTemplate(id: number): Promise<SingleTemplateResponse> {
  try {
    console.log('📡 Deleting template:', {
      url: `${API_BASE_URL}/${id}`,
      method: 'DELETE',
      templateId: id
    });

    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'DELETE',
      headers: {
        'X-API-Key': API_KEY,
      },
    });

    console.log('📡 Response received:', {
      status: response.status,
      statusText: response.statusText,
      ok: response.ok
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ API returned error:', {
        status: response.status,
        body: errorText
      });

      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { error: errorText || response.statusText };
      }

      return {
        success: false,
        data: null as any,
        error: errorData.error || errorData.message || `HTTP ${response.status}: ${response.statusText}`
      };
    }

    const result = await response.json();
    console.log('✅ Template deleted successfully:', result);
    return result;

  } catch (error) {
    console.error('❌ Delete exception:', error);

    if (error instanceof TypeError && error.message.includes('fetch')) {
      return {
        success: false,
        data: null as any,
        error: `Network error: Cannot connect to ${API_BASE_URL}. Please ensure the API server is running on port 3001.`
      };
    }

    return {
      success: false,
      data: null as any,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

/**
 * Convert File to Base64
 */
export async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
}

/**
 * Compress image before upload
 */
export async function compressImage(file: File, maxWidth = 800, quality = 0.8): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (e) => {
      const img = new Image();
      img.src = e.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          canvas.toBlob(
            (blob) => {
              if (blob) {
                const reader = new FileReader();
                reader.readAsDataURL(blob);
                reader.onloadend = () => resolve(reader.result as string);
              }
            },
            'image/jpeg',
            quality
          );
        }
      };
    };
  });
}

export const CATEGORIES = [
  'modern',
  'floral',
  'classic',
  'vintage',
  'minimalist',
  'elegant'
] as const;

export const BADGES = [
  'Populer',
  'Premium',
  'Eksklusif'
] as const;
