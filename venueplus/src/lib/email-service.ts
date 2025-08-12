// Email service using Brevo SMTP
import nodemailer from 'nodemailer'
import crypto from 'crypto'

// SMTP configuration - Gmail SMTP with correct App Password
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // Use TLS
  auth: {
    user: process.env.GMAIL_USER || 'blueadarsh1@gmail.com',
    pass: process.env.GMAIL_APP_PASSWORD || 'irlu ftsh fixi tjur', // Gmail App Password with spaces
  },
})

// Alternative: SendGrid SMTP (backup option)
/*
const transporter = nodemailer.createTransport({
  host: 'smtp.sendgrid.net',
  port: 587,
  secure: false,
  auth: {
    user: 'apikey',
    pass: 'your-sendgrid-api-key',
  },
})
*/

// Backup: Brevo SMTP (commented out)
/*
const transporter = nodemailer.createTransport({
  host: 'smtp-relay.brevo.com',
  port: 587,
  secure: false,
  auth: {
    user: '947ead001@smtp-brevo.com',
    pass: 'Arash5KvQbq9PM2d',
  },
})
*/

// Verify SMTP connection
export const verifyEmailConnection = async (): Promise<boolean> => {
  try {
    await transporter.verify()
    console.log('SMTP connection verified successfully')
    return true
  } catch (error) {
    console.error('SMTP connection failed:', error)
    return false
  }
}

// Generate 6-digit OTP
export const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

// Generate secure verification token (keeping for backward compatibility)
export const generateVerificationToken = (): string => {
  return crypto.randomBytes(32).toString('hex')
}

// Generate password reset token (keeping for backward compatibility)
export const generatePasswordResetToken = (): string => {
  return crypto.randomBytes(32).toString('hex')
}

// OTP verification email template
export const sendVerificationOTP = async (
  email: string,
  name: string,
  otp: string
): Promise<boolean> => {
  try {

    const mailOptions = {
      from: {
        name: 'VenuePlus',
        address: 'blueadarsh1@gmail.com'
      },
      to: email,
      subject: 'Verify Your VenuePlus Account',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Verify Your Account</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background-color: #f3f4f6; }
            .container { max-width: 600px; margin: 0 auto; background-color: white; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center; }
            .header h1 { color: white; margin: 0; font-size: 28px; font-weight: 600; }
            .content { padding: 40px 20px; }
            .button { display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; padding: 16px 32px; border-radius: 8px; font-weight: 600; margin: 20px 0; }
            .otp-box { text-align: center; margin: 30px 0; padding: 20px; background-color: #f3f4f6; border-radius: 12px; }
            .otp-code { font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #667eea; margin: 15px 0; font-family: monospace; }
            .footer { background-color: #f9fafb; padding: 20px; text-align: center; color: #6b7280; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Welcome to VenuePlus!</h1>
            </div>
            <div class="content">
              <h2>Hi ${name}!</h2>
              <p>Thank you for signing up with VenuePlus! Please use the verification code below to complete your registration:</p>
              
              <div class="otp-box">
                <p style="margin: 0; font-weight: 600; color: #374151;">Your Verification Code</p>
                <div class="otp-code">${otp}</div>
                <p style="margin: 10px 0 0 0; font-size: 14px; color: #6b7280;">Enter this code in the verification form</p>
              </div>
              
              <p><strong>⚠️ Important:</strong></p>
              <ul style="color: #374151;">
                <li>This code will expire in <strong>10 minutes</strong></li>
                <li>Do not share this code with anyone</li>
                <li>If you didn't create this account, please ignore this email</li>
              </ul>
              
              <p>Best regards,<br>The VenuePlus Team</p>
            </div>
            <div class="footer">
              <p>© 2025 VenuePlus. All rights reserved.</p>
              <p>This email was sent to ${email}</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
        Welcome to VenuePlus!
        
        Hi ${name}!
        
        Thank you for signing up with VenuePlus! Please use this verification code:
        
        VERIFICATION CODE: ${otp}
        
        Important:
        - This code will expire in 10 minutes
        - Do not share this code with anyone
        - If you didn't create this account, please ignore this email
        
        Best regards,
        The VenuePlus Team
      `
    }

    await transporter.sendMail(mailOptions)
    console.log('Verification OTP sent successfully to:', email)
    console.log('🔐 OTP CODE FOR TESTING:', otp) // Development only - remove in production
    return true
  } catch (error) {
    console.error('Failed to send verification OTP:', error)
    return false
  }
}

// Keep original verification email for backward compatibility
export const sendVerificationEmail = async (
  email: string,
  name: string,
  verificationToken: string
): Promise<boolean> => {
  // For now, redirect to OTP-based verification
  return sendVerificationOTP(email, name, verificationToken.substring(0, 6))
}

// Password reset OTP email template
export const sendPasswordResetOTP = async (
  email: string,
  name: string,
  otp: string,
  resetUrl: string = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/auth/reset-password`
): Promise<boolean> => {
  try {

    const mailOptions = {
      from: {
        name: 'VenuePlus',
        address: 'blueadarsh1@gmail.com'
      },
      to: email,
      subject: 'Reset Your VenuePlus Password',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Reset Your Password</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background-color: #f3f4f6; }
            .container { max-width: 600px; margin: 0 auto; background-color: white; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center; }
            .header h1 { color: white; margin: 0; font-size: 28px; font-weight: 600; }
            .content { padding: 40px 20px; }
            .button { display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; padding: 16px 32px; border-radius: 8px; font-weight: 600; margin: 20px 0; }
            .warning { background-color: #fef3cd; border: 1px solid #fde68a; padding: 16px; border-radius: 8px; margin: 20px 0; }
            .footer { background-color: #f9fafb; padding: 20px; text-align: center; color: #6b7280; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Password Reset Request</h1>
            </div>
            <div class="content">
              <h2>Hi ${name}!</h2>
              <p>We received a request to reset your password for your VenuePlus account.</p>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${resetUrl}" class="button">Reset Your Password</a>
              </div>
              
              <p>If the button doesn't work, you can also copy and paste this link into your browser:</p>
              <p style="word-break: break-all; color: #667eea;">${resetUrl}</p>
              
              <div class="warning">
                <p><strong>⚠️ Security Notice:</strong></p>
                <ul>
                  <li>This password reset link will expire in 1 hour</li>
                  <li>If you didn't request this reset, please ignore this email</li>
                  <li>For security, this link can only be used once</li>
                </ul>
              </div>
              
              <p>If you continue to have problems, please contact our support team.</p>
              
              <p>Best regards,<br>The VenuePlus Team</p>
            </div>
            <div class="footer">
              <p>© 2025 VenuePlus. All rights reserved.</p>
              <p>This email was sent to ${email}</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
        Password Reset Request
        
        Hi ${name}!
        
        We received a request to reset your password for your VenuePlus account.
        
        Reset Link: ${resetUrl}
        
        Security Notice:
        - This password reset link will expire in 1 hour
        - If you didn't request this reset, please ignore this email
        - For security, this link can only be used once
        
        If you continue to have problems, please contact our support team.
        
        Best regards,
        The VenuePlus Team
      `
    }

    await transporter.sendMail(mailOptions)
    console.log('Password reset OTP sent successfully to:', email)
    return true
  } catch (error) {
    console.error('Failed to send password reset OTP:', error)
    return false
  }
}

// Keep original password reset email for backward compatibility
export const sendPasswordResetEmail = async (
  email: string,
  name: string,
  resetToken: string
): Promise<boolean> => {
  // For now, redirect to OTP-based verification
  const resetUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/auth/reset-password?token=${resetToken}`
  return sendPasswordResetOTP(email, name, resetToken.substring(0, 6), resetUrl)
}

// Welcome email after verification
export const sendWelcomeEmail = async (
  email: string,
  name: string
): Promise<boolean> => {
  try {
    const mailOptions = {
      from: {
        name: 'VenuePlus',
        address: 'blueadarsh1@gmail.com'
      },
      to: email,
      subject: 'Welcome to VenuePlus! Your account is ready',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to VenuePlus</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background-color: #f3f4f6; }
            .container { max-width: 600px; margin: 0 auto; background-color: white; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center; }
            .header h1 { color: white; margin: 0; font-size: 28px; font-weight: 600; }
            .content { padding: 40px 20px; }
            .button { display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; padding: 16px 32px; border-radius: 8px; font-weight: 600; margin: 20px 0; }
            .feature { margin: 20px 0; padding: 20px; background-color: #f9fafb; border-radius: 8px; }
            .footer { background-color: #f9fafb; padding: 20px; text-align: center; color: #6b7280; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 Welcome to VenuePlus!</h1>
            </div>
            <div class="content">
              <h2>Hi ${name}!</h2>
              <p>Your email has been successfully verified! Welcome to the VenuePlus community.</p>
              
              <p>You can now:</p>
              
              <div class="feature">
                <h3>🗺️ Plan Amazing Trips</h3>
                <p>Create detailed itineraries with our AI-powered trip planner</p>
              </div>
              
              <div class="feature">
                <h3>🏨 Smart Booking</h3>
                <p>Find and book the best accommodations and activities</p>
              </div>
              
              <div class="feature">
                <h3>📱 Track Your Adventures</h3>
                <p>Save memories and manage your travel history</p>
              </div>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/dashboard" class="button">Start Planning Your Trip</a>
              </div>
              
              <p>If you have any questions, feel free to reach out to our support team.</p>
              
              <p>Happy travels!<br>The VenuePlus Team</p>
            </div>
            <div class="footer">
              <p>© 2025 VenuePlus. All rights reserved.</p>
              <p>This email was sent to ${email}</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
        Welcome to VenuePlus!
        
        Hi ${name}!
        
        Your email has been successfully verified! Welcome to the VenuePlus community.
        
        You can now:
        - Plan Amazing Trips: Create detailed itineraries with our AI-powered trip planner
        - Smart Booking: Find and book the best accommodations and activities  
        - Track Your Adventures: Save memories and manage your travel history
        
        Start planning: ${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/dashboard
        
        If you have any questions, feel free to reach out to our support team.
        
        Happy travels!
        The VenuePlus Team
      `
    }

    await transporter.sendMail(mailOptions)
    console.log('Welcome email sent successfully to:', email)
    return true
  } catch (error) {
    console.error('Failed to send welcome email:', error)
    return false
  }
}

// Send ticket confirmation email with QR code
export const sendTicketConfirmationEmail = async (
  email: string,
  name: string,
  ticketBooking: any
): Promise<boolean> => {
  try {
    const mailOptions = {
      from: {
        name: 'VenuePlus',
        address: 'blueadarsh1@gmail.com'
      },
      to: email,
      subject: `Ticket Confirmed - ${ticketBooking.title}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Ticket Confirmation</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background-color: #f3f4f6; }
            .container { max-width: 600px; margin: 0 auto; background-color: white; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center; }
            .header h1 { color: white; margin: 0; font-size: 28px; font-weight: 600; }
            .content { padding: 40px 20px; }
            .ticket-card { border: 2px dashed #667eea; border-radius: 12px; padding: 20px; margin: 20px 0; background-color: #f8faff; }
            .ticket-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
            .ticket-title { font-size: 20px; font-weight: bold; color: #374151; margin: 0; }
            .ticket-type { background: #667eea; color: white; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; text-transform: uppercase; }
            .ticket-details { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin: 20px 0; }
            .detail-item { }
            .detail-label { font-size: 12px; color: #6b7280; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }
            .detail-value { font-size: 16px; color: #374151; font-weight: 500; margin-top: 4px; }
            .qr-section { text-align: center; margin: 30px 0; padding: 20px; background-color: white; border-radius: 8px; }
            .qr-code { max-width: 200px; margin: 15px auto; }
            .booking-ref { font-family: monospace; font-size: 18px; font-weight: bold; letter-spacing: 2px; color: #667eea; margin: 10px 0; }
            .instructions { background-color: #fef3cd; border: 1px solid #fde68a; padding: 16px; border-radius: 8px; margin: 20px 0; }
            .footer { background-color: #f9fafb; padding: 20px; text-align: center; color: #6b7280; font-size: 14px; }
            .price-info { text-align: right; }
            .total-amount { font-size: 24px; font-weight: bold; color: #059669; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎫 Ticket Confirmed!</h1>
            </div>
            <div class="content">
              <h2>Hi ${name}!</h2>
              <p>Great news! Your ${ticketBooking.ticketType} booking has been confirmed. Here are your ticket details:</p>
              
              <div class="ticket-card">
                <div class="ticket-header">
                  <h3 class="ticket-title">${ticketBooking.title}</h3>
                  <span class="ticket-type">${ticketBooking.ticketType}</span>
                </div>
                
                <div class="ticket-details">
                  <div class="detail-item">
                    <div class="detail-label">Booking Reference</div>
                    <div class="detail-value booking-ref">${ticketBooking.bookingReference}</div>
                  </div>
                  <div class="detail-item price-info">
                    <div class="detail-label">Total Amount</div>
                    <div class="total-amount">₹${ticketBooking.totalAmount}</div>
                  </div>
                  ${ticketBooking.venue ? `
                  <div class="detail-item">
                    <div class="detail-label">Venue</div>
                    <div class="detail-value">${ticketBooking.venue}</div>
                  </div>
                  ` : ''}
                  <div class="detail-item">
                    <div class="detail-label">Location</div>
                    <div class="detail-value">${ticketBooking.location}</div>
                  </div>
                  ${ticketBooking.eventDate ? `
                  <div class="detail-item">
                    <div class="detail-label">Date</div>
                    <div class="detail-value">${new Date(ticketBooking.eventDate).toLocaleDateString()}</div>
                  </div>
                  ` : ''}
                  ${ticketBooking.eventTime ? `
                  <div class="detail-item">
                    <div class="detail-label">Time</div>
                    <div class="detail-value">${ticketBooking.eventTime}</div>
                  </div>
                  ` : ''}
                  ${ticketBooking.checkInDate ? `
                  <div class="detail-item">
                    <div class="detail-label">Check-in</div>
                    <div class="detail-value">${new Date(ticketBooking.checkInDate).toLocaleDateString()}</div>
                  </div>
                  ` : ''}
                  ${ticketBooking.checkOutDate ? `
                  <div class="detail-item">
                    <div class="detail-label">Check-out</div>
                    <div class="detail-value">${new Date(ticketBooking.checkOutDate).toLocaleDateString()}</div>
                  </div>
                  ` : ''}
                  <div class="detail-item">
                    <div class="detail-label">Quantity</div>
                    <div class="detail-value">${ticketBooking.quantity} ticket(s)</div>
                  </div>
                  <div class="detail-item">
                    <div class="detail-label">Status</div>
                    <div class="detail-value" style="color: #059669;">✅ Confirmed</div>
                  </div>
                </div>
                
                ${ticketBooking.qrCode ? `
                <div class="qr-section">
                  <div class="detail-label">Your Digital Ticket</div>
                  <img src="${ticketBooking.qrCode}" alt="QR Code" class="qr-code" />
                  <p style="font-size: 14px; color: #6b7280; margin: 10px 0;">Present this QR code at the venue</p>
                </div>
                ` : ''}
              </div>
              
              <div class="instructions">
                <h3 style="margin-top: 0; color: #92400e;">📋 Important Instructions</h3>
                <ul style="color: #92400e; margin: 10px 0;">
                  <li><strong>Save this email</strong> - You'll need it for entry</li>
                  <li><strong>Arrive early</strong> - Allow extra time for security checks</li>
                  <li><strong>Bring ID</strong> - Valid photo identification may be required</li>
                  <li><strong>No screenshots</strong> - Present the original QR code from this email</li>
                  ${ticketBooking.specialInstructions ? `<li><strong>Special Note:</strong> ${ticketBooking.specialInstructions}</li>` : ''}
                </ul>
              </div>
              
              ${ticketBooking.description ? `
              <div style="margin: 20px 0;">
                <h3>About This ${ticketBooking.ticketType}</h3>
                <p style="color: #374151; line-height: 1.6;">${ticketBooking.description}</p>
              </div>
              ` : ''}
              
              <div style="margin: 30px 0;">
                <h3>Need Help?</h3>
                <p>If you have any questions about your booking, please contact our support team with your booking reference: <strong>${ticketBooking.bookingReference}</strong></p>
                <p style="color: #667eea;">📧 support@venueplus.com | 📞 +91-XXXXX-XXXXX</p>
              </div>
              
              <p>Thank you for choosing VenuePlus! We hope you have an amazing experience.</p>
              
              <p>Best regards,<br>The VenuePlus Team</p>
            </div>
            <div class="footer">
              <p>© 2025 VenuePlus. All rights reserved.</p>
              <p>This email was sent to ${email}</p>
              <p>Booking Reference: ${ticketBooking.bookingReference}</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
        Ticket Confirmation - ${ticketBooking.title}
        
        Hi ${name}!
        
        Your ${ticketBooking.ticketType} booking has been confirmed!
        
        Booking Details:
        - Reference: ${ticketBooking.bookingReference}
        - Title: ${ticketBooking.title}
        - Location: ${ticketBooking.location}
        ${ticketBooking.venue ? `- Venue: ${ticketBooking.venue}` : ''}
        ${ticketBooking.eventDate ? `- Date: ${new Date(ticketBooking.eventDate).toLocaleDateString()}` : ''}
        ${ticketBooking.eventTime ? `- Time: ${ticketBooking.eventTime}` : ''}
        - Quantity: ${ticketBooking.quantity} ticket(s)
        - Total Amount: ₹${ticketBooking.totalAmount}
        - Status: ✅ Confirmed
        
        Important Instructions:
        - Save this email - You'll need it for entry
        - Arrive early - Allow extra time for security checks  
        - Bring ID - Valid photo identification may be required
        - Present the QR code from this email at the venue
        
        Need help? Contact support with reference: ${ticketBooking.bookingReference}
        Email: support@venueplus.com
        
        Thank you for choosing VenuePlus!
        The VenuePlus Team
      `,
      attachments: ticketBooking.qrCode ? [
        {
          filename: `ticket-${ticketBooking.bookingReference}.png`,
          content: ticketBooking.qrCode.split(',')[1],
          encoding: 'base64',
          cid: 'qr-code'
        }
      ] : []
    }

    await transporter.sendMail(mailOptions)
    console.log('Ticket confirmation email sent successfully to:', email)
    return true
  } catch (error) {
    console.error('Failed to send ticket confirmation email:', error)
    return false
  }
}

export default {
  verifyEmailConnection,
  generateOTP,
  generateVerificationToken,
  generatePasswordResetToken,
  sendVerificationOTP,
  sendVerificationEmail,
  sendPasswordResetOTP,
  sendPasswordResetEmail,
  sendWelcomeEmail,
  sendTicketConfirmationEmail
}
