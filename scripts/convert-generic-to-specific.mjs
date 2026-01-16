#!/usr/bin/env node
/**
 * 汎用データを具体的なレシピに変換
 * - 副菜77件：side_011〜side_090
 * - 汁物49件：soup_011〜soup_059
 */

import { readFileSync, writeFileSync } from 'fs';
import { execSync } from 'child_process';

/**
 * 副菜テンプレート（和食中心）
 */
const SIDE_DISH_TEMPLATES = [
  // きんぴらシリーズ
  { base: 'ごぼう', name: 'きんぴらごぼう', ingredients: [
    { name: 'ごぼう', quantity: 150, unit: 'g' },
    { name: 'にんじん', quantity: 50, unit: 'g' },
    { name: '醤油', quantity: 15, unit: 'ml' },
    { name: 'みりん', quantity: 15, unit: 'ml' },
    { name: 'ごま油', quantity: 10, unit: 'ml' },
    { name: '白ごま', quantity: 5, unit: 'g' }
  ]},
  { base: 'れんこん', name: 'れんこんのきんぴら', ingredients: [
    { name: 'れんこん', quantity: 200, unit: 'g' },
    { name: '醤油', quantity: 15, unit: 'ml' },
    { name: 'みりん', quantity: 15, unit: 'ml' },
    { name: '砂糖', quantity: 10, unit: 'g' },
    { name: 'ごま油', quantity: 10, unit: 'ml' },
    { name: '唐辛子', quantity: 1, unit: '本' }
  ]},
  
  // 煮物シリーズ
  { base: 'ひじき', name: 'ひじきの煮物', ingredients: [
    { name: 'ひじき', quantity: 30, unit: 'g' },
    { name: '油揚げ', quantity: 1, unit: '枚' },
    { name: 'にんじん', quantity: 50, unit: 'g' },
    { name: '枝豆', quantity: 50, unit: 'g' },
    { name: 'だし', quantity: 200, unit: 'ml' },
    { name: '醤油', quantity: 20, unit: 'ml' },
    { name: 'みりん', quantity: 20, unit: 'ml' },
    { name: '砂糖', quantity: 10, unit: 'g' }
  ]},
  { base: 'かぼちゃ', name: 'かぼちゃの煮物', ingredients: [
    { name: 'かぼちゃ', quantity: 300, unit: 'g' },
    { name: 'だし', quantity: 200, unit: 'ml' },
    { name: '醤油', quantity: 20, unit: 'ml' },
    { name: 'みりん', quantity: 20, unit: 'ml' },
    { name: '砂糖', quantity: 15, unit: 'g' }
  ]},
  { base: '大根', name: '大根の煮物', ingredients: [
    { name: '大根', quantity: 300, unit: 'g' },
    { name: '鶏もも肉', quantity: 100, unit: 'g' },
    { name: 'だし', quantity: 300, unit: 'ml' },
    { name: '醤油', quantity: 30, unit: 'ml' },
    { name: 'みりん', quantity: 30, unit: 'ml' },
    { name: '砂糖', quantity: 15, unit: 'g' }
  ]},
  
  // サラダシリーズ
  { base: 'ポテト', name: 'ポテトサラダ', ingredients: [
    { name: 'じゃがいも', quantity: 300, unit: 'g' },
    { name: 'きゅうり', quantity: 1, unit: '本' },
    { name: 'にんじん', quantity: 50, unit: 'g' },
    { name: 'ハム', quantity: 50, unit: 'g' },
    { name: 'マヨネーズ', quantity: 50, unit: 'g' },
    { name: '塩', quantity: 2, unit: 'g' },
    { name: 'こしょう', quantity: 1, unit: 'g' }
  ]},
  { base: 'マカロニ', name: 'マカロニサラダ', ingredients: [
    { name: 'マカロニ', quantity: 100, unit: 'g' },
    { name: 'きゅうり', quantity: 1, unit: '本' },
    { name: 'にんじん', quantity: 50, unit: 'g' },
    { name: 'ハム', quantity: 50, unit: 'g' },
    { name: 'マヨネーズ', quantity: 50, unit: 'g' },
    { name: '塩', quantity: 2, unit: 'g' },
    { name: 'こしょう', quantity: 1, unit: 'g' }
  ]},
  { base: '春雨', name: '春雨サラダ', ingredients: [
    { name: '春雨', quantity: 50, unit: 'g' },
    { name: 'きゅうり', quantity: 1, unit: '本' },
    { name: 'にんじん', quantity: 50, unit: 'g' },
    { name: 'ハム', quantity: 50, unit: 'g' },
    { name: '醤油', quantity: 15, unit: 'ml' },
    { name: '酢', quantity: 15, unit: 'ml' },
    { name: 'ごま油', quantity: 10, unit: 'ml' },
    { name: '砂糖', quantity: 10, unit: 'g' }
  ]},
  
  // 和え物シリーズ
  { base: 'ほうれん草', name: 'ほうれん草のお浸し', ingredients: [
    { name: 'ほうれん草', quantity: 200, unit: 'g' },
    { name: 'だし', quantity: 50, unit: 'ml' },
    { name: '醤油', quantity: 15, unit: 'ml' },
    { name: 'かつお節', quantity: 5, unit: 'g' }
  ]},
  { base: '小松菜', name: '小松菜のごま和え', ingredients: [
    { name: '小松菜', quantity: 200, unit: 'g' },
    { name: 'すりごま', quantity: 20, unit: 'g' },
    { name: '醤油', quantity: 15, unit: 'ml' },
    { name: '砂糖', quantity: 10, unit: 'g' }
  ]},
  { base: 'もやし', name: 'もやしのナムル', ingredients: [
    { name: 'もやし', quantity: 200, unit: 'g' },
    { name: 'ごま油', quantity: 10, unit: 'ml' },
    { name: '醤油', quantity: 10, unit: 'ml' },
    { name: 'にんにく', quantity: 1, unit: '片' },
    { name: '白ごま', quantity: 5, unit: 'g' },
    { name: '塩', quantity: 2, unit: 'g' }
  ]}
];

/**
 * 汁物テンプレート（味噌汁・スープ）
 */
const SOUP_TEMPLATES = [
  // 味噌汁シリーズ
  { name: '味噌汁（豆腐・わかめ）', ingredients: [
    { name: 'だし', quantity: 600, unit: 'ml' },
    { name: '味噌', quantity: 40, unit: 'g' },
    { name: '豆腐', quantity: 0.5, unit: '丁' },
    { name: 'わかめ', quantity: 10, unit: 'g' }
  ]},
  { name: '味噌汁（大根・油揚げ）', ingredients: [
    { name: 'だし', quantity: 600, unit: 'ml' },
    { name: '味噌', quantity: 40, unit: 'g' },
    { name: '大根', quantity: 100, unit: 'g' },
    { name: '油揚げ', quantity: 1, unit: '枚' },
    { name: '長ねぎ', quantity: 0.25, unit: '本' }
  ]},
  { name: '味噌汁（なめこ・豆腐）', ingredients: [
    { name: 'だし', quantity: 600, unit: 'ml' },
    { name: '味噌', quantity: 40, unit: 'g' },
    { name: 'なめこ', quantity: 1, unit: 'パック' },
    { name: '豆腐', quantity: 0.5, unit: '丁' },
    { name: '長ねぎ', quantity: 0.25, unit: '本' }
  ]},
  { name: '味噌汁（キャベツ・玉ねぎ）', ingredients: [
    { name: 'だし', quantity: 600, unit: 'ml' },
    { name: '味噌', quantity: 40, unit: 'g' },
    { name: 'キャベツ', quantity: 100, unit: 'g' },
    { name: '玉ねぎ', quantity: 0.5, unit: '個' }
  ]},
  { name: '味噌汁（じゃがいも・玉ねぎ）', ingredients: [
    { name: 'だし', quantity: 600, unit: 'ml' },
    { name: '味噌', quantity: 40, unit: 'g' },
    { name: 'じゃがいも', quantity: 1, unit: '個' },
    { name: '玉ねぎ', quantity: 0.5, unit: '個' }
  ]},
  { name: '味噌汁（白菜・油揚げ）', ingredients: [
    { name: 'だし', quantity: 600, unit: 'ml' },
    { name: '味噌', quantity: 40, unit: 'g' },
    { name: '白菜', quantity: 150, unit: 'g' },
    { name: '油揚げ', quantity: 1, unit: '枚' }
  ]},
  { name: '味噌汁（ほうれん草・えのき）', ingredients: [
    { name: 'だし', quantity: 600, unit: 'ml' },
    { name: '味噌', quantity: 40, unit: 'g' },
    { name: 'ほうれん草', quantity: 100, unit: 'g' },
    { name: 'えのき', quantity: 0.5, unit: 'パック' }
  ]},
  { name: '味噌汁（小松菜・油揚げ）', ingredients: [
    { name: 'だし', quantity: 600, unit: 'ml' },
    { name: '味噌', quantity: 40, unit: 'g' },
    { name: '小松菜', quantity: 100, unit: 'g' },
    { name: '油揚げ', quantity: 1, unit: '枚' }
  ]},
  { name: '味噌汁（かぼちゃ）', ingredients: [
    { name: 'だし', quantity: 600, unit: 'ml' },
    { name: '味噌', quantity: 40, unit: 'g' },
    { name: 'かぼちゃ', quantity: 150, unit: 'g' },
    { name: '長ねぎ', quantity: 0.25, unit: '本' }
  ]},
  { name: '味噌汁（さつまいも）', ingredients: [
    { name: 'だし', quantity: 600, unit: 'ml' },
    { name: '味噌', quantity: 40, unit: 'g' },
    { name: 'さつまいも', quantity: 150, unit: 'g' },
    { name: '長ねぎ', quantity: 0.25, unit: '本' }
  ]},
  
  // スープシリーズ
  { name: 'コンソメスープ', ingredients: [
    { name: '水', quantity: 600, unit: 'ml' },
    { name: 'コンソメ', quantity: 2, unit: '個' },
    { name: 'キャベツ', quantity: 100, unit: 'g' },
    { name: 'にんじん', quantity: 50, unit: 'g' },
    { name: '玉ねぎ', quantity: 0.5, unit: '個' },
    { name: '塩', quantity: 2, unit: 'g' },
    { name: 'こしょう', quantity: 1, unit: 'g' }
  ]},
  { name: '中華スープ', ingredients: [
    { name: '水', quantity: 600, unit: 'ml' },
    { name: '鶏ガラスープの素', quantity: 10, unit: 'g' },
    { name: '長ねぎ', quantity: 0.5, unit: '本' },
    { name: '卵', quantity: 1, unit: '個' },
    { name: 'ごま油', quantity: 5, unit: 'ml' },
    { name: '塩', quantity: 2, unit: 'g' }
  ]},
  { name: 'オニオンスープ', ingredients: [
    { name: '玉ねぎ', quantity: 2, unit: '個' },
    { name: 'バター', quantity: 20, unit: 'g' },
    { name: '水', quantity: 600, unit: 'ml' },
    { name: 'コンソメ', quantity: 2, unit: '個' },
    { name: '塩', quantity: 2, unit: 'g' },
    { name: 'こしょう', quantity: 1, unit: 'g' },
    { name: 'パセリ', quantity: 5, unit: 'g' }
  ]}
];

/**
 * SQL UPDATE文生成
 */
function generateUpdateSQL() {
  const sqlStatements = [];
  
  // 副菜更新（77件）
  for (let i = 0; i < 77; i++) {
    const recipeId = `side_${String(i + 11).padStart(3, '0')}`;
    const template = SIDE_DISH_TEMPLATES[i % SIDE_DISH_TEMPLATES.length];
    
    // title更新
    sqlStatements.push(
      `UPDATE recipes SET title = '${template.name}' WHERE recipe_id = '${recipeId}';`
    );
    
    // 材料削除＆再挿入
    sqlStatements.push(
      `DELETE FROM recipe_ingredients WHERE recipe_id = '${recipeId}';`
    );
    
    template.ingredients.forEach((ing, idx) => {
      const ingId = `ing_${template.base}_${idx + 1}`;
      sqlStatements.push(
        `INSERT OR IGNORE INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit) VALUES ('${recipeId}', '${ingId}', ${ing.quantity}, '${ing.unit}');`
      );
    });
  }
  
  // 汁物更新（49件）
  for (let i = 0; i < 49; i++) {
    const recipeId = `soup_${String(i + 11).padStart(3, '0')}`;
    const template = SOUP_TEMPLATES[i % SOUP_TEMPLATES.length];
    
    // title更新
    sqlStatements.push(
      `UPDATE recipes SET title = '${template.name}' WHERE recipe_id = '${recipeId}';`
    );
    
    // 材料削除＆再挿入
    sqlStatements.push(
      `DELETE FROM recipe_ingredients WHERE recipe_id = '${recipeId}';`
    );
    
    template.ingredients.forEach((ing, idx) => {
      const ingId = `ing_soup_${i}_${idx}`;
      sqlStatements.push(
        `INSERT OR IGNORE INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit) VALUES ('${recipeId}', '${ingId}', ${ing.quantity}, '${ing.unit}');`
      );
    });
  }
  
  return sqlStatements.join('\n');
}

// SQL生成＆保存
const sql = generateUpdateSQL();
const outputPath = '/tmp/update_generic_to_specific.sql';
writeFileSync(outputPath, sql);

console.log(`✅ SQL生成完了: ${outputPath}`);
console.log(`📊 更新対象: 副菜77件 + 汁物49件 = 126件`);
console.log(`📝 SQL行数: ${sql.split('\n').length}行`);
