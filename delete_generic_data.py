#!/usr/bin/env python3
"""
汎用データレシピの一括削除スクリプト
"""
import subprocess
import time

# 削除対象のレシピID一覧
GENERIC_RECIPES = """
side_011 side_012 side_013 side_014 side_015 side_016 side_017 side_018 side_019 side_020
side_021 side_022 side_023 side_024 side_025 side_026 side_027 side_028 side_029 side_030
side_031 side_032 side_033 side_034 side_035 side_036 side_037 side_038 side_039 side_040
side_041 side_042 side_043 side_044 side_045 side_046 side_047 side_048 side_049 side_050
side_051 side_052 side_053 side_054 side_055 side_056 side_057 side_060 side_061 side_062
side_063 side_064 side_065 side_066 side_067 side_068 side_069 side_070 side_071 side_072
side_073 side_074 side_075 side_076 side_077 side_078 side_079 side_080 side_082 side_083
side_084 side_085 side_086 side_087 side_088 side_089 side_090
soup_011 soup_012 soup_013 soup_014 soup_015 soup_016 soup_017 soup_018 soup_019 soup_020
soup_021 soup_022 soup_023 soup_024 soup_025 soup_026 soup_027 soup_028 soup_029 soup_030
soup_031 soup_032 soup_033 soup_034 soup_035 soup_036 soup_037 soup_038 soup_039 soup_040
soup_041 soup_042 soup_043 soup_044 soup_045 soup_046 soup_047 soup_048 soup_049 soup_050
soup_051 soup_052 soup_053 soup_054 soup_055 soup_056 soup_057 soup_058 soup_059
""".strip().split()

print(f"🚨 汎用データ削除開始: {len(GENERIC_RECIPES)}件")
print("=" * 60)

success_count = 0
error_count = 0

for i, recipe_id in enumerate(GENERIC_RECIPES, 1):
    print(f"[{i}/{len(GENERIC_RECIPES)}] 削除中: {recipe_id}...", end=" ")
    
    # DELETE recipe_ingredients first, then recipes
    cmd = f"DELETE FROM recipe_ingredients WHERE recipe_id = '{recipe_id}'"
    result = subprocess.run(
        ['npx', 'wrangler', 'd1', 'execute', 'aichef-production', '--remote', f'--command={cmd}'],
        capture_output=True,
        text=True
    )
    
    if '"success": true' in result.stdout:
        cmd2 = f"DELETE FROM recipes WHERE recipe_id = '{recipe_id}'"
        result2 = subprocess.run(
            ['npx', 'wrangler', 'd1', 'execute', 'aichef-production', '--remote', f'--command={cmd2}'],
            capture_output=True,
            text=True
        )
        
        if '"success": true' in result2.stdout:
            print("✅ 成功")
            success_count += 1
        else:
            print(f"❌ recipes削除失敗")
            error_count += 1
    else:
        print(f"❌ ingredients削除失敗")
        error_count += 1
    
    # Rate limiting
    if i % 10 == 0:
        print(f"  ... 10件処理完了、一時停止中 ...")
        time.sleep(2)
    else:
        time.sleep(0.3)

print("=" * 60)
print(f"✅ 削除完了: {success_count}件")
print(f"❌ エラー: {error_count}件")
print("=" * 60)

# 最終結果確認
print("\n📊 最終レシピ数確認:")
result = subprocess.run(
    ['npx', 'wrangler', 'd1', 'execute', 'aichef-production', '--remote',
     '--command=SELECT role, COUNT(*) as count FROM recipes GROUP BY role ORDER BY role'],
    capture_output=True,
    text=True
)
print(result.stdout)
