# Ultimate cleanup - fix ALL remaining TypeScript syntax in ui components

$uiPath = "src/components/ui"
$files = Get-ChildItem "$uiPath/*.jsx"

Write-Host "Scanning $($files.Count) component files..." -ForegroundColor Cyan

$fixed = 0
foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    if (-not $content) { continue }
    
    $original = $content
    
    # Fix ALL variations of forwardRef with generics
    $content = $content -replace '(?s)React\.forwardRef\s*<[^(]+\(', 'React.forwardRef('
    $content = $content -replace '(?s)forwardRef\s*<[^(]+\(', 'forwardRef('
    
    if ($content -ne $original) {
        Set-Content -Path $file.FullName -Value $content -NoNewline
        $fixed++
        Write-Host "  ✓ $($file.Name)" -ForegroundColor Green
    }
}

Write-Host "`n✅ Fixed $fixed files!" -ForegroundColor Green
