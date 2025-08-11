# VenuePlus Development Setup Script
Write-Host "Setting up VenuePlus for development..." -ForegroundColor Green

# Create .env.local file
$envContent = @"
# Database (PostgreSQL with Docker)
DATABASE_URL="postgresql://venueplus:venueplus123@localhost:5432/venueplus"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="dev-secret-key-change-this-in-production"

# Google AI (Gemini) - Optional for registration
GOOGLE_AI_API_KEY="your-google-ai-api-key-here"
"@

Write-Host "Creating .env.local file..." -ForegroundColor Yellow
$envContent | Out-File -FilePath ".env.local" -Encoding UTF8

Write-Host "Starting PostgreSQL with Docker..." -ForegroundColor Yellow
docker-compose up -d

Write-Host "Waiting for PostgreSQL to be ready..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

Write-Host "Installing dependencies..." -ForegroundColor Yellow
npm install

Write-Host "Generating Prisma client..." -ForegroundColor Yellow
npx prisma generate

Write-Host "Running database migrations..." -ForegroundColor Yellow
npx prisma migrate dev --name init

Write-Host "Seeding database..." -ForegroundColor Yellow
npm run db:seed

Write-Host "Setup complete! You can now run 'npm run dev' to start the development server." -ForegroundColor Green
Write-Host "The registration should now work properly." -ForegroundColor Green
