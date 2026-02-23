/**
 * Image Optimization Utilities
 * CDN and responsive image helpers
 */

export interface ImageConfig {
  src: string;
  width?: number;
  quality?: number;
  format?: 'webp' | 'jpg' | 'png' | 'avif';
}

/**
 * Generate optimized image URL with CDN parameters
 * Supports Cloudinary, Imgix, or custom CDN
 */
export const getOptimizedImageUrl = (config: ImageConfig): string => {
  const { src, width, quality = 85, format = 'webp' } = config;

  // If using Cloudinary
  if (process.env.CLOUDINARY_CLOUD_NAME) {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const transformations = [
      width && `w_${width}`,
      `q_${quality}`,
      `f_${format}`,
      'c_fill',
      'g_auto',
    ]
      .filter(Boolean)
      .join(',');

    return `https://res.cloudinary.com/${cloudName}/image/upload/${transformations}/${src}`;
  }

  // If using Imgix
  if (process.env.IMGIX_DOMAIN) {
    const domain = process.env.IMGIX_DOMAIN;
    const params = new URLSearchParams({
      auto: 'format,compress',
      q: quality.toString(),
      ...(width && { w: width.toString() }),
      fit: 'crop',
    });

    return `https://${domain}/${src}?${params.toString()}`;
  }

  // Fallback to original URL
  return src;
};

/**
 * Generate srcSet for responsive images
 */
export const generateSrcSet = (
  src: string,
  widths: number[] = [320, 640, 960, 1280, 1920]
): string => {
  return widths
    .map((width) => {
      const url = getOptimizedImageUrl({ src, width });
      return `${url} ${width}w`;
    })
    .join(', ');
};

/**
 * Generate sizes attribute for responsive images
 */
export const generateSizes = (breakpoints?: Record<string, string>): string => {
  if (breakpoints) {
    return Object.entries(breakpoints)
      .map(([bp, size]) => `(max-width: ${bp}) ${size}`)
      .join(', ');
  }

  // Default responsive sizes
  return '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw';
};

/**
 * Preload critical images
 */
export const preloadImage = (src: string, priority: 'high' | 'low' = 'high') => {
  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = 'image';
  link.href = src;
  link.fetchPriority = priority;
  document.head.appendChild(link);
};

/**
 * Get image dimensions from URL
 */
export const getImageDimensions = (src: string): Promise<{ width: number; height: number }> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
    };
    img.onerror = reject;
    img.src = src;
  });
};

/**
 * Check if WebP is supported
 */
export const supportsWebP = (): boolean => {
  if (typeof window === 'undefined') return false;

  const canvas = document.createElement('canvas');
  if (canvas.getContext && canvas.getContext('2d')) {
    return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
  }
  return false;
};

/**
 * Check if AVIF is supported
 */
export const supportsAVIF = async (): Promise<boolean> => {
  if (typeof window === 'undefined') return false;

  const avif = 'data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgANogQEAwgMg8f8D///8WfhwB8+ErK42A=';

  try {
    const response = await fetch(avif);
    return response.ok;
  } catch {
    return false;
  }
};

/**
 * Get optimal image format based on browser support
 */
export const getOptimalFormat = async (): Promise<'avif' | 'webp' | 'jpg'> => {
  if (await supportsAVIF()) return 'avif';
  if (supportsWebP()) return 'webp';
  return 'jpg';
};

/**
 * Blur placeholder generator (for blur-up effect)
 */
export const generateBlurPlaceholder = (width: number = 40, height: number = 30): string => {
  return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 ${width} ${height}'%3E%3Cfilter id='b' color-interpolation-filters='sRGB'%3E%3CfeGaussianBlur stdDeviation='20'/%3E%3CfeColorMatrix values='1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 100 -1' result='s'/%3E%3CfeFlood x='0' y='0' width='100%25' height='100%25'/%3E%3CfeComposite operator='out' in='s'/%3E%3CfeComposite in2='SourceGraphic'/%3E%3CfeGaussianBlur stdDeviation='20'/%3E%3C/filter%3E%3Cimage width='100%25' height='100%25' x='0' y='0' preserveAspectRatio='none' style='filter: url(%23b);' href='data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=='/%3E%3C/svg%3E`;
};
