import { NextRequest, NextResponse } from 'next/server'
import { generateOTP, sendVerificationOTP, verifyEmailConnection } from '@/lib/email-service'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()
    
    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    console.log('🧪 Testing SMTP Email Service...')
    console.log(`📧 Target email: ${email}`)
    
    // First test SMTP connection
    console.log('🔌 Testing SMTP connection...')
    const connectionTest = await verifyEmailConnection()
    
    if (!connectionTest) {
      console.error('❌ SMTP connection failed')
      return NextResponse.json(
        { 
          error: 'SMTP connection failed',
          details: 'Could not connect to Brevo SMTP server'
        },
        { status: 500 }
      )
    }
    
    console.log('✅ SMTP connection successful')
    
    // Generate test OTP
    const testOTP = generateOTP()
    console.log(`🔢 Generated test OTP: ${testOTP}`)
    
    // Send test email
    console.log('📤 Sending test verification email...')
    const emailSent = await sendVerificationOTP(email, 'Test User', testOTP)
    
    if (emailSent) {
      console.log('✅ SUCCESS! Test email sent successfully!')
      return NextResponse.json(
        { 
          success: true,
          message: 'Test email sent successfully!',
          otp: testOTP,
          email: email,
          smtpHost: 'smtp-relay.brevo.com',
          smtpPort: 587
        },
        { status: 200 }
      )
    } else {
      console.log('❌ FAILED! Email could not be sent')
      return NextResponse.json(
        { 
          error: 'Email sending failed',
          details: 'SMTP sent command failed but connection was successful'
        },
        { status: 500 }
      )
    }
    
  } catch (error: any) {
    console.error('💥 Error during email test:', error)
    
    return NextResponse.json(
      { 
        error: 'Email test failed',
        details: error.message,
        code: error.code || 'UNKNOWN',
        stack: error.stack
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json(
    { 
      message: 'Email test endpoint. Send POST request with {"email": "test@example.com"}' 
    },
    { status: 200 }
  )
}
