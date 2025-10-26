# LMS - Install Updated Dependencies Script
# Phase 1: Architecture Cleanup Complete
# This script removes old node_modules and installs updated dependencies

Write-Host "================================" -ForegroundColor Cyan
Write-Host "LMS - Installing Dependencies" -ForegroundColor Cyan
Write-Host "Phase 1: Architecture Cleanup" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# Check if we're in the correct directory
if (!(Test-Path "package.json")) {
    Write-Host "Error: package.json not found!" -ForegroundColor Red
    Write-Host "Please run this script from the client/LMS directory." -ForegroundColor Red
    exit 1
}

Write-Host "Step 1: Removing old node_modules..." -ForegroundColor Yellow
if (Test-Path "node_modules") {
    Remove-Item -Path "node_modules" -Recurse -Force
    Write-Host "✓ node_modules removed" -ForegroundColor Green
} else {
    Write-Host "✓ node_modules not found (skip)" -ForegroundColor Green
}

Write-Host ""
Write-Host "Step 2: Removing package-lock.json..." -ForegroundColor Yellow
if (Test-Path "package-lock.json") {
    Remove-Item -Path "package-lock.json" -Force
    Write-Host "✓ package-lock.json removed" -ForegroundColor Green
} else {
    Write-Host "✓ package-lock.json not found (skip)" -ForegroundColor Green
}

Write-Host ""
Write-Host "Step 3: Installing fresh dependencies..." -ForegroundColor Yellow
Write-Host "This may take a few minutes..." -ForegroundColor Gray
npm install

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✓ Dependencies installed successfully!" -ForegroundColor Green
    Write-Host ""
    
    Write-Host "================================" -ForegroundColor Cyan
    Write-Host "Verification Check" -ForegroundColor Cyan
    Write-Host "================================" -ForegroundColor Cyan
    
    # Check that MUI is NOT installed
    Write-Host ""
    Write-Host "Checking Material-UI removal..." -ForegroundColor Yellow
    $muiCheck = npm list @mui/material 2>&1
    if ($muiCheck -match "empty") {
        Write-Host "✓ Material-UI successfully removed" -ForegroundColor Green
    } else {
        Write-Host "⚠ Material-UI still present (may need manual cleanup)" -ForegroundColor Yellow
    }
    
    # Check that Heroicons is installed
    Write-Host ""
    Write-Host "Checking Heroicons installation..." -ForegroundColor Yellow
    $heroiconsCheck = npm list @heroicons/react 2>&1
    if ($heroiconsCheck -match "@heroicons/react@") {
        Write-Host "✓ Heroicons installed correctly" -ForegroundColor Green
    } else {
        Write-Host "⚠ Heroicons not found" -ForegroundColor Yellow
    }
    
    Write-Host ""
    Write-Host "================================" -ForegroundColor Cyan
    Write-Host "Next Steps" -ForegroundColor Cyan
    Write-Host "================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "1. Start the development server:" -ForegroundColor White
    Write-Host "   npm run dev" -ForegroundColor Gray
    Write-Host ""
    Write-Host "2. Check for any remaining MUI imports:" -ForegroundColor White
    Write-Host "   grep -r '@mui' src/" -ForegroundColor Gray
    Write-Host ""
    Write-Host "3. Review Phase 1 summary:" -ForegroundColor White
    Write-Host "   PHASE1_CLEANUP_SUMMARY.md" -ForegroundColor Gray
    Write-Host ""
    Write-Host "✨ Phase 1 Complete! Ready for Phase 2." -ForegroundColor Green
    
} else {
    Write-Host ""
    Write-Host "✗ Installation failed!" -ForegroundColor Red
    Write-Host "Please check the error messages above." -ForegroundColor Red
    exit 1
}
