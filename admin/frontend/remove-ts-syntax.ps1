# Script to remove TypeScript syntax from JavaScript files
# This will remove interface declarations and type annotations

Write-Host "Removing TypeScript syntax from JavaScript files..." -ForegroundColor Green

# Get all .jsx and .js files in src directory
$files = Get-ChildItem -Path ".\src" -Recurse -Include "*.jsx", "*.js"

$interfacePattern = '(?m)^(export )?interface\s+\w+.*?^\}'
$typeAnnotationPattern = ':\s*React\.\w+(\<[^>]+\>)?'
$typeAnnotationPattern2 = ':\s*\w+(\[\]|\<[^>]+\>)?(?=\s*[,\)\{=;])'
$optionalPattern = '\?:'

$filesModified = 0

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    $originalContent = $content
    
    # Remove interface declarations
    $content = $content -replace $interfacePattern, ''
    
    # Remove type annotations like `: React.ComponentProps<...>`
    $content = $content -replace $typeAnnotationPattern, ''
    
    # Remove simple type annotations like `: string`, `: number`, etc.
    # But be careful not to remove colons from object properties
    $content = $content -replace '\{\s*([^:]+):\s*\w+(\[\])?\s*([,\}])', '{ $1$3'
    
    # Remove optional markers (?:)
    $content = $content -replace '\?\s*:', ':'
    
    # Clean up multiple blank lines
    $content = $content -replace '(?m)^\s*$(\r?\n^\s*$)+', "`r`n"
    
    if ($content -ne $originalContent) {
        Set-Content -Path $file.FullName -Value $content -NoNewline
        $filesModified++
        Write-Host "  Modified: $($file.Name)" -ForegroundColor Yellow
    }
}

Write-Host "`nModified $filesModified files" -ForegroundColor Green
