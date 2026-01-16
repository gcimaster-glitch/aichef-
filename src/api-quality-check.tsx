import { Hono } from 'hono'

type Bindings = {
  DB: D1Database;
}

const app = new Hono<{ Bindings: Bindings }>()

// レシピ品質スコア計算API
app.get('/api/quality/recipe/:recipe_id', async (c) => {
  const { env } = c;
  const recipeId = c.req.param('recipe_id');
  
  try {
    // レシピ基本情報取得
    const recipe = await env.DB!.prepare(`
      SELECT 
        recipe_id, title, description, role, time_min, difficulty,
        steps_json, substitutes_json, tags_json, child_friendly_score
      FROM recipes
      WHERE recipe_id = ?
    `).bind(recipeId).first();
    
    if (!recipe) {
      return c.json({ error: 'Recipe not found' }, 404);
    }
    
    // 材料数取得
    const ingredientCount = await env.DB!.prepare(`
      SELECT COUNT(*) as count
      FROM recipe_ingredients
      WHERE recipe_id = ?
    `).bind(recipeId).first();
    
    // 品質スコア計算
    const qualityScore = calculateQualityScore(recipe, ingredientCount?.count || 0);
    
    return c.json({
      recipe_id: recipeId,
      title: recipe.title,
      quality_score: qualityScore.total,
      breakdown: qualityScore.breakdown,
      issues: qualityScore.issues,
      recommendations: qualityScore.recommendations
    });
    
  } catch (error: any) {
    console.error('Quality score error:', error);
    return c.json({ error: 'Internal server error', details: error.message }, 500);
  }
});

// 全レシピ品質レポート
app.get('/api/quality/report', async (c) => {
  const { env } = c;
  
  try {
    // 全レシピの統計
    const stats = await env.DB!.prepare(`
      SELECT 
        COUNT(*) as total_recipes,
        COUNT(CASE WHEN role = 'main' THEN 1 END) as main_count,
        COUNT(CASE WHEN role = 'side' THEN 1 END) as side_count,
        COUNT(CASE WHEN role = 'soup' THEN 1 END) as soup_count,
        AVG(child_friendly_score) as avg_child_friendly
      FROM recipes
    `).first();
    
    // 材料数異常チェック
    const abnormalIngredients = await env.DB!.prepare(`
      SELECT recipe_id, title, ingredient_count
      FROM (
        SELECT r.recipe_id, r.title, COUNT(ri.ingredient_id) as ingredient_count
        FROM recipes r
        LEFT JOIN recipe_ingredients ri ON r.recipe_id = ri.recipe_id
        GROUP BY r.recipe_id, r.title
      )
      WHERE ingredient_count < 3 OR ingredient_count > 19
      LIMIT 20
    `).all();
    
    // 手順なしレシピチェック
    const emptySteps = await env.DB!.prepare(`
      SELECT recipe_id, title
      FROM recipes
      WHERE steps_json IS NULL 
         OR steps_json = '[]' 
         OR LENGTH(steps_json) < 10
      LIMIT 20
    `).all();
    
    // 重複タイトルチェック
    const duplicates = await env.DB!.prepare(`
      SELECT title, COUNT(*) as count
      FROM recipes
      GROUP BY title
      HAVING COUNT(*) > 1
      LIMIT 20
    `).all();
    
    // 品質スコア分布
    const qualityDistribution = {
      excellent: 0,  // 90+
      good: 0,       // 70-89
      fair: 0,       // 50-69
      poor: 0        // <50
    };
    
    // 簡易品質スコア計算（全件）
    const allRecipes = await env.DB!.prepare(`
      SELECT r.recipe_id, r.title, r.steps_json, r.substitutes_json,
             COUNT(ri.ingredient_id) as ingredient_count
      FROM recipes r
      LEFT JOIN recipe_ingredients ri ON r.recipe_id = ri.recipe_id
      GROUP BY r.recipe_id, r.title, r.steps_json, r.substitutes_json
    `).all();
    
    allRecipes.results?.forEach((recipe: any) => {
      const score = calculateSimpleQualityScore(recipe);
      if (score >= 90) qualityDistribution.excellent++;
      else if (score >= 70) qualityDistribution.good++;
      else if (score >= 50) qualityDistribution.fair++;
      else qualityDistribution.poor++;
    });
    
    return c.json({
      summary: {
        total_recipes: stats?.total_recipes || 0,
        by_role: {
          main: stats?.main_count || 0,
          side: stats?.side_count || 0,
          soup: stats?.soup_count || 0
        },
        avg_child_friendly: Math.round((stats?.avg_child_friendly as number) || 0)
      },
      quality_distribution: qualityDistribution,
      issues: {
        abnormal_ingredients: abnormalIngredients.results || [],
        empty_steps: emptySteps.results || [],
        duplicates: duplicates.results || []
      },
      recommendations: generateRecommendations(
        abnormalIngredients.results?.length || 0,
        emptySteps.results?.length || 0,
        duplicates.results?.length || 0
      )
    });
    
  } catch (error: any) {
    console.error('Quality report error:', error);
    return c.json({ error: 'Internal server error', details: error.message }, 500);
  }
});

// 品質スコア計算関数
function calculateQualityScore(recipe: any, ingredientCount: number) {
  const scores = {
    completeness: 0,      // 完全性 (30点)
    accuracy: 0,          // 正確性 (25点)
    consistency: 0,       // 一貫性 (25点)
    usability: 0          // 使いやすさ (20点)
  };
  
  const issues: string[] = [];
  const recommendations: string[] = [];
  
  // 完全性チェック (30点)
  if (recipe.title) scores.completeness += 5;
  if (recipe.description && recipe.description.length > 10) scores.completeness += 5;
  if (ingredientCount >= 3) scores.completeness += 10;
  else issues.push('材料が少なすぎます（3個未満）');
  
  try {
    const steps = JSON.parse(recipe.steps_json || '[]');
    if (steps.length >= 2) scores.completeness += 10;
    else issues.push('手順が不足しています（2ステップ未満）');
  } catch {
    issues.push('手順データが不正です');
  }
  
  // 正確性チェック (25点)
  if (recipe.time_min > 0 && recipe.time_min <= 120) scores.accuracy += 10;
  if (ingredientCount <= 19) scores.accuracy += 10;
  else issues.push('材料が多すぎます（19個超）');
  if (['easy', 'normal', 'hard'].includes(recipe.difficulty)) scores.accuracy += 5;
  
  // 一貫性チェック (25点)
  if (['main', 'side', 'soup'].includes(recipe.role)) scores.consistency += 10;
  if (recipe.child_friendly_score >= 0 && recipe.child_friendly_score <= 100) {
    scores.consistency += 10;
  }
  if (ingredientCount > 0) scores.consistency += 5;
  
  // 使いやすさチェック (20点)
  try {
    const substitutes = JSON.parse(recipe.substitutes_json || '[]');
    if (substitutes.length > 0) {
      scores.usability += 10;
    } else {
      recommendations.push('代替食材を追加すると使いやすくなります');
    }
  } catch {}
  
  if (recipe.time_min <= 30) {
    scores.usability += 5;
    recommendations.push('30分以内の時短レシピです');
  }
  if (recipe.child_friendly_score >= 80) scores.usability += 5;
  
  const total = scores.completeness + scores.accuracy + scores.consistency + scores.usability;
  
  return {
    total,
    breakdown: scores,
    issues,
    recommendations,
    grade: total >= 90 ? 'A' : total >= 70 ? 'B' : total >= 50 ? 'C' : 'D'
  };
}

// 簡易品質スコア計算
function calculateSimpleQualityScore(recipe: any): number {
  let score = 50; // ベーススコア
  
  if (recipe.ingredient_count >= 3 && recipe.ingredient_count <= 19) score += 25;
  
  try {
    const steps = JSON.parse(recipe.steps_json || '[]');
    if (steps.length >= 2) score += 25;
  } catch {}
  
  return Math.min(100, score);
}

// 推奨事項生成
function generateRecommendations(abnormalCount: number, emptyStepsCount: number, duplicateCount: number): string[] {
  const recommendations = [];
  
  if (abnormalCount > 0) {
    recommendations.push(`${abnormalCount}件のレシピで材料数が異常です。3〜19個に調整してください。`);
  }
  
  if (emptyStepsCount > 0) {
    recommendations.push(`${emptyStepsCount}件のレシピで手順が不足しています。最低2ステップ以上追加してください。`);
  }
  
  if (duplicateCount > 0) {
    recommendations.push(`${duplicateCount}件の重複タイトルが検出されました。修正または削除してください。`);
  }
  
  if (recommendations.length === 0) {
    recommendations.push('全てのレシピが品質基準を満たしています。');
  }
  
  return recommendations;
}

export default app
