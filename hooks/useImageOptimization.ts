import { useState, useEffect } from 'react';
import { getOptimalFormat, generateSrcSet, generateSizes } from '../utils/imageOptimization';

interface UseImageOptimizationOptions {
  src: string;
  widths?: number[];
  breakpoints?: Record<string, string>;
  quality?: number;
}

interface ImageOptimizationResult {
  src: string;
  srcSet: string;
  sizes: string;
  format: 'avif' | 'webp' | 'jpg';
  isLoading: boolean;
}

/**
 * Hook for automatic image optimization
 * Detects browser capabilities and generates optimal image attributes
 */
export const useImageOptimization = ({
  src,
  widths,
  breakpoints,
  quality = 85,
}: UseImageOptimizationOptions): ImageOptimizationResult => {
  const [format, setFormat] = useState<'avif' | 'webp' | 'jpg'>('jpg');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getOptimalFormat().then((optimalFormat) => {
      setFormat(optimalFormat);
      setIsLoading(false);
    });
  }, []);

  const srcSet = generateSrcSet(src, widths);
  const sizes = generateSizes(breakpoints);

  return {
    src,
    srcSet,
    sizes,
    format,
    isLoading,
  };
};
