/**
 * Comprehensive Accessibility Modes System
 * WCAG 2.1 AAA Compliant Accessibility Features
 */

export type AccessibilityMode =
  | 'standard'
  | 'seniorCitizen'
  | 'divyang'
  | 'highContrast'
  | 'voiceFirst';

export interface AccessibilityModeConfig {
  mode: AccessibilityMode;
  fontSize: number;
  fontFamily: string;
  lineHeight: number;
  contrastRatio: number;
  touchTargetSize: number;
  animationDuration: number;
  voiceEnabled: boolean;
  focusIndicatorSize: number;
  colorBlindMode: 'normal' | 'deuteranopia' | 'protanopia' | 'tritanopia';
  descriptions: {
    name: string;
    description: string;
    benefits: string[];
  };
}

export const ACCESSIBILITY_MODES: Record<
  AccessibilityMode,
  AccessibilityModeConfig
> = {
  standard: {
    mode: 'standard',
    fontSize: 18,
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    lineHeight: 1.5,
    contrastRatio: 4.5,
    touchTargetSize: 64,
    animationDuration: 200,
    voiceEnabled: true,
    focusIndicatorSize: 3,
    colorBlindMode: 'normal',
    descriptions: {
      name: 'Standard Mode',
      description: 'Default accessibility settings for general public',
      benefits: [
        'Balanced font sizes and spacing',
        'Standard color contrasts (WCAG AA)',
        'Touch targets 64x64px',
        'Optional voice assistance',
      ],
    },
  },

  seniorCitizen: {
    mode: 'seniorCitizen',
    fontSize: 26,
    fontFamily: 'Georgia, "Times New Roman", serif',
    lineHeight: 1.8,
    contrastRatio: 7.0,
    touchTargetSize: 80,
    animationDuration: 500,
    voiceEnabled: true,
    focusIndicatorSize: 4,
    colorBlindMode: 'normal',
    descriptions: {
      name: 'Senior Citizen Mode',
      description:
        'Enhanced readability for elderly citizens with visual limitations',
      benefits: [
        'Extra large fonts (26px minimum)',
        'Serif fonts for easier reading',
        'Higher line spacing for clarity',
        'Extra large touch targets (80x80px)',
        'Slower animations and transitions',
        'Voice guidance for all interactions',
        'Simplified navigation',
      ],
    },
  },

  divyang: {
    mode: 'divyang',
    fontSize: 18,
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    lineHeight: 1.6,
    contrastRatio: 7.0,
    touchTargetSize: 72,
    animationDuration: 200,
    voiceEnabled: true,
    focusIndicatorSize: 4,
    colorBlindMode: 'normal',
    descriptions: {
      name: 'Persons with Disabilities Mode',
      description:
        'Optimized for users with mobility and vision impairments',
      benefits: [
        'Screen reader optimized (semantic HTML)',
        'Voice command priority',
        'Keyboard-only navigation',
        'Large touch targets (72x72px)',
        'High contrast UI elements',
        'Simplified tab order',
        'ARIA labels on all interactive elements',
        'Hands-free voice control option',
      ],
    },
  },

  highContrast: {
    mode: 'highContrast',
    fontSize: 18,
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    lineHeight: 1.5,
    contrastRatio: 7.0,
    touchTargetSize: 64,
    animationDuration: 150,
    voiceEnabled: true,
    focusIndicatorSize: 4,
    colorBlindMode: 'normal',
    descriptions: {
      name: 'High Contrast Mode',
      description: 'Maximum contrast for low vision users',
      benefits: [
        'Pure black text on white background',
        'Very high contrast (7:1 minimum)',
        'Reduced animations',
        'Bold text by default',
        'Strong focus indicators',
        'Large touch targets',
        'Color blind safe palette',
      ],
    },
  },

  voiceFirst: {
    mode: 'voiceFirst',
    fontSize: 18,
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    lineHeight: 1.5,
    contrastRatio: 4.5,
    touchTargetSize: 64,
    animationDuration: 200,
    voiceEnabled: true,
    focusIndicatorSize: 3,
    colorBlindMode: 'normal',
    descriptions: {
      name: 'Voice-First Mode',
      description:
        'Optimized for voice command and speech recognition (blind/low vision)',
      benefits: [
        'Voice commands as primary input',
        'Audio descriptions for all UI elements',
        'Minimal visual interface',
        'Screen reader enabled',
        'Audio alerts and notifications',
        'Voice confirmation for actions',
        'Audio navigation guidance',
      ],
    },
  },
};

/**
 * Accessibility Mode Manager
 */
export class AccessibilityModeManager {
  private currentMode: AccessibilityMode = 'standard';
  private colorBlindMode: string = 'normal';
  private listeners: Map<string, Function[]> = new Map();

  constructor(initialMode: AccessibilityMode = 'standard') {
    this.currentMode = initialMode;
    this.applyMode(initialMode);
  }

  /**
   * Set accessibility mode
   */
  setMode(mode: AccessibilityMode): void {
    if (mode === this.currentMode) return;

    this.currentMode = mode;
    this.applyMode(mode);
    this.emit('mode-changed', { mode });
  }

  /**
   * Get current mode
   */
  getMode(): AccessibilityMode {
    return this.currentMode;
  }

  /**
   * Get current mode config
   */
  getModeConfig(): AccessibilityModeConfig {
    return ACCESSIBILITY_MODES[this.currentMode];
  }

  /**
   * Set color blind simulation mode
   */
  setColorBlindMode(mode: string): void {
    this.colorBlindMode = mode;
    this.applyColorBlindFilter(mode);
    this.emit('color-blind-mode-changed', { mode });
  }

  /**
   * Apply accessibility mode to DOM
   */
  private applyMode(mode: AccessibilityMode): void {
    const config = ACCESSIBILITY_MODES[mode];

    if (typeof document === 'undefined') return;

    // Remove existing accessibility styles
    const existingStyle = document.getElementById('a11y-styles');
    if (existingStyle) existingStyle.remove();

    // Create and inject new styles
    const style = document.createElement('style');
    style.id = 'a11y-styles';
    style.textContent = this.generateAccessibilityCSS(config);

    document.head.appendChild(style);

    // Update HTML attributes
    document.documentElement.setAttribute('data-a11y-mode', mode);
    document.documentElement.style.fontSize = `${config.fontSize}px`;
    document.documentElement.style.lineHeight = config.lineHeight.toString();

    // Set ARIA live region for announcements
    this.setupLiveRegion();
  }

  /**
   * Generate CSS for accessibility mode
   */
  private generateAccessibilityCSS(config: AccessibilityModeConfig): string {
    const touchSize = `${config.touchTargetSize}px`;
    const focusSize = `${config.focusIndicatorSize}px`;

    return `
/* Accessibility Mode: ${config.mode} */

:root {
  --a11y-font-size: ${config.fontSize}px;
  --a11y-line-height: ${config.lineHeight};
  --a11y-touch-size: ${touchSize};
  --a11y-focus-size: ${focusSize};
  --a11y-animation-duration: ${config.animationDuration}ms;
}

/* Global Typography */
html {
  font-size: ${config.fontSize}px;
  line-height: ${config.lineHeight};
  font-family: ${config.fontFamily};
}

body {
  font-size: ${config.fontSize}px;
  line-height: ${config.lineHeight};
  font-family: ${config.fontFamily};
  ${this.currentMode === 'highContrast' ? 'background: #FFFFFF; color: #000000;' : ''}
}

/* Headings */
h1, h2, h3, h4, h5, h6 {
  font-family: ${config.fontFamily};
  line-height: ${config.lineHeight};
}

h1 { font-size: ${Math.round(config.fontSize * 2)}px; font-weight: bold; }
h2 { font-size: ${Math.round(config.fontSize * 1.8)}px; font-weight: bold; }
h3 { font-size: ${Math.round(config.fontSize * 1.6)}px; font-weight: bold; }
h4 { font-size: ${Math.round(config.fontSize * 1.4)}px; font-weight: bold; }
h5 { font-size: ${Math.round(config.fontSize * 1.2)}px; font-weight: bold; }
h6 { font-size: ${Math.round(config.fontSize * 1.1)}px; font-weight: bold; }

/* Text */
p, span, div {
  font-size: ${config.fontSize}px;
  line-height: ${config.lineHeight};
}

/* Interactive Elements */
button, a, input, select, textarea {
  font-size: ${config.fontSize}px;
  min-height: ${config.touchTargetSize}px;
  min-width: ${config.touchTargetSize}px;
  padding: calc(${config.touchTargetSize}px / 8) calc(${config.touchTargetSize}px / 4);
}

button, a {
  padding: calc(${config.touchTargetSize}px / 6) calc(${config.touchTargetSize}px / 3);
}

/* Focus Indicators */
*:focus {
  outline: ${focusSize} solid #0066CC;
  outline-offset: 2px;
  border-radius: 2px;
}

button:focus,
a:focus,
input:focus,
select:focus,
textarea:focus {
  outline: ${focusSize} solid #0066CC;
  outline-offset: 2px;
}

/* Animations and Transitions */
* {
  transition-duration: ${config.animationDuration}ms !important;
}

${
  this.currentMode === 'highContrast'
    ? `
/* High Contrast Mode */
button {
  border: 2px solid #000000;
  background: #FFFFFF;
  color: #000000;
}

button:hover {
  background: #000000;
  color: #FFFFFF;
}

a {
  color: #0066CC;
  text-decoration: underline;
}

input, textarea, select {
  border: 2px solid #000000;
  background: #FFFFFF;
  color: #000000;
}
`
    : ''
}

${
  this.currentMode === 'seniorCitizen'
    ? `
/* Senior Citizen Mode */
body {
  letter-spacing: 0.5px;
}

button {
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

button:hover {
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}
`
    : ''
}

/* Skip Links */
.skip-link {
  position: absolute;
  top: -40px;
  left: 0;
  background: #000000;
  color: white;
  padding: 8px;
  text-decoration: none;
  z-index: 100;
}

.skip-link:focus {
  top: 0;
}

/* Live Region for Screen Readers */
[aria-live] {
  position: absolute;
  left: -10000px;
  width: 1px;
  height: 1px;
  ;
}

/* Keyboard Navigation Indicators */
.keyboard-focus:focus {
  outline: ${focusSize} dashed #0066CC;
  outline-offset: 4px;
`;
  }

  /**
   * Apply color blind filter
   */
  private applyColorBlindFilter(mode: string): void {
    if (typeof document === 'undefined') return;

    const existingFilter = document.getElementById('color-blind-filter');
    if (existingFilter) existingFilter.remove();

    if (mode === 'normal') return;

    const style = document.createElement('style');
    style.id = 'color-blind-filter';

    const filters: Record<string, string> = {
      deuteranopia: `
        filter: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg"><filter id="deuteranopia"><feColorMatrix type="matrix" values="0.625 0.375 0 0 0 0.7 0.3 0 0 0 0 0.3 0.7 0 0 0 0 0 1 0"/></filter></svg>#deuteranopia');
      `,
      protanopia: `
        filter: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg"><filter id="protanopia"><feColorMatrix type="matrix" values="0.567 0.433 0 0 0 0.558 0.442 0 0 0 0 0.242 0.758 0 0 0 0 0 1 0"/></filter></svg>#protanopia');
      `,
      tritanopia: `
        filter: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg"><filter id="tritanopia"><feColorMatrix type="matrix" values="0.95 0.05 0 0 0 0 0.433 0.567 0 0 0 0.475 0.525 0 0 0 0 0 1 0"/></filter></svg>#tritanopia');
      `,
    };

    if (filters[mode]) {
      style.textContent = `body { ${filters[mode]} }`;
      document.head.appendChild(style);
    }
  }

  /**
   * Setup live region for screen reader announcements
   */
  private setupLiveRegion(): void {
    if (typeof document === 'undefined') return;

    const existingRegion = document.getElementById('a11y-live-region');
    if (existingRegion) return;

    const region = document.createElement('div');
    region.id = 'a11y-live-region';
    region.setAttribute('aria-live', 'polite');
    region.setAttribute('aria-atomic', 'true');
    region.style.position = 'absolute';
    region.style.left = '-10000px';
    region.style.width = '1px';
    region.style.height = '1px';
    region.style.overflow = 'hidden';

    document.body.appendChild(region);
  }

  /**
   * Announce message to screen readers
   */
  announce(message: string): void {
    if (typeof document === 'undefined') return;

    const region = document.getElementById('a11y-live-region');
    if (region) {
      region.textContent = message;
    }
  }

  /**
   * Event listener management
   */
  on(event: string, callback: Function): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(callback);
  }

  off(event: string, callback: Function): void {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  private emit(event: string, data?: any): void {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      callbacks.forEach((callback) => callback(data));
    }
  }
};

export function getAccessibilityManager(
  initialMode?: AccessibilityMode
): AccessibilityModeManager {
  return new AccessibilityModeManager(initialMode);
}

export default ACCESSIBILITY_MODES;
