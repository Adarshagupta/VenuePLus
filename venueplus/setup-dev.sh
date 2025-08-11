#!/bin/bash
# VenuePlus Development Setup Script

echo "Setting up VenuePlus for development..."

# Create .env.local file
cat > .env.local << EOF
# Database (SQLite for development)
DATABASE_URL="file:./dev.db"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="dev-secret-key-change-this-in-production"

# Google AI (Gemini) - Optional for registration
GOOGLE_AI_API_KEY="your-google-ai-api-key-here"
EOF

echo "Created .env.local file..."

echo "Installing dependencies..."
npm install

echo "Generating Prisma client..."
npx prisma generate

echo "Running database migrations..."
npx prisma migrate dev --name init

echo "Seeding database..."
npm run db:seed

echo "Setup complete! You can now run 'npm run dev' to start the development server."
echo "The registration should now work properly."
