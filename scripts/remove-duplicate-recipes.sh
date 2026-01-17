#!/bin/bash

echo "========================================="
echo "重複レシピ削除スクリプト"
echo "========================================="
echo ""

# 削除対象の汎用データ（説明が「〇〇のレシピです」のもの）
RECIPES_TO_DELETE=(
    "main_022"  # 豚バラ大根（重複）
    "main_061"  # 鮭のムニエル（重複）
    "main_099"  # 麻婆茄子（重複）
    "main_107"  # 厚揚げの煮物（重複）
    "main_146"  # エビチリ（重複）
)

SUCCESS=0
FAILED=0

for recipe_id in "${RECIPES_TO_DELETE[@]}"; do
    echo "🗑️  削除中: $recipe_id"
    
    # 関連する材料データも削除（外部キー制約のため）
    RESULT1=$(cd /home/user/webapp && npx wrangler d1 execute aichef-production --remote --command="DELETE FROM recipe_ingredients WHERE recipe_id='$recipe_id';" 2>&1)
    
    # レシピ本体を削除
    RESULT2=$(cd /home/user/webapp && npx wrangler d1 execute aichef-production --remote --command="DELETE FROM recipes WHERE recipe_id='$recipe_id';" 2>&1)
    
    if echo "$RESULT2" | grep -q "success.*true"; then
        echo "   ✅ 削除成功: $recipe_id"
        ((SUCCESS++))
    else
        echo "   ❌ 削除失敗: $recipe_id"
        ((FAILED++))
    fi
done

echo ""
echo "========================================="
echo "削除完了"
echo "成功: $SUCCESS 件"
echo "失敗: $FAILED 件"
echo "========================================="
