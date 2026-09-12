// Helper to ensure all images uploaded or preset are optimized and in Gemini-supported formats (image/png, image/jpeg, image/webp)

export async function convertImageToGeminiFormat(
  fileOrUrl: File | string,
  originalMimeType?: string
): Promise<{ url: string; base64Data: string; mimeType: string }> {
  // If it's a File
  if (fileOrUrl instanceof File) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const rawUrl = e.target?.result as string;
        try {
          if (fileOrUrl.type === 'image/svg+xml') {
            const pngData = await rasterizeSvgToPng(rawUrl);
            resolve(pngData);
          } else {
            const optimized = await resizeAndCompressImage(rawUrl, fileOrUrl.type || 'image/jpeg');
            resolve(optimized);
          }
        } catch {
          // Fallback to direct raw base64
          const base64Data = rawUrl.split(',')[1] || rawUrl;
          resolve({
            url: rawUrl,
            base64Data,
            mimeType: fileOrUrl.type || 'image/png',
          });
        }
      };
      reader.onerror = reject;
      reader.readAsDataURL(fileOrUrl);
    });
  }

  // If it's a string URL / data URL
  const url = fileOrUrl;
  if (url.startsWith('data:image/svg+xml') || originalMimeType === 'image/svg+xml') {
    return rasterizeSvgToPng(url);
  }

  if (url.startsWith('data:image/')) {
    try {
      return await resizeAndCompressImage(url, originalMimeType || 'image/jpeg');
    } catch {
      // Fallback
    }
  }

  const base64Data = url.split(',')[1] || url;
  return {
    url,
    base64Data,
    mimeType: originalMimeType || 'image/png',
  };
}

export function resizeAndCompressImage(
  dataUrl: string,
  preferredMime = 'image/jpeg',
  maxWidth = 1600,
  maxHeight = 1200
): Promise<{ url: string; base64Data: string; mimeType: string }> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      try {
        let width = img.naturalWidth || img.width;
        let height = img.naturalHeight || img.height;

        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const mime = preferredMime.includes('png') ? 'image/png' : 'image/jpeg';
          const quality = mime === 'image/jpeg' ? 0.85 : undefined;
          const compressedUrl = canvas.toDataURL(mime, quality);
          const base64Data = compressedUrl.split(',')[1] || compressedUrl;
          resolve({
            url: compressedUrl,
            base64Data,
            mimeType: mime,
          });
          return;
        }
      } catch (err) {
        console.warn('Could not compress image on canvas:', err);
      }
      const base64Data = dataUrl.split(',')[1] || dataUrl;
      resolve({ url: dataUrl, base64Data, mimeType: preferredMime });
    };
    img.onerror = () => {
      const base64Data = dataUrl.split(',')[1] || dataUrl;
      resolve({ url: dataUrl, base64Data, mimeType: preferredMime });
    };
    img.src = dataUrl;
  });
}

export function rasterizeSvgToPng(svgDataUrl: string): Promise<{ url: string; base64Data: string; mimeType: string }> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth || 800;
        canvas.height = img.naturalHeight || 450;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.fillStyle = '#131722';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0);
          const pngUrl = canvas.toDataURL('image/png');
          const base64Data = pngUrl.split(',')[1] || pngUrl;
          resolve({ url: pngUrl, base64Data, mimeType: 'image/png' });
          return;
        }
      } catch (err) {
        console.warn('Could not rasterize SVG to canvas:', err);
      }
      // Fallback
      resolve({
        url: svgDataUrl,
        base64Data: svgDataUrl.split(',')[1] || svgDataUrl,
        mimeType: 'image/png',
      });
    };
    img.onerror = () => {
      resolve({
        url: svgDataUrl,
        base64Data: svgDataUrl.split(',')[1] || svgDataUrl,
        mimeType: 'image/png',
      });
    };
    img.src = svgDataUrl;
  });
}
