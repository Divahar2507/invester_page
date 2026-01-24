# Fix script to correct broken imports and remaining TypeScript syntax

Write-Host "Fixing broken imports and TypeScript syntax..." -ForegroundColor Green

$files = Get-ChildItem -Path ".\src" -Recurse -Include "*.jsx", "*.js"
$count = 0

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    if (-not $content) { continue }
    
    $original = $content
    
    # 1. FIX: Restore broken import * from "react" to import * as React from "react"
    $content = $content -replace 'import\s+\*\s+from\s+"react"', 'import * as React from "react"'
    $content = $content -replace 'import\s+\*\s+from\s+"@radix-ui/', 'import * as RadixUI from "@radix-ui/'
    
    # 2. Remove remaining type declarations
    $content = $content -replace '(?m)^type\s+\w+\s*=\s*[^;]+;?\s*$', ''
    
    # 3. Remove keyof typeof patterns
    $content = $content -replace ':\s*keyof\s+typeof\s+\w+', ''
    
    # 4. Remove generic type parameters from forwardRef
    $content = $content -replace '\.forwardRef<[^>]+>\(', '.forwardRef('
    
    # 5. Clean up ToastActionElement and ToastProps type imports
    $content = $content -replace ',\s*ToastActionElement\s*,\s*ToastProps', ''
    $content = $content -replace 'ToastActionElement\s*,\s*ToastProps\s*,', ''
    
    if ($content -ne $original) {
        Set-Content -Path $file.FullName -Value $content -NoNewline
        $count++
        Write-Host "  Fixed: $($file.Name)" -ForegroundColor Yellow
    }
}

Write-Host "`nFixed $count files" -ForegroundColor Green
