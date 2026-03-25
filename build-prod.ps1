# This script prepares the project for a Unified Deployment on Vercel

echo "🚀 Starting Unified Build Process..."

# 1. Build the Frontend
echo "📦 Building Frontend..."
cd frontend
npm install
npm run build
cd ..

# 2. Clean and Move to Backend Public
echo "🚚 Moving Build to Backend..."
if (Test-Path "backend/public") {
    Remove-Item -Recurse -Force "backend/public/*"
} else {
    New-Item -ItemType Directory -Path "backend/public"
}

Copy-Item -Recurse -Force "frontend/dist/*" "backend/public/"

echo "✅ Ready! You can now deploy the 'backend' folder as a single project on Vercel."
echo "🔗 Frontend is now merged into Backend."
