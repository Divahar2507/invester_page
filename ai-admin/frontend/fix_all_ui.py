import os
import re
from pathlib import Path

# Directory containing UI components
ui_dir = Path("src/components/ui")

# Pattern to match React.forwardRef< ... >( with any content between < and (
pattern = re.compile(r'React\.forwardRef\s*<[^(]+\(', re.DOTALL)

fixed_count = 0

for jsx_file in ui_dir.glob("*.jsx"):
    with open(jsx_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original = content
   
    # Replace forwardRef with generics
    content = pattern.sub('React.forwardRef(', content)
    
    if content != original:
        with open(jsx_file, 'w', encoding='utf-8', newline='') as f:
            f.write(content)
        fixed_count += 1
        print(f"✓ Fixed: {jsx_file.name}")

print(f"\n✅ Total files fixed: {fixed_count}")
