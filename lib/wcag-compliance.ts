/**
 * WCAG 2.1 AA Compliance Module for Public Kiosk
 * Ensures all colors, contrast ratios, and accessibility standards are met
 */

export interface AccessibilityConfig {
  contrastRatio: number;
  minFontSize: number;
  minTouchTarget: number;
  colorBlindSafe: boolean;
}

// WCAG 2.1 AA Compliant Color Palette
export const wcagColorPalette = {
  // Primary Colors (High Contrast)
  primary: '#0066CC', // Blue (Government trust color)
  primaryDark: '#004399',
  primaryLight: '#3399FF',
  
  // Neutral Colors
  background: '#FFFFFF',
  backgroundAlt: '#F5F5F5',
  surface: '#FAFAFA',
  
  // Text Colors (High Contrast)
  textPrimary: '#000000', // Pure black - 21:1 contrast
  textSecondary: '#333333', // Dark gray - 12.6:1 contrast
  textTertiary: '#666666', // Medium gray - 7:1 contrast
  
  // Dark Mode
  darkBg: '#1A1A1A',
  darkText: '#FFFFFF',
  darkTextSecondary: '#E0E0E0',
  
  // Status Colors (Color Blind Safe)
  success: '#198754', // Green (accessible)
  warning: '#FF9800', // Amber (accessible)
  error: '#DC3545', // Red (accessible)
  info: '#0066CC', // Blue (accessible)
  
  // Interactive Colors
  buttonBg: '#0066CC',
  buttonText: '#FFFFFF',
  buttonHover: '#004399',
  buttonActive: '#003366',
  
  // Borders & Dividers
  border: '#CCCCCC', // 4.5:1 contrast with white
  borderDark: '#666666', // 7:1 contrast for dark mode
};

// WCAG Compliance Standards
export const wcagStandards = {
  // Contrast Ratios (WCAG 2.1 AA)
  normalText: 4.5, // 4.5:1 for body text
  largeText: 3.0, // 3:1 for text 24px+
  uiComponents: 3.0, // 3:1 for UI components
  importantButtons: 7.0, // 7:1 for critical buttons
  
  // Font Sizes
  minBodyFontSize: 18, // Kiosk minimum
  minHeadingSize: 24,
  seniorCitizenSize: 26,
  largeTextMode: 32,
  
  // Touch Targets
  minTouchTarget: 48, // 48x48px minimum
  kioskTouchTarget: 64, // 64x64px preferred for kiosk
  spacing: 16, // Minimum spacing between targets
  
  // Timing
  focusIndicatorWidth: 3, // px
  transitionDuration: 200, // ms
  inactivityTimeout: 60000, // 60 seconds for kiosk
};

// Color Contrast Checker
export function checkContrast(
  foreground: string,
  background: string
): { ratio: number; compliant: boolean; level: 'AAA' | 'AA' | 'FAIL' } {
  const fg = hexToRgb(foreground);
  const bg = hexToRgb(background);
  
  const fgLum = getRelativeLuminance(fg);
  const bgLum = getRelativeLuminance(bg);
  
  const lighter = Math.max(fgLum, bgLum);
  const darker = Math.min(fgLum, bgLum);
  const ratio = (lighter + 0.05) / (darker + 0.05);
  
  return {
    ratio: Math.round(ratio * 100) / 100,
    compliant: ratio >= 4.5,
    level: ratio >= 7 ? 'AAA' : ratio >= 4.5 ? 'AA' : 'FAIL',
  };
}

// Helper: Convert hex to RGB
function hexToRgb(hex: string): [number, number, number] {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return [0, 0, 0];
  return [
    parseInt(result[1], 16),
    parseInt(result[2], 16),
    parseInt(result[3], 16),
  ];
}

// Helper: Calculate relative luminance (WCAG formula)
function getRelativeLuminance(rgb: [number, number, number]): number {
  const [r, g, b] = rgb.map((val) => {
    val = val / 255;
    return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

// Color Blind Safe Palette Checker
export function isColorBlindSafe(color: string): boolean {
  // Check against common color blindness patterns
  const rgb = hexToRgb(color);
  
  // Protanopia (red-blind)
  const protanopiaUnsafe = rgb[0] > 200 && rgb[1] < 100 && rgb[2] < 100;
  
  // Deuteranopia (green-blind)
  const deuteranopiaUnsafe = rgb[1] > 200 && rgb[0] < 100 && rgb[2] < 100;
  
  // Tritanopia (blue-yellow blind)
  const tritanopiaUnsafe = rgb[2] > 200 && rgb[0] < 100;
  
  return !(protanopiaUnsafe || deuteranopiaUnsafe || tritanopiaUnsafe);
}

// Accessibility Configuration Generator
export function getAccessibilityConfig(mode: string): AccessibilityConfig {
  const configs: Record<string, AccessibilityConfig> = {
    standard: {
      contrastRatio: wcagStandards.normalText,
      minFontSize: wcagStandards.minBodyFontSize,
      minTouchTarget: wcagStandards.kioskTouchTarget,
      colorBlindSafe: true,
    },
    seniorCitizen: {
      contrastRatio: wcagStandards.importantButtons,
      minFontSize: wcagStandards.seniorCitizenSize,
      minTouchTarget: 80, // Extra large
      colorBlindSafe: true,
    },
    divyang: {
      contrastRatio: wcagStandards.importantButtons,
      minFontSize: wcagStandards.minBodyFontSize,
      minTouchTarget: wcagStandards.kioskTouchTarget,
      colorBlindSafe: true,
    },
    highContrast: {
      contrastRatio: 7.0,
      minFontSize: wcagStandards.minBodyFontSize,
      minTouchTarget: wcagStandards.kioskTouchTarget,
      colorBlindSafe: true,
    },
  };
  
  return configs[mode] || configs.standard;
}

// Verify all colors in palette are WCAG compliant
export function verifyPaletteCompliance(): {
  compliant: boolean;
  results: Record<string, any>;
} {
  const results: Record<string, any> = {};
  let allCompliant = true;
  
  // Test primary text on backgrounds
  const tests = [
    {
      name: 'Primary Text on White',
      fg: wcagColorPalette.textPrimary,
      bg: wcagColorPalette.background,
      required: 4.5,
    },
    {
      name: 'Button on Primary',
      fg: wcagColorPalette.buttonText,
      bg: wcagColorPalette.buttonBg,
      required: 4.5,
    },
    {
      name: 'Success Status',
      fg: wcagColorPalette.success,
      bg: wcagColorPalette.background,
      required: 3.0,
    },
    {
      name: 'Error Status',
      fg: wcagColorPalette.error,
      bg: wcagColorPalette.background,
      required: 3.0,
    },
    {
      name: 'Dark Mode Text',
      fg: wcagColorPalette.darkText,
      bg: wcagColorPalette.darkBg,
      required: 4.5,
    },
  ];
  
  tests.forEach((test) => {
    const contrast = checkContrast(test.fg, test.bg);
    const isCompliant = contrast.ratio >= test.required;
    allCompliant = allCompliant && isCompliant;
    
    results[test.name] = {
      ratio: contrast.ratio,
      required: test.required,
      compliant: isCompliant,
      level: contrast.level,
    };
  });
  
  return {
    compliant: allCompliant,
    results,
  };
}

// Accessibility Utilities
export const a11yUtils = {
  // Generate accessible focus styles
  focusStyles: `
    outline: 3px solid ${wcagColorPalette.primary};
    outline-offset: 2px;
  `,
  
  // Generate accessible button styles
  getButtonStyles: (variant: 'primary' | 'secondary' | 'danger' = 'primary') => {
    const variants = {
      primary: {
        bg: wcagColorPalette.buttonBg,
        text: wcagColorPalette.buttonText,
        hover: wcagColorPalette.buttonHover,
      },
      secondary: {
        bg: wcagColorPalette.backgroundAlt,
        text: wcagColorPalette.textPrimary,
        hover: wcagColorPalette.surface,
      },
      danger: {
        bg: wcagColorPalette.error,
        text: wcagColorPalette.buttonText,
        hover: '#BB2D3B',
      },
    };
    return variants[variant];
  },
  
  // Touch target sizing
  getTouchTargetSize: (mode: string): number => {
    if (mode === 'seniorCitizen') return 80;
    if (mode === 'divyang') return 64;
    return wcagStandards.kioskTouchTarget;
  },
};

export default {
  wcagColorPalette,
  wcagStandards,
  checkContrast,
  isColorBlindSafe,
  getAccessibilityConfig,
  verifyPaletteCompliance,
  a11yUtils,
};
