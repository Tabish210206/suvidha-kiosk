/**
 * Kiosk Session Management
 * Handles auto-logout, inactivity tracking, and security
 */

export interface KioskSession {
  userId?: string;
  startTime: number;
  lastActivityTime: number;
  sessionId: string;
  isLoggedIn: boolean;
  inactivityTimeout: number; // milliseconds
  warningThreshold: number; // milliseconds before logout
}

export interface SessionActivity {
  type: 'touch' | 'click' | 'voice' | 'keyboard';
  timestamp: number;
  targetElement?: string;
}

export class KioskSessionManager {
  private session: KioskSession | null = null;
  private activityLog: SessionActivity[] = [];
  private inactivityTimer: NodeJS.Timeout | null = null;
  private warningTimer: NodeJS.Timeout | null = null;
  private listeners: Map<string, Function[]> = new Map();
  private readonly STORAGE_KEY = 'kiosk_session';

  constructor(
    inactivityTimeout: number = 60000, // 60 seconds
    warningThreshold: number = 10000 // 10 seconds before logout
  ) {
    this.session = {
      startTime: Date.now(),
      lastActivityTime: Date.now(),
      sessionId: this.generateSessionId(),
      isLoggedIn: false,
      inactivityTimeout,
      warningThreshold,
    };

    this.setupActivityTracking();
  }

  /**
   * Start a new session
   */
  startSession(userId?: string): KioskSession {
    this.session = {
      userId,
      startTime: Date.now(),
      lastActivityTime: Date.now(),
      sessionId: this.generateSessionId(),
      isLoggedIn: true,
      inactivityTimeout: this.session?.inactivityTimeout || 60000,
      warningThreshold: this.session?.warningThreshold || 10000,
    };

    this.saveSession();
    this.resetInactivityTimer();
    this.emit('session-started', this.session);

    return this.session;
  }

  /**
   * Record user activity to reset inactivity timer
   */
  recordActivity(
    type: 'touch' | 'click' | 'voice' | 'keyboard',
    targetElement?: string
  ): void {
    if (!this.session?.isLoggedIn) return;

    const wasInactive =
      Date.now() - this.session.lastActivityTime >
      this.session.inactivityTimeout / 2;

    this.session.lastActivityTime = Date.now();

    this.activityLog.push({
      type,
      timestamp: Date.now(),
      targetElement,
    });

    // Keep only last 100 activities
    if (this.activityLog.length > 100) {
      this.activityLog.shift();
    }

    // Reset timers on activity
    this.resetInactivityTimer();

    if (wasInactive) {
      this.emit('activity-resumed', type);
    }
  }

  /**
   * Reset inactivity timer
   */
  private resetInactivityTimer(): void {
    // Clear existing timers
    if (this.inactivityTimer) clearTimeout(this.inactivityTimer);
    if (this.warningTimer) clearTimeout(this.warningTimer);

    if (!this.session?.isLoggedIn) return;

    const timeout = this.session.inactivityTimeout;
    const warning = this.session.warningThreshold;

    // Warning timer
    this.warningTimer = setTimeout(() => {
      this.emit('inactivity-warning', {
        timeRemaining: warning,
      });
    }, timeout - warning);

    // Logout timer
    this.inactivityTimer = setTimeout(() => {
      this.logout('inactivity');
    }, timeout);
  }

  /**
   * End session and logout
   */
  logout(reason: 'manual' | 'inactivity' | 'forced'): void {
    this.emit('before-logout', {
      reason,
      sessionDuration: this.getSessionDuration(),
      activityCount: this.activityLog.length,
    });

    // Clear sensitive data
    this.clearSessionData();

    if (this.session) {
      this.session.isLoggedIn = false;
    }

    // Clear timers
    if (this.inactivityTimer) clearTimeout(this.inactivityTimer);
    if (this.warningTimer) clearTimeout(this.warningTimer);

    // Remove from storage
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem(this.STORAGE_KEY);
    }

    this.emit('logout', { reason });
  }

  /**
   * Clear all sensitive session data
   */
  private clearSessionData(): void {
    // Clear form data
    const forms = document.querySelectorAll('form');
    forms.forEach((form) => form.reset());

    // Clear input values
    const inputs = document.querySelectorAll('input, textarea, select');
    inputs.forEach((input: any) => {
      input.value = '';
      input.cleared = true;
    });

    // Clear from localStorage
    const sensitiveKeys = [
      'userId',
      'userPhone',
      'consumerNumber',
      'tempFormData',
    ];
    sensitiveKeys.forEach((key) => {
      if (typeof window !== 'undefined') {
        localStorage.removeItem(key);
        sessionStorage.removeItem(key);
      }
    });
  }

  /**
   * Setup global activity tracking
   */
  private setupActivityTracking(): void {
    if (typeof window === 'undefined') return;

    // Touch events
    document.addEventListener('touchstart', () => {
      this.recordActivity('touch');
    });

    // Click events (for non-touch)
    document.addEventListener('click', (e) => {
      if (!('ontouchstart' in window)) {
        this.recordActivity('click', (e.target as HTMLElement).id);
      }
    });

    // Keyboard events
    document.addEventListener('keydown', () => {
      this.recordActivity('keyboard');
    });

    // Voice activity (will be called by voice assistant)
    window.addEventListener('kiosk:voice-activity', () => {
      this.recordActivity('voice');
    });
  }

  /**
   * Get remaining inactivity time
   */
  getRemainingTime(): number {
    if (!this.session?.isLoggedIn) return 0;

    const elapsed = Date.now() - this.session.lastActivityTime;
    return Math.max(0, this.session.inactivityTimeout - elapsed);
  }

  /**
   * Get session duration in seconds
   */
  getSessionDuration(): number {
    if (!this.session) return 0;
    return (Date.now() - this.session.startTime) / 1000;
  }

  /**
   * Get current session
   */
  getSession(): KioskSession | null {
    return this.session;
  }

  /**
   * Get activity log
   */
  getActivityLog(): SessionActivity[] {
    return [...this.activityLog];
  }

  /**
   * Save session to storage
   */
  private saveSession(): void {
    if (typeof window === 'undefined' || !this.session) return;

    try {
      sessionStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.session));
    } catch (e) {
      console.warn('Failed to save session:', e);
    }
  }

  /**
   * Restore session from storage
   */
  restoreSession(): KioskSession | null {
    if (typeof window === 'undefined') return null;

    try {
      const stored = sessionStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        this.session = JSON.parse(stored);
        return this.session;
      }
    } catch (e) {
      console.warn('Failed to restore session:', e);
    }

    return null;
  }

  /**
   * Generate unique session ID
   */
  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
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

  /**
   * Mask sensitive data for logging
   */
  maskSensitiveData(data: string): string {
    // Mask phone numbers
    data = data.replace(/\d{10}/g, 'XXXX-XXXX-10');

    // Mask consumer numbers
    data = data.replace(/\d{4,}/g, (match) => {
      return match.slice(0, 2) + 'X'.repeat(match.length - 4) + match.slice(-2);
    });

    return data;
  }

  /**
   * Get session analytics
   */
  getAnalytics(): {
    sessionDuration: number;
    totalActivities: number;
    activityBreakdown: Record<string, number>;
    averageActivityInterval: number;
  } {
    const activityBreakdown: Record<string, number> = {
      touch: 0,
      click: 0,
      voice: 0,
      keyboard: 0,
    };

    this.activityLog.forEach((activity) => {
      activityBreakdown[activity.type]++;
    });

    const intervals = [];
    for (let i = 1; i < this.activityLog.length; i++) {
      intervals.push(
        this.activityLog[i].timestamp - this.activityLog[i - 1].timestamp
      );
    }

    const averageInterval =
      intervals.length > 0
        ? intervals.reduce((a, b) => a + b, 0) / intervals.length
        : 0;

    return {
      sessionDuration: this.getSessionDuration(),
      totalActivities: this.activityLog.length,
      activityBreakdown,
      averageActivityInterval: averageInterval,
    };
  }
}

// Global session manager instance
let sessionManager: KioskSessionManager | null = null;

export function getSessionManager(
  inactivityTimeout?: number,
  warningThreshold?: number
): KioskSessionManager {
  if (!sessionManager) {
    sessionManager = new KioskSessionManager(inactivityTimeout, warningThreshold);
  }
  return sessionManager;
}

export function resetSessionManager(): void {
  if (sessionManager) {
    sessionManager.logout('forced');
  }
  sessionManager = null;
}

export default KioskSessionManager;
