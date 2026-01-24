# Final comprehensive cleanup of ALL TypeScript syntax

Write-Host "Running final TypeScript cleanup..." -ForegroundColor Green

$files = Get-ChildItem -Path ".\src" -Recurse -Include "*.jsx", "*.js"
$count = 0

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    if (-not $content) { continue }
    
    $original = $content
    
    # 1. Fix all forwardRef with generics - MOST CRITICAL
    # Pattern: React.forwardRef<anything here>( => React.forwardRef(
    $content = $content -replace 'React\.forwardRef<[^>]*>(?:\s*<[^>]*>)?\s*\(', 'React.forwardRef('
    
    # 2. Fix multiline forwardRef patterns
    $content = $content -replace '(?s)React\.forwardRef<\s*[^>]*\s*>\s*\(', 'React.forwardRef('
    
    # 3. Remove type/interface declarations
    $content = $content -replace '(?m)^type\s+\w+\s*=\s*[^;]*;?\s*$', ''
    $content = $content -replace '(?m)^interface\s+\w+\s*\{[^\}]*\}\s*$', ''
    
    # 4. Fix Map/Set with generics
    $content = $content -replace 'new Map<[^>]+>\s*\(', 'new Map('
    $content = $content -replace 'new Set<[^>]+>\s*\(', 'new Set('
    
    # 5. Fix Array type annotations
    $content = $content -replace 'Array<[^>]+>', 'Array'
    
    # 6. Fix setState with generics
    $content = $content -replace 'useState<[^>]+>\s*\(', 'useState('
    
    # 7. Fix & type intersections
    $content = $content -replace '\s*&\s*\{\s*asChild:\s*boolean\s*\}', ''
    
    # 8. Clean up extra blank lines
    $content = $content -replace '(\r?\n){3,}', "`r`n`r`n"
    
    if ($content -ne $original) {
        Set-Content -Path $file.FullName -Value $content -NoNewline
        $count++
        Write-Host "  Fixed: $($file.Name)" -ForegroundColor Yellow
    }
}

Write-Host "`nFixed $count files. TypeScript cleanup complete!" -ForegroundColor Green
