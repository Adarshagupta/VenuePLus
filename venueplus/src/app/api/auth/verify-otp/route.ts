import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendWelcomeEmail } from '@/lib/email-service'

export async function POST(request: NextRequest) {
  try {
    const { email, otp } = await request.json()

    if (!email || !otp) {
      return NextResponse.json(
        { error: 'Email and OTP are required' },
        { status: 400 }
      )
    }

    // Find user with this email
    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Check if email is already verified
    if (user.emailVerified) {
      return NextResponse.json(
        { message: 'Email already verified' },
        { status: 200 }
      )
    }

    // Debug logging for OTP verification
    console.log('🔍 OTP Verification Debug:');
    console.log(`   Email: ${email}`);
    console.log(`   Provided OTP: "${otp}"`);
    console.log(`   Database OTP: "${user.emailVerificationOTP}"`);
    console.log(`   OTP Match: ${user.emailVerificationOTP === otp}`);
    console.log(`   OTP Types: provided=${typeof otp}, database=${typeof user.emailVerificationOTP}`);

    // Check if OTP matches
    if (user.emailVerificationOTP !== otp) {
      console.log('❌ OTP verification failed - codes do not match');
      return NextResponse.json(
        { error: `Invalid verification code. Expected: ${user.emailVerificationOTP}, Got: ${otp}` },
        { status: 400 }
      )
    }

    // Check if OTP has expired
    if (user.emailVerificationExpires && user.emailVerificationExpires < new Date()) {
      return NextResponse.json(
        { error: 'Verification code has expired. Please request a new one.' },
        { status: 400 }
      )
    }

    // Update user to mark email as verified and clear OTP
    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: true,
        emailVerificationOTP: null,
        emailVerificationExpires: null,
        updatedAt: new Date()
      }
    })

    // Send welcome email
    const welcomeEmailSent = await sendWelcomeEmail(user.email, user.name || 'User')
    
    if (!welcomeEmailSent) {
      console.warn('Failed to send welcome email, but verification was successful')
    }

    return NextResponse.json(
      { 
        message: 'Email verified successfully! Welcome to VenuePlus.',
        welcomeEmailSent
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('OTP verification error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Resend verification OTP
export async function PUT(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    if (user.emailVerified) {
      return NextResponse.json(
        { error: 'Email already verified' },
        { status: 400 }
      )
    }

    // Generate new OTP
    const { generateOTP, sendVerificationOTP } = await import('@/lib/email-service')
    const verificationOTP = generateOTP()
    const verificationExpires = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

    // Update user with new OTP
    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerificationOTP: verificationOTP,
        emailVerificationExpires: verificationExpires,
        updatedAt: new Date()
      }
    })

    // Send verification OTP
    const emailSent = await sendVerificationOTP(email, user.name || 'User', verificationOTP)

    if (!emailSent) {
      return NextResponse.json(
        { error: 'Failed to send verification code' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { message: 'Verification code sent successfully' },
      { status: 200 }
    )

  } catch (error) {
    console.error('Resend OTP error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
