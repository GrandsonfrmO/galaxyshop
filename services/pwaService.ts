import { GeneratedIcons } from '../ui/PWAIconGenerator';

export interface PWASettings {
  appName: string;
  shortName: string;
  description: string;
  themeColor: string;
  backgroundColor: string;
  icons: GeneratedIcons;
}

// Save PWA icons to database via API
export const savePWAIcons = async (icons: GeneratedIcons): Promise<void> => {
  try {
    const response = await fetch('/api/pwa/icons', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(icons),
    });

    if (!response.ok) {
      throw new Error('Failed to save PWA icons');
    }

    // Also save to localStorage as backup
    localStorage.setItem('pwa_icons', JSON.stringify(icons));
    console.log('✅ PWA icons saved successfully');
  } catch (error) {
    console.error('❌ Error saving PWA icons:', error);
    throw error;
  }
};

// Load PWA icons from database via API
export const loadPWAIcons = async (): Promise<GeneratedIcons | null> => {
  try {
    const response = await fetch('/api/pwa/icons');
    if (!response.ok) {
      throw new Error('Failed to load PWA icons');
    }
    const icons = await response.json();
    return icons;
  } catch (error) {
    console.error('❌ Error loading PWA icons:', error);
    // Fallback to localStorage
    try {
      const stored = localStorage.getItem('pwa_icons');
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('❌ Error loading from localStorage:', e);
    }
    return null;
  }
};

// Save PWA settings
export const savePWASettings = async (settings: Partial<PWASettings>): Promise<void> => {
  try {
    const response = await fetch('/api/pwa/settings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(settings),
    });

    if (!response.ok) {
      throw new Error('Failed to save PWA settings');
    }

    // Also save to localStorage as backup
    const current = await loadPWASettings();
    const updated = { ...current, ...settings };
    localStorage.setItem('pwa_settings', JSON.stringify(updated));
    console.log('✅ PWA settings saved successfully');
  } catch (error) {
    console.error('❌ Error saving PWA settings:', error);
    throw error;
  }
};

// Load PWA settings
export const loadPWASettings = async (): Promise<PWASettings> => {
  try {
    const response = await fetch('/api/pwa/settings');
    if (response.ok) {
      const settings = await response.json();
      return settings;
    }
  } catch (error) {
    console.error('❌ Error loading PWA settings from API:', error);
  }

  // Fallback to localStorage
  try {
    const stored = localStorage.getItem('pwa_settings');
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('❌ Error loading PWA settings from localStorage:', error);
  }

  // Default settings
  return {
    appName: 'The Boutique',
    shortName: 'Boutique',
    description: 'Immersive fashion store with 3D experience',
    themeColor: '#a855f7',
    backgroundColor: '#050505',
    icons: {} as GeneratedIcons
  };
};

// Generate and update manifest.json dynamically
export const updateManifest = async (settings: PWASettings): Promise<void> => {
  try {
    const manifest = {
      name: settings.appName,
      short_name: settings.shortName,
      description: settings.description,
      start_url: '/',
      scope: '/',
      id: '/',
      display: 'standalone',
      display_override: ['standalone', 'fullscreen', 'minimal-ui'],
      orientation: 'portrait-primary',
      background_color: settings.backgroundColor,
      theme_color: settings.themeColor,
      lang: 'fr-FR',
      dir: 'ltr',
      prefer_related_applications: false,
      icons: [
        {
          src: '/api/pwa/icon/72',
          sizes: '72x72',
          type: 'image/png',
          purpose: 'any'
        },
        {
          src: '/api/pwa/icon/96',
          sizes: '96x96',
          type: 'image/png',
          purpose: 'any'
        },
        {
          src: '/api/pwa/icon/128',
          sizes: '128x128',
          type: 'image/png',
          purpose: 'any'
        },
        {
          src: '/api/pwa/icon/144',
          sizes: '144x144',
          type: 'image/png',
          purpose: 'any'
        },
        {
          src: '/api/pwa/icon/152',
          sizes: '152x152',
          type: 'image/png',
          purpose: 'any'
        },
        {
          src: '/api/pwa/icon/192',
          sizes: '192x192',
          type: 'image/png',
          purpose: 'any'
        },
        {
          src: '/api/pwa/icon/384',
          sizes: '384x384',
          type: 'image/png',
          purpose: 'any'
        },
        {
          src: '/api/pwa/icon/512',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'any'
        },
        {
          src: '/api/pwa/icon/192-maskable',
          sizes: '192x192',
          type: 'image/png',
          purpose: 'maskable'
        },
        {
          src: '/api/pwa/icon/512-maskable',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'maskable'
        }
      ],
      screenshots: [
        {
          src: '/screenshot-540x720.png',
          sizes: '540x720',
          type: 'image/png',
          form_factor: 'narrow',
          label: 'Boutique principale'
        },
        {
          src: '/screenshot-1280x720.png',
          sizes: '1280x720',
          type: 'image/png',
          form_factor: 'wide',
          label: 'Vue catalogue'
        }
      ],
      categories: ['shopping', 'lifestyle', 'entertainment'],
      shortcuts: [
        {
          name: 'Catalogue',
          short_name: 'Catalogue',
          description: 'Voir le catalogue',
          url: '/?tab=shop',
          icons: [
            {
              src: '/api/pwa/icon/96',
              sizes: '96x96',
              type: 'image/png'
            }
          ]
        },
        {
          name: 'Panier',
          short_name: 'Panier',
          description: 'Voir mon panier',
          url: '/?tab=cart',
          icons: [
            {
              src: '/api/pwa/icon/96',
              sizes: '96x96',
              type: 'image/png'
            }
          ]
        }
      ],
      share_target: {
        action: '/share',
        method: 'GET',
        params: {
          title: 'title',
          text: 'text',
          url: 'url'
        }
      }
    };

    // Save manifest to API
    await fetch('/api/pwa/manifest', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(manifest),
    });

    // Also store in localStorage as backup
    localStorage.setItem('pwa_manifest', JSON.stringify(manifest));
    
    // Update the manifest link in the DOM
    const manifestLink = document.querySelector('link[rel="manifest"]') as HTMLLinkElement;
    if (manifestLink) {
      // Force reload manifest by adding timestamp
      const url = `/api/pwa/manifest?t=${Date.now()}`;
      manifestLink.href = url;
    }

    console.log('✅ Manifest updated successfully');
  } catch (error) {
    console.error('❌ Error updating manifest:', error);
    throw error;
  }
};

// Update theme color in the DOM
export const updateThemeColor = (color: string): void => {
  const metaThemeColor = document.querySelector('meta[name="theme-color"]');
  if (metaThemeColor) {
    metaThemeColor.setAttribute('content', color);
  }
};

// Convert data URL to Blob for download
export const dataURLtoBlob = (dataURL: string): Blob => {
  const arr = dataURL.split(',');
  const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/png';
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
};

// Download icon as file
export const downloadIcon = (dataURL: string, filename: string): void => {
  const link = document.createElement('a');
  link.href = dataURL;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Download all icons as a zip (requires JSZip library)
export const downloadAllIcons = async (icons: GeneratedIcons): Promise<void> => {
  const iconMap = {
    'icon-16.png': icons.icon16,
    'icon-32.png': icons.icon32,
    'icon-72.png': icons.icon72,
    'icon-96.png': icons.icon96,
    'icon-120.png': icons.icon120,
    'icon-128.png': icons.icon128,
    'icon-144.png': icons.icon144,
    'icon-152.png': icons.icon152,
    'icon-167.png': icons.icon167,
    'icon-180.png': icons.icon180,
    'icon-192.png': icons.icon192,
    'icon-384.png': icons.icon384,
    'icon-512.png': icons.icon512,
    'icon-192-maskable.png': icons.icon192Maskable,
    'icon-512-maskable.png': icons.icon512Maskable
  };

  // Download each icon individually
  for (const [filename, dataURL] of Object.entries(iconMap)) {
    if (dataURL) {
      downloadIcon(dataURL, filename);
      // Small delay between downloads
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }
};

// Check if service worker needs update
export const checkServiceWorkerUpdate = async (): Promise<boolean> => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.getRegistration();
      if (registration) {
        await registration.update();
        return true;
      }
    } catch (error) {
      console.error('Error checking service worker update:', error);
    }
  }
  return false;
};

// Reload service worker to apply new icons
export const reloadServiceWorker = async (): Promise<void> => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.getRegistration();
      if (registration) {
        await registration.unregister();
        await navigator.serviceWorker.register('/sw.js');
        console.log('✅ Service Worker reloaded');
      }
    } catch (error) {
      console.error('❌ Error reloading service worker:', error);
    }
  }
};
