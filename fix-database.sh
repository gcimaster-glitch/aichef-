#!/bin/bash
set -e

echo "🔄 データベース修復を開始します..."

# ローカルDBをリセット
echo "📦 ローカルDBをリセット..."
rm -rf .wrangler/state/v3/d1
npx wrangler d1 migrations apply aichef-production --local

# 本番DBから全データをエクスポート
echo "📥 本番DBからデータをエクスポート..."

# recipes
npx wrangler d1 execute aichef-production --remote --command="SELECT * FROM recipes" --json > /tmp/recipes.json

# recipe_ingredients  
npx wrangler d1 execute aichef-production --remote --command="SELECT * FROM recipe_ingredients" --json > /tmp/recipe_ingredients.json

# ingredients
npx wrangler d1 execute aichef-production --remote --command="SELECT * FROM ingredients" --json > /tmp/ingredients.json

echo "✅ データエクスポート完了"
echo "📊 次のステップ: データをローカルDBにインポート"
