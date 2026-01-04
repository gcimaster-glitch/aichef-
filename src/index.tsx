import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { serveStatic } from 'hono/cloudflare-workers'

type Bindings = {
  DB?: D1Database;
}

type Json = Record<string, unknown>;

const app = new Hono<{ Bindings: Bindings }>()

// CORS有効化
app.use('/api/*', cors())

// 静的ファイル配信
app.use('/static/*', serveStatic({ root: './public' }))

// ========================================
// ユーティリティ関数
// ========================================

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
    },
  });
}

function badRequest(message: string, details?: unknown) {
  return json({ error: { message, details } }, 400);
}

function uuid() {
  return crypto.randomUUID();
}

async function readJson(req: Request) {
  const ct = req.headers.get("content-type") || "";
  if (!ct.includes("application/json")) throw new Error("Content-Type must be application/json");
  return (await req.json()) as Json;
}

function safeJsonParse<T>(s: unknown, fallback: T): T {
  try {
    if (typeof s !== "string") return fallback;
    return JSON.parse(s) as T;
  } catch {
    return fallback;
  }
}

// 日付操作関数
function parseYMD(ymd: string): Date {
  const [y, m, d] = ymd.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d));
}

function formatYMD(dt: Date): string {
  const y = dt.getUTCFullYear();
  const m = String(dt.getUTCMonth() + 1).padStart(2, "0");
  const d = String(dt.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function addDays(ymd: string, days: number): string {
  const dt = parseYMD(ymd);
  dt.setUTCDate(dt.getUTCDate() + days);
  return formatYMD(dt);
}

function addMonths(ymd: string, months: number): string {
  const dt = parseYMD(ymd);
  const y = dt.getUTCFullYear();
  const m = dt.getUTCMonth();
  const d = dt.getUTCDate();
  const base = new Date(Date.UTC(y, m, 1));
  base.setUTCMonth(base.getUTCMonth() + months);
  const y2 = base.getUTCFullYear();
  const m2 = base.getUTCMonth();
  const lastDay = new Date(Date.UTC(y2, m2 + 1, 0)).getUTCDate();
  const day = Math.min(d, lastDay);
  return formatYMD(new Date(Date.UTC(y2, m2, day)));
}

function rangeDates(startYMD: string, endYMD: string): string[] {
  const out: string[] = [];
  let cur = startYMD;
  while (cur <= endYMD) {
    out.push(cur);
    cur = addDays(cur, 1);
  }
  return out;
}

function buildPeriod(start_date: string, months: number) {
  const end_exclusive = addMonths(start_date, months);
  const period_end = addDays(end_exclusive, -1);
  const dates = rangeDates(start_date, period_end);
  return { period_start: start_date, period_end, dates };
}

// ========================================
// ルーティング
// ========================================

async function route(req: Request, env: Bindings): Promise<Response> {
  const url = new URL(req.url);
  const { pathname } = url;

  // ヘルスチェック
  if (pathname === "/api/health") {
    return json({ ok: true, db: !!env.DB });
  }

  // D1チェック
  if (!env.DB) {
    return json({ error: { message: "Database not configured" } }, 500);
  }

  // ========================================
  // 家族プロファイル作成
  // ========================================
  if (pathname === "/api/households" && req.method === "POST") {
    const body = await readJson(req);
    
    // 必須フィールドチェック
    const required = [
      "title", "members_count", "members", "start_date", "months",
      "budget_tier_per_person", "budget_distribution", "dislikes", "allergies"
    ];
    for (const f of required) {
      if (!(f in body)) return badRequest(`Missing required field: ${f}`);
    }

    const household_id = uuid();

    const season = (body.season as string) || null;
    const cooking = (body.cooking_time_limit_min as number) || 30;
    const shopping = (body.shopping_frequency as string) || "weekly";
    const fish = (body.fish_frequency as string) || "normal";

    const dislikesJson = JSON.stringify(body.dislikes ?? []);
    const allergiesStd = JSON.stringify((body.allergies as any)?.standard ?? []);
    const allergiesFree = JSON.stringify((body.allergies as any)?.free_text ?? []);

    await env.DB.prepare(
      `INSERT INTO households
       (household_id, title, members_count, start_date, months, season,
        budget_tier_per_person, budget_distribution, cooking_time_limit_min,
        shopping_frequency, fish_frequency,
        dislikes_json, allergies_standard_json, allergies_free_text_json)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).bind(
      household_id,
      body.title,
      body.members_count,
      body.start_date,
      body.months,
      season,
      body.budget_tier_per_person,
      body.budget_distribution,
      cooking,
      shopping,
      fish,
      dislikesJson,
      allergiesStd,
      allergiesFree
    ).run();

    // メンバー保存
    const members = (body.members as any[]) || [];
    for (let i = 0; i < members.length; i++) {
      const m = members[i];
      await env.DB.prepare(
        `INSERT INTO household_members (household_id, member_index, gender, age_band)
         VALUES (?, ?, ?, ?)`
      ).bind(household_id, i, m.gender ?? "unknown", m.age_band ?? "adult").run();
    }

    return json({ household_id }, 201);
  }

  // ========================================
  // 家族プロファイル取得
  // ========================================
  if (pathname.match(/^\/api\/households\/[^/]+$/) && req.method === "GET") {
    const household_id = pathname.split("/").pop();
    
    const household = await env.DB.prepare(
      `SELECT * FROM households WHERE household_id = ?`
    ).bind(household_id).first();

    if (!household) return badRequest("household not found");

    const members = await env.DB.prepare(
      `SELECT * FROM household_members WHERE household_id = ? ORDER BY member_index`
    ).bind(household_id).all();

    return json({
      ...(household as any),
      members: members.results || []
    });
  }

  // ========================================
  // 献立生成（簡易版：サンプルレシピから3品セット）
  // ========================================
  if (pathname === "/api/plans/generate" && req.method === "POST") {
    const body = await readJson(req);
    if (!body.household_id) return badRequest("household_id is required");

    const household = await env.DB.prepare(
      `SELECT * FROM households WHERE household_id = ?`
    ).bind(body.household_id).first() as any;

    if (!household) return badRequest("household not found");

    const plan_id = uuid();
    
    // 期間計算
    const period = buildPeriod(household.start_date, household.months);
    
    // サンプル：毎日同じ3品を返す簡易実装（MVP）
    const main = await env.DB.prepare(
      `SELECT * FROM recipes WHERE role='main' LIMIT 1`
    ).first() as any;
    
    const side = await env.DB.prepare(
      `SELECT * FROM recipes WHERE role='side' LIMIT 1`
    ).first() as any;
    
    const soup = await env.DB.prepare(
      `SELECT * FROM recipes WHERE role='soup' LIMIT 1`
    ).first() as any;

    if (!main || !side || !soup) {
      return badRequest("Not enough recipes in database");
    }

    // プラン作成
    await env.DB.prepare(
      `INSERT INTO meal_plans (plan_id, household_id, start_date, months, status)
       VALUES (?, ?, ?, ?, 'generated')`
    ).bind(plan_id, body.household_id, household.start_date, household.months).run();

    // 各日の献立作成
    const days: any[] = [];
    for (const date of period.dates) {
      const plan_day_id = uuid();
      
      await env.DB.prepare(
        `INSERT INTO meal_plan_days (plan_day_id, plan_id, date, estimated_time_min, estimated_cost_tier, note)
         VALUES (?, ?, ?, ?, ?, ?)`
      ).bind(
        plan_day_id,
        plan_id,
        date,
        main.time_min + side.time_min + soup.time_min,
        household.budget_tier_per_person,
        ""
      ).run();

      // レシピ紐付け
      await env.DB.prepare(
        `INSERT INTO meal_plan_day_recipes (plan_day_id, role, recipe_id) VALUES (?, ?, ?)`
      ).bind(plan_day_id, "main", main.recipe_id).run();
      
      await env.DB.prepare(
        `INSERT INTO meal_plan_day_recipes (plan_day_id, role, recipe_id) VALUES (?, ?, ?)`
      ).bind(plan_day_id, "side", side.recipe_id).run();
      
      await env.DB.prepare(
        `INSERT INTO meal_plan_day_recipes (plan_day_id, role, recipe_id) VALUES (?, ?, ?)`
      ).bind(plan_day_id, "soup", soup.recipe_id).run();

      days.push({
        date,
        recipes: [
          { role: "main", recipe_id: main.recipe_id, title: main.title },
          { role: "side", recipe_id: side.recipe_id, title: side.title },
          { role: "soup", recipe_id: soup.recipe_id, title: soup.title }
        ]
      });
    }

    return json({ plan_id, days }, 201);
  }

  // ========================================
  // 献立取得
  // ========================================
  if (pathname.match(/^\/api\/plans\/[^/]+$/) && req.method === "GET") {
    const plan_id = pathname.split("/").pop();
    
    const plan = await env.DB.prepare(
      `SELECT * FROM meal_plans WHERE plan_id = ?`
    ).bind(plan_id).first() as any;

    if (!plan) return badRequest("plan not found");

    const days = await env.DB.prepare(
      `SELECT d.plan_day_id, d.date, d.estimated_time_min, d.estimated_cost_tier, d.note
       FROM meal_plan_days d
       WHERE d.plan_id = ?
       ORDER BY d.date ASC`
    ).bind(plan_id).all();

    const resultDays: any[] = [];
    for (const row of (days.results ?? []) as any[]) {
      const rs = await env.DB.prepare(
        `SELECT r.role, r.recipe_id, rc.title
         FROM meal_plan_day_recipes r
         JOIN recipes rc ON rc.recipe_id = r.recipe_id
         WHERE r.plan_day_id = ?
         ORDER BY CASE r.role WHEN 'main' THEN 1 WHEN 'side' THEN 2 ELSE 3 END`
      ).bind(row.plan_day_id).all();

      resultDays.push({
        date: row.date,
        recipes: (rs.results ?? []).map((x: any) => ({ 
          role: x.role, 
          recipe_id: x.recipe_id, 
          title: x.title 
        })),
        estimated_time_min: row.estimated_time_min,
        estimated_cost_tier: row.estimated_cost_tier,
        note: row.note,
      });
    }

    return json({
      plan_id: plan.plan_id,
      household_id: plan.household_id,
      start_date: plan.start_date,
      months: plan.months,
      days: resultDays,
    });
  }

  return json({ error: { message: "Not Found" } }, 404);
}

app.all("*", async (c) => {
  try {
    return await route(c.req.raw, c.env);
  } catch (e: any) {
    return json({ error: { message: e?.message ?? "Internal Error" } }, 500);
  }
});

export default app
