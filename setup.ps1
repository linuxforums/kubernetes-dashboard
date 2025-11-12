# PowerShell setup script for Windows

Write-Host "🚀 Setting up Kubernetes Dashboard..." -ForegroundColor Cyan

# Check if Node.js is installed
try {
    $nodeVersion = node -v
    Write-Host "✅ Node.js $nodeVersion detected" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js is not installed. Please install Node.js 20+ first." -ForegroundColor Red
    exit 1
}

# Check Node.js version
$versionNumber = (node -v).TrimStart('v').Split('.')[0]
if ([int]$versionNumber -lt 20) {
    Write-Host "❌ Node.js version 20+ is required. Current version: $(node -v)" -ForegroundColor Red
    exit 1
}

# Install root dependencies
Write-Host "📦 Installing root dependencies..." -ForegroundColor Yellow
npm install

# Install frontend dependencies
Write-Host "📦 Installing frontend dependencies..." -ForegroundColor Yellow
Set-Location frontend
npm install
Set-Location ..

# Install backend dependencies
Write-Host "📦 Installing backend dependencies..." -ForegroundColor Yellow
Set-Location backend
npm install
Set-Location ..

Write-Host "✅ Setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "To start the development servers:" -ForegroundColor Cyan
Write-Host "  npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "Or start them separately:" -ForegroundColor Cyan
Write-Host "  npm run dev:frontend  # Frontend on http://localhost:3000" -ForegroundColor White
Write-Host "  npm run dev:backend   # Backend on http://localhost:3001" -ForegroundColor White
Write-Host ""
Write-Host "Note: Make sure you have kubectl configured if you want to connect to a real cluster." -ForegroundColor Yellow
Write-Host "      Otherwise, the dashboard will run in demo mode with mock data." -ForegroundColor Yellow

