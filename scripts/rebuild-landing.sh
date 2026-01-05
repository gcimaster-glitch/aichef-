#!/bin/bash

cd /home/user/webapp

# 一時ファイルを作成
head -n 13 src/index.tsx > /tmp/index_part1.tsx
echo 'const landingHtml = `' >> /tmp/index_part1.tsx
cat public/landing.html >> /tmp/index_part1.tsx
echo '`' >> /tmp/index_part1.tsx
echo '' >> /tmp/index_part1.tsx
tail -n +470 src/index.tsx >> /tmp/index_part1.tsx

# ファイルを置き換え
mv /tmp/index_part1.tsx src/index.tsx

echo "✅ landingHtml rebuilt successfully!"
