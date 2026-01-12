// 524件の不完全レシピを完璧にするスクリプト
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'dummy-key'
});

// レシピデータを生成
async function generateRecipeData(title, role) {
  const prompt = `日本の家庭料理「${title}」の完全なレシピデータをJSON形式で生成してください。

要件:
1. 材料: 最低5個以上、ingredient_idは以下のカテゴリから選択
   - meat_pork_minced, meat_chicken_breast, meat_beef_slice
   - veg_cabbage, veg_carrot, veg_onion, veg_nira
   - seasoning_soy_sauce, seasoning_mirin, seasoning_sake, seasoning_sugar
   - seasoning_salt, seasoning_pepper, seasoning_oil, seasoning_sesame_oil
2. 手順: 6ステップ程度
3. 代替案: 3つ程度

JSON形式:
{
  "ingredients": [
    {"ingredient_id": "meat_pork_minced", "quantity": 200, "unit": "g", "is_optional": 0}
  ],
  "steps": ["手順1", "手順2"],
  "substitutes": [
    {"original": "豚ひき肉", "alternatives": ["鶏ひき肉", "牛ひき肉"]}
  ]
}`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      response_format: { type: "json_object" }
    });
    
    return JSON.parse(response.choices[0].message.content);
  } catch (error) {
    console.error(`Error generating recipe for ${title}:`, error.message);
    return null;
  }
}

console.log('レシピ生成スクリプト準備完了');
console.log('実行方法: node scripts/fix-all-recipes.js');
