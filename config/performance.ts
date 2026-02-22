/**
 * Performance Configuration
 * Optimisations pour améliorer les performances du site
 */

// Canvas performance settings
export const CANVAS_CONFIG = {
  // Adaptive pixel ratio for better performance on different devices
  dpr: [1, 1.5],
  
  // Performance scaling settings
  performance: {
    min: 0.5,  // Minimum performance level (50%)
    max: 1,    // Maximum performance level (100%)
  },
  
  // Camera settings
  camera: {
    position: [0, 2, 15],
    fov: 45,
  },
  
  // Shadows settings
  shadows: true,
};

// Lazy loading configuration
export const LAZY_LOAD_CONFIG = {
  // Delay before loading 3D scene (ms)
  delay: 100,
  
  // Timeout for 3D scene loading (ms)
  timeout: 30000,
};

// Memory optimization settings
export const MEMORY_CONFIG = {
  // Maximum number of objects in scene
  maxObjects: 1000,
  
  // Texture size limit (pixels)
  maxTextureSize: 2048,
  
  // Enable texture compression
  textureCompression: true,
};

// Network optimization settings
export const NETWORK_CONFIG = {
  // Enable resource caching
  caching: true,
  
  // Cache duration (ms)
  cacheDuration: 24 * 60 * 60 * 1000, // 24 hours
  
  // Enable compression
  compression: true,
};

// Rendering optimization settings
export const RENDERING_CONFIG = {
  // Enable frustum culling
  frustumCulling: true,
  
  // Enable LOD (Level of Detail)
  lod: true,
  
  // Enable instancing for repeated objects
  instancing: true,
  
  // Maximum draw calls per frame
  maxDrawCalls: 1000,
};

// Animation optimization settings
export const ANIMATION_CONFIG = {
  // Use requestAnimationFrame for smooth animations
  useRAF: true,
  
  // Target FPS
  targetFPS: 60,
  
  // Enable frame rate limiting
  limitFrameRate: true,
  
  // Framer Motion settings for smooth UI animations
  framerMotion: {
    // Use GPU acceleration
    acceleratedAnimation: true,
    
    // Transition defaults for smooth animations
    defaultTransition: {
      type: 'spring',
      stiffness: 300,
      damping: 30,
      mass: 1,
    },
    
    // Fast transitions for UI elements
    fastTransition: {
      type: 'spring',
      stiffness: 500,
      damping: 25,
    },
    
    // Smooth transitions for modals
    smoothTransition: {
      type: 'spring',
      stiffness: 200,
      damping: 35,
    },
  },
};

// Mobile optimization settings
export const MOBILE_CONFIG = {
  // Reduce quality on mobile devices
  reduceQuality: true,
  
  // Lower pixel ratio on mobile
  mobilePixelRatio: 1,
  
  // Disable shadows on mobile
  disableShadows: true,
  
  // Reduce texture quality on mobile
  reduceTextureQuality: true,
};

// Debug settings
export const DEBUG_CONFIG = {
  // Enable performance monitoring
  enableMonitoring: false,
  
  // Show FPS counter
  showFPS: false,
  
  // Show memory usage
  showMemory: false,
  
  // Log performance metrics
  logMetrics: false,
};

/**
 * Get optimized config based on device
 */
export const getOptimizedConfig = () => {
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  
  if (isMobile) {
    return {
      ...CANVAS_CONFIG,
      dpr: [1, 1],
      performance: { min: 0.3, max: 0.8 },
      shadows: false,
    };
  }
  
  return CANVAS_CONFIG;
};

/**
 * Check device capabilities
 */
export const checkDeviceCapabilities = () => {
  const canvas = document.createElement('canvas');
  const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
  
  if (!gl) {
    console.warn('WebGL not supported');
    return { webgl: false };
  }
  
  const maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE);
  const maxRenderbufferSize = gl.getParameter(gl.MAX_RENDERBUFFER_SIZE);
  
  return {
    webgl: true,
    maxTextureSize,
    maxRenderbufferSize,
    isMobile: /iPhone|iPad|iPod|Android/i.test(navigator.userAgent),
  };
};

/**
 * Performance monitoring
 */
export class PerformanceMonitor {
  private fps = 0;
  private frameCount = 0;
  private lastTime = performance.now();
  
  update() {
    this.frameCount++;
    const currentTime = performance.now();
    const deltaTime = currentTime - this.lastTime;
    
    if (deltaTime >= 1000) {
      this.fps = this.frameCount;
      this.frameCount = 0;
      this.lastTime = currentTime;
    }
    
    return this.fps;
  }
  
  getFPS() {
    return this.fps;
  }
  
  getMemory() {
    if (performance.memory) {
      return {
        usedJSHeapSize: performance.memory.usedJSHeapSize,
        totalJSHeapSize: performance.memory.totalJSHeapSize,
        jsHeapSizeLimit: performance.memory.jsHeapSizeLimit,
      };
    }
    return null;
  }
}
