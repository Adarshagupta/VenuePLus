# Vercel Deployment Guide for VenuePlus

## Environment Variables Required

Go to your Vercel project dashboard → Settings → Environment Variables and add:

### NextAuth Configuration
- `NEXTAUTH_SECRET`: Generate a secure random string (32+ characters)
- `NEXTAUTH_URL`: https://makemyway.vercel.app (or your actual domain)

### Database Configuration
- `DATABASE_URL`: Your production database connection string
  - For development: Use Vercel Postgres or any PostgreSQL provider
  - Example: `postgresql://username:password@host:port/database`

### Payment Integration (Optional for testing)
- `RAZORPAY_KEY_ID`: Your Razorpay key ID
- `RAZORPAY_KEY_SECRET`: Your Razorpay secret key

### Email Configuration (Optional for testing)
- `SMTP_HOST`: smtp.gmail.com
- `SMTP_PORT`: 587
- `SMTP_USER`: your-email@gmail.com
- `SMTP_PASSWORD`: your-app-password
- `GMAIL_USER`: your-email@gmail.com
- `GMAIL_APP_PASSWORD`: your-gmail-app-password

## 🚨 URGENT FIX for 404 Error

Your app is getting 404 errors because of missing environment variables. Here's the immediate fix:

### Step 1: Set Environment Variables in Vercel Dashboard

Go to your Vercel project → Settings → Environment Variables and add these **immediately**:

```
NEXTAUTH_SECRET=your-super-secret-key-here-make-it-very-long-and-random-at-least-32-chars
NEXTAUTH_URL=https://makemyway.vercel.app
DATABASE_URL=postgresql://dummy:dummy@localhost:5432/dummy
NODE_ENV=production
```

### Step 2: Test the Fix

After adding environment variables, test these URLs:
- `https://makemyway.vercel.app/test-deployment` - Simple test page
- `https://makemyway.vercel.app/api/health` - API health check
- `https://makemyway.vercel.app/` - Main homepage

## Quick Setup for Testing

For immediate deployment testing, you can use these minimal environment variables:

```
NEXTAUTH_SECRET=your-super-secret-key-here-make-it-long-and-random
NEXTAUTH_URL=https://your-project-name.vercel.app
DATABASE_URL=postgresql://test:test@localhost:5432/test
```

## Deployment Steps

1. Push your code to GitHub/GitLab/Bitbucket
2. Connect your repository to Vercel
3. Add the environment variables in Vercel dashboard
4. Deploy!

## Common Issues

- **404 Error**: Usually caused by missing environment variables or database connection issues
- **Build Failures**: Check if all dependencies are properly listed in package.json
- **API Routes Failing**: Ensure DATABASE_URL is properly configured

## Database Setup

For production, consider:
- Vercel Postgres (recommended for Vercel deployments)
- Railway
- PlanetScale
- Neon
- Supabase

Make sure to run `npx prisma db push` or `npx prisma migrate deploy` after setting up your production database.
