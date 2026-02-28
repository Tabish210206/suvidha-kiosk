import { NextRequest, NextResponse } from 'next/server';
import { securityManager, rateLimitConfigs } from '@/lib/security';

export async function POST(request: NextRequest) {
  try {
    const { phone, otp } = await request.json();

    // Rate limiting
    if (!securityManager.checkRateLimit(phone, rateLimitConfigs.otp)) {
      return NextResponse.json(
        { error: 'Too many attempts. Please try again later.' },
        { status: 429 }
      );
    }

    // Validate OTP
    const isValid = securityManager.validateOTP(phone, otp);

    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid or expired OTP' },
        { status: 400 }
      );
    }

    // Create session
    const session = securityManager.createSession(`user_${phone}`);

    const response = NextResponse.json(
      {
        success: true,
        message: 'OTP verified successfully',
        session: {
          id: session.id,
          token: session.token,
          expiresAt: session.expiresAt,
        },
      },
      { status: 200 }
    );

    // Set secure session cookie
    response.cookies.set('suvidha_session', session.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 15 * 60, // 15 minutes
    });

    return response;
  } catch (error) {
    console.error('[v0] OTP verification error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
