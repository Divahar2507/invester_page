# Script to convert TypeScript to JavaScript
# This will rename .tsx to .jsx and .ts to .js

Write-Host "Converting TypeScript files to JavaScript..." -ForegroundColor Green

# Get all .tsx and .ts files in src directory (not node_modules)
$tsxFiles = Get-ChildItem -Path ".\src" -Recurse -Filter "*.tsx"
$tsFiles = Get-ChildItem -Path ".\src" -Recurse -Filter "*.ts"

# Convert .tsx to .jsx
Write-Host "`nConverting .tsx files to .jsx..." -ForegroundColor Yellow
foreach ($file in $tsxFiles) {
    $newName = $file.FullName -replace '\.tsx$', '.jsx'
    Write-Host "  $($file.Name) -> $([System.IO.Path]::GetFileName($newName))"
    Rename-Item -Path $file.FullName -NewName $newName
}

# Convert .ts to .js (excluding .d.ts files)
Write-Host "`nConverting .ts files to .js..." -ForegroundColor Yellow
foreach ($file in $tsFiles) {
    if (-not $file.Name.EndsWith('.d.ts')) {
        $newName = $file.FullName -replace '\.ts$', '.js'
        Write-Host "  $($file.Name) -> $([System.IO.Path]::GetFileName($newName))"
        Rename-Item -Path $file.FullName -NewName $newName
    }
}

Write-Host "`nConversion complete!" -ForegroundColor Green
Write-Host "Files converted. Remember to:" -ForegroundColor Cyan
Write-Host "  1. Update vite.config.ts to vite.config.js" -ForegroundColor Cyan
Write-Host "  2. Update tailwind.config.ts to tailwind.config.js" -ForegroundColor Cyan
Write-Host "  3. Remove TypeScript dependencies from package.json" -ForegroundColor Cyan
Write-Host "  4. Delete tsconfig files" -ForegroundColor Cyan
