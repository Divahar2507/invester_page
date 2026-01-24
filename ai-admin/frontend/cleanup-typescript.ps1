# Comprehensive script to remove TypeScript syntax from all .jsx and .js files

Write-Host "Removing TypeScript syntax from all JavaScript files..." -ForegroundColor Green

$files = Get-ChildItem -Path ".\src" -Recurse -Include "*.jsx", "*.js"
$count = 0

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    if (-not $content) { continue }
    
    $original = $content
    
    # 1. Remove `type` keyword from imports: import { foo, type Bar } from ...
    $content = $content -replace ',\s*type\s+\w+', ''
    $content = $content -replace 'import\s+type\s+', 'import '
    
    # 2. Remove interface declarations (multi-line)
    $content = $content -replace '(?ms)^export\s+interface\s+\w+[^{]*\{[^}]*\}\s*[\r\n]*', ''
    $content = $content -replace '(?ms)^interface\s+\w+[^{]*\{[^}]*\}\s*[\r\n]*', ''
    
    # 3. Remove generic type parameters: <Type1, Type2>
    $content = $content -replace '\.forwardRef<[^>]+>\(', '.forwardRef('
    $content = $content -replace ':\s*React\.FC<[^>]+>', ''
    $content = $content -replace ':\s*React\.ComponentProps<[^>]+>', ''
    
    # 4. Remove type annotations from function parameters
    # Pattern: ({ param }: Type) or ({ param, param2 }: Type)
    $content = $content -replace '(\([^)]*)\}:\s*[A-Z]\w+(<[^>]+>)?\s*\)', '$1})'
    $content = $content -replace '(\([^)]*)\):\s*[A-Z]\w+[A-Za-z0-9<>[\]]*\s*=>', '$1) =>'
    
    # 5. Remove : Type from variable declarations
    $content = $content -replace '(const|let|var)\s+(\w+):\s*[A-Z]\w+(<[^>]+>)?(\[\])?\s*=', '$1 $2 ='
    
    # 6. Remove optional ? from properties
    $content = $content -replace '(\w+)\?:', '$1:'
    
    # 7. Remove as Type assertions
    $content = $content -replace '\s+as\s+[A-Z]\w+', ''
    
    # 8. Remove ! non-null assertions
    $content = $content -replace '(\w+)!\.', '$1.'
    $content = $content -replace '(\))!\s', '$1 '
    
    # 9. Clean up extra blank lines
    $content = $content -replace '(\r?\n){3,}', "`r`n`r`n"
    
    if ($content -ne $original) {
        Set-Content -Path $file.FullName -Value $content -NoNewline
        $count++
        Write-Host "  Fixed: $($file.FullName.Replace((Get-Location).Path + '\', ''))" -ForegroundColor Yellow
    }
}

Write-Host "`nProcessed $($files.Count) files, modified $count files" -ForegroundColor Green
