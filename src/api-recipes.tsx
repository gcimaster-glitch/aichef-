import { Hono } from 'hono'

type Bindings = {
  DB: D1Database;
}

const app = new Hono<{ Bindings: Bindings }>()

// レシピ詳細API - 材料と手順を含む完全なレシピデータ
app.get('/api/recipes/:recipe_id', async (c) => {
  const { env } = c;
  const recipeId = c.req.param('recipe_id');

  try {
    // レシピ基本情報を取得
    const recipe = await env.DB.prepare(`
      SELECT 
        recipe_id,
        title,
        description,
        role,
        time_minutes,
        difficulty,
        cuisine_type,
        primary_protein,
        cost_tier,
        child_friendly_score,
        steps_json,
        possible_substitutes,
        tags,
        created_at,
        updated_at
      FROM recipes
      WHERE recipe_id = ?
    `).bind(recipeId).first();

    if (!recipe) {
      return c.json({ error: 'Recipe not found' }, 404);
    }

    // 材料を取得
    const ingredients = await env.DB.prepare(`
      SELECT 
        i.ingredient_id,
        i.name,
        i.category,
        ri.quantity,
        ri.unit
      FROM recipe_ingredients ri
      JOIN ingredients i ON ri.ingredient_id = i.ingredient_id
      WHERE ri.recipe_id = ?
      ORDER BY ri.quantity DESC
    `).bind(recipeId).all();

    // 手順をパース
    let steps = [];
    try {
      steps = JSON.parse(recipe.steps_json || '[]');
    } catch (e) {
      console.error('Failed to parse steps_json:', e);
      steps = [];
    }

    // 代用可能な食材をパース
    let substitutes = [];
    try {
      if (recipe.possible_substitutes) {
        substitutes = JSON.parse(recipe.possible_substitutes);
      }
    } catch (e) {
      console.error('Failed to parse substitutes:', e);
      substitutes = [];
    }

    // タグをパース
    let tags = [];
    try {
      if (recipe.tags) {
        tags = JSON.parse(recipe.tags);
      }
    } catch (e) {
      console.error('Failed to parse tags:', e);
      tags = [];
    }

    // レスポンスを構築
    return c.json({
      recipe_id: recipe.recipe_id,
      title: recipe.title,
      description: recipe.description,
      role: recipe.role,
      time_minutes: recipe.time_minutes,
      difficulty: recipe.difficulty,
      cuisine_type: recipe.cuisine_type,
      primary_protein: recipe.primary_protein,
      cost_tier: recipe.cost_tier,
      child_friendly_score: recipe.child_friendly_score,
      ingredients: ingredients.results?.map((ing: any) => ({
        ingredient_id: ing.ingredient_id,
        name: ing.name,
        category: ing.category,
        quantity: ing.quantity,
        unit: ing.unit
      })) || [],
      steps: steps,
      substitutes: substitutes,
      tags: tags,
      created_at: recipe.created_at,
      updated_at: recipe.updated_at
    });

  } catch (error: any) {
    console.error('Recipe API error:', error);
    return c.json({ error: 'Internal server error', details: error.message }, 500);
  }
});

// レシピ統計API
app.get('/api/recipes/stats', async (c) => {
  const { env } = c;

  try {
    const stats = await env.DB.prepare(`
      SELECT 
        COUNT(*) as total,
        COUNT(CASE WHEN role = 'main' THEN 1 END) as main_count,
        COUNT(CASE WHEN role = 'side' THEN 1 END) as side_count,
        COUNT(CASE WHEN role = 'soup' THEN 1 END) as soup_count,
        AVG(time_minutes) as avg_time,
        AVG(child_friendly_score) as avg_child_friendly
      FROM recipes
    `).first();

    const ingredientCount = await env.DB.prepare(`
      SELECT COUNT(*) as total FROM ingredients
    `).first();

    return c.json({
      recipes: {
        total: stats?.total || 0,
        main: stats?.main_count || 0,
        side: stats?.side_count || 0,
        soup: stats?.soup_count || 0
      },
      ingredients: {
        total: ingredientCount?.total || 0
      },
      averages: {
        time_minutes: Math.round(stats?.avg_time || 0),
        child_friendly_score: Math.round(stats?.avg_child_friendly || 0)
      }
    });

  } catch (error: any) {
    console.error('Stats API error:', error);
    return c.json({ error: 'Internal server error', details: error.message }, 500);
  }
});

// カテゴリ別レシピ一覧API
app.get('/api/recipes/category/:role', async (c) => {
  const { env } = c;
  const role = c.req.param('role');
  const limit = parseInt(c.req.query('limit') || '50');
  const offset = parseInt(c.req.query('offset') || '0');

  if (!['main', 'side', 'soup'].includes(role)) {
    return c.json({ error: 'Invalid role' }, 400);
  }

  try {
    const recipes = await env.DB.prepare(`
      SELECT 
        recipe_id,
        title,
        description,
        time_minutes,
        difficulty,
        primary_protein,
        cost_tier,
        child_friendly_score
      FROM recipes
      WHERE role = ?
      ORDER BY recipe_id
      LIMIT ? OFFSET ?
    `).bind(role, limit, offset).all();

    return c.json({
      role: role,
      count: recipes.results?.length || 0,
      recipes: recipes.results || []
    });

  } catch (error: any) {
    console.error('Category API error:', error);
    return c.json({ error: 'Internal server error', details: error.message }, 500);
  }
});

export default app
