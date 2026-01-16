// 買い物リスト生成・印刷・送信ヘルパー
// src/helpers/shopping-list.ts

/**
 * 献立から買い物リストを生成
 */
export async function generateShoppingList(
  db: D1Database,
  mealPlanId: string
): Promise<{
  success: boolean;
  shopping_list?: any;
  error?: string;
}> {
  try {
    // 献立の全レシピを取得
    const recipes = await db.prepare(`
      SELECT DISTINCT r.recipe_id
      FROM meal_plan_days mpd
      JOIN meal_plan_day_recipes mpdr ON mpd.meal_plan_day_id = mpdr.meal_plan_day_id
      JOIN recipes r ON mpdr.recipe_id = r.recipe_id
      WHERE mpd.meal_plan_id = ?
    `).bind(mealPlanId).all();

    if (!recipes.results || recipes.results.length === 0) {
      return { success: false, error: '献立が見つかりません' };
    }

    // 材料を集計
    const ingredientMap = new Map<string, {
      ingredient_id: string;
      name: string;
      category: string;
      total_quantity: number;
      unit: string;
    }>();

    // 各レシピの材料を取得して集計
    for (const recipe of recipes.results) {
      const ingredients = await db.prepare(`
        SELECT 
          ri.ingredient_id,
          i.name,
          i.category,
          ri.quantity,
          ri.unit
        FROM recipe_ingredients ri
        JOIN ingredients i ON ri.ingredient_id = i.ingredient_id
        WHERE ri.recipe_id = ?
      `).bind((recipe as any).recipe_id).all();

      ingredients.results?.forEach((ing: any) => {
        const key = `${ing.ingredient_id}_${ing.unit}`;
        
        if (ingredientMap.has(key)) {
          const existing = ingredientMap.get(key)!;
          existing.total_quantity += ing.quantity;
        } else {
          ingredientMap.set(key, {
            ingredient_id: ing.ingredient_id,
            name: ing.name,
            category: ing.category,
            total_quantity: ing.quantity,
            unit: ing.unit
          });
        }
      });
    }

    // カテゴリ別にグループ化
    const groupedByCategory: any = {};
    ingredientMap.forEach((item) => {
      if (!groupedByCategory[item.category]) {
        groupedByCategory[item.category] = [];
      }
      groupedByCategory[item.category].push(item);
    });

    // カテゴリの日本語名マッピング
    const categoryNames: any = {
      'vegetables': '野菜',
      'meat_fish': '肉・魚',
      'dairy_eggs': '乳製品・卵',
      'tofu_beans': '豆腐・豆類',
      'seasonings': '調味料',
      'others': 'その他'
    };

    const shoppingList = Object.keys(groupedByCategory).map(category => ({
      category: category,
      category_name: categoryNames[category] || category,
      items: groupedByCategory[category]
    }));

    return {
      success: true,
      shopping_list: {
        meal_plan_id: mealPlanId,
        total_items: ingredientMap.size,
        categories: shoppingList,
        generated_at: new Date().toISOString()
      }
    };

  } catch (error: any) {
    console.error('買い物リスト生成エラー:', error);
    return {
      success: false,
      error: error.message || 'システムエラーが発生しました'
    };
  }
}

/**
 * 買い物リストをHTML形式で印刷用に整形
 */
export function formatShoppingListForPrint(shoppingList: any): string {
  const date = new Date().toLocaleDateString('ja-JP');
  
  let html = `
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>買い物リスト - AICHEFS</title>
  <style>
    body { font-family: 'Helvetica Neue', Arial, 'Hiragino Kaku Gothic ProN', 'Hiragino Sans', Meiryo, sans-serif; max-width: 800px; margin: 20px auto; padding: 20px; }
    h1 { color: #2563eb; border-bottom: 3px solid #2563eb; padding-bottom: 10px; }
    .meta { color: #666; font-size: 14px; margin-bottom: 20px; }
    .category { margin-bottom: 30px; page-break-inside: avoid; }
    .category-title { background: #f3f4f6; padding: 10px; font-weight: bold; font-size: 18px; border-left: 4px solid #2563eb; margin-bottom: 10px; }
    .item { padding: 8px 0; border-bottom: 1px solid #e5e7eb; display: flex; justify-content: space-between; }
    .item:last-child { border-bottom: none; }
    .item-name { font-weight: 500; }
    .item-quantity { color: #059669; font-weight: bold; }
    .checkbox { display: inline-block; width: 20px; height: 20px; border: 2px solid #d1d5db; margin-right: 10px; vertical-align: middle; }
    @media print { body { margin: 0; } .no-print { display: none; } }
  </style>
</head>
<body>
  <h1>🛒 買い物リスト</h1>
  <div class="meta">
    <p>作成日: ${date}</p>
    <p>合計: ${shoppingList.total_items}品目</p>
  </div>
  <button class="no-print" onclick="window.print()" style="background: #2563eb; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer; margin-bottom: 20px;">印刷する</button>
`;

  shoppingList.categories.forEach((category: any) => {
    html += `
  <div class="category">
    <div class="category-title">${category.category_name}</div>
`;
    category.items.forEach((item: any) => {
      html += `
    <div class="item">
      <span><span class="checkbox"></span><span class="item-name">${item.name}</span></span>
      <span class="item-quantity">${item.total_quantity}${item.unit}</span>
    </div>
`;
    });
    html += `
  </div>
`;
  });

  html += `
</body>
</html>
`;

  return html;
}
