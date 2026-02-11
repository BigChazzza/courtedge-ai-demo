#!/bin/bash

echo "🍬 Starting Sugar & Gold Treats rebrand..."

# Backup first
echo "📦 Creating backup..."
git stash

# Find and replace in all relevant files
echo "🔄 Replacing terminology..."

find . -type f \( -name "*.js" -o -name "*.jsx" -o -name "*.ts" -o -name "*.tsx" -o -name "*.json" -o -name "*.md" -o -name "*.html" \) \
  -not -path "*/node_modules/*" \
  -not -path "*/.git/*" \
  -not -path "*/dist/*" \
  -not -path "*/build/*" \
  -exec sed -i '' \
    -e 's/ProGear/Sugar \& Gold Treats/g' \
    -e 's/progear/sugar-gold-treats/g' \
    -e 's/Progear/Sugar \& Gold Treats/g' \
    -e 's/basketball/chocolate/gi' \
    -e 's/\bcourt\b/store/gi' \
    -e 's/\bplayer\b/product/gi' \
    -e 's/\bteam\b/product line/gi' \
    -e 's/\bgame\b/sale/gi' \
    -e 's/\bscore\b/revenue/gi' \
    -e 's/\bjersey\b/wrapper/gi' \
    {} \;

echo "✅ Rebrand complete!"
echo "📝 Review changes with: git diff"