const fs = require('fs');
const path = require('path');

// JSONファイルを読み込み
const recipesData = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'master-recipes-50.json'), 'utf8')
);

// ingredient_idのマッピング（実際のDBスキーマに合わせて調整が必要）
const ingredientMapping = {
  "meat_pork": "ing_pork",
  "veg_potato": "ing_potato",
  "veg_onion": "ing_onion",
  "veg_carrot": "ing_carrot",
  "seasoning_soy_sauce": "ing_soy_sauce",
  "seasoning_mirin": "ing_mirin",
  "seasoning_sake": "ing_sake",
  "seasoning_sugar": "ing_sugar",
  "dashi_stock": "ing_dashi",
  "seasoning_curry_roux": "ing_curry_roux",
  "seasoning_oil": "ing_oil",
  "water": "ing_water",
  "meat_ground_beef": "ing_ground_beef",
  "egg": "ing_egg",
  "bread_crumbs": "ing_bread_crumbs",
  "milk": "ing_milk",
  "seasoning_salt": "ing_salt",
  "seasoning_pepper": "ing_pepper",
  "seasoning_nutmeg": "ing_nutmeg",
  "seasoning_ketchup": "ing_ketchup",
  "seasoning_worcestershire": "ing_worcestershire",
  "meat_chicken_thigh": "ing_chicken_thigh",
  "seasoning_ginger": "ing_ginger",
  "seasoning_garlic": "ing_garlic",
  "flour_potato_starch": "ing_potato_starch",
  "fish_salmon": "ing_salmon",
  "lemon": "ing_lemon",
  "tofu": "ing_tofu",
  "meat_ground_pork": "ing_ground_pork",
  "veg_leek": "ing_leek",
  "seasoning_doubanjiang": "ing_doubanjiang",
  "chicken_stock": "ing_chicken_stock",
  "sesame_oil": "ing_sesame_oil",
  "rice": "ing_rice",
  "kimchi": "ing_kimchi",
  "fish_mackerel": "ing_mackerel",
  "meat_beef": "ing_beef",
  "veg_bell_pepper": "ing_bell_pepper",
  "bamboo_shoots": "ing_bamboo_shoots",
  "seasoning_oyster_sauce": "ing_oyster_sauce",
  "veg_cabbage": "ing_cabbage",
  "gyoza_wrappers": "ing_gyoza_wrappers",
  "seasoning_miso": "ing_miso",
  "veg_daikon": "ing_daikon",
  "veg_burdock": "ing_burdock",
  "seafood_shrimp": "ing_shrimp",
  "flour": "ing_flour",
  "tartar_sauce": "ing_tartar_sauce",
  "meat_pork_loin": "ing_pork_loin",
  "tonkatsu_sauce": "ing_tonkatsu_sauce",
  "bonito_flakes": "ing_bonito_flakes",
  "dried_hijiki": "ing_hijiki",
  "aburaage": "ing_aburaage",
  "veg_cucumber": "ing_cucumber",
  "wakame_seaweed": "ing_wakame",
  "seasoning_vinegar": "ing_vinegar",
  "sesame_seeds": "ing_sesame_seeds",
  "veg_lettuce": "ing_lettuce",
  "dried_daikon": "ing_dried_daikon",
  "veg_pumpkin": "ing_pumpkin",
  "veg_spinach": "ing_spinach",
  "meat_chicken": "ing_chicken",
  "butter": "ing_butter",
  "canned_corn": "ing_canned_corn",
  "consomme": "ing_consomme",
  "nameko_mushroom": "ing_nameko",
  "canned_tomato": "ing_canned_tomato",
  "veg_celery": "ing_celery"
};

let sqlOutput = `-- AI Chefs 正確な50件のレシピデータ
-- 生成日時: ${new Date().toISOString()}

`;

// recipesテーブルへのINSERT
recipesData.forEach((recipe, index) => {
  // stepsとsubstitutesをJSON配列に変換
  const stepsJson = JSON.stringify(recipe.steps).replace(/'/g, "''");
  const substitutesArray = recipe.substitutes ? recipe.substitutes.split('、').map(s => s.trim()) : [];
  const substitutesJson = JSON.stringify(substitutesArray).replace(/'/g, "''");
  
  // primary_proteinを推測（ingredientsから判定）
  let primaryProtein = 'other';
  const firstIngredient = recipe.ingredients[0]?.ingredient_id || '';
  
  if (firstIngredient.includes('chicken') || recipe.title.includes('鶏') || recipe.title.includes('チキン') || recipe.title.includes('親子')) {
    primaryProtein = 'chicken';
  } else if (firstIngredient.includes('pork') || recipe.title.includes('豚') || recipe.title.includes('とんかつ')) {
    primaryProtein = 'pork';
  } else if (firstIngredient.includes('beef') || recipe.title.includes('牛')) {
    primaryProtein = 'beef';
  } else if (firstIngredient.includes('fish') || firstIngredient.includes('salmon') || firstIngredient.includes('mackerel') || firstIngredient.includes('shrimp') || recipe.title.includes('魚') || recipe.title.includes('鮭') || recipe.title.includes('鯖') || recipe.title.includes('エビ')) {
    primaryProtein = 'fish';
  } else if (firstIngredient.includes('egg') || recipe.title.includes('卵') || recipe.title.includes('オムライス') || recipe.title.includes('親子')) {
    primaryProtein = 'egg';
  } else if (firstIngredient.includes('tofu') || recipe.title.includes('豆腐') || recipe.title.includes('麻婆')) {
    primaryProtein = 'soy';
  } else if (recipe.title.includes('じゃが') || recipe.title.includes('かぼちゃ') || recipe.title.includes('ほうれん草') || recipe.title.includes('大根') || recipe.title.includes('きんぴら')) {
    primaryProtein = 'other';
  }
  
  sqlOutput += `-- ${index + 1}. ${recipe.title}
INSERT INTO recipes (
  recipe_id, title, description, role, cuisine,
  difficulty, time_min, cost_tier, popularity, child_friendly_score,
  primary_protein, steps_json, substitutes_json
) VALUES (
  '${recipe.recipe_id}',
  '${recipe.title}',
  '${recipe.description.replace(/'/g, "''")}',
  '${recipe.category}',
  '${recipe.cuisine}',
  '${recipe.difficulty}',
  ${recipe.time_min},
  ${recipe.cost_tier},
  ${recipe.popularity},
  ${recipe.child_friendly_score},
  '${primaryProtein}',
  '${stepsJson}',
  '${substitutesJson}'
);

`;

  // recipe_ingredientsテーブルへのINSERT
  recipe.ingredients.forEach((ing, ingIndex) => {
    const mappedId = ingredientMapping[ing.ingredient_id] || ing.ingredient_id;
    sqlOutput += `INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
VALUES ('${recipe.recipe_id}', '${mappedId}', ${ing.amount}, '${ing.unit}');
`;
  });

  sqlOutput += '\n';
});

// 確認用SELECT
sqlOutput += `
-- 確認クエリ
SELECT 'recipes' as table_name, COUNT(*) as count FROM recipes
UNION ALL
SELECT 'recipe_ingredients', COUNT(*) FROM recipe_ingredients;

-- サンプルレシピの確認
SELECT r.recipe_id, r.title, r.role, COUNT(ri.ingredient_id) as ingredient_count
FROM recipes r
LEFT JOIN recipe_ingredients ri ON r.recipe_id = ri.recipe_id
GROUP BY r.recipe_id, r.title, r.role
ORDER BY r.recipe_id
LIMIT 10;
`;

// ファイルに書き出し
const outputPath = path.join(__dirname, '..', 'db', 'insert-master-recipes-50.sql');
fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, sqlOutput);

console.log('✅ SQL file generated:', outputPath);
console.log(`📊 Total recipes: ${recipesData.length}`);
console.log(`📊 Total ingredient entries: ${recipesData.reduce((sum, r) => sum + r.ingredients.length, 0)}`);
