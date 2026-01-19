#!/bin/bash

# ========================================
# AICHEFS 特別監査チーム
# 総合品質監査スクリプト
# ========================================

echo "=================================================="
echo "🛡️  AICHEFS 特別監査チーム - 総合品質監査"
echo "=================================================="
echo ""
echo "監査チーム構成："
echo "  👨‍💻 田中エンジニア（データベース専門家）"
echo "  👩‍💻 佐藤エンジニア（品質保証専門家）"
echo "  👨‍🍳 山田シェフエンジニア（料理専門家）"
echo ""
echo "開始時刻: $(date '+%Y-%m-%d %H:%M:%S')"
echo "=================================================="
echo ""

# カウンター
TOTAL_CHECKS=0
PASSED=0
WARNINGS=0
CRITICAL=0

# 監査結果ファイル
REPORT_FILE="/tmp/audit_report_$(date '+%Y%m%d_%H%M%S').txt"
echo "監査レポート作成: $REPORT_FILE" > $REPORT_FILE
echo "========================================" >> $REPORT_FILE
echo "" >> $REPORT_FILE

# ========================================
# Phase 1: データベース整合性監査（田中担当）
# ========================================
echo "=================================================="
echo "Phase 1: データベース整合性監査（田中担当）"
echo "=================================================="
echo ""

# 1-1: 材料ID重複チェック
echo "📋 監査1-1: 材料ID重複チェック"
((TOTAL_CHECKS++))
RESULT=$(cd /home/user/webapp && npx wrangler d1 execute aichef-production --remote --command="SELECT COUNT(*) as count FROM (SELECT ingredient_id FROM ingredients GROUP BY ingredient_id HAVING COUNT(*) > 1);" 2>&1 | grep -o '"count":[0-9]*' | grep -o '[0-9]*')
if [ "$RESULT" = "0" ]; then
    echo "   ✅ 合格: 材料IDの重複なし"
    ((PASSED++))
else
    echo "   ❌ 不合格: 材料IDが重複しています（$RESULT件）"
    ((CRITICAL++))
fi
echo "【監査1-1】材料ID重複チェック: $RESULT件の重複" >> $REPORT_FILE
echo ""

# 1-2: レシピ-材料紐付けの孤児チェック
echo "📋 監査1-2: レシピ-材料紐付けの孤児チェック"
((TOTAL_CHECKS++))
echo "   🔍 レシピが存在しない材料紐付けをチェック中..."
ORPHAN_CHECK=$(cd /home/user/webapp && npx wrangler d1 execute aichef-production --remote --command="SELECT COUNT(*) as count FROM recipe_ingredients WHERE recipe_id NOT IN (SELECT recipe_id FROM recipes);" 2>&1)
if echo "$ORPHAN_CHECK" | grep -q '"count":0'; then
    echo "   ✅ 合格: 孤児データなし"
    ((PASSED++))
else
    echo "   ⚠️  警告: 孤児データが存在する可能性"
    ((WARNINGS++))
fi
echo ""

# 1-3: レシピの材料数チェック
echo "📋 監査1-3: レシピの材料数チェック（メイン食材漏れチェック）"
((TOTAL_CHECKS++))
echo "   🔍 材料が0件のレシピをチェック中..."
cd /home/user/webapp && npx wrangler d1 execute aichef-production --remote --command="
SELECT r.recipe_id, r.title, r.role, COUNT(ri.ingredient_id) as ingredient_count
FROM recipes r
LEFT JOIN recipe_ingredients ri ON r.recipe_id = ri.recipe_id
GROUP BY r.recipe_id
HAVING COUNT(ri.ingredient_id) = 0
LIMIT 10;
" 2>&1 > /tmp/empty_recipes.txt

if grep -q '"results":\[\]' /tmp/empty_recipes.txt; then
    echo "   ✅ 合格: すべてのレシピに材料が設定されています"
    ((PASSED++))
else
    echo "   ❌ 不合格: 材料が0件のレシピが存在します"
    echo "   📄 詳細: /tmp/empty_recipes.txt を確認してください"
    ((CRITICAL++))
    cat /tmp/empty_recipes.txt >> $REPORT_FILE
fi
echo ""

# 1-4: 異常に少ない材料数のレシピチェック
echo "📋 監査1-4: 異常に少ない材料数のレシピチェック"
((TOTAL_CHECKS++))
echo "   🔍 材料が1-2件のレシピをチェック中（メイン食材漏れの可能性）..."
cd /home/user/webapp && npx wrangler d1 execute aichef-production --remote --command="
SELECT r.recipe_id, r.title, r.role, COUNT(ri.ingredient_id) as ingredient_count
FROM recipes r
LEFT JOIN recipe_ingredients ri ON r.recipe_id = ri.recipe_id
GROUP BY r.recipe_id
HAVING COUNT(ri.ingredient_id) BETWEEN 1 AND 2
ORDER BY ingredient_count ASC
LIMIT 20;
" 2>&1 > /tmp/few_ingredients.txt

FEW_COUNT=$(grep -o '"recipe_id"' /tmp/few_ingredients.txt | wc -l)
if [ "$FEW_COUNT" -eq 0 ]; then
    echo "   ✅ 合格: すべてのレシピに3件以上の材料があります"
    ((PASSED++))
elif [ "$FEW_COUNT" -le 5 ]; then
    echo "   ⚠️  警告: 材料が少ないレシピが${FEW_COUNT}件あります"
    echo "   （副菜や汁物の場合は問題ない可能性あり）"
    ((WARNINGS++))
else
    echo "   ❌ 不合格: 材料が少ないレシピが${FEW_COUNT}件あります"
    echo "   📄 詳細: /tmp/few_ingredients.txt を確認してください"
    ((CRITICAL++))
fi
echo "【監査1-4】材料が少ないレシピ: ${FEW_COUNT}件" >> $REPORT_FILE
echo ""

# ========================================
# Phase 2: レシピ内容監査（佐藤担当）
# ========================================
echo "=================================================="
echo "Phase 2: レシピ内容監査（佐藤担当）"
echo "=================================================="
echo ""

# 2-1: アレルギー情報の設定状況チェック
echo "📋 監査2-1: アレルギー情報の設定状況チェック"
((TOTAL_CHECKS++))
echo "   🔍 アレルギー情報が未設定のレシピをチェック中..."
cd /home/user/webapp && npx wrangler d1 execute aichef-production --remote --command="
SELECT COUNT(*) as count
FROM recipes r
WHERE NOT EXISTS (
    SELECT 1 FROM recipe_allergens ra WHERE ra.recipe_id = r.recipe_id
);
" 2>&1 > /tmp/no_allergen.txt

NO_ALLERGEN=$(grep -o '"count":[0-9]*' /tmp/no_allergen.txt | grep -o '[0-9]*' | head -1)
if [ "$NO_ALLERGEN" = "0" ]; then
    echo "   ✅ 合格: すべてのレシピにアレルギー情報が設定されています"
    ((PASSED++))
elif [ "$NO_ALLERGEN" -le 50 ]; then
    echo "   ⚠️  警告: アレルギー情報未設定のレシピが${NO_ALLERGEN}件あります"
    ((WARNINGS++))
else
    echo "   ❌ 不合格: アレルギー情報未設定のレシピが${NO_ALLERGEN}件あります"
    ((CRITICAL++))
fi
echo "【監査2-1】アレルギー情報未設定: ${NO_ALLERGEN}件" >> $REPORT_FILE
echo ""

# 2-2: 主菜の主要タンパク質チェック
echo "📋 監査2-2: 主菜の主要タンパク質チェック"
((TOTAL_CHECKS++))
echo "   🔍 主菜に肉・魚・卵・豆腐のいずれかがあるかチェック中..."
cd /home/user/webapp && npx wrangler d1 execute aichef-production --remote --command="
SELECT r.recipe_id, r.title
FROM recipes r
WHERE r.role = 'main'
AND NOT EXISTS (
    SELECT 1 FROM recipe_ingredients ri
    JOIN ingredients i ON ri.ingredient_id = i.ingredient_id
    WHERE ri.recipe_id = r.recipe_id
    AND i.category IN ('meat_fish', 'dairy_eggs', 'tofu_beans')
)
LIMIT 20;
" 2>&1 > /tmp/no_protein.txt

NO_PROTEIN=$(grep -o '"recipe_id"' /tmp/no_protein.txt | wc -l)
if [ "$NO_PROTEIN" -eq 0 ]; then
    echo "   ✅ 合格: すべての主菜にタンパク質源があります"
    ((PASSED++))
elif [ "$NO_PROTEIN" -le 5 ]; then
    echo "   ⚠️  警告: タンパク質源が不明な主菜が${NO_PROTEIN}件あります"
    echo "   （野菜メインの主菜の可能性あり）"
    ((WARNINGS++))
else
    echo "   ❌ 不合格: タンパク質源が不明な主菜が${NO_PROTEIN}件あります"
    echo "   📄 詳細: /tmp/no_protein.txt を確認してください"
    ((CRITICAL++))
fi
echo "【監査2-2】タンパク質源不明の主菜: ${NO_PROTEIN}件" >> $REPORT_FILE
echo ""

# 2-3: 調味料の過不足チェック
echo "📋 監査2-3: 調味料の妥当性チェック"
((TOTAL_CHECKS++))
echo "   🔍 調味料が0件のレシピをチェック中..."
cd /home/user/webapp && npx wrangler d1 execute aichef-production --remote --command="
SELECT r.recipe_id, r.title, r.role
FROM recipes r
WHERE NOT EXISTS (
    SELECT 1 FROM recipe_ingredients ri
    JOIN ingredients i ON ri.ingredient_id = i.ingredient_id
    WHERE ri.recipe_id = r.recipe_id
    AND i.category = 'seasonings'
)
LIMIT 20;
" 2>&1 > /tmp/no_seasoning.txt

NO_SEASONING=$(grep -o '"recipe_id"' /tmp/no_seasoning.txt | wc -l)
if [ "$NO_SEASONING" -le 10 ]; then
    echo "   ✅ 合格: ほとんどのレシピに調味料が設定されています"
    echo "   （調味料不要: ${NO_SEASONING}件）"
    ((PASSED++))
elif [ "$NO_SEASONING" -le 30 ]; then
    echo "   ⚠️  警告: 調味料が設定されていないレシピが${NO_SEASONING}件あります"
    ((WARNINGS++))
else
    echo "   ❌ 不合格: 調味料が設定されていないレシピが${NO_SEASONING}件あります"
    ((CRITICAL++))
fi
echo "【監査2-3】調味料未設定: ${NO_SEASONING}件" >> $REPORT_FILE
echo ""

# ========================================
# Phase 3: 料理妥当性監査（山田担当）
# ========================================
echo "=================================================="
echo "Phase 3: 料理妥当性監査（山田シェフ担当）"
echo "=================================================="
echo ""

# 3-1: 材料の量の妥当性チェック（異常値検出）
echo "📋 監査3-1: 材料の量の妥当性チェック（異常値検出）"
((TOTAL_CHECKS++))
echo "   🔍 異常に多い量の材料をチェック中..."
cd /home/user/webapp && npx wrangler d1 execute aichef-production --remote --command="
SELECT r.recipe_id, r.title, i.name_ja, ri.quantity, ri.unit
FROM recipe_ingredients ri
JOIN recipes r ON ri.recipe_id = r.recipe_id
JOIN ingredients i ON ri.ingredient_id = i.ingredient_id
WHERE ri.quantity > 1000
LIMIT 20;
" 2>&1 > /tmp/abnormal_quantity.txt

ABNORMAL=$(grep -o '"recipe_id"' /tmp/abnormal_quantity.txt | wc -l)
if [ "$ABNORMAL" -eq 0 ]; then
    echo "   ✅ 合格: 異常な量の材料はありません"
    ((PASSED++))
else
    echo "   ⚠️  警告: 異常に多い量の材料が${ABNORMAL}件あります"
    echo "   📄 詳細: /tmp/abnormal_quantity.txt を確認してください"
    ((WARNINGS++))
fi
echo "【監査3-1】異常な量の材料: ${ABNORMAL}件" >> $REPORT_FILE
echo ""

# 3-2: 汁物の出汁チェック
echo "📋 監査3-2: 汁物の出汁・調味料チェック"
((TOTAL_CHECKS++))
echo "   🔍 汁物に出汁または味噌・醤油があるかチェック中..."
cd /home/user/webapp && npx wrangler d1 execute aichef-production --remote --command="
SELECT r.recipe_id, r.title
FROM recipes r
WHERE r.role = 'soup'
AND NOT EXISTS (
    SELECT 1 FROM recipe_ingredients ri
    JOIN ingredients i ON ri.ingredient_id = i.ingredient_id
    WHERE ri.recipe_id = r.recipe_id
    AND (i.name_ja LIKE '%だし%' 
         OR i.name_ja LIKE '%味噌%' 
         OR i.name_ja LIKE '%醤油%'
         OR i.name_ja LIKE '%塩%'
         OR i.name_ja LIKE '%コンソメ%'
         OR i.name_ja LIKE '%ブイヨン%')
)
LIMIT 20;
" 2>&1 > /tmp/soup_no_base.txt

NO_BASE=$(grep -o '"recipe_id"' /tmp/soup_no_base.txt | wc -l)
if [ "$NO_BASE" -eq 0 ]; then
    echo "   ✅ 合格: すべての汁物に出汁または調味料があります"
    ((PASSED++))
elif [ "$NO_BASE" -le 5 ]; then
    echo "   ⚠️  警告: 出汁・調味料が不明な汁物が${NO_BASE}件あります"
    ((WARNINGS++))
else
    echo "   ❌ 不合格: 出汁・調味料が不明な汁物が${NO_BASE}件あります"
    ((CRITICAL++))
fi
echo "【監査3-2】出汁・調味料不明の汁物: ${NO_BASE}件" >> $REPORT_FILE
echo ""

# 3-3: レシピデータ統計
echo "📋 監査3-3: レシピデータ統計"
echo "   🔍 全体統計を取得中..."
cd /home/user/webapp && npx wrangler d1 execute aichef-production --remote --command="
SELECT 
    role,
    COUNT(*) as recipe_count,
    AVG(LENGTH(description)) as avg_desc_length
FROM recipes
GROUP BY role;
" 2>&1 > /tmp/recipe_stats.txt

echo "   📊 レシピ統計:"
grep -A 50 '"results"' /tmp/recipe_stats.txt | grep -E '"role"|"recipe_count"|"avg_desc_length"' | head -20
echo ""

# ========================================
# 最終集計
# ========================================
echo "=================================================="
echo "🏁 監査完了 - 最終集計"
echo "=================================================="
echo ""
echo "総監査項目: $TOTAL_CHECKS 件"
echo "✅ 合格: $PASSED 件"
echo "⚠️  警告: $WARNINGS 件"
echo "❌ 不合格: $CRITICAL 件"
echo ""

if [ "$CRITICAL" -eq 0 ] && [ "$WARNINGS" -eq 0 ]; then
    echo "🎉 総合評価: 【優秀】"
    echo "   すべての監査項目に合格しました。ローンチ準備完了です！"
elif [ "$CRITICAL" -eq 0 ]; then
    echo "✅ 総合評価: 【合格】"
    echo "   重大な問題はありません。警告項目を確認してください。"
elif [ "$CRITICAL" -le 2 ]; then
    echo "⚠️  総合評価: 【要改善】"
    echo "   不合格項目があります。修正してから再監査してください。"
else
    echo "❌ 総合評価: 【不合格】"
    echo "   複数の重大な問題があります。早急に修正が必要です。"
fi
echo ""
echo "📄 詳細レポート: $REPORT_FILE"
echo "終了時刻: $(date '+%Y-%m-%d %H:%M:%S')"
echo "=================================================="
