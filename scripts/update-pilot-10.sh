#!/bin/bash

# パイロット10件の説明文更新スクリプト
# 1件ずつ確実に更新

echo "========================================="
echo "パイロット10件の説明文更新を開始します"
echo "========================================="
echo ""

# 更新カウンター
SUCCESS=0
FAILED=0

# 関数: レシピ更新
update_recipe() {
    local ID=$1
    local DESC=$2
    
    echo "📝 更新中: $ID"
    
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

# 10件の更新実行
update_recipe "side_001" "シャキシャキとした食感が楽しいごぼうとにんじんを甘辛く炒めた定番の副菜。食物繊維が豊富で、ご飯のお供に最適です。"

update_recipe "side_002" "茹でたほうれん草を鰹節と醤油で味付けした、栄養満点のシンプルな一品。鉄分とビタミンが豊富で健康的です。"

update_recipe "side_003" "ホクホクのじゃがいもとマヨネーズで作る、子供から大人まで大好きなクリーミーなサラダ。お弁当のおかずにもぴったりです。"

update_recipe "side_004" "甘くてホクホクのかぼちゃを、だし汁と醤油で優しく煮込んだ和食の定番。ビタミンAが豊富で栄養価も高い一品です。"

update_recipe "side_005" "冷たい豆腐に薬味をたっぷり乗せた、夏にぴったりのさっぱりとした副菜。低カロリーで高タンパク、ヘルシー志向の方におすすめです。"

update_recipe "side_006" "ひじきと大豆、油揚げを甘辛く煮込んだ、栄養バランス抜群の常備菜。カルシウムと食物繊維が豊富で、作り置きにも最適です。"

update_recipe "side_007" "シャキシャキのきゅうりを酢で和えた、さっぱりとした口直しにぴったりの一品。わかめやタコを加えても美味しくいただけます。"

update_recipe "side_008" "千切りにした大根のシャキシャキ食感が楽しい、和風ドレッシングで味付けしたヘルシーなサラダ。消化を助ける効果もあります。"

update_recipe "side_009" "切り干し大根をにんじんや油揚げと一緒に甘辛く煮込んだ、食物繊維たっぷりの常備菜。保存がきくので作り置きにも便利です。"

update_recipe "side_010" "ふわふわで優しい甘さの卵焼きは、お弁当の定番おかず。だし巻き風にしても美味しく、朝食にもぴったりの一品です。"

echo ""
echo "========================================="
echo "更新完了！"
echo "成功: $SUCCESS 件"
echo "失敗: $FAILED 件"
echo "========================================="
