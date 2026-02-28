import crypto from 'crypto';

export interface SecuritySession {
  id: string;
  userId: string;
  token: string;
  expiresAt: number;
  createdAt: number;
  ipAddress?: string;
  userAgent?: string;
}

export interface RateLimitConfig {
  maxAttempts: number;
  windowMs: number;
  blockDurationMs: number;
}

class SecurityManager {
  private sessions: Map<string, SecuritySession> = new Map();
  private rateLimitStore: Map<string, number[]> = new Map();
  private otpStore: Map<string, { code: string; createdAt: number; attempts: number }> = new Map();

  // Session Management
  createSession(userId: string): SecuritySession {
    const session: SecuritySession = {
      id: crypto.randomUUID(),
      userId,
      token: this.generateSecureToken(),
      expiresAt: Date.now() + 15 * 60 * 1000, // 15 minutes
      createdAt: Date.now(),
      ipAddress: this.getClientIp(),
      userAgent: this.getUserAgent(),
    };

    this.sessions.set(session.id, session);
    return session;
  }

  validateSession(sessionId: string): boolean {
    const session = this.sessions.get(sessionId);
    if (!session) return false;

    if (Date.now() > session.expiresAt) {
      this.sessions.delete(sessionId);
      return false;
    }

    return true;
  }

  extendSession(sessionId: string): boolean {
    const session = this.sessions.get(sessionId);
    if (!session) return false;

    session.expiresAt = Date.now() + 15 * 60 * 1000;
    return true;
  }

  destroySession(sessionId: string): boolean {
    return this.sessions.delete(sessionId);
  }

  // Token Generation
  generateSecureToken(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  // Rate Limiting
  checkRateLimit(identifier: string, config: RateLimitConfig): boolean {
    const key = `ratelimit:${identifier}`;
    const now = Date.now();
    const windowStart = now - config.windowMs;

    let attempts = this.rateLimitStore.get(key) || [];
    attempts = attempts.filter(time => time > windowStart);

    if (attempts.length >= config.maxAttempts) {
      const oldestAttempt = Math.min(...attempts);
      const blockUntil = oldestAttempt + config.windowMs + config.blockDurationMs;
      if (now < blockUntil) {
        return false;
      }
      // Reset after block period
      attempts = [];
    }

    attempts.push(now);
    this.rateLimitStore.set(key, attempts);
    return true;
  }

  // OTP Management
  generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  storeOTP(phone: string, code: string): void {
    this.otpStore.set(phone, {
      code,
      createdAt: Date.now(),
      attempts: 0,
    });
  }

  validateOTP(phone: string, code: string, maxAge: number = 5 * 60 * 1000): boolean {
    const otp = this.otpStore.get(phone);
    if (!otp) return false;

    // Check expiration (5 minutes by default)
    if (Date.now() - otp.createdAt > maxAge) {
      this.otpStore.delete(phone);
      return false;
    }

    // Check max attempts
    if (otp.attempts >= 3) {
      this.otpStore.delete(phone);
      return false;
    }

    otp.attempts++;

    if (otp.code === code) {
      this.otpStore.delete(phone);
      return true;
    }

    return false;
  }

  // Input Sanitization
  sanitizeInput(input: string): string {
    return input
      .replace(/[<>\"']/g, '') // Remove HTML special chars
      .trim()
      .substring(0, 255); // Limit length
  }

  sanitizePhoneNumber(phone: string): string {
    return phone.replace(/\D/g, '').slice(-10);
  }

  // HTTPS Enforcement
  enforceHttps(): void {
    if (typeof window !== 'undefined' && window.location.protocol !== 'https:' && process.env.NODE_ENV === 'production') {
      window.location.href = 'https:' + window.location.href.substring(window.location.protocol.length);
    }
  }

  // Content Security Policy
  setCSPHeaders(): Record<string, string> {
    return {
      'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'",
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
    };
  }

  // Session Activity Monitoring
  isSessionIdle(session: SecuritySession, idleTimeMs: number = 5 * 60 * 1000): boolean {
    // In real implementation, track last activity timestamp
    return false;
  }

  // Utility methods
  private getClientIp(): string {
    // In real implementation, extract from request headers
    return '0.0.0.0';
  }

  private getUserAgent(): string {
    return typeof navigator !== 'undefined' ? navigator.userAgent : '';
  }
}

export const securityManager = new SecurityManager();

// Rate limit configurations
export const rateLimitConfigs = {
  otp: { maxAttempts: 3, windowMs: 60 * 1000, blockDurationMs: 5 * 60 * 1000 } as RateLimitConfig,
  login: { maxAttempts: 5, windowMs: 60 * 1000, blockDurationMs: 15 * 60 * 1000 } as RateLimitConfig,
  payment: { maxAttempts: 10, windowMs: 60 * 1000, blockDurationMs: 10 * 60 * 1000 } as RateLimitConfig,
};

// Security headers middleware
export function getSecurityHeaders() {
  return {
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
  };
}
