# Quick Start Script for Database Setup

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Special Service Registration - DB Setup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if .env.local exists
if (Test-Path ".env.local") {
    Write-Host "OK .env.local file found" -ForegroundColor Green
    
    # Check if MONGODB_URI is set
    $envContent = Get-Content ".env.local" -Raw
    if ($envContent -match "MONGODB_URI=mongodb") {
        Write-Host "OK MONGODB_URI is configured" -ForegroundColor Green
    } else {
        Write-Host "WARNING MONGODB_URI needs to be configured" -ForegroundColor Yellow
        Write-Host "  Please add your MongoDB connection string to .env.local" -ForegroundColor Yellow
    }
} else {
    Write-Host "ERROR .env.local file not found" -ForegroundColor Red
    Write-Host "  Creating .env.local from example..." -ForegroundColor Yellow
    
    if (Test-Path ".env.local.example") {
        Copy-Item ".env.local.example" ".env.local"
        Write-Host "OK Created .env.local file" -ForegroundColor Green
        Write-Host ""
        Write-Host "IMPORTANT: Edit .env.local and add your MongoDB connection string!" -ForegroundColor Yellow
        Write-Host "  Example: MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/special-service" -ForegroundColor Gray
    } else {
        Write-Host "ERROR .env.local.example not found" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "MongoDB Setup Options:" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. MongoDB Atlas (Cloud - Recommended for production)" -ForegroundColor White
Write-Host "   Go to: https://www.mongodb.com/cloud/atlas" -ForegroundColor Gray
Write-Host "   Create free account and cluster" -ForegroundColor Gray
Write-Host "   Get connection string" -ForegroundColor Gray

Write-Host ""
Write-Host "2. Local MongoDB (Good for development)" -ForegroundColor White
Write-Host "   Download: https://www.mongodb.com/try/download/community" -ForegroundColor Gray
Write-Host "   Use: MONGODB_URI=mongodb://localhost:27017/special-service" -ForegroundColor Gray

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Next Steps:" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "1. Configure your MONGODB_URI in .env.local" -ForegroundColor White
Write-Host "2. Restart the dev server: npm run dev" -ForegroundColor White
Write-Host "3. Test the form at http://localhost:3002" -ForegroundColor White
Write-Host ""
Write-Host "Your registration system is ready!" -ForegroundColor Green

