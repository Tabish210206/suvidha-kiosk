/**
 * Kiosk Display System
 * Manages responsive layout for 1920x1080 (landscape) and 1080x1920 (portrait) displays
 */

export type KioskOrientation = 'landscape' | 'portrait';
export type KioskResolution = '1920x1080' | '1080x1920' | 'custom';

export interface KioskDisplayConfig {
  width: number;
  height: number;
  orientation: KioskOrientation;
  resolution: KioskResolution;
  aspectRatio: string;
  isFullscreen: boolean;
  dpi: number;
}

export interface ResponsiveBreakpoints {
  minTouchSize: number;
  spacing: number;
  fontSize: {
    tiny: number;
    small: number;
    base: number;
    large: number;
    xlarge: number;
  };
  padding: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
}

// Standard Kiosk Resolutions
export const KIOSK_RESOLUTIONS = {
  landscapeFHD: {
    width: 1920,
    height: 1080,
    orientation: 'landscape' as const,
    aspectRatio: '16:9',
  },
  portraitFHD: {
    width: 1080,
    height: 1920,
    orientation: 'portrait' as const,
    aspectRatio: '9:16',
  },
  landscape4K: {
    width: 3840,
    height: 2160,
    orientation: 'landscape' as const,
    aspectRatio: '16:9',
  },
  portraitUHD: {
    width: 2160,
    height: 3840,
    orientation: 'portrait' as const,
    aspectRatio: '9:16',
  },
};

// Responsive Breakpoints Generator
export function getResponsiveBreakpoints(
  resolution: KioskResolution
): ResponsiveBreakpoints {
  const configs: Record<KioskResolution, ResponsiveBreakpoints> = {
    '1920x1080': {
      // Full HD Landscape
      minTouchSize: 64, // 64x64px
      spacing: 16,
      fontSize: {
        tiny: 14,
        small: 16,
        base: 18,
        large: 24,
        xlarge: 32,
      },
      padding: {
        xs: 8,
        sm: 12,
        md: 16,
        lg: 24,
        xl: 32,
      },
    },
    '1080x1920': {
      // Full HD Portrait
      minTouchSize: 64,
      spacing: 12,
      fontSize: {
        tiny: 14,
        small: 16,
        base: 18,
        large: 24,
        xlarge: 32,
      },
      padding: {
        xs: 8,
        sm: 12,
        md: 16,
        lg: 20,
        xl: 24,
      },
    },
    custom: {
      // Fallback for custom resolutions
      minTouchSize: 64,
      spacing: 16,
      fontSize: {
        tiny: 14,
        small: 16,
        base: 18,
        large: 24,
        xlarge: 32,
      },
      padding: {
        xs: 8,
        sm: 12,
        md: 16,
        lg: 24,
        xl: 32,
      },
    },
  };

  return configs[resolution];
}

// Detect current display configuration
export function detectDisplayConfig(): KioskDisplayConfig {
  if (typeof window === 'undefined') {
    return {
      width: 1920,
      height: 1080,
      orientation: 'landscape',
      resolution: '1920x1080',
      aspectRatio: '16:9',
      isFullscreen: false,
      dpi: 96,
    };
  }

  const width = window.innerWidth;
  const height = window.innerHeight;
  const orientation = width > height ? 'landscape' : 'portrait';
  const dpi = window.devicePixelRatio || 1;

  // Map to known resolutions
  let resolution: KioskResolution = 'custom';
  if ((width === 1920 && height === 1080) || (width === 1080 && height === 1920)) {
    resolution = width === 1920 ? '1920x1080' : '1080x1920';
  } else if (
    (width === 3840 && height === 2160) ||
    (width === 2160 && height === 3840)
  ) {
    resolution = width === 3840 ? '1920x1080' : '1080x1920'; // Map 4K to FHD standards
  }

  return {
    width,
    height,
    orientation,
    resolution,
    aspectRatio: orientation === 'landscape' ? '16:9' : '9:16',
    isFullscreen: document.fullscreenElement !== null,
    dpi,
  };
}

// Tailwind Class Generator for Kiosk Responsive
export function generateKioskClasses(
  resolution: KioskResolution,
  baseClasses: string = ''
): string {
  const orientationClass =
    resolution === '1080x1920' ? 'portrait' : 'landscape';

  // Add responsive classes
  return `${baseClasses} kiosk-${orientationClass}`;
}

// Layout Helper: Safe Area with Home Button
export interface SafeAreaConfig {
  headerHeight: number;
  footerHeight: number;
  sidebarWidth: number;
  contentHeight: number;
  contentWidth: number;
}

export function getSafeAreaConfig(
  displayConfig: KioskDisplayConfig
): SafeAreaConfig {
  const breakpoints = getResponsiveBreakpoints(displayConfig.resolution);
  const headerHeight = 80; // Top bar with logo/status
  const footerHeight = 80; // Home button + status bar
  const sidebarWidth =
    displayConfig.orientation === 'landscape' ? 200 : 0; // Sidebar in landscape

  return {
    headerHeight,
    footerHeight,
    sidebarWidth,
    contentHeight: displayConfig.height - headerHeight - footerHeight,
    contentWidth: displayConfig.width - sidebarWidth,
  };
}

// Fullscreen Management
export async function requestFullscreen(element: HTMLElement): Promise<void> {
  try {
    if (element.requestFullscreen) {
      await element.requestFullscreen();
    } else if ((element as any).webkitRequestFullscreen) {
      // Safari
      (element as any).webkitRequestFullscreen();
    } else if ((element as any).msRequestFullscreen) {
      // IE11
      (element as any).msRequestFullscreen();
    }
  } catch (error) {
    console.error('Failed to enter fullscreen:', error);
  }
}

export function exitFullscreen(): void {
  if (document.fullscreenElement) {
    document.exitFullscreen().catch(() => {
      // Fullscreen exit not allowed
    });
  }
}

export function isFullscreenEnabled(): boolean {
  return (
    document.fullscreenEnabled ||
    (document as any).webkitFullscreenEnabled ||
    (document as any).mozFullScreenEnabled
  );
}

// Screen Orientation Lock (For Kiosk Mode)
export async function lockOrientation(
  orientation: 'landscape' | 'portrait'
): Promise<void> {
  try {
    if (screen.orientation && screen.orientation.lock) {
      const fullOrientation =
        orientation === 'landscape'
          ? 'landscape-primary'
          : 'portrait-primary';
      await (screen.orientation as any).lock(fullOrientation);
    }
  } catch (error) {
    console.warn('Screen orientation lock not supported:', error);
  }
}

// Touch Detection
export function isTouchDevice(): boolean {
  if (typeof window === 'undefined') return false;

  return (
    (window as any).ontouchstart !== undefined ||
    navigator.maxTouchPoints > 0 ||
    (navigator as any).msMaxTouchPoints > 0
  );
}

// CSS Generation for Kiosk Responsive Layout
export const kioskResponsiveCSS = `
  /* Landscape (1920x1080) */
  @media (min-width: 1920px) and (min-height: 1080px) {
    .kiosk-landscape {
      width: 100vw;
      height: 100vh;
    }
    
    .kiosk-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 16px;
    }
    
    .kiosk-button {
      min-width: 64px;
      min-height: 64px;
      font-size: 18px;
      padding: 16px;
    }
    
    .kiosk-heading {
      font-size: 32px;
      line-height: 1.4;
    }
  }
  
  /* Portrait (1080x1920) */
  @media (max-aspect-ratio: 1/1) and (min-width: 1080px) {
    .kiosk-portrait {
      width: 100vw;
      height: 100vh;
    }
    
    .kiosk-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 12px;
    }
    
    .kiosk-button {
      min-width: 64px;
      min-height: 64px;
      font-size: 16px;
      padding: 12px;
    }
    
    .kiosk-heading {
      font-size: 28px;
      line-height: 1.3;
    }
  }
  
  /* Fullscreen Mode */
  .kiosk-fullscreen {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: 9999;
  }
  
  /* No hover for touch devices */
  @media (hover: none) {
    button:hover {
      background-color: inherit;
    }
    
    .kiosk-button:active {
      transform: scale(0.98);
      transition: transform 100ms ease-in;
    }
  }
`;

// Responsive Grid Helper
export function createResponsiveGrid(
  itemCount: number,
  resolution: KioskResolution
): {
  columns: number;
  rows: number;
  itemWidth: string;
  itemHeight: string;
} {
  const isPortrait = resolution === '1080x1920';

  if (isPortrait) {
    // Portrait: 2 columns
    return {
      columns: 2,
      rows: Math.ceil(itemCount / 2),
      itemWidth: 'calc(50% - 6px)',
      itemHeight: '200px',
    };
  }

  // Landscape: 4-5 columns
  const columns = itemCount <= 4 ? 4 : 5;
  return {
    columns,
    rows: Math.ceil(itemCount / columns),
    itemWidth: `calc(${100 / columns}% - 12px)`,
    itemHeight: '240px',
  };
}

export default {
  KIOSK_RESOLUTIONS,
  getResponsiveBreakpoints,
  detectDisplayConfig,
  generateKioskClasses,
  getSafeAreaConfig,
  requestFullscreen,
  exitFullscreen,
  isFullscreenEnabled,
  lockOrientation,
  isTouchDevice,
  kioskResponsiveCSS,
  createResponsiveGrid,
};
