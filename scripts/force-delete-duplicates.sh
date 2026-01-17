#!/bin/bash

echo "========================================="
echo "重複レシピ強制削除（全関連データ削除）"
echo "========================================="
echo ""

RECIPES=("main_022" "main_099")

for recipe_id in "${RECIPES[@]}"; do
    echo "🗑️  削除中: $recipe_id（全関連テーブル）"
    
    # 1. recipe_allergens
    cd /home/user/webapp && npx wrangler d1 execute aichef-production --remote --command="DELETE FROM recipe_allergens WHERE recipe_id='$recipe_id';" 2>&1 > /dev/null
    
    # 2. recipe_seasons
    cd /home/user/webapp && npx wrangler d1 execute aichef-production --remote --command="DELETE FROM recipe_seasons WHERE recipe_id='$recipe_id';" 2>&1 > /dev/null
    
    # 3. recipe_reuse_keys
    cd /home/user/webapp && npx wrangler d1 execute aichef-production --remote --command="DELETE FROM recipe_reuse_keys WHERE recipe_id='$recipe_id';" 2>&1 > /dev/null
    
    # 4. meal_plan_days
    cd /home/user/webapp && npx wrangler d1 execute aichef-production --remote --command="DELETE FROM meal_plan_days WHERE main_dish_id='$recipe_id' OR side_dish_id='$recipe_id' OR soup_id='$recipe_id';" 2>&1 > /dev/null
    
    # 5. recipe_ingredients
    cd /home/user/webapp && npx wrangler d1 execute aichef-production --remote --command="DELETE FROM recipe_ingredients WHERE recipe_id='$recipe_id';" 2>&1 > /dev/null
    
    # 6. recipes本体
    RESULT=$(cd /home/user/webapp && npx wrangler d1 execute aichef-production --remote --command="DELETE FROM recipes WHERE recipe_id='$recipe_id';" 2>&1)
    
    if echo "$RESULT" | grep -q "success.*true"; then
        echo "   ✅ 削除成功: $recipe_id"
    else
        echo "   ❌ 削除失敗: $recipe_id"
    fi
done

echo ""
echo "========================================="
echo "削除完了"
echo "========================================="
