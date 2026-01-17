#!/bin/bash

# Week 2: side_011 ~ side_020 の説明文更新スクリプト

echo "========================================="
echo "Week 2: 10件の説明文更新を開始します"
echo "========================================="
echo ""

# 更新カウンター
SUCCESS=0
FAILED=0

# 関数: レシピ更新
update_recipe() {
    local ID=$1
    local DESC=$2
    
    echo "📝 更新中: $ID - $(date '+%H:%M:%S')"
    
    # SQLエスケープ（シングルクォートを二重化）
    DESC_ESCAPED="${DESC//\'/\'\'}"
    
    # 更新実行
    RESULT=$(cd /home/user/webapp && npx wrangler d1 execute aichef-production --remote --command="UPDATE recipes SET description='$DESC_ESCAPED' WHERE recipe_id='$ID';" 2>&1)
    
    if echo "$RESULT" | grep -q "success.*true"; then
        echo "✅ 成功: $ID"
        ((SUCCESS++))
        return 0
    else
        echo "❌ 失敗: $ID"
        echo "$RESULT"
        ((FAILED++))
        return 1
    fi
}

# Week 2: 10件の更新実行
update_recipe "side_011" "茹でた小松菜を醤油とかつお節で和えた、栄養満点の和食の副菜。カルシウムと鉄分が豊富で、あっさりとした味わいが魅力です。"

update_recipe "side_012" "シャキシャキの白菜を塩で浅漬けにした、さっぱりとした箸休めにぴったりの一品。短時間で作れて、食卓の彩りにも最適です。"

update_recipe "side_013" "とろりと柔らかく煮込んだなすに、だし汁がじんわり染み込んだ夏の定番料理。冷やしても美味しく、食欲のない日にもおすすめです。"

update_recipe "side_014" "ねっとりとした里芋を甘辛く煮絡めた、ほっこり温まる和食の定番。里芋独特のぬめりと食感が楽しめる、素朴で優しい味わいです。"

update_recipe "side_015" "鶏肉と根菜をたっぷり使った、九州福岡の郷土料理。ごぼう、れんこん、にんじんなどの野菜が旨みを吸い込んだ、栄養バランス抜群の一品です。"

update_recipe "side_016" "ふんわり柔らかいがんもどきを、だし汁でじっくり煮込んだ優しい味わいの煮物。豆腐の旨みが凝縮され、ご飯によく合います。"

update_recipe "side_017" "プリプリのこんにゃくを甘辛く煮込んだ、食物繊維たっぷりのヘルシーな副菜。低カロリーでダイエット中の方にもおすすめの一品です。"

update_recipe "side_018" "ほくほくの大豆を甘辛く煮込んだ、タンパク質と食物繊維が豊富な栄養満点の常備菜。作り置きにも最適で、毎日の食卓に嬉しい一品です。"

update_recipe "side_019" "シャキシャキのれんこんを甘辛く炒めた、歯ごたえが楽しい副菜。ビタミンCと食物繊維が豊富で、お弁当のおかずにもぴったりです。"

update_recipe "side_020" "シャキシャキのもやしをごま油と塩で和えた、韓国風の簡単副菜。低カロリーで栄養価も高く、あと一品欲しい時に大活躍します。"

echo ""
echo "========================================="
echo "Week 2 更新完了！"
echo "成功: $SUCCESS 件"
echo "失敗: $FAILED 件"
echo "累計完了: 20 件（Week 1 + Week 2）"
echo "========================================="
