# レシピデータ修正 - 本番環境適用手順書

## 概要
レシピ材料データの完全修正を本番環境に適用します。

## 事前確認
1. **バックアップ**: 本番DBのバックアップを推奨（Cloudflare D1は自動バックアップあり）
2. **影響範囲**: recipe_ingredientsテーブルに988件のデータ追加
3. **所要時間**: 約5-10分

## 手順

### Step 1: 不足している材料を追加
```bash
cd /home/user/webapp
npx wrangler d1 migrations apply aichef-production --remote
```

これにより`0023_add_missing_ingredients.sql`が適用され、以下の材料が追加されます：
- grain_flour (小麦粉)
- seasoning_oil (サラダ油)
- seasoning_mayo (マヨネーズ)
- seasoning_ketchup (ケチャップ)
- seasoning_dashi (だし)
- seasoning_curry (カレールー)
- seasoning_dressing (ドレッシング)
- seafood_octopus (タコ)
- fish_sardine (イワシ)

### Step 2: レシピ材料データを投入
```bash
cd /home/user/webapp

# 外部キー制約を一時無効化
npx wrangler d1 execute aichef-production --remote --command="PRAGMA foreign_keys = OFF;"

# 各バッチを順次投入（001-015）
for i in {001..015}; do
    echo "Applying batch $i..."
    npx wrangler d1 execute aichef-production --remote --file="migrations/generated/recipe_ingredients_batch_${i}.sql"
done

# 外部キー制約を再有効化
npx wrangler d1 execute aichef-production --remote --command="PRAGMA foreign_keys = ON;"
```

### Step 3: データ検証
```bash
# 総件数確認
npx wrangler d1 execute aichef-production --remote --command="SELECT COUNT(*) as total FROM recipe_ingredients;"

# 親子丼のレシピ確認
npx wrangler d1 execute aichef-production --remote --command="SELECT r.title, i.name as ingredient, ri.quantity, ri.unit FROM recipes r JOIN recipe_ingredients ri ON r.recipe_id = ri.recipe_id JOIN ingredients i ON ri.ingredient_id = i.ingredient_id WHERE r.recipe_id = 'main_016';"

# ポテトサラダのレシピ確認
npx wrangler d1 execute aichef-production --remote --command="SELECT r.title, i.name as ingredient, ri.quantity, ri.unit FROM recipes r JOIN recipe_ingredients ri ON r.recipe_id = ri.recipe_id JOIN ingredients i ON ri.ingredient_id = i.ingredient_id WHERE r.recipe_id = 'side_011';"
```

## 期待される結果

### 総件数
- 約988-1000件の recipe_ingredients レコード

### 親子丼 (main_016)
- 鶏肉 300g
- 卵 2個
- 玉ねぎ 100g
- 米 200g
- 醤油 15ml
- みりん 15ml
- だし 50ml

### ポテトサラダ (side_011)
- じゃがいも 300g
- 人参 50g
- きゅうり 50g
- 卵 1個
- マヨネーズ 30g
- 塩 2g

## トラブルシューティング

### 外部キー制約エラーが発生した場合
```bash
# 存在しないingredient_idを確認
npx wrangler d1 execute aichef-production --remote --command="SELECT DISTINCT ingredient_id FROM recipe_ingredients WHERE ingredient_id NOT IN (SELECT ingredient_id FROM ingredients);"

# 不足している材料を手動追加
npx wrangler d1 execute aichef-production --remote --command="INSERT INTO ingredients (ingredient_id, name, category) VALUES ('missing_id', '材料名', 'category');"
```

### データが0件の場合
- PRAGMA foreign_keys = OFF が正しく適用されたか確認
- マイグレーションファイルのパスが正しいか確認
- ログファイルでエラーメッセージを確認

## 完了確認
1. 親子丼とポテトサラダのレシピが正しく表示される
2. 総レシピ材料件数が988件以上
3. ユーザーが献立生成時に正しい材料が表示される

## ロールバック（必要時）
```bash
# recipe_ingredientsテーブルをクリア
npx wrangler d1 execute aichef-production --remote --command="DELETE FROM recipe_ingredients;"

# 追加した材料を削除
npx wrangler d1 execute aichef-production --remote --command="DELETE FROM ingredients WHERE ingredient_id IN ('grain_flour', 'seasoning_oil', 'seasoning_mayo', 'seasoning_ketchup', 'seasoning_dashi', 'seasoning_curry', 'seasoning_dressing', 'seafood_octopus', 'fish_sardine');"
```

## 注意事項
- 本番環境での作業は慎重に行ってください
- 各ステップの結果を確認してから次へ進んでください
- エラーが発生した場合は、ログを確認してから対応してください
