/**
 * Image Compression Utility
 * Compress images without reducing resolution using Canvas API
 */

export interface CompressionOptions {
  maxSizeMB?: number;        // Max output size in MB (default: 15)
  quality?: number;          // Image quality 0-1 (default: 0.9 = 90%)
  maxWidthOrHeight?: number; // Max dimension in pixels (default: keep original)
  preserveTransparency?: boolean; // Use PNG to preserve transparency (default: false, uses JPEG)
}

/**
 * Compress image file using Canvas API
 * @param file - Image file to compress
 * @param options - Compression options
 * @returns Compressed image as base64 string
 */
export async function compressImage(
  file: File,
  options: CompressionOptions = {}
): Promise<string> {
  const {
    maxSizeMB = 15,
    quality = 0.9,
    maxWidthOrHeight,
    preserveTransparency = false,
  } = options;

  console.log(`🔄 [Compression] Starting compression for ${file.name} (${formatFileSize(file.size)})`);

  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();

      img.onload = () => {
        try {
          // Calculate dimensions (keep aspect ratio)
          let width = img.width;
          let height = img.height;

          console.log(`📐 [Compression] Original dimensions: ${width}x${height}`);

          if (maxWidthOrHeight) {
            if (width > height) {
              if (width > maxWidthOrHeight) {
                height = (height * maxWidthOrHeight) / width;
                width = maxWidthOrHeight;
              }
            } else {
              if (height > maxWidthOrHeight) {
                width = (width * maxWidthOrHeight) / height;
                height = maxWidthOrHeight;
              }
            }
            console.log(`📐 [Compression] Resized dimensions: ${width}x${height}`);
          }

          // Create canvas
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('Failed to get canvas context'));
            return;
          }

          // Choose output format based on transparency needs
          const outputFormat = preserveTransparency ? 'image/png' : 'image/jpeg';

          // Only fill white background if NOT preserving transparency (JPEG needs it)
          if (!preserveTransparency) {
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(0, 0, width, height);
          }

          ctx.drawImage(img, 0, 0, width, height);

          console.log(`🎨 [Compression] Output format: ${outputFormat}, Quality: ${quality * 100}%, Preserve Transparency: ${preserveTransparency}`);

          // Convert canvas to blob with compression
          canvas.toBlob(
            async (blob) => {
              if (!blob) {
                console.error('❌ [Compression] Failed to create blob');
                reject(new Error('Failed to create blob'));
                return;
              }

              const sizeMB = blob.size / (1024 * 1024);
              const originalSizeMB = file.size / (1024 * 1024);

              console.log(`📊 [Compression] First attempt: ${originalSizeMB.toFixed(2)}MB → ${sizeMB.toFixed(2)}MB`);

              // Check if size is within limit
              if (sizeMB > maxSizeMB && quality > 0.5) {
                // If still too large, try with lower quality
                console.warn(`⚠️ [Compression] Still too large (${sizeMB.toFixed(2)}MB > ${maxSizeMB}MB), retrying with lower quality...`);

                const lowerQuality = Math.max(0.7, quality - 0.2);
                console.log(`🔄 [Compression] Retry with quality: ${lowerQuality * 100}%`);

                canvas.toBlob(
                  async (retryBlob) => {
                    if (!retryBlob) {
                      console.error('❌ [Compression] Failed to create blob on retry');
                      reject(new Error('Failed to create blob on retry'));
                      return;
                    }

                    const newSizeMB = retryBlob.size / (1024 * 1024);
                    const reduction = ((1 - newSizeMB / originalSizeMB) * 100).toFixed(1);

                    console.log(`✅ [Compression] SUCCESS (retry): ${originalSizeMB.toFixed(2)}MB → ${newSizeMB.toFixed(2)}MB (${reduction}% reduction)`);

                    // Convert blob to base64
                    const base64 = await blobToBase64(retryBlob);
                    resolve(base64);
                  },
                  outputFormat,
                  lowerQuality
                );
              } else {
                const reduction = ((1 - sizeMB / originalSizeMB) * 100).toFixed(1);
                console.log(`✅ [Compression] SUCCESS: ${originalSizeMB.toFixed(2)}MB → ${sizeMB.toFixed(2)}MB (${reduction}% reduction)`);

                // Convert blob to base64
                const base64 = await blobToBase64(blob);
                resolve(base64);
              }
            },
            outputFormat,
            quality
          );
        } catch (error) {
          console.error('❌ [Compression] Error during compression:', error);
          reject(error);
        }
      };

      img.onerror = () => {
        console.error('❌ [Compression] Failed to load image');
        reject(new Error('Failed to load image'));
      };

      img.src = e.target?.result as string;
    };

    reader.onerror = () => {
      console.error('❌ [Compression] Failed to read file');
      reject(new Error('Failed to read file'));
    };

    reader.readAsDataURL(file);
  });
}

/**
 * Convert blob to base64 string
 */
function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      console.log(`📦 [Compression] Base64 size: ${formatFileSize((result.length * 3) / 4)}`);
      resolve(result);
    };
    reader.onerror = () => {
      console.error('❌ [Compression] Failed to convert blob to base64');
      reject(new Error('Failed to convert blob to base64'));
    };
    reader.readAsDataURL(blob);
  });
}

/**
 * Get image dimensions without loading full image
 */
export function getImageDimensions(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();

      img.onload = () => {
        resolve({ width: img.width, height: img.height });
      };

      img.onerror = () => {
        reject(new Error('Failed to load image'));
      };

      img.src = e.target?.result as string;
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };

    reader.readAsDataURL(file);
  });
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
