import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { serveStatic } from 'hono/cloudflare-workers'

type Bindings = {
  DB?: D1Database;
}

type Json = Record<string, unknown>;

// ========================================
// index.html の内容をインライン化
// ========================================
const indexHtml = `<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Aメニュー - 毎日の献立を考える負担から解放</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
</head>
<body class="bg-gray-50">
    <div id="app" class="container mx-auto px-4 py-8 max-w-4xl">
        <!-- ヘッダー -->
        <header class="text-center mb-8">
            <h1 class="text-4xl font-bold text-gray-800 mb-2">
                <i class="fas fa-utensils mr-2"></i>
                Aメニュー
            </h1>
            <p class="text-gray-600">
                考えなくていい、悩まなくていい。<br>
                今日から1ヶ月分の晩ごはんが決まります。
            </p>
        </header>

        <!-- チャットエリア -->
        <div id="chat-container" class="bg-white rounded-lg shadow-lg p-6 mb-6">
            <div id="messages" class="space-y-4 mb-6"></div>
            <div id="input-area"></div>
        </div>

        <!-- 献立カレンダー（生成後に表示） -->
        <div id="calendar-container" class="hidden bg-white rounded-lg shadow-lg p-6">
            <h2 class="text-2xl font-bold mb-4">
                <i class="fas fa-calendar-alt mr-2"></i>
                1ヶ月分の献立
            </h2>
            <div id="calendar-content"></div>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js"></script>
    <script>
        const appState = {
            step: 0,
            data: {
                title: '',
                start_date: '',
                months: 1,
                members_count: 0,
                members: [],
                budget_tier_per_person: 500,
                budget_distribution: 'average',
                cooking_time_limit_min: 30,
                shopping_frequency: 'weekly',
                fish_frequency: 'normal',
                dislikes: [],
                allergies: { standard: [], free_text: [] }
            },
            planId: null
        };

        const questions = [
            {
                id: 'welcome',
                type: 'message',
                text: 'こんにちは！Aメニューへようこそ。<br>いくつかの質問に答えるだけで、1ヶ月分の晩ごはん献立が完成します。<br><br>準備はいいですか？',
                options: [{ label: 'はじめる', value: 'start' }]
            },
            {
                id: 'title',
                type: 'text',
                text: 'この献立のタイトルを教えてください（例：「岩間家」「我が家の献立」）',
                field: 'title',
                placeholder: '献立のタイトル'
            },
            {
                id: 'start_date',
                type: 'date',
                text: 'いつから始めますか？',
                field: 'start_date'
            },
            {
                id: 'months',
                type: 'choice',
                text: '何ヶ月分作りますか？',
                field: 'months',
                options: [
                    { label: '1ヶ月', value: 1 },
                    { label: '2ヶ月', value: 2 },
                    { label: '3ヶ月', value: 3 }
                ]
            },
            {
                id: 'members_count',
                type: 'number',
                text: '家族は何人ですか？',
                field: 'members_count',
                min: 1,
                max: 10
            },
            {
                id: 'budget',
                type: 'choice',
                text: '1人あたりの平均予算を選んでください',
                field: 'budget_tier_per_person',
                options: [
                    { label: '300円（超節約）', value: 300 },
                    { label: '500円（節約）', value: 500 },
                    { label: '800円（標準）', value: 800 },
                    { label: '1000円（やや贅沢）', value: 1000 },
                    { label: '1200円（贅沢）', value: 1200 },
                    { label: '1500円（ご褒美）', value: 1500 }
                ]
            },
            {
                id: 'time',
                type: 'choice',
                text: '平日の調理時間の目安は？',
                field: 'cooking_time_limit_min',
                options: [
                    { label: '15分', value: 15 },
                    { label: '30分', value: 30 },
                    { label: '45分', value: 45 },
                    { label: '60分', value: 60 }
                ]
            },
            {
                id: 'allergies',
                type: 'multi-choice',
                text: 'アレルギーはありますか？（複数選択可）',
                field: 'allergies.standard',
                options: [
                    { label: 'なし', value: 'none' },
                    { label: '卵', value: 'egg' },
                    { label: '乳', value: 'milk' },
                    { label: '小麦', value: 'wheat' },
                    { label: 'えび', value: 'shrimp' },
                    { label: 'かに', value: 'crab' },
                    { label: 'そば', value: 'buckwheat' },
                    { label: '落花生', value: 'peanut' }
                ]
            },
            {
                id: 'confirm',
                type: 'confirm',
                text: 'これで1ヶ月分の献立を作成します。よろしいですか？',
                summary: true
            }
        ];

        const messagesEl = document.getElementById('messages');
        const inputAreaEl = document.getElementById('input-area');
        const calendarContainerEl = document.getElementById('calendar-container');
        const calendarContentEl = document.getElementById('calendar-content');

        function addMessage(text, isBot = true) {
            const messageDiv = document.createElement('div');
            messageDiv.className = isBot ? 
                'flex items-start space-x-2' : 
                'flex items-start space-x-2 justify-end';
            
            const icon = isBot ? '<i class="fas fa-robot text-blue-500"></i>' : '<i class="fas fa-user text-green-500"></i>';
            const bgColor = isBot ? 'bg-blue-50' : 'bg-green-50';
            
            messageDiv.innerHTML = \`
                \${isBot ? icon : ''}
                <div class="\${bgColor} rounded-lg p-3 max-w-md">
                    <p class="text-gray-800">\${text}</p>
                </div>
                \${!isBot ? icon : ''}
            \`;
            
            messagesEl.appendChild(messageDiv);
            messagesEl.scrollTop = messagesEl.scrollHeight;
        }

        function showInput(question) {
            inputAreaEl.innerHTML = '';

            if (question.type === 'message') {
                const btnContainer = document.createElement('div');
                btnContainer.className = 'flex gap-2';
                question.options.forEach(opt => {
                    const btn = document.createElement('button');
                    btn.className = 'px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600';
                    btn.textContent = opt.label;
                    btn.onclick = () => nextStep();
                    btnContainer.appendChild(btn);
                });
                inputAreaEl.appendChild(btnContainer);
            }
            else if (question.type === 'text') {
                const input = document.createElement('input');
                input.type = 'text';
                input.className = 'w-full px-4 py-2 border rounded';
                input.placeholder = question.placeholder || '';
                
                const btn = document.createElement('button');
                btn.className = 'mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600';
                btn.textContent = '次へ';
                btn.onclick = () => {
                    if (input.value.trim()) {
                        appState.data[question.field] = input.value.trim();
                        addMessage(input.value, false);
                        nextStep();
                    }
                };
                
                inputAreaEl.appendChild(input);
                inputAreaEl.appendChild(btn);
            }
            else if (question.type === 'date') {
                const input = document.createElement('input');
                input.type = 'date';
                input.className = 'w-full px-4 py-2 border rounded';
                input.value = new Date().toISOString().split('T')[0];
                
                const btn = document.createElement('button');
                btn.className = 'mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600';
                btn.textContent = '次へ';
                btn.onclick = () => {
                    appState.data[question.field] = input.value;
                    addMessage(input.value, false);
                    nextStep();
                };
                
                inputAreaEl.appendChild(input);
                inputAreaEl.appendChild(btn);
            }
            else if (question.type === 'number') {
                const input = document.createElement('input');
                input.type = 'number';
                input.className = 'w-full px-4 py-2 border rounded';
                input.min = question.min || 1;
                input.max = question.max || 10;
                input.value = question.min || 1;
                
                const btn = document.createElement('button');
                btn.className = 'mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600';
                btn.textContent = '次へ';
                btn.onclick = () => {
                    appState.data[question.field] = parseInt(input.value);
                    if (question.field === 'members_count') {
                        appState.data.members = Array(parseInt(input.value)).fill(0).map(() => ({
                            gender: 'unknown',
                            age_band: 'adult'
                        }));
                    }
                    addMessage(input.value + '人', false);
                    nextStep();
                };
                
                inputAreaEl.appendChild(input);
                inputAreaEl.appendChild(btn);
            }
            else if (question.type === 'choice') {
                const btnContainer = document.createElement('div');
                btnContainer.className = 'flex flex-wrap gap-2';
                question.options.forEach(opt => {
                    const btn = document.createElement('button');
                    btn.className = 'px-4 py-2 bg-gray-100 border rounded hover:bg-blue-100';
                    btn.textContent = opt.label;
                    btn.onclick = () => {
                        appState.data[question.field] = opt.value;
                        addMessage(opt.label, false);
                        nextStep();
                    };
                    btnContainer.appendChild(btn);
                });
                inputAreaEl.appendChild(btnContainer);
            }
            else if (question.type === 'multi-choice') {
                const selected = new Set();
                const btnContainer = document.createElement('div');
                btnContainer.className = 'flex flex-wrap gap-2 mb-2';
                
                question.options.forEach(opt => {
                    const btn = document.createElement('button');
                    btn.className = 'px-4 py-2 bg-gray-100 border rounded hover:bg-blue-100';
                    btn.textContent = opt.label;
                    btn.onclick = () => {
                        if (opt.value === 'none') {
                            selected.clear();
                            btnContainer.querySelectorAll('button').forEach(b => b.classList.remove('bg-blue-200'));
                        } else {
                            if (selected.has(opt.value)) {
                                selected.delete(opt.value);
                                btn.classList.remove('bg-blue-200');
                            } else {
                                selected.add(opt.value);
                                btn.classList.add('bg-blue-200');
                            }
                        }
                    };
                    btnContainer.appendChild(btn);
                });
                
                const confirmBtn = document.createElement('button');
                confirmBtn.className = 'w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600';
                confirmBtn.textContent = '次へ';
                confirmBtn.onclick = () => {
                    appState.data.allergies.standard = Array.from(selected).filter(v => v !== 'none');
                    const msg = selected.size === 0 || selected.has('none') ? 'なし' : Array.from(selected).join(', ');
                    addMessage(msg, false);
                    nextStep();
                };
                
                inputAreaEl.appendChild(btnContainer);
                inputAreaEl.appendChild(confirmBtn);
            }
            else if (question.type === 'confirm') {
                const summary = \`
                    <div class="bg-gray-50 p-4 rounded mb-4">
                        <p><strong>タイトル:</strong> \${appState.data.title}</p>
                        <p><strong>開始日:</strong> \${appState.data.start_date}</p>
                        <p><strong>期間:</strong> \${appState.data.months}ヶ月</p>
                        <p><strong>人数:</strong> \${appState.data.members_count}人</p>
                        <p><strong>予算:</strong> \${appState.data.budget_tier_per_person}円/人</p>
                        <p><strong>調理時間:</strong> \${appState.data.cooking_time_limit_min}分</p>
                    </div>
                \`;
                inputAreaEl.innerHTML = summary;
                
                const btn = document.createElement('button');
                btn.className = 'w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600';
                btn.textContent = '献立を作成する';
                btn.onclick = async () => {
                    btn.disabled = true;
                    btn.textContent = '生成中...';
                    await generatePlan();
                };
                inputAreaEl.appendChild(btn);
            }
        }

        function nextStep() {
            if (appState.step < questions.length - 1) {
                appState.step++;
                const question = questions[appState.step];
                addMessage(question.text);
                showInput(question);
            }
        }

        async function generatePlan() {
            try {
                const householdRes = await axios.post('/api/households', appState.data);
                const household_id = householdRes.data.household_id;
                addMessage('家族プロファイルを作成しました！');

                const planRes = await axios.post('/api/plans/generate', { household_id });
                appState.planId = planRes.data.plan_id;
                addMessage('✨ 献立が完成しました！');
                
                document.getElementById('chat-container').classList.add('hidden');
                showCalendar(planRes.data.days);

            } catch (error) {
                console.error(error);
                addMessage('エラーが発生しました。もう一度お試しください。');
            }
        }

        function showCalendar(days) {
            calendarContainerEl.classList.remove('hidden');
            
            let html = '<div class="grid gap-4">';
            days.forEach(day => {
                const recipes = day.recipes || [];
                const main = recipes.find(r => r.role === 'main');
                const side = recipes.find(r => r.role === 'side');
                const soup = recipes.find(r => r.role === 'soup');

                html += \`
                    <div class="border rounded-lg p-4 hover:shadow-md transition">
                        <div class="font-bold text-lg mb-2">\${day.date}</div>
                        <div class="space-y-1 text-sm">
                            \${main ? \`<p><span class="text-red-600">●</span> \${main.title}</p>\` : ''}
                            \${side ? \`<p><span class="text-green-600">●</span> \${side.title}</p>\` : ''}
                            \${soup ? \`<p><span class="text-blue-600">●</span> \${soup.title}</p>\` : ''}
                        </div>
                        <div class="mt-2 text-xs text-gray-500">
                            <i class="far fa-clock"></i> \${day.estimated_time_min}分
                        </div>
                    </div>
                \`;
            });
            html += '</div>';
            
            calendarContentEl.innerHTML = html;
        }

        window.addEventListener('DOMContentLoaded', () => {
            const question = questions[0];
            addMessage(question.text);
            showInput(question);
        });
    </script>
</body>
</html>
`;

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

  // ========================================
  // ルートパス：index.htmlを返す
  // ========================================
  if (pathname === "/" || pathname === "/index.html") {
    return new Response(indexHtml, {
      headers: { 
        'content-type': 'text/html; charset=utf-8',
        'cache-control': 'public, max-age=3600'
      }
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
