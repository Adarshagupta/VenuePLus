import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { userService } from '@/lib/user-service'
import { generateOTP, sendVerificationOTP } from '@/lib/email-service'

export async function POST(request: NextRequest) {
  // Debug environment variables
  console.log('API Route - DATABASE_URL exists:', !!process.env.DATABASE_URL)
  console.log('API Route - NODE_ENV:', process.env.NODE_ENV)
  
  try {
    const { name, email, password } = await request.json()

    if (!name || !email || !password) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { message: 'User already exists with this email' },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Generate email verification OTP
    const verificationOTP = generateOTP()
    const verificationExpires = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes
    
    // Debug logging for registration
    console.log('🔍 Registration Debug:');
    console.log(`   Email: ${email}`);
    console.log(`   Generated OTP: "${verificationOTP}"`);
    console.log(`   OTP Type: ${typeof verificationOTP}`);
    console.log(`   Expires: ${verificationExpires}`)

    // Create user with basic information and verification OTP
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        emailVerified: false,
        emailVerificationOTP: verificationOTP,
        emailVerificationExpires: verificationExpires,
        preferences: userService.getDefaultPreferences() as any,
        stats: userService.getDefaultStats(new Date()) as any
      } as any
    })

    // Send verification OTP email
    const emailSent = await sendVerificationOTP(email, name, verificationOTP)
    
    if (!emailSent) {
      console.warn('Failed to send verification email, but user was created')
    }

    // Remove password and sensitive data from response
    const { password: _, emailVerificationOTP: __, ...userWithoutPassword } = user

    return NextResponse.json(
      { 
        message: 'User created successfully. Please check your email for the verification code.',
        user: userWithoutPassword,
        emailSent,
        requiresVerification: true
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

