#!/bin/bash

# Batch 1: side_011 to side_030 (20 items)
npx wrangler d1 execute aichef-production --remote --command="
DELETE FROM recipe_ingredients WHERE recipe_id IN ('side_011','side_012','side_013','side_014','side_015','side_016','side_017','side_018','side_019','side_020','side_021','side_022','side_023','side_024','side_025','side_026','side_027','side_028','side_029','side_030');
DELETE FROM recipes WHERE recipe_id IN ('side_011','side_012','side_013','side_014','side_015','side_016','side_017','side_018','side_019','side_020','side_021','side_022','side_023','side_024','side_025','side_026','side_027','side_028','side_029','side_030');
"
echo "Batch 1 完了 (side_011-030)"

# Batch 2: side_031 to side_050 (20 items)
npx wrangler d1 execute aichef-production --remote --command="
DELETE FROM recipe_ingredients WHERE recipe_id IN ('side_031','side_032','side_033','side_034','side_035','side_036','side_037','side_038','side_039','side_040','side_041','side_042','side_043','side_044','side_045','side_046','side_047','side_048','side_049','side_050');
DELETE FROM recipes WHERE recipe_id IN ('side_031','side_032','side_033','side_034','side_035','side_036','side_037','side_038','side_039','side_040','side_041','side_042','side_043','side_044','side_045','side_046','side_047','side_048','side_049','side_050');
"
echo "Batch 2 完了 (side_031-050)"

# Batch 3: side_051-090 (remaining sides)
npx wrangler d1 execute aichef-production --remote --command="
DELETE FROM recipe_ingredients WHERE recipe_id IN ('side_051','side_052','side_053','side_054','side_055','side_056','side_057','side_060','side_061','side_062','side_063','side_064','side_065','side_066','side_067','side_068','side_069','side_070','side_071','side_072','side_073','side_074','side_075','side_076','side_077','side_078','side_079','side_080','side_082','side_083','side_084','side_085','side_086','side_087','side_088','side_089','side_090');
DELETE FROM recipes WHERE recipe_id IN ('side_051','side_052','side_053','side_054','side_055','side_056','side_057','side_060','side_061','side_062','side_063','side_064','side_065','side_066','side_067','side_068','side_069','side_070','side_071','side_072','side_073','side_074','side_075','side_076','side_077','side_078','side_079','side_080','side_082','side_083','side_084','side_085','side_086','side_087','side_088','side_089','side_090');
"
echo "Batch 3 完了 (side_051-090)"

# Batch 4: soup_011 to soup_030 (20 items)
npx wrangler d1 execute aichef-production --remote --command="
DELETE FROM recipe_ingredients WHERE recipe_id IN ('soup_011','soup_012','soup_013','soup_014','soup_015','soup_016','soup_017','soup_018','soup_019','soup_020','soup_021','soup_022','soup_023','soup_024','soup_025','soup_026','soup_027','soup_028','soup_029','soup_030');
DELETE FROM recipes WHERE recipe_id IN ('soup_011','soup_012','soup_013','soup_014','soup_015','soup_016','soup_017','soup_018','soup_019','soup_020','soup_021','soup_022','soup_023','soup_024','soup_025','soup_026','soup_027','soup_028','soup_029','soup_030');
"
echo "Batch 4 完了 (soup_011-030)"

# Batch 5: soup_031-059 (remaining soups)
npx wrangler d1 execute aichef-production --remote --command="
DELETE FROM recipe_ingredients WHERE recipe_id IN ('soup_031','soup_032','soup_033','soup_034','soup_035','soup_036','soup_037','soup_038','soup_039','soup_040','soup_041','soup_042','soup_043','soup_044','soup_045','soup_046','soup_047','soup_048','soup_049','soup_050','soup_051','soup_052','soup_053','soup_054','soup_055','soup_056','soup_057','soup_058','soup_059');
DELETE FROM recipes WHERE recipe_id IN ('soup_031','soup_032','soup_033','soup_034','soup_035','soup_036','soup_037','soup_038','soup_039','soup_040','soup_041','soup_042','soup_043','soup_044','soup_045','soup_046','soup_047','soup_048','soup_049','soup_050','soup_051','soup_052','soup_053','soup_054','soup_055','soup_056','soup_057','soup_058','soup_059');
"
echo "Batch 5 完了 (soup_031-059)"

echo "======================================="
echo "全削除完了！結果確認中..."
npx wrangler d1 execute aichef-production --remote --command="SELECT role, COUNT(*) as count FROM recipes GROUP BY role ORDER BY role"
