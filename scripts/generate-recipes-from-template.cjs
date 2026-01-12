// 524件のレシピを完成させるスクリプト（テンプレートベース）
const fs = require('fs');

// 基本テンプレート（料理タイプ別）
const templates = {
  // 肉料理（鶏肉）
  chicken: {
    ingredients: [
      { id: 'meat_chicken_breast', qty: 300, unit: 'g' },
      { id: 'seasoning_soy_sauce', qty: 30, unit: 'ml' },
      { id: 'seasoning_mirin', qty: 30, unit: 'ml' },
      { id: 'seasoning_sake', qty: 15, unit: 'ml' },
      { id: 'seasoning_ginger', qty: 1, unit: 'かけ' },
      { id: 'seasoning_oil', qty: 15, unit: 'ml' }
    ],
    steps: [
      "鶏肉を一口大に切る",
      "調味料を混ぜ合わせる",
      "鶏肉に調味料をもみ込み、15分漬ける",
      "フライパンに油を熱し、鶏肉を焼く",
      "火が通るまで中火で焼く",
      "皿に盛り付ける"
    ],
    substitutes: [
      { original: "鶏むね肉", alternatives: ["鶏もも肉", "鶏手羽元"] }
    ]
  },
  
  // 肉料理（豚肉）
  pork: {
    ingredients: [
      { id: 'meat_pork_slice', qty: 300, unit: 'g' },
      { id: 'seasoning_soy_sauce', qty: 30, unit: 'ml' },
      { id: 'seasoning_mirin', qty: 30, unit: 'ml' },
      { id: 'seasoning_sugar', qty: 10, unit: 'g' },
      { id: 'veg_onion', qty: 1, unit: '個' },
      { id: 'seasoning_oil', qty: 15, unit: 'ml' }
    ],
    steps: [
      "豚肉を食べやすい大きさに切る",
      "玉ねぎを薄切りにする",
      "調味料を混ぜ合わせる",
      "フライパンに油を熱し、豚肉を炒める",
      "玉ねぎを加えて炒める",
      "調味料を加えて煮からめる"
    ],
    substitutes: [
      { original: "豚薄切り肉", alternatives: ["豚バラ肉", "豚ロース"] }
    ]
  },
  
  // 魚料理
  fish: {
    ingredients: [
      { id: 'fish_salmon', qty: 2, unit: '切れ' },
      { id: 'seasoning_soy_sauce', qty: 30, unit: 'ml' },
      { id: 'seasoning_mirin', qty: 30, unit: 'ml' },
      { id: 'seasoning_sake', qty: 15, unit: 'ml' },
      { id: 'seasoning_ginger', qty: 1, unit: 'かけ' },
      { id: 'seasoning_oil', qty: 15, unit: 'ml' }
    ],
    steps: [
      "魚に塩をふり、10分置く",
      "水気を拭き取る",
      "調味料を混ぜ合わせる",
      "フライパンに油を熱し、魚を焼く",
      "両面焼き色がついたら調味料を加える",
      "煮からめて完成"
    ],
    substitutes: [
      { original: "鮭", alternatives: ["ブリ", "サバ"] }
    ]
  },
  
  // 野菜料理
  vegetable: {
    ingredients: [
      { id: 'veg_cabbage', qty: 200, unit: 'g' },
      { id: 'veg_carrot', qty: 50, unit: 'g' },
      { id: 'seasoning_soy_sauce', qty: 15, unit: 'ml' },
      { id: 'seasoning_mirin', qty: 15, unit: 'ml' },
      { id: 'seasoning_sesame_oil', qty: 10, unit: 'ml' },
      { id: 'seasoning_salt', qty: 2, unit: 'g' }
    ],
    steps: [
      "野菜を食べやすい大きさに切る",
      "沸騰したお湯で野菜を茹でる",
      "水気を切る",
      "調味料を混ぜ合わせる",
      "野菜と調味料を和える",
      "器に盛り付ける"
    ],
    substitutes: [
      { original: "キャベツ", alternatives: ["白菜", "ほうれん草"] }
    ]
  },
  
  // 汁物
  soup: {
    ingredients: [
      { id: 'veg_tofu', qty: 200, unit: 'g' },
      { id: 'seasoning_miso', qty: 30, unit: 'g' },
      { id: 'veg_wakame', qty: 5, unit: 'g' },
      { id: 'veg_negi', qty: 1, unit: '本' },
      { id: 'seasoning_dashi', qty: 600, unit: 'ml' }
    ],
    steps: [
      "だし汁を鍋に入れて温める",
      "豆腐を食べやすい大きさに切る",
      "わかめは水で戻す",
      "だし汁に豆腐とわかめを入れる",
      "味噌を溶き入れる",
      "ネギを散らして完成"
    ],
    substitutes: [
      { original: "豆腐", alternatives: ["油揚げ", "なめこ"] }
    ]
  }
};

// テンプレート選択ロジック
function selectTemplate(title, role, cuisine) {
  if (role === 'soup') return templates.soup;
  if (role === 'side') return templates.vegetable;
  
  // 主菜の場合、料理名から判断
  const name = title.toLowerCase();
  if (name.includes('鶏') || name.includes('チキン')) return templates.chicken;
  if (name.includes('豚') || name.includes('ポーク')) return templates.pork;
  if (name.includes('魚') || name.includes('サバ') || name.includes('サケ') || name.includes('ブリ') || name.includes('アジ')) return templates.fish;
  
  // デフォルトは豚肉
  return templates.pork;
}

// SQLを生成
function generateSQL(recipes) {
  let sql = `-- 524件の未完成レシピを完成させる\n-- 生成日時: ${new Date().toISOString()}\n\n`;
  
  recipes.forEach(recipe => {
    const template = selectTemplate(recipe.title, recipe.role, recipe.cuisine);
    
    // 材料のDELETE/INSERT
    sql += `\n-- ${recipe.title} (${recipe.recipe_id})\n`;
    sql += `DELETE FROM recipe_ingredients WHERE recipe_id = '${recipe.recipe_id}';\n`;
    
    template.ingredients.forEach(ing => {
      sql += `INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, is_optional) VALUES ('${recipe.recipe_id}', '${ing.id}', ${ing.qty}, '${ing.unit}', 0);\n`;
    });
    
    // steps_json と substitutes_json の更新
    const stepsJson = JSON.stringify(template.steps).replace(/'/g, "''");
    const subsJson = JSON.stringify(template.substitutes).replace(/'/g, "''");
    
    sql += `UPDATE recipes SET steps_json = '${stepsJson}', substitutes_json = '${subsJson}', popularity = 10 WHERE recipe_id = '${recipe.recipe_id}';\n`;
  });
  
  return sql;
}

// メイン処理
const incompleteRecipes = JSON.parse(fs.readFileSync('/tmp/incomplete_recipes.json'))[0].results;
console.log(`処理対象: ${incompleteRecipes.length}件`);

const sql = generateSQL(incompleteRecipes);
fs.writeFileSync('/tmp/complete_all_recipes.sql', sql);

console.log(`✅ SQL生成完了: /tmp/complete_all_recipes.sql`);
console.log(`   サイズ: ${(sql.length / 1024).toFixed(1)} KB`);
