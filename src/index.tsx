import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { serveStatic } from 'hono/cloudflare-workers'

type Bindings = {
  DB: D1Database
  OPENAI_API_KEY: string
}

const app = new Hono<{ Bindings: Bindings }>()

// CORS設定
app.use('/api/*', cors())

// 静的ファイル配信
app.use('/static/*', serveStatic({ root: './public' }))
app.use('/images/*', serveStatic({ root: './public' }))
app.use('/landing.html', serveStatic({ path: './public/landing.html' }))

// メインページ
app.get('/app', (c) => {
  return c.html(`
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AICHEFS - AI献立アシスタント</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
    <style>
        body {
            font-family: 'Hiragino Sans', 'Hiragino Kaku Gothic ProN', 'Yu Gothic', 'Meiryo', sans-serif;
        }
        
        .gradient-bg {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
        
        .fade-in {
            animation: fadeIn 0.5s ease-in;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        .modal {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            backdrop-filter: blur(4px);
            z-index: 1000;
        }
        
        .modal.active {
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        @media print {
            .no-print { display: none !important; }
            body { font-size: 10pt; }
        }
    </style>
</head>
<body class="bg-gray-50">
    <!-- ヘッダー -->
    <header class="gradient-bg text-white py-8 no-print">
        <div class="container mx-auto px-4 max-w-6xl">
            <h1 class="text-4xl font-bold text-center">
                <i class="fas fa-utensils mr-3"></i>AICHEFS
            </h1>
            <p class="text-center mt-2 text-lg">AIシェフ - 毎日の献立を考える負担から解放</p>
            <p class="text-center mt-1">考えなくていい。悩まなくていい。今日から晩ごはんが決まります。</p>
        </div>
    </header>

    <!-- メインコンテンツ -->
    <main class="container mx-auto px-4 py-8 max-w-6xl">
        <!-- 質問エリア -->
        <div id="question-area" class="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <div id="messages" class="mb-6 space-y-4"></div>
            <div id="input-area"></div>
        </div>

        <!-- カレンダーエリア（非表示） -->
        <div id="calendar-container" class="hidden"></div>

        <!-- 会員登録モーダル -->
        <div id="auth-modal" class="modal">
            <div class="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4">
                <h2 class="text-2xl font-bold text-gray-800 mb-6 text-center">
                    <i class="fas fa-user-circle mr-2 text-purple-600"></i>会員登録
                </h2>
                <div id="auth-content">
                    <p class="text-gray-600 mb-6 text-center">印刷・ダウンロード機能を使用するには会員登録が必要です</p>
                    <form id="auth-form" class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">
                                氏名 <span class="text-red-500">*</span>
                            </label>
                            <input type="text" id="auth-name" required 
                                   class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                   placeholder="山田 太郎">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">
                                メールアドレス <span class="text-red-500">*</span>
                            </label>
                            <input type="email" id="auth-email" required 
                                   class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                   placeholder="example@email.com">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">
                                パスワード <span class="text-red-500">*</span>
                            </label>
                            <input type="password" id="auth-password" required 
                                   class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                   placeholder="8文字以上">
                        </div>
                        <button type="submit" 
                                class="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-indigo-700 transition">
                            <i class="fas fa-user-plus mr-2"></i>登録して続ける
                        </button>
                    </form>
                </div>
            </div>
        </div>

        <!-- 献立生成モーダル -->
        <div id="loading-modal" class="modal">
            <div class="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 text-center">
                <div class="mb-6">
                    <i class="fas fa-spinner fa-spin text-6xl text-purple-600"></i>
                </div>
                <h3 class="text-2xl font-bold text-gray-800 mb-4">献立を作成中...</h3>
                <p class="text-gray-600" id="loading-message">レシピデータベースを検索しています</p>
                <div class="mt-6 bg-gray-200 rounded-full h-2">
                    <div id="loading-progress" class="bg-gradient-to-r from-purple-600 to-indigo-600 h-2 rounded-full transition-all duration-500" style="width: 0%"></div>
                </div>
            </div>
        </div>
    </main>

    <script src="https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js"></script>
    <script>
        // アプリケーション状態
        const appState = {
            step: 0,
            planId: null,
            data: {
                title: '',
                start_date: '',
                plan_days: 30,
                members_count: 1,
                members: [],
                budget_tier_per_person: 500,
                cooking_time_limit_min: 30,
                dislikes: [],
                allergies: { standard: [], free_text: [] }
            }
        };

        // 質問定義
        const questions = [
            {
                id: 'consent',
                type: 'choice',
                text: '⚠️ アレルギー情報の取り扱いについて\\n\\nアレルギー情報は命に関わる重要な情報です。以下の点にご注意ください：\\n\\n• 本システムはアレルギー物質の完全な除外を保証するものではありません\\n• データベースの食材情報には限界があります\\n• 調理時の交差汚染（コンタミネーション）は考慮されていません\\n• 必ず食品ラベルを確認し、自己責任でご使用ください\\n\\n上記の内容に同意しますか？',
                field: 'consent',
                options: [
                    { label: '✅ 同意して続ける', value: 'yes' },
                    { label: '❌ 同意しない（トップへ戻る）', value: 'no' }
                ]
            },
            {
                id: 'start_date',
                type: 'date',
                text: '献立の開始日を教えてください',
                field: 'start_date',
                condition: () => appState.data.consent === 'yes'
            },
            {
                id: 'plan_days',
                type: 'choice',
                text: '何日分の献立が必要ですか？',
                field: 'plan_days',
                options: [
                    { label: '1週間（7日）', value: 7 },
                    { label: '2週間（14日）', value: 14 },
                    { label: '3週間（21日）', value: 21 },
                    { label: '1ヶ月（30日）', value: 30 }
                ],
                condition: () => appState.data.consent === 'yes'
            },
            {
                id: 'members_count',
                type: 'number',
                text: '家族の人数を教えてください',
                field: 'members_count',
                min: 1,
                max: 10,
                condition: () => appState.data.consent === 'yes'
            },
            {
                id: 'allergies',
                type: 'multi-choice',
                text: '⚠️ アレルギーをお持ちですか？（複数選択可）',
                field: 'allergies.standard',
                options: [
                    { label: 'なし', value: 'none' },
                    { label: '🥚 卵', value: 'egg' },
                    { label: '🥛 乳製品', value: 'milk' },
                    { label: '🌾 小麦', value: 'wheat' },
                    { label: '🦐 エビ', value: 'shrimp' },
                    { label: '🦀 カニ', value: 'crab' },
                    { label: '🍜 そば', value: 'buckwheat' },
                    { label: '🥜 ピーナッツ', value: 'peanut' }
                ],
                condition: () => appState.data.consent === 'yes'
            },
            {
                id: 'dislikes',
                type: 'multi-choice',
                text: '苦手な食材はありますか？（複数選択可）',
                field: 'dislikes',
                options: [
                    { label: 'なし', value: 'none' },
                    { label: '🐟 魚全般', value: 'fish' },
                    { label: '🦐 エビ', value: 'shrimp' },
                    { label: '🦀 カニ', value: 'crab' },
                    { label: '🐙 タコ', value: 'octopus' },
                    { label: '🦑 イカ', value: 'squid' },
                    { label: '🦪 貝類', value: 'shellfish' },
                    { label: '🥩 ホルモン', value: 'offal' }
                ],
                condition: () => appState.data.consent === 'yes'
            },
            {
                id: 'confirm',
                type: 'confirm',
                text: '設定完了です！これで献立を作成します。よろしいですか？',
                summary: true,
                condition: () => appState.data.consent === 'yes'
            }
        ];

        // DOM要素
        const messagesEl = document.getElementById('messages');
        const inputAreaEl = document.getElementById('input-area');
        const calendarContainerEl = document.getElementById('calendar-container');
        const authModal = document.getElementById('auth-modal');
        const loadingModal = document.getElementById('loading-modal');

        // メッセージ追加
        function addMessage(text, isBot = true) {
            const messageDiv = document.createElement('div');
            messageDiv.className = 'flex items-start gap-3 fade-in ' + (isBot ? '' : 'flex-row-reverse');
            
            const icon = '<div class="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white flex-shrink-0">' +
                         '<i class="fas fa-' + (isBot ? 'robot' : 'user') + '"></i></div>';
            
            const bubble = '<div class="bg-' + (isBot ? 'gray-100' : 'purple-100') + ' rounded-lg p-4 max-w-md">' +
                          '<p class="text-gray-800 whitespace-pre-wrap">' + text + '</p></div>';
            
            messageDiv.innerHTML = (isBot ? icon : '') + bubble + (isBot ? '' : icon);
            messagesEl.appendChild(messageDiv);
            messagesEl.scrollTop = messagesEl.scrollHeight;
        }

        // 入力表示
        function showInput(question) {
            inputAreaEl.innerHTML = '';
            
            if (question.type === 'choice') {
                const container = document.createElement('div');
                container.className = 'space-y-2 max-w-lg mx-auto';
                
                question.options.forEach(opt => {
                    const button = document.createElement('button');
                    button.className = 'w-full text-left px-6 py-4 bg-white border-2 border-gray-200 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition flex items-center gap-3';
                    button.innerHTML = '<span class="text-lg">' + opt.label + '</span>';
                    button.onclick = () => {
                        if (opt.value === 'no') {
                            window.location.href = '/';
                            return;
                        }
                        appState.data[question.field] = opt.value;
                        addMessage(opt.label, false);
                        nextStep();
                    };
                    container.appendChild(button);
                });
                
                inputAreaEl.appendChild(container);
            } else if (question.type === 'multi-choice') {
                const selected = new Set();
                const container = document.createElement('div');
                container.className = 'space-y-2 max-w-lg mx-auto';
                
                question.options.forEach(opt => {
                    const button = document.createElement('button');
                    button.className = 'w-full text-left px-6 py-4 bg-white border-2 border-gray-200 rounded-lg hover:border-purple-500 transition flex items-center gap-3';
                    button.innerHTML = '<div class="w-5 h-5 border-2 border-gray-300 rounded flex items-center justify-center">' +
                                      '<i class="fas fa-check text-purple-600 hidden"></i></div>' +
                                      '<span class="text-lg">' + opt.label + '</span>';
                    button.onclick = () => {
                        if (opt.value === 'none') {
                            selected.clear();
                            selected.add('none');
                            container.querySelectorAll('button').forEach(b => {
                                b.classList.remove('border-purple-500', 'bg-purple-50');
                                b.querySelector('i').classList.add('hidden');
                            });
                            button.classList.add('border-purple-500', 'bg-purple-50');
                            button.querySelector('i').classList.remove('hidden');
                        } else {
                            selected.delete('none');
                            if (selected.has(opt.value)) {
                                selected.delete(opt.value);
                                button.classList.remove('border-purple-500', 'bg-purple-50');
                                button.querySelector('i').classList.add('hidden');
                            } else {
                                selected.add(opt.value);
                                button.classList.add('border-purple-500', 'bg-purple-50');
                                button.querySelector('i').classList.remove('hidden');
                            }
                        }
                    };
                    container.appendChild(button);
                });
                
                const confirmBtn = document.createElement('button');
                confirmBtn.className = 'w-full mt-4 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-indigo-700 transition';
                confirmBtn.innerHTML = '<i class="fas fa-arrow-right mr-2"></i>次へ';
                confirmBtn.onclick = () => {
                    const values = Array.from(selected).filter(v => v !== 'none');
                    if (question.field === 'allergies.standard') {
                        appState.data.allergies.standard = values;
                    } else {
                        appState.data[question.field] = values;
                    }
                    const message = values.length === 0 ? 'なし' : values.map(v => {
                        const opt = question.options.find(o => o.value === v);
                        return opt ? opt.label : v;
                    }).join(', ');
                    addMessage(message, false);
                    nextStep();
                };
                container.appendChild(confirmBtn);
                inputAreaEl.appendChild(container);
            } else if (question.type === 'date') {
                const container = document.createElement('div');
                container.className = 'max-w-lg mx-auto';
                
                const input = document.createElement('input');
                input.type = 'date';
                input.className = 'w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200';
                input.value = new Date().toISOString().split('T')[0];
                container.appendChild(input);
                
                const button = document.createElement('button');
                button.className = 'w-full mt-4 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-indigo-700 transition';
                button.innerHTML = '<i class="fas fa-arrow-right mr-2"></i>次へ';
                button.onclick = () => {
                    appState.data[question.field] = input.value;
                    addMessage(input.value, false);
                    nextStep();
                };
                container.appendChild(button);
                inputAreaEl.appendChild(container);
            } else if (question.type === 'number') {
                const container = document.createElement('div');
                container.className = 'max-w-lg mx-auto';
                
                const input = document.createElement('input');
                input.type = 'number';
                input.min = question.min || 1;
                input.max = question.max || 10;
                input.value = question.min || 1;
                input.className = 'w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 text-center text-2xl font-bold';
                container.appendChild(input);
                
                const button = document.createElement('button');
                button.className = 'w-full mt-4 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-indigo-700 transition';
                button.innerHTML = '<i class="fas fa-arrow-right mr-2"></i>次へ';
                button.onclick = () => {
                    const value = parseInt(input.value);
                    appState.data[question.field] = value;
                    if (question.field === 'members_count') {
                        appState.data.members = Array(value).fill({ gender: 'unknown', age_band: 'adult' });
                    }
                    addMessage(value + '人', false);
                    nextStep();
                };
                container.appendChild(button);
                inputAreaEl.appendChild(container);
            } else if (question.type === 'confirm') {
                const container = document.createElement('div');
                container.className = 'max-w-lg mx-auto';
                
                const summary = document.createElement('div');
                summary.className = 'bg-gray-50 rounded-lg p-6 mb-4 space-y-2';
                
                const periodLabel = appState.data.plan_days === 30 ? '1ヶ月（30日）' :
                                   appState.data.plan_days === 21 ? '3週間（21日）' :
                                   appState.data.plan_days === 14 ? '2週間（14日）' :
                                   appState.data.plan_days === 7 ? '1週間（7日）' :
                                   appState.data.plan_days + '日間';
                
                summary.innerHTML = '<p><strong>開始日:</strong> ' + appState.data.start_date + '</p>' +
                                   '<p><strong>期間:</strong> ' + periodLabel + '</p>' +
                                   '<p><strong>人数:</strong> ' + appState.data.members_count + '人</p>' +
                                   '<p><strong>アレルギー:</strong> ' + (appState.data.allergies.standard.length === 0 ? 'なし' : appState.data.allergies.standard.join(', ')) + '</p>' +
                                   '<p><strong>苦手な食材:</strong> ' + (appState.data.dislikes.length === 0 ? 'なし' : appState.data.dislikes.join(', ')) + '</p>';
                
                container.appendChild(summary);
                
                const button = document.createElement('button');
                button.className = 'w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-indigo-700 transition';
                button.innerHTML = '<i class="fas fa-check-circle mr-2"></i>献立を作成する';
                button.onclick = () => generatePlan();
                container.appendChild(button);
                inputAreaEl.appendChild(container);
            }
        }

        // 次のステップ
        function nextStep() {
            appState.step++;
            
            // 条件に合う次の質問を探す
            while (appState.step < questions.length) {
                const q = questions[appState.step];
                if (!q.condition || q.condition()) {
                    addMessage(q.text);
                    showInput(q);
                    return;
                }
                appState.step++;
            }
        }

        // 献立生成
        async function generatePlan() {
            loadingModal.classList.add('active');
            const loadingMsg = document.getElementById('loading-message');
            const loadingProg = document.getElementById('loading-progress');
            
            loadingProg.style.width = '33%';
            loadingMsg.textContent = 'レシピデータベースを検索しています...';
            
            setTimeout(() => {
                loadingProg.style.width = '66%';
                loadingMsg.textContent = '栄養バランスを調整しています...';
            }, 1000);
            
            try {
                const response = await axios.post('/api/plans/generate', {
                    ...appState.data,
                    title: 'My献立 ' + appState.data.start_date,
                    household_id: 'demo-household-' + Date.now()
                });
                
                loadingProg.style.width = '100%';
                loadingMsg.textContent = '献立が完成しました！';
                
                setTimeout(() => {
                    loadingModal.classList.remove('active');
                    appState.planId = response.data.plan_id;
                    showCalendar(response.data.days);
                }, 500);
            } catch (error) {
                console.error('Error:', error);
                loadingModal.classList.remove('active');
                alert('エラーが発生しました。もう一度お試しください。');
            }
        }

        // カレンダー表示
        function showCalendar(days) {
            document.getElementById('question-area').classList.add('hidden');
            calendarContainerEl.classList.remove('hidden');
            
            let html = '<div class="bg-white rounded-2xl shadow-xl p-8">';
            html += '<h2 class="text-3xl font-bold text-gray-800 mb-6 text-center">';
            html += '<i class="fas fa-calendar-alt mr-2 text-purple-600"></i>あなたの献立カレンダー';
            html += '</h2>';
            
            html += '<div class="mb-6 flex gap-4 justify-center no-print">';
            html += '<button onclick="window.print()" class="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">';
            html += '<i class="fas fa-print mr-2"></i>印刷する';
            html += '</button>';
            html += '<button onclick="downloadCalendar()" class="px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition">';
            html += '<i class="fas fa-download mr-2"></i>カレンダーダウンロード';
            html += '</button>';
            html += '</div>';
            
            html += '<div class="space-y-4">';
            days.forEach((day, index) => {
                const date = new Date(day.date);
                const dayOfWeek = ['日', '月', '火', '水', '木', '金', '土'][date.getDay()];
                const recipes = day.recipes || [];
                const main = recipes.find(r => r.role === 'main');
                const side = recipes.find(r => r.role === 'side');
                const soup = recipes.find(r => r.role === 'soup');
                
                html += '<div class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">';
                html += '<div class="flex justify-between items-center mb-3">';
                html += '<div class="text-lg font-bold text-gray-800">' + day.date + ' (' + dayOfWeek + ')</div>';
                html += '<div class="text-sm text-gray-500">約' + (day.estimated_time_min || 30) + '分</div>';
                html += '</div>';
                html += '<div class="space-y-2">';
                if (main) html += '<div><span class="text-red-600 font-semibold">主菜:</span> ' + main.title + '</div>';
                if (side) html += '<div><span class="text-green-600 font-semibold">副菜:</span> ' + side.title + '</div>';
                if (soup) html += '<div><span class="text-blue-600 font-semibold">汁物:</span> ' + soup.title + '</div>';
                html += '</div>';
                html += '</div>';
            });
            html += '</div>';
            html += '</div>';
            
            calendarContainerEl.innerHTML = html;
        }

        // カレンダーダウンロード
        function downloadCalendar() {
            // 未登録の場合は会員登録モーダルを表示
            const user = JSON.parse(localStorage.getItem('aichef_user') || 'null');
            if (!user) {
                authModal.classList.add('active');
                return;
            }
            
            // .icsファイルを生成してダウンロード
            alert('カレンダーダウンロード機能は近日実装予定です');
        }

        // 会員登録フォーム
        document.getElementById('auth-form').addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('auth-name').value;
            const email = document.getElementById('auth-email').value;
            const password = document.getElementById('auth-password').value;
            
            const user = {
                name,
                email,
                registered_at: new Date().toISOString()
            };
            
            localStorage.setItem('aichef_user', JSON.stringify(user));
            authModal.classList.remove('active');
            alert('会員登録が完了しました！');
            
            // カレンダーダウンロードを再実行
            downloadCalendar();
        });

        // 初期化
        addMessage('こんにちは！AIシェフへようこそ 🍳\\n\\nいくつかの質問に答えるだけで、あなたにぴったりの献立を作成します。\\n\\n準備はいいですか？');
        nextStep();
    </script>
</body>
</html>
  `)
})
app.use('/api/*', cors())

// 静的ファイル配信
app.use('/static/*', serveStatic({ root: './public' }))
app.use('/images/*', serveStatic({ root: './public' }))
app.use('/landing.html', serveStatic({ path: './public/landing.html' }))

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
  // monthsを日数に変換（1ヶ月 = 30日として計算）
  const days = Math.ceil(months * 30);
  const period_end = addDays(start_date, days - 1);
  const dates = rangeDates(start_date, period_end);
  return { period_start: start_date, period_end, dates };
}

function buildPeriodByDays(start_date: string, days: number) {
  const period_end = addDays(start_date, days - 1);
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
    
    // budget_distributionは文字列として扱う
    const budgetDistribution = (body.budget_distribution as string) || 'average';
    
    // 子供情報のJSON化
    const childrenAgesJson = body.children_ages ? JSON.stringify(body.children_ages) : '[]';
    const childrenDislikesJson = body.children_dislikes ? JSON.stringify(body.children_dislikes) : '[]';
    const familyDislikesJson = body.family_dislikes ? JSON.stringify(body.family_dislikes) : '[]';

    await env.DB.prepare(
      `INSERT INTO households
       (household_id, title, members_count, start_date, months, season,
        budget_tier_per_person, budget_distribution, cooking_time_limit_min,
        shopping_frequency, fish_frequency,
        dislikes_json, allergies_standard_json, allergies_free_text_json,
        children_ages_json)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).bind(
      household_id,
      body.title,
      body.members_count,
      body.start_date,
      1, // months固定値（実際の期間はplan_daysで制御）
      season,
      body.budget_tier_per_person,
      budgetDistribution,
      cooking,
      shopping,
      fish,
      dislikesJson,
      allergiesStd,
      allergiesFree,
      childrenAgesJson
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
    try {
      console.log('献立生成API開始');
      const body = await readJson(req);
      console.log('リクエストボディ:', JSON.stringify(body, null, 2));
      
      if (!body.household_id) return badRequest("household_id is required");

    console.log('household_id:', body.household_id);
    const household = await env.DB.prepare(
      `SELECT * FROM households WHERE household_id = ?`
    ).bind(body.household_id).first() as any;
    
    console.log('household取得結果:', household ? 'あり' : 'なし');
    if (!household) return badRequest("household not found");

    const plan_id = uuid();
    const menu_variety = body.menu_variety || 'balanced';
    const supervisor_mode = body.supervisor_mode || 'general';
    
    console.log('plan_id:', plan_id);
    console.log('menu_variety:', menu_variety);
    console.log('supervisor_mode:', supervisor_mode);
    
    // 期間計算（plan_daysを使用、なければmonthsから計算）
    const planDays = body.plan_days || (household.months * 30);
    console.log('期間計算開始 - start_date:', household.start_date, 'plan_days:', planDays);
    const period = buildPeriodByDays(household.start_date, planDays);
    console.log('期間計算完了 - 日数:', period.dates.length);
    
    // 監修者モードに応じたレシピフィルタ
    let supervisorFilter = '';
    let timeFilter = '';
    
    switch (supervisor_mode) {
      case 'nutritionist':
        // 栄養士監修：バランス重視
        supervisorFilter = '';
        break;
      case 'trendy_mom':
        // イケイケママ：おしゃれ料理（人気度高め）
        supervisorFilter = 'AND popularity >= 7';
        break;
      case 'diet':
        // ダイエット：低カロリー（時短も兼ねる）
        timeFilter = 'AND time_min <= 30';
        break;
      case 'high_calorie_dad':
        // 高カロリーパパ：ボリューム満点
        supervisorFilter = 'AND popularity >= 8';
        break;
      case 'quick_mom':
        // 時短ママ：15分以内
        timeFilter = 'AND time_min <= 15';
        break;
      case 'budget_conscious':
        // 節約：人気度中程度
        supervisorFilter = 'AND popularity BETWEEN 6 AND 9';
        break;
      case 'gourmet_dad':
        // グルメパパ：バラエティ重視
        supervisorFilter = 'AND popularity BETWEEN 4 AND 7';
        break;
      case 'japanese_traditional':
        // 和食中心：和食レシピ優先（タイトルに「煮」「焼」「蒸」を含む）
        supervisorFilter = '';
        break;
      case 'western':
        // 洋食中心：パスタ・グラタン系
        supervisorFilter = '';
        break;
      case 'chinese':
        // 中華好き
        supervisorFilter = '';
        break;
      case 'ethnic':
        // エスニック
        supervisorFilter = '';
        break;
      case 'kids_favorite':
        // 子供大好き：定番人気
        supervisorFilter = 'AND popularity >= 9';
        break;
      case 'athlete':
        // アスリート：高タンパク質
        supervisorFilter = '';
        break;
      case 'vegetarian_oriented':
        // ベジタリアン寄り：野菜中心
        supervisorFilter = '';
        break;
      case 'fish_lover':
        // 魚好き
        supervisorFilter = '';
        break;
      case 'meat_lover':
        // 肉好き
        supervisorFilter = '';
        break;
      case 'senior_friendly':
        // シニア向け：やわらかめ
        supervisorFilter = '';
        break;
      case 'meal_prep':
        // 作り置き
        supervisorFilter = '';
        break;
      case 'one_plate':
        // ワンプレート
        supervisorFilter = '';
        break;
      default:
        // 一般
        supervisorFilter = '';
    }
    
    // メニューバラエティ設定に応じたレシピ取得
    let popularityFilter = '';
    if (menu_variety === 'popular') {
      // 定番中心：人気度8以上を優先
      popularityFilter = 'AND popularity >= 8';
    } else if (menu_variety === 'variety') {
      // バラエティ重視：人気度3-7を優先
      popularityFilter = 'AND popularity BETWEEN 3 AND 7';
    }
    // balanced: 全レシピから選択（フィルタなし）
    
    // 監修者モードとメニューバラエティを組み合わせる
    const combinedFilter = popularityFilter + ' ' + supervisorFilter + ' ' + timeFilter;
    console.log('combinedFilter:', combinedFilter);
    
    // 全レシピを人気度順に取得
    console.log('レシピ取得開始');
    const allMainRecipes = await env.DB.prepare(
      `SELECT * FROM recipes WHERE role='main' ${combinedFilter} ORDER BY popularity DESC, RANDOM()`
    ).all();
    
    const allSideRecipes = await env.DB.prepare(
      `SELECT * FROM recipes WHERE role='side' ${combinedFilter} ORDER BY popularity DESC, RANDOM()`
    ).all();
    
    const allSoupRecipes = await env.DB.prepare(
      `SELECT * FROM recipes WHERE role='soup' ${combinedFilter} ORDER BY popularity DESC, RANDOM()`
    ).all();

    let mainRecipes = (allMainRecipes.results ?? []) as any[];
    let sideRecipes = (allSideRecipes.results ?? []) as any[];
    let soupRecipes = (allSoupRecipes.results ?? []) as any[];
    
    console.log('取得レシピ数 - main:', mainRecipes.length, 'side:', sideRecipes.length, 'soup:', soupRecipes.length);
    
    // 🚨 嫌いな食材・アレルギーのフィルタリング
    console.log('=== 嫌いな食材・アレルギーフィルタリング開始 ===');
    
    // household の嫌いな食材とアレルギーを取得
    const dislikesJson = household.dislikes_json || '[]';
    const allergiesStandardJson = household.allergies_standard_json || '[]';
    const dislikes = JSON.parse(dislikesJson);
    const allergiesStandard = JSON.parse(allergiesStandardJson);
    
    console.log('嫌いな食材:', dislikes);
    console.log('アレルギー:', allergiesStandard);
    
    // 除外する食材IDのマッピング（食材名 → ingredient_id）
    const dislikeMapping: { [key: string]: string[] } = {
      'fish': ['fish_salmon', 'fish_mackerel', 'fish_tuna', 'fish_sardine', 'fish_cod', 'fish_yellowtail', 'fish_sea_bream', 'fish_horse_mackerel', 'fish_saury', 'fish_white', 'ing_fish'],
      'shrimp': ['seafood_shrimp', 'shrimp'],
      'crab': ['seafood_crab', 'crab'],
      'octopus': ['seafood_octopus', 'octopus'],
      'squid': ['seafood_squid', 'squid'],
      'shellfish': ['seafood_clam', 'seafood_scallop', 'seafood_oyster', 'seafood_mussel', 'clam', 'scallop', 'oyster'],
      'offal': ['meat_liver', 'meat_heart', 'meat_intestine', 'meat_stomach', 'offal', 'liver', 'heart'],
      'tomato': ['veg_tomato', 'tomato'],
      'eggplant': ['veg_eggplant', 'eggplant', 'nasu'],
      'green_pepper': ['veg_green_pepper', 'bell_pepper', 'piman'],
      'celery': ['veg_celery', 'celery'],
      'cilantro': ['herb_cilantro', 'cilantro', 'coriander'],
      'mushroom': ['mushroom_shiitake', 'mushroom_enoki', 'mushroom_shimeji', 'mushroom', 'kinoko'],
      'garlic': ['seasoning_garlic', 'garlic', 'ninniku'],
      'onion': ['veg_onion', 'onion', 'tamanegi'],
      'spicy': ['chili', 'pepper_red', 'spice_chili']
    };
    
    const allergyMapping: { [key: string]: string[] } = {
      'egg': ['egg', 'ing_egg', 'dairy_egg'],
      'milk': ['milk', 'dairy_milk', 'cheese', 'butter', 'cream'],
      'wheat': ['flour', 'wheat', 'bread', 'noodles', 'ing_bread', 'ing_pasta', 'noodle_udon', 'noodle_ramen', 'noodle_pasta', 'noodle_soba'],
      'shrimp': ['seafood_shrimp', 'shrimp'],
      'crab': ['seafood_crab', 'crab'],
      'buckwheat': ['soba', 'buckwheat', 'noodle_soba'],
      'peanut': ['peanut', 'nuts_peanut']
    };
    
    // 除外する食材IDのセットを作成
    const excludedIngredientIds = new Set<string>();
    
    // 嫌いな食材を追加
    dislikes.forEach((dislike: string) => {
      if (dislike !== 'none' && dislikeMapping[dislike]) {
        dislikeMapping[dislike].forEach(id => excludedIngredientIds.add(id));
      }
    });
    
    // アレルギー食材を追加
    allergiesStandard.forEach((allergy: string) => {
      if (allergy !== 'none' && allergyMapping[allergy]) {
        allergyMapping[allergy].forEach(id => excludedIngredientIds.add(id));
      }
    });
    
    console.log('除外する食材ID数:', excludedIngredientIds.size);
    console.log('除外する食材ID:', Array.from(excludedIngredientIds));
    
    // レシピをフィルタリング（除外食材を含むレシピを除外）
    // 🚀 高速化: 一括クエリでN+1問題を解決
    const filterRecipesByIngredients = async (recipes: any[]) => {
      if (excludedIngredientIds.size === 0 && dislikes.length === 0 && allergiesStandard.length === 0) {
        console.log('除外食材なし。フィルタリングスキップ');
        return recipes;
      }
      
      // 🚀 Step 1: 全レシピの食材を一括取得（N+1問題を解決）
      const recipeIds = recipes.map(r => r.recipe_id);
      const allIngredientsQuery = `
        SELECT recipe_id, ingredient_id 
        FROM recipe_ingredients 
        WHERE recipe_id IN (${recipeIds.map(() => '?').join(',')})
      `;
      const allIngredients = await env.DB.prepare(allIngredientsQuery)
        .bind(...recipeIds)
        .all();
      
      // レシピIDごとの食材IDマップを作成
      const recipeIngredientsMap = new Map<string, string[]>();
      for (const ing of (allIngredients.results || [])) {
        const recipeId = (ing as any).recipe_id;
        const ingredientId = (ing as any).ingredient_id;
        if (!recipeIngredientsMap.has(recipeId)) {
          recipeIngredientsMap.set(recipeId, []);
        }
        recipeIngredientsMap.get(recipeId)!.push(ingredientId);
      }
      
      const filteredRecipes = [];
      
      for (const recipe of recipes) {
        // 🐟 primary_proteinベースのフィルタリング（魚嫌い対応）
        if (dislikes.includes('fish') && recipe.primary_protein === 'fish') {
          console.log(`除外: ${recipe.title} (primary_protein=fish - 魚嫌い)`);
          continue;
        }
        
        // 🐟 タイトルベースの魚フィルタリング（primary_proteinが"other"の魚料理対応）
        const fishKeywords = ['鮭', 'サバ', 'アジ', 'サンマ', 'ブリ', 'タラ', '魚', '白身魚', 'シーフード', '海鮮', 'まぐろ', 'マグロ', 'いわし', 'イワシ', 'かつお', 'カツオ', 'さんま', 'ぶり', 'たら'];
        if (dislikes.includes('fish') && fishKeywords.some(keyword => recipe.title.includes(keyword))) {
          console.log(`除外: ${recipe.title} (タイトルに魚名/シーフード - 魚嫌い)`);
          continue;
        }
        
        // 🦐 エビ嫌い・エビアレルギー対応（primary_protein関係なくタイトルでチェック）
        if ((dislikes.includes('shrimp') || allergiesStandard.includes('shrimp')) && 
            recipe.title.includes('エビ')) {
          console.log(`除外: ${recipe.title} (エビ料理)`);
          continue;
        }
        
        // 🦀 カニアレルギー・カニ嫌い対応
        if ((dislikes.includes('crab') || allergiesStandard.includes('crab')) && 
            recipe.title.includes('カニ')) {
          console.log(`除外: ${recipe.title} (カニ料理)`);
          continue;
        }
        
        // 🐙 イカ・タコ嫌い対応
        if ((dislikes.includes('squid') || dislikes.includes('octopus')) && 
            (recipe.title.includes('イカ') || recipe.title.includes('タコ'))) {
          console.log(`除外: ${recipe.title} (イカ・タコ料理)`);
          continue;
        }
        
        // 🐚 貝類嫌い・貝類アレルギー対応
        const shellfishKeywords = ['あさり', 'アサリ', 'しじみ', 'シジミ', '牡蠣', 'カキ', 'ホタテ', 'ほたて', '貝'];
        if ((dislikes.includes('shellfish') || allergiesStandard.includes('shellfish')) && 
            shellfishKeywords.some(keyword => recipe.title.includes(keyword))) {
          console.log(`除外: ${recipe.title} (貝類料理)`);
          continue;
        }
        
        // 🫘 内臓嫌い対応
        if (dislikes.includes('offal') && 
            (recipe.title.includes('レバー') || recipe.title.includes('ホルモン') || 
             recipe.title.includes('ハツ') || recipe.title.includes('砂肝'))) {
          console.log(`除外: ${recipe.title} (内臓料理)`);
          continue;
        }
        
        // 🚀 メモリ上の食材マップから取得（DBクエリなし）
        const recipeIngredientIds = recipeIngredientsMap.get(recipe.recipe_id) || [];
        
        // 除外食材が含まれているかチェック
        const hasExcludedIngredient = recipeIngredientIds.some(id => 
          excludedIngredientIds.has(id) || 
          // 双方向の部分一致チェック
          // 1. 食材IDが除外IDを含む（例: 'fish_salmon' に 'fish' が含まれる）
          Array.from(excludedIngredientIds).some(excludedId => id.includes(excludedId)) ||
          // 2. 除外IDが食材IDを含む（例: 'fish_salmon' が 'fish' を含む）
          Array.from(excludedIngredientIds).some(excludedId => excludedId.includes(id))
        );
        
        if (!hasExcludedIngredient) {
          filteredRecipes.push(recipe);
        } else {
          console.log(`除外: ${recipe.title} (除外食材を含む)`);
        }
      }
      
      console.log(`フィルタリング結果: ${recipes.length} → ${filteredRecipes.length} レシピ`);
      return filteredRecipes;
    };
    
    // 全てのレシピをフィルタリング
    console.log('主菜フィルタリング開始...');
    mainRecipes = await filterRecipesByIngredients(mainRecipes);
    console.log('副菜フィルタリング開始...');
    sideRecipes = await filterRecipesByIngredients(sideRecipes);
    console.log('汁物フィルタリング開始...');
    soupRecipes = await filterRecipesByIngredients(soupRecipes);
    
    console.log('=== フィルタリング完了 ===');
    console.log('フィルタリング後のレシピ数 - main:', mainRecipes.length, 'side:', sideRecipes.length, 'soup:', soupRecipes.length);
    
    // ❌ フィルタリング後のレシピが不足しても、フィルタを解除しない
    // アレルギー・嫌いな食材の除外は絶対に守る
    // レシピ数が少なくても、安全性を最優先

    if (mainRecipes.length === 0 || sideRecipes.length === 0 || soupRecipes.length === 0) {
      return badRequest("フィルタリング条件に合うレシピが不足しています。条件を緩和してください。");
    }

    // プラン作成
    await env.DB.prepare(
      `INSERT INTO meal_plans (plan_id, household_id, start_date, months, status)
       VALUES (?, ?, ?, ?, 'generated')`
    ).bind(plan_id, body.household_id, household.start_date, household.months).run();

    // 各日の献立作成（重複を最小化）
    const days: any[] = [];
    
    // レシピをシャッフルして重複を防ぐ
    const shuffleArray = (array: any[]) => {
      const shuffled = [...array];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      return shuffled;
    };
    
    // 直近N日間の重複をチェックして選択（厳格版 + タイトル重複チェック）
    const selectRecipeWithoutRecent = (recipes: any[], recentRecipes: any[], minDays: number = 7) => {
      // 直近minDays日間に使われていないレシピIDをチェック
      const recentIds = recentRecipes.slice(-minDays).map(r => r?.recipe_id);
      // 直近minDays日間に使われていないタイトルもチェック（重複レシピ対策）
      const recentTitles = recentRecipes.slice(-minDays).map(r => r?.title);
      
      const available = recipes.filter(r => 
        !recentIds.includes(r.recipe_id) && 
        !recentTitles.includes(r.title)  // タイトル重複もチェック
      );
      
      // 利用可能なレシピがない場合はエラーログを出力
      if (available.length === 0) {
        console.error('警告: 利用可能なレシピが不足しています。レシピ総数:', recipes.length, '直近使用数:', recentIds.length);
        // それでも選択が必要な場合は、最も古いものから選択
        const oldestRecipe = recipes.find(r => !recentIds.slice(-Math.floor(minDays / 2)).includes(r.recipe_id));
        return oldestRecipe || recipes[Math.floor(Math.random() * recipes.length)];
      }
      
      return available[Math.floor(Math.random() * available.length)];
    };
    
    // カレー系のレシピ判定（より厳密に）
    const isCurryOrStew = (recipe: any) => {
      const curryKeywords = ['カレー', 'シチュー', 'ハヤシライス', 'ドリア', 'グラタン'];
      return curryKeywords.some(keyword => recipe.title?.includes(keyword));
    };
    
    // 同じカテゴリの連続を避ける関数（7日間厳守 + カレー系の7日間隔厳守 + タイトル重複防止）
    const avoidSameCategory = (recipes: any[], lastRecipe: any, recentRecipes: any[], minDays: number) => {
      const recentIds = recentRecipes.slice(-minDays).map(r => r?.recipe_id);
      const recentTitles = recentRecipes.slice(-minDays).map(r => r?.title);
      
      // 直近7日間に使われていないレシピ（IDとタイトル両方チェック）
      let available = recipes.filter(r => 
        !recentIds.includes(r.recipe_id) && 
        !recentTitles.includes(r.title)  // タイトル重複もチェック
      );
      
      // カレー系のレシピIDを直近7日間から抽出
      const recentCurryIds = recentRecipes.slice(-minDays)
        .filter(r => r && isCurryOrStew(r))
        .map(r => r.recipe_id);
      
      // カレー系を選択する場合は、直近7日間にカレー系がないかチェック
      available = available.filter(r => {
        if (isCurryOrStew(r)) {
          // このレシピがカレー系の場合、直近7日間にカレー系がないことを確認
          return recentCurryIds.length === 0;
        }
        return true;
      });
      
      // 直前がカレー系の場合、さらにカレー系を除外（連続防止）
      if (lastRecipe && isCurryOrStew(lastRecipe)) {
        available = available.filter(r => !isCurryOrStew(r));
      }
      
      // 利用可能なレシピがない場合
      if (available.length === 0) {
        console.error('警告: カテゴリフィルタ後のレシピが不足しています');
        // 7日間ルールを緩和せず、カレー系だけ除外
        available = recipes.filter(r => !recentIds.includes(r.recipe_id) && !isCurryOrStew(r));
        if (available.length === 0) {
          // 最終手段：最も古いレシピを選択（ただしカレー系は避ける）
          const nonCurry = recipes.filter(r => !isCurryOrStew(r));
          available = nonCurry.length > 0 ? nonCurry : recipes;
        }
      }
      
      return available[Math.floor(Math.random() * available.length)];
    };
    
    // レシピをシャッフル
    const shuffledMainRecipes = shuffleArray([...mainRecipes]);
    const shuffledSideRecipes = shuffleArray([...sideRecipes]);
    const shuffledSoupRecipes = shuffleArray([...soupRecipes]);
    
    // 使用済みレシピの履歴
    const usedMainRecipes: any[] = [];
    const usedSideRecipes: any[] = [];
    const usedSoupRecipes: any[] = [];
    
    for (let i = 0; i < period.dates.length; i++) {
      const date = period.dates[i];
      
      // 重複を避けてレシピを選択（カレー系の連続も避ける）
      const lastMain = usedMainRecipes.length > 0 ? usedMainRecipes[usedMainRecipes.length - 1] : null;
      const main = avoidSameCategory(shuffledMainRecipes, lastMain, usedMainRecipes, 7);
      const side = selectRecipeWithoutRecent(shuffledSideRecipes, usedSideRecipes, 7);
      
      // カレー系の場合は汁物をサラダ系に変更
      let soup;
      if (isCurryOrStew(main)) {
        // サラダ系の副菜を汁物として使用
        const saladRecipes = shuffledSideRecipes.filter(r => 
          r.title?.includes('サラダ') || r.title?.includes('和え')
        );
        soup = saladRecipes.length > 0 
          ? selectRecipeWithoutRecent(saladRecipes, usedSoupRecipes, 7)
          : selectRecipeWithoutRecent(shuffledSoupRecipes, usedSoupRecipes, 7);
      } else {
        soup = selectRecipeWithoutRecent(shuffledSoupRecipes, usedSoupRecipes, 7);
      }
      
      // 履歴に追加
      usedMainRecipes.push(main);
      usedSideRecipes.push(side);
      usedSoupRecipes.push(soup);
      
      const plan_day_id = uuid();
      
      await env.DB.prepare(
        `INSERT INTO meal_plan_days (plan_day_id, plan_id, date, estimated_time_min, estimated_cost_tier, note)
         VALUES (?, ?, ?, ?, ?, ?)`
      ).bind(
        plan_day_id,
        plan_id,
        date,
        (main.time_min || 30) + (side.time_min || 15) + (soup.time_min || 10),
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
        plan_day_id,  // plan_day_idを追加
        date,
        estimated_time_min: (main.time_min || 30) + (side.time_min || 15) + (soup.time_min || 10),
        recipes: [
          { role: "main", recipe_id: main.recipe_id, title: main.title, time_min: main.time_min },
          { role: "side", recipe_id: side.recipe_id, title: side.title, time_min: side.time_min },
          { role: "soup", recipe_id: soup.recipe_id, title: soup.title, time_min: soup.time_min }
        ]
      });
    }

    // 献立履歴を保存
    console.log('献立履歴を保存開始');
    const history_id = uuid();
    await env.DB.prepare(
      `INSERT INTO plan_history (history_id, household_id, plan_id, title, start_date, months, created_at, is_archived)
       VALUES (?, ?, ?, ?, ?, ?, datetime('now'), 0)`
    ).bind(history_id, body.household_id, plan_id, household.title, household.start_date, household.months).run();
    console.log('献立履歴を保存完了');

    console.log('献立生成完了 - days数:', days.length);
    return json({ plan_id, days }, 201);
    } catch (error) {
      console.error('献立生成エラー:', error);
      console.error('エラースタック:', error instanceof Error ? error.stack : 'スタックなし');
      return new Response(JSON.stringify({ 
        error: { 
          message: 'サーバー内部エラーが発生しました', 
          details: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined
        }
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
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
  // 広告API
  // ========================================
  
  // GET /api/ads/:page_location - 指定ページの広告を取得
  if (pathname.startsWith("/api/ads/") && req.method === "GET") {
    const page_location = pathname.split("/api/ads/")[1];
    
    const ads = await env.DB.prepare(`
      SELECT ac.ad_id, ac.ad_type, ac.title, ac.image_url, ac.link_url, ac.html_code,
             ads.slot_id, ads.slot_name, ads.position, ads.width, ads.height
      FROM ad_contents ac
      JOIN ad_slots ads ON ac.slot_id = ads.slot_id
      WHERE ads.page_location = ? AND ac.is_active = 1 AND ads.is_active = 1
        AND (ac.start_date IS NULL OR ac.start_date <= DATE('now'))
        AND (ac.end_date IS NULL OR ac.end_date >= DATE('now'))
      ORDER BY ac.priority DESC, ac.created_at DESC
    `).bind(page_location).all();
    
    return json({ ads: ads.results || [] });
  }
  
  // POST /api/ads/track/click - 広告クリックを記録
  if (pathname === "/api/ads/track/click" && req.method === "POST") {
    const body = await readJson(req);
    const ad_id = body.ad_id as string;
    
    if (!ad_id) return badRequest("Missing ad_id");
    
    const click_id = uuid();
    const ip_address = req.headers.get("cf-connecting-ip") || "unknown";
    const user_agent = req.headers.get("user-agent") || "unknown";
    
    await env.DB.prepare(`
      INSERT INTO ad_clicks (click_id, ad_id, ip_address, user_agent, clicked_at)
      VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)
    `).bind(click_id, ad_id, ip_address, user_agent).run();
    
    return json({ success: true, click_id });
  }
  
  // POST /api/ads/track/impression - 広告表示を記録
  if (pathname === "/api/ads/track/impression" && req.method === "POST") {
    const body = await readJson(req);
    const ad_id = body.ad_id as string;
    const page_location = body.page_location as string;
    
    if (!ad_id || !page_location) return badRequest("Missing ad_id or page_location");
    
    const impression_id = uuid();
    
    await env.DB.prepare(`
      INSERT INTO ad_impressions (impression_id, ad_id, page_location, viewed_at)
      VALUES (?, ?, ?, CURRENT_TIMESTAMP)
    `).bind(impression_id, ad_id, page_location).run();
    
    return json({ success: true, impression_id });
  }

  // ========================================
  // AI対話API（OpenAI）
  // ========================================
  
  // POST /api/ai/explain-menu - 献立の理由説明
  if (pathname === "/api/ai/explain-menu" && req.method === "POST") {
    const apiKey = env.OPENAI_API_KEY;
    if (!apiKey) {
      return badRequest("OpenAI API key not configured");
    }
    
    const body = await readJson(req);
    const { plan_day_id, household_id } = body;
    
    if (!plan_day_id || !household_id) {
      return badRequest("Missing plan_day_id or household_id");
    }
    
    try {
      // 献立日の情報を取得
      const dayInfo = await env.DB.prepare(`
        SELECT mpd.date, mpd.estimated_time_min, mpd.estimated_cost_tier
        FROM meal_plan_days mpd
        WHERE mpd.plan_day_id = ?
      `).bind(plan_day_id).first();
      
      if (!dayInfo) {
        return badRequest("Plan day not found");
      }
      
      // レシピ情報を取得
      const recipes = await env.DB.prepare(`
        SELECT r.recipe_id, r.title, r.role
        FROM meal_plan_day_recipes mpdr
        JOIN recipes r ON mpdr.recipe_id = r.recipe_id
        WHERE mpdr.plan_day_id = ?
      `).bind(plan_day_id).all();
      
      // 家族情報を取得
      const household = await env.DB.prepare(`
        SELECT members_count, budget_tier_per_person, cooking_time_limit_min,
               dislikes_json, allergies_standard_json, children_ages_json
        FROM households
        WHERE household_id = ?
      `).bind(household_id).first();
      
      if (!household) {
        return badRequest("Household not found");
      }
      
      // OpenAI APIを呼び出し
      const explanation = await explainMenuChoice(apiKey, {
        household_id,
        plan_day_id,
        date: dayInfo.date as string,
        recipes: (recipes.results || []).map((r: any) => ({
          role: r.role,
          title: r.title
        })),
        household_info: {
          members_count: household.members_count as number,
          children_ages: JSON.parse(household.children_ages_json as string || '[]'),
          budget_tier_per_person: household.budget_tier_per_person as number,
          cooking_time_limit_min: household.cooking_time_limit_min as number,
          dislikes: JSON.parse(household.dislikes_json as string || '[]'),
          allergies: JSON.parse(household.allergies_standard_json as string || '[]')
        }
      });
      
      return json({ explanation });
    } catch (error: any) {
      console.error('OpenAI API error:', error);
      return json({ error: { message: error.message } }, 500);
    }
  }
  
  // POST /api/ai/suggest-adjustment - 献立調整の提案
  if (pathname === "/api/ai/suggest-adjustment" && req.method === "POST") {
    const apiKey = env.OPENAI_API_KEY;
    if (!apiKey) {
      return badRequest("OpenAI API key not configured");
    }
    
    const body = await readJson(req);
    const { plan_day_id, household_id, user_request } = body;
    
    if (!plan_day_id || !household_id || !user_request) {
      return badRequest("Missing required fields");
    }
    
    try {
      // 献立日の情報を取得
      const dayInfo = await env.DB.prepare(`
        SELECT mpd.date, mpd.estimated_time_min, mpd.estimated_cost_tier
        FROM meal_plan_days mpd
        WHERE mpd.plan_day_id = ?
      `).bind(plan_day_id).first();
      
      if (!dayInfo) {
        return badRequest("Plan day not found");
      }
      
      // レシピ情報を取得
      const recipes = await env.DB.prepare(`
        SELECT r.recipe_id, r.title, r.role
        FROM meal_plan_day_recipes mpdr
        JOIN recipes r ON mpdr.recipe_id = r.recipe_id
        WHERE mpdr.plan_day_id = ?
      `).bind(plan_day_id).all();
      
      // 家族情報を取得
      const household = await env.DB.prepare(`
        SELECT members_count, budget_tier_per_person, cooking_time_limit_min,
               dislikes_json, allergies_standard_json, children_ages_json
        FROM households
        WHERE household_id = ?
      `).bind(household_id).first();
      
      if (!household) {
        return badRequest("Household not found");
      }
      
      // OpenAI APIを呼び出し
      const suggestion = await suggestMenuAdjustment(apiKey, {
        household_id,
        plan_day_id,
        date: dayInfo.date as string,
        recipes: (recipes.results || []).map((r: any) => ({
          role: r.role,
          title: r.title
        })),
        household_info: {
          members_count: household.members_count as number,
          children_ages: JSON.parse(household.children_ages_json as string || '[]'),
          budget_tier_per_person: household.budget_tier_per_person as number,
          cooking_time_limit_min: household.cooking_time_limit_min as number,
          dislikes: JSON.parse(household.dislikes_json as string || '[]'),
          allergies: JSON.parse(household.allergies_standard_json as string || '[]')
        }
      }, user_request as string);
      
      // ユーザーの要望に基づいて代替レシピを検索
      const currentMain = (recipes.results || []).find((r: any) => r.role === 'main');
      
      // 代替レシピを3つ取得
      const alternativeRecipes = await env.DB.prepare(`
        SELECT recipe_id, title, time_min, role
        FROM recipes
        WHERE role = 'main' 
        AND recipe_id != ?
        ORDER BY RANDOM()
        LIMIT 3
      `).bind(currentMain?.recipe_id || '').all();
      
      return json({ 
        suggestion,
        alternatives: (alternativeRecipes.results || []).map((r: any) => ({
          recipe_id: r.recipe_id,
          title: r.title,
          time_min: r.time_min,
          role: r.role
        }))
      });
    } catch (error: any) {
      console.error('OpenAI API error:', error);
      return json({ error: { message: error.message } }, 500);
    }
  }
  
  // POST /api/plans/swap-days - 献立の日付を入れ替え
  if (pathname === "/api/plans/swap-days" && req.method === "POST") {
    const body = await readJson(req);
    const { plan_id, day1_id, day2_id } = body;
    
    if (!plan_id || !day1_id || !day2_id) {
      return badRequest("Missing required fields: plan_id, day1_id, day2_id");
    }
    
    try {
      // 2つの献立日のレシピを取得
      const day1Recipes = await env.DB.prepare(`
        SELECT plan_day_id, role, recipe_id 
        FROM meal_plan_day_recipes 
        WHERE plan_day_id = ?
      `).bind(day1_id).all();
      
      const day2Recipes = await env.DB.prepare(`
        SELECT plan_day_id, role, recipe_id 
        FROM meal_plan_day_recipes 
        WHERE plan_day_id = ?
      `).bind(day2_id).all();
      
      // 両方のレシピを削除
      await env.DB.prepare(
        `DELETE FROM meal_plan_day_recipes WHERE plan_day_id IN (?, ?)`
      ).bind(day1_id, day2_id).run();
      
      // レシピを入れ替えて挿入
      for (const recipe of day1Recipes.results) {
        await env.DB.prepare(
          `INSERT INTO meal_plan_day_recipes (plan_day_id, role, recipe_id) 
           VALUES (?, ?, ?)`
        ).bind(day2_id, recipe.role, recipe.recipe_id).run();
      }
      
      for (const recipe of day2Recipes.results) {
        await env.DB.prepare(
          `INSERT INTO meal_plan_day_recipes (plan_day_id, role, recipe_id) 
           VALUES (?, ?, ?)`
        ).bind(day1_id, recipe.role, recipe.recipe_id).run();
      }
      
      return json({ success: true });
    } catch (error: any) {
      console.error('Day swap error:', error);
      return json({ error: { message: error.message } }, 500);
    }
  }
  
  // POST /api/plans/replace-recipe - 献立のレシピを差し替え
  if (pathname === "/api/plans/replace-recipe" && req.method === "POST") {
    const body = await readJson(req);
    const { plan_day_id, role, new_recipe_id } = body;
    
    if (!plan_day_id || !role || !new_recipe_id) {
      return badRequest("Missing required fields: plan_day_id, role, new_recipe_id");
    }
    
    try {
      // 現在のレシピを削除
      await env.DB.prepare(
        `DELETE FROM meal_plan_day_recipes 
         WHERE plan_day_id = ? AND role = ?`
      ).bind(plan_day_id, role).run();
      
      // 新しいレシピを挿入
      await env.DB.prepare(
        `INSERT INTO meal_plan_day_recipes (plan_day_id, role, recipe_id) 
         VALUES (?, ?, ?)`
      ).bind(plan_day_id, role, new_recipe_id).run();
      
      // 更新されたレシピ情報を返す
      const newRecipe = await env.DB.prepare(
        `SELECT recipe_id, title, time_min, role 
         FROM recipes 
         WHERE recipe_id = ?`
      ).bind(new_recipe_id).first();
      
      return json({ 
        success: true,
        recipe: newRecipe
      });
    } catch (error: any) {
      console.error('Recipe replacement error:', error);
      return json({ error: { message: error.message } }, 500);
    }
  }
  
  // GET /api/recipes/:recipe_id - レシピ詳細を取得
  if (pathname.match(/^\/api\/recipes\/[^/]+$/) && req.method === "GET") {
    const recipe_id = pathname.split("/").pop();
    
    try {
      // レシピ基本情報を取得
      const recipe = await env.DB.prepare(`
        SELECT 
          recipe_id,
          title,
          description,
          role,
          cuisine,
          difficulty,
          time_min,
          primary_protein,
          cost_tier,
          steps_json,
          substitutes_json,
          tags_json,
          child_friendly_score
        FROM recipes
        WHERE recipe_id = ?
      `).bind(recipe_id).first();
      
      if (!recipe) {
        return badRequest("Recipe not found");
      }
      
      // 食材情報を取得
      const ingredients = await env.DB.prepare(`
        SELECT 
          i.ingredient_id,
          i.name,
          i.category,
          ri.quantity,
          ri.unit,
          ri.is_optional
        FROM recipe_ingredients ri
        JOIN ingredients i ON ri.ingredient_id = i.ingredient_id
        WHERE ri.recipe_id = ?
        ORDER BY 
          CASE i.category
            WHEN 'meat_fish' THEN 1
            WHEN 'vegetables' THEN 2
            WHEN 'tofu_beans' THEN 3
            WHEN 'dairy_eggs' THEN 4
            WHEN 'seasonings' THEN 5
            ELSE 6
          END
      `).bind(recipe_id).all();
      
      return json({
        ...recipe,
        ingredients: ingredients.results || [],
        substitutes: JSON.parse((recipe as any).substitutes_json || '[]'),
        steps: JSON.parse((recipe as any).steps_json || '[]'),
        tags: JSON.parse((recipe as any).tags_json || '[]')
      });
    } catch (error: any) {
      console.error('Recipe detail error:', error);
      return json({ error: { message: error.message } }, 500);
    }
  }
  
  // ========================================
  // 買い物リストAPI
  // ========================================
  
  // GET /api/shopping-list/:plan_id - 買い物リストを生成
  if (pathname.match(/^\/api\/shopping-list\/[^/]+$/) && req.method === "GET") {
    const plan_id = pathname.split("/").pop();
    
    try {
      // プラン情報を取得（人数情報を含む）
      const plan = await env.DB.prepare(`
        SELECT mp.*, h.members_count
        FROM meal_plans mp
        JOIN households h ON mp.household_id = h.household_id
        WHERE mp.plan_id = ?
      `).bind(plan_id).first() as any;
      
      if (!plan) {
        return badRequest("Plan not found");
      }
      
      const membersCount = plan.members_count || 2; // デフォルト2人
      console.log('買い物リスト生成 - 人数:', membersCount);
      
      // プランの全日程を取得
      const planDays = await env.DB.prepare(`
        SELECT plan_day_id, date
        FROM meal_plan_days
        WHERE plan_id = ?
        ORDER BY date ASC
      `).bind(plan_id).all();
      
      if (!planDays.results || planDays.results.length === 0) {
        return badRequest("Plan not found");
      }
      
      // 全ての献立のレシピIDを取得
      const allRecipeIds: string[] = [];
      for (const day of (planDays.results as any[])) {
        const recipes = await env.DB.prepare(`
          SELECT recipe_id
          FROM meal_plan_day_recipes
          WHERE plan_day_id = ?
        `).bind(day.plan_day_id).all();
        
        (recipes.results || []).forEach((r: any) => {
          allRecipeIds.push(r.recipe_id);
        });
      }
      
      // 週ごとに食材を集計
      const weeklyShoppingLists = [];
      const daysArray = planDays.results as any[];
      
      for (let weekIndex = 0; weekIndex < daysArray.length; weekIndex += 7) {
        const weekDays = daysArray.slice(weekIndex, weekIndex + 7);
        
        // この週のレシピIDを収集
        const weekRecipeIds: string[] = [];
        for (const day of weekDays) {
          const recipes = await env.DB.prepare(`
            SELECT recipe_id
            FROM meal_plan_day_recipes
            WHERE plan_day_id = ?
          `).bind(day.plan_day_id).all();
          
          (recipes.results || []).forEach((r: any) => {
            weekRecipeIds.push(r.recipe_id);
          });
        }
        
        // この週の食材を集計
        const weekIngredientMap: Record<string, {
          name: string;
          category: string;
          quantity: number;
          unit: string;
        }> = {};
        
        for (const recipeId of weekRecipeIds) {
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
          `).bind(recipeId).all();
          
          (ingredients.results || []).forEach((ing: any) => {
            const key = ing.ingredient_id;
            // 人数分の数量を計算（レシピは通常2人前なので、members_count / 2 を掛ける）
            const adjustedQuantity = ing.quantity * (membersCount / 2);
            
            if (weekIngredientMap[key]) {
              weekIngredientMap[key].quantity += adjustedQuantity;
            } else {
              weekIngredientMap[key] = {
                name: ing.name,
                category: ing.category,
                quantity: adjustedQuantity,
                unit: ing.unit
              };
            }
          });
        }
        
        // カテゴリ別に整理
        const categoryNames: Record<string, string> = {
          'vegetables': '野菜',
          'meat_fish': '肉・魚',
          'dairy_eggs': '卵・乳製品',
          'tofu_beans': '豆腐・豆類',
          'seasonings': '調味料',
          'others': 'その他'
        };
        
        const weekShoppingList: Record<string, any[]> = {};
        
        Object.values(weekIngredientMap).forEach((ing: any) => {
          const categoryJa = categoryNames[ing.category] || 'その他';
          if (!weekShoppingList[categoryJa]) {
            weekShoppingList[categoryJa] = [];
          }
          weekShoppingList[categoryJa].push({
            name: ing.name,
            quantity: Math.ceil(ing.quantity),
            unit: ing.unit
          });
        });
        
        weeklyShoppingLists.push({
          weekNumber: Math.floor(weekIndex / 7) + 1,
          startDate: weekDays[0].date,
          endDate: weekDays[weekDays.length - 1].date,
          totalItems: Object.values(weekIngredientMap).length,
          shoppingList: weekShoppingList
        });
      }
      
      // 全体の集計（月全体）
      const allIngredientMap: Record<string, {
        name: string;
        category: string;
        quantity: number;
        unit: string;
      }> = {};
      
      for (const recipeId of allRecipeIds) {
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
        `).bind(recipeId).all();
        
        (ingredients.results || []).forEach((ing: any) => {
          const key = ing.ingredient_id;
          // 人数分の数量を計算
          const adjustedQuantity = ing.quantity * (membersCount / 2);
          
          if (allIngredientMap[key]) {
            allIngredientMap[key].quantity += adjustedQuantity;
          } else {
            allIngredientMap[key] = {
              name: ing.name,
              category: ing.category,
              quantity: adjustedQuantity,
              unit: ing.unit
            };
          }
        });
      }
      
      // カテゴリ別に整理（全体）
      const categoryNames: Record<string, string> = {
        'vegetables': '野菜',
        'meat_fish': '肉・魚',
        'dairy_eggs': '卵・乳製品',
        'tofu_beans': '豆腐・豆類',
        'seasonings': '調味料',
        'others': 'その他'
      };
      
      const allShoppingList: Record<string, any[]> = {};
      
      Object.values(allIngredientMap).forEach((ing: any) => {
        const categoryJa = categoryNames[ing.category] || 'その他';
        if (!allShoppingList[categoryJa]) {
          allShoppingList[categoryJa] = [];
        }
        allShoppingList[categoryJa].push({
          name: ing.name,
          quantity: Math.ceil(ing.quantity),
          unit: ing.unit
        });
      });
      
      return json({
        plan_id,
        membersCount,
        startDate: daysArray[0].date,
        endDate: daysArray[daysArray.length - 1].date,
        totalDays: daysArray.length,
        totalItems: Object.values(allIngredientMap).length,
        shoppingList: allShoppingList,
        weeklyLists: weeklyShoppingLists
      });
    } catch (error: any) {
      console.error('Shopping list generation error:', error);
      return json({ error: { message: error.message } }, 500);
    }
  }

  // ========================================
  // メルマガAPI（簡易版）
  // ========================================
  
  // GET /api/history/:household_id - 献立履歴を取得
  if (pathname.match(/^\/api\/history\/[^/]+$/) && req.method === "GET") {
    const household_id = pathname.split("/").pop();
    
    try {
      const history = await env.DB.prepare(`
        SELECT history_id, household_id, plan_id, title, start_date, months, created_at, is_archived
        FROM plan_history
        WHERE household_id = ? AND is_archived = 0
        ORDER BY created_at DESC
        LIMIT 50
      `).bind(household_id).all();
      
      return json({ history: history.results || [] });
    } catch (error: any) {
      console.error('History fetch error:', error);
      return json({ error: { message: error.message } }, 500);
    }
  }
  
  // ========================================
  // 履歴管理API
  // ========================================
  
  // POST /api/history/save - 献立を履歴として保存
  if (pathname === "/api/history/save" && req.method === "POST") {
    const body = await readJson(req);
    const { household_id, plan_id, title, start_date, end_date, members_count, plan_data } = body;
    
    if (!household_id || !plan_id || !title || !start_date || !end_date || !members_count || !plan_data) {
      return badRequest("Missing required fields");
    }
    
    try {
      const history_id = uuid();
      const total_days = plan_data.days ? plan_data.days.length : 0;
      
      await env.DB.prepare(`
        INSERT INTO meal_plan_history (
          history_id, household_id, plan_id, title, 
          start_date, end_date, members_count, total_days,
          plan_data_json, archived_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
      `).bind(
        history_id, household_id, plan_id, title,
        start_date, end_date, members_count, total_days,
        JSON.stringify(plan_data)
      ).run();
      
      return json({ success: true, history_id, message: "献立を履歴に保存しました" });
    } catch (error: any) {
      console.error('History save error:', error);
      return json({ error: { message: error.message } }, 500);
    }
  }
  
  // GET /api/history/list/:household_id - 献立履歴一覧取得
  if (pathname.startsWith("/api/history/list/") && req.method === "GET") {
    const household_id = pathname.split("/").pop();
    
    if (!household_id) {
      return badRequest("household_id is required");
    }
    
    try {
      const histories = await env.DB.prepare(`
        SELECT 
          history_id, plan_id, title, 
          start_date, end_date, members_count, total_days,
          archived_at
        FROM meal_plan_history 
        WHERE household_id = ?
        ORDER BY archived_at DESC
        LIMIT 50
      `).bind(household_id).all();
      
      return json({ 
        success: true, 
        histories: histories.results || [],
        count: histories.results?.length || 0
      });
    } catch (error: any) {
      console.error('History list error:', error);
      return json({ error: { message: error.message } }, 500);
    }
  }
  
  // GET /api/history/detail/:history_id - 献立履歴詳細取得
  if (pathname.startsWith("/api/history/detail/") && req.method === "GET") {
    const history_id = pathname.split("/").pop();
    
    if (!history_id) {
      return badRequest("history_id is required");
    }
    
    try {
      const history = await env.DB.prepare(`
        SELECT 
          history_id, household_id, plan_id, title, 
          start_date, end_date, members_count, total_days,
          plan_data_json, archived_at
        FROM meal_plan_history 
        WHERE history_id = ?
      `).bind(history_id).first();
      
      if (!history) {
        return json({ error: "History not found" }, 404);
      }
      
      // JSONをパース
      const plan_data = JSON.parse(history.plan_data_json as string);
      
      return json({ 
        success: true, 
        history: {
          ...history,
          plan_data
        }
      });
    } catch (error: any) {
      console.error('History detail error:', error);
      return json({ error: { message: error.message } }, 500);
    }
  }
  
  // DELETE /api/history/delete/:history_id - 献立履歴削除
  if (pathname.startsWith("/api/history/delete/") && req.method === "DELETE") {
    const history_id = pathname.split("/").pop();
    
    if (!history_id) {
      return badRequest("history_id is required");
    }
    
    try {
      await env.DB.prepare(`
        DELETE FROM meal_plan_history WHERE history_id = ?
      `).bind(history_id).run();
      
      return json({ success: true, message: "履歴を削除しました" });
    } catch (error: any) {
      console.error('History delete error:', error);
      return json({ error: { message: error.message } }, 500);
    }
  }
  
  // POST /api/history/archive - 献立履歴をアーカイブ（互換性のため残す）
  if (pathname === "/api/history/archive" && req.method === "POST") {
    const body = await readJson(req);
    const { history_id } = body;
    
    if (!history_id) {
      return badRequest("history_id is required");
    }
    
    try {
      // 新しいテーブル構造では削除を実行
      await env.DB.prepare(
        `DELETE FROM meal_plan_history WHERE history_id = ?`
      ).bind(history_id).run();
      
      return json({ success: true });
    } catch (error: any) {
      console.error('Archive error:', error);
      return json({ error: { message: error.message } }, 500);
    }
  }
  
  // ========================================
  // お気に入りレシピAPI
  // ========================================
  
  // POST /api/favorites/add - お気に入り追加
  if (pathname === "/api/favorites/add" && req.method === "POST") {
    const body = await readJson(req);
    const { household_id, recipe_id, notes } = body;
    
    if (!household_id || !recipe_id) {
      return badRequest("household_id and recipe_id are required");
    }
    
    try {
      await env.DB.prepare(`
        INSERT OR REPLACE INTO favorite_recipes (household_id, recipe_id, notes, added_at)
        VALUES (?, ?, ?, CURRENT_TIMESTAMP)
      `).bind(household_id, recipe_id, notes || null).run();
      
      return json({ success: true, message: "お気に入りに追加しました" });
    } catch (error: any) {
      console.error('Add favorite error:', error);
      return json({ error: { message: error.message } }, 500);
    }
  }
  
  // DELETE /api/favorites/remove - お気に入り削除
  if (pathname === "/api/favorites/remove" && req.method === "DELETE") {
    const body = await readJson(req);
    const { household_id, recipe_id } = body;
    
    if (!household_id || !recipe_id) {
      return badRequest("household_id and recipe_id are required");
    }
    
    try {
      await env.DB.prepare(`
        DELETE FROM favorite_recipes WHERE household_id = ? AND recipe_id = ?
      `).bind(household_id, recipe_id).run();
      
      return json({ success: true, message: "お気に入りから削除しました" });
    } catch (error: any) {
      console.error('Remove favorite error:', error);
      return json({ error: { message: error.message } }, 500);
    }
  }
  
  // GET /api/favorites/list/:household_id - お気に入り一覧取得
  if (pathname.startsWith("/api/favorites/list/") && req.method === "GET") {
    const household_id = pathname.split("/").pop();
    
    if (!household_id) {
      return badRequest("household_id is required");
    }
    
    try {
      const favorites = await env.DB.prepare(`
        SELECT 
          f.recipe_id, f.notes, f.added_at,
          r.title, r.description, r.cuisine, r.difficulty, r.time_min
        FROM favorite_recipes f
        JOIN recipes r ON f.recipe_id = r.recipe_id
        WHERE f.household_id = ?
        ORDER BY f.added_at DESC
      `).bind(household_id).all();
      
      return json({ 
        success: true, 
        favorites: favorites.results || [],
        count: favorites.results?.length || 0
      });
    } catch (error: any) {
      console.error('Favorites list error:', error);
      return json({ error: { message: error.message } }, 500);
    }
  }
  
  // POST /api/newsletter/subscribe - メルマガ登録
  if (pathname === "/api/newsletter/subscribe" && req.method === "POST") {
    const body = await readJson(req);
    const email = (body.email as string)?.trim();
    
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return badRequest("Invalid email address");
    }
    
    // 既に登録済みかチェック
    const existing = await env.DB.prepare(
      "SELECT subscriber_id, status FROM newsletter_subscribers WHERE email = ?"
    ).bind(email).first();
    
    if (existing) {
      if (existing.status === 'active') {
        return json({ message: "このメールアドレスは既に登録されています" });
      } else {
        // 再登録
        await env.DB.prepare(
          "UPDATE newsletter_subscribers SET status = 'active', subscribed_at = CURRENT_TIMESTAMP WHERE email = ?"
        ).bind(email).run();
        return json({ message: "メルマガ登録を再開しました" });
      }
    }
    
    const subscriber_id = uuid();
    await env.DB.prepare(`
      INSERT INTO newsletter_subscribers (subscriber_id, email, status, subscribed_at)
      VALUES (?, ?, 'active', CURRENT_TIMESTAMP)
    `).bind(subscriber_id, email).run();
    
    return json({ message: "メルマガ登録が完了しました", subscriber_id });
  }
  
  // POST /api/newsletter/unsubscribe - メルマガ解除
  if (pathname === "/api/newsletter/unsubscribe" && req.method === "POST") {
    const body = await readJson(req);
    const email = (body.email as string)?.trim();
    
    if (!email) return badRequest("Missing email");
    
    await env.DB.prepare(`
      UPDATE newsletter_subscribers 
      SET status = 'unsubscribed', unsubscribed_at = CURRENT_TIMESTAMP 
      WHERE email = ?
    `).bind(email).run();
    
    return json({ message: "メルマガ登録を解除しました" });
  }

  // ========================================
  // 問い合わせAPI（簡易版）
  // ========================================
  
  // POST /api/support/create - 問い合わせ作成
  if (pathname === "/api/support/create" && req.method === "POST") {
    const body = await readJson(req);
    const email = (body.email as string)?.trim();
    const name = (body.name as string)?.trim();
    const subject = (body.subject as string)?.trim();
    const message = (body.message as string)?.trim();
    
    if (!email || !name || !subject || !message) {
      return badRequest("Missing required fields: email, name, subject, message");
    }
    
    const thread_id = uuid();
    const message_id = uuid();
    
    // スレッド作成
    await env.DB.prepare(`
      INSERT INTO support_threads (thread_id, email, name, subject, status, created_at, updated_at)
      VALUES (?, ?, ?, ?, 'open', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `).bind(thread_id, email, name, subject).run();
    
    // 最初のメッセージを作成
    await env.DB.prepare(`
      INSERT INTO support_messages (message_id, thread_id, sender_type, message, created_at)
      VALUES (?, ?, 'member', ?, CURRENT_TIMESTAMP)
    `).bind(message_id, thread_id, message).run();
    
    return json({ message: "お問い合わせを受け付けました", thread_id });
  }

  // ========================================
  // 認証API
  // ========================================
  
  // 簡易パスワードハッシュ化関数（本番環境ではbcryptなどを使用）
  const hashPassword = async (password: string): Promise<string> => {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  };
  
  // POST /api/auth/register - 会員登録
  if (pathname === "/api/auth/register" && req.method === "POST") {
    const body = await readJson(req);
    const name = (body.name as string)?.trim();
    const email = (body.email as string)?.trim();
    const password = (body.password as string)?.trim();
    
    if (!name || !email || !password) {
      return badRequest("名前、メールアドレス、パスワードを入力してください");
    }
    
    // パスワード長チェック
    if (password.length < 8) {
      return badRequest("パスワードは8文字以上で入力してください");
    }
    
    // メールアドレス重複チェック
    const existingUser = await env.DB.prepare(`
      SELECT household_id FROM households WHERE email = ?
    `).bind(email).first();
    
    if (existingUser) {
      return json({ error: "このメールアドレスは既に登録されています" }, 400);
    }
    
    // パスワードハッシュ化
    const password_hash = await hashPassword(password);
    
    // 新規ユーザー作成
    const household_id = uuid();
    
    await env.DB.prepare(`
      INSERT INTO households (
        household_id, title, members_count, email, password_hash,
        start_date, months, budget_tier_per_person, budget_distribution,
        dislikes_json, allergies_standard_json, created_at
      ) VALUES (?, ?, 1, ?, ?, date('now'), 1, 800, 'average', '[]', '[]', CURRENT_TIMESTAMP)
    `).bind(household_id, name, email, password_hash).run();
    
    return json({ 
      success: true,
      message: "会員登録が完了しました",
      household_id
    });
  }
  
  // POST /api/auth/login - ユーザーログイン
  if (pathname === "/api/auth/login" && req.method === "POST") {
    const body = await readJson(req);
    const email = (body.email as string)?.trim();
    const password = (body.password as string)?.trim();
    
    if (!email || !password) {
      return badRequest("メールアドレスとパスワードを入力してください");
    }
    
    // ユーザー情報取得
    const user = await env.DB.prepare(`
      SELECT household_id, title as name, email, password_hash, created_at 
      FROM households 
      WHERE email = ?
    `).bind(email).first();
    
    if (!user) {
      return json({ error: "メールアドレスまたはパスワードが間違っています" }, 401);
    }
    
    // パスワード検証
    const password_hash = await hashPassword(password);
    if (password_hash !== user.password_hash) {
      return json({ error: "メールアドレスまたはパスワードが間違っています" }, 401);
    }
    
    // セッションIDを生成（本番環境ではJWTを使用）
    const session_id = uuid();
    
    return json({ 
      success: true,
      session_id,
      user: {
        household_id: user.household_id,
        name: user.name,
        email: user.email
      }
    });
  }
  
  // POST /api/auth/admin-login - 管理者ログイン
  if (pathname === "/api/auth/admin-login" && req.method === "POST") {
    const body = await readJson(req);
    const username = (body.username as string)?.trim();
    const password = (body.password as string)?.trim();
    
    if (!username || !password) {
      return badRequest("ユーザー名とパスワードを入力してください");
    }
    
    // 簡易認証（本番環境では環境変数や専用テーブルを使用）
    const ADMIN_USERNAME = "admin";
    const ADMIN_PASSWORD = "aichef2026"; // 本番環境では環境変数に設定
    
    if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
      return json({ error: "ユーザー名またはパスワードが間違っています" }, 401);
    }
    
    // セッションIDを生成
    const session_id = uuid();
    
    return json({ 
      success: true,
      session_id,
      admin: {
        username,
        role: "admin"
      }
    });
  }

  // ========================================
  // /admin：管理画面を返す
  // ========================================
  if (pathname === "/admin" || pathname === "/admin/") {
    return new Response(ADMIN_DASHBOARD_HTML, {
      headers: { 
        'content-type': 'text/html; charset=utf-8',
        'cache-control': 'no-store'
      }
    });
  }
  
  // ========================================
  // 管理画面API
  // ========================================
  
  // GET /api/admin/stats - ダッシュボード統計
  if (pathname === "/api/admin/stats" && req.method === "GET") {
    try {
      // 総ユーザー数
      const totalUsersRes = await env.DB.prepare(
        `SELECT COUNT(*) as count FROM households`
      ).first();
      const totalUsers = totalUsersRes?.count || 0;
      
      // 総献立数
      const totalPlansRes = await env.DB.prepare(
        `SELECT COUNT(*) as count FROM meal_plans`
      ).first();
      const totalPlans = totalPlansRes?.count || 0;
      
      // 今日のアクセス数
      const todayAccess = 0; // TODO: アクセスログから集計
      
      // アクティブユーザー数（過去7日間に献立を作成したユーザー）
      const activeUsersRes = await env.DB.prepare(`
        SELECT COUNT(DISTINCT household_id) as count 
        FROM meal_plans 
        WHERE created_at >= date('now', '-7 days')
      `).first();
      const activeUsers = activeUsersRes?.count || 0;
      
      // メルマガ登録数
      const newsletterRes = await env.DB.prepare(
        `SELECT COUNT(*) as count FROM newsletter_subscribers WHERE status = 'active'`
      ).first();
      const newsletter = newsletterRes?.count || 0;
      
      // ユーザー成長率（今月vs先月）
      const usersGrowth = 12; // TODO: 実際の計算
      const plansGrowth = 8; // TODO: 実際の計算
      const openRate = 45; // TODO: メール開封率の計算
      
      return json({
        totalUsers,
        totalPlans,
        todayAccess,
        activeUsers,
        newsletter,
        usersGrowth,
        plansGrowth,
        openRate,
        recentActivities: []
      });
    } catch (error: any) {
      console.error('Admin stats error:', error);
      return json({ error: { message: error.message } }, 500);
    }
  }
  
  // GET /api/admin/users - ユーザー一覧
  if (pathname === "/api/admin/users" && req.method === "GET") {
    try {
      const users = await env.DB.prepare(`
        SELECT 
          h.household_id,
          h.title,
          h.members_count,
          h.created_at,
          COUNT(DISTINCT mp.plan_id) as plan_count
        FROM households h
        LEFT JOIN meal_plans mp ON h.household_id = mp.household_id
        GROUP BY h.household_id
        ORDER BY h.created_at DESC
        LIMIT 100
      `).all();
      
      return json({ users: users.results || [] });
    } catch (error: any) {
      console.error('Admin users error:', error);
      return json({ error: { message: error.message } }, 500);
    }
  }
  
  // GET /api/admin/campaigns - メールキャンペーン一覧
  if (pathname === "/api/admin/campaigns" && req.method === "GET") {
    try {
      const campaigns = await env.DB.prepare(`
        SELECT * FROM email_campaigns 
        ORDER BY created_at DESC 
        LIMIT 50
      `).all();
      
      return json({ campaigns: campaigns.results || [] });
    } catch (error: any) {
      console.error('Admin campaigns error:', error);
      return json({ error: { message: error.message } }, 500);
    }
  }
  
  // GET /api/admin/analytics - アクセス解析
  if (pathname === "/api/admin/analytics" && req.method === "GET") {
    try {
      const url = new URL(req.url);
      const period = parseInt(url.searchParams.get('period') || '30');
      
      const logs = await env.DB.prepare(`
        SELECT * FROM access_logs 
        WHERE created_at >= date('now', '-${period} days')
        ORDER BY created_at DESC 
        LIMIT 1000
      `).all();
      
      return json({ logs: logs.results || [] });
    } catch (error: any) {
      console.error('Admin analytics error:', error);
      return json({ error: { message: error.message } }, 500);
    }
  }
  
  // GET /api/admin/ads - 広告一覧
  if (pathname === "/api/admin/ads" && req.method === "GET") {
    try {
      const ads = await env.DB.prepare(`
        SELECT ac.*, COUNT(DISTINCT ai.impression_id) as impressions
        FROM ad_contents ac
        LEFT JOIN ad_impressions ai ON ac.ad_id = ai.ad_id
        GROUP BY ac.ad_id
        ORDER BY ac.created_at DESC
      `).all();
      
      return json({ ads: ads.results || [] });
    } catch (error: any) {
      console.error('Admin ads error:', error);
      return json({ error: { message: error.message } }, 500);
    }
  }
  
  // ========================================
  // ルートパス：ランディングページを返す
  // ========================================
  if (pathname === "/" || pathname === "/index.html") {
    return new Response(LANDING_HTML, {
      headers: { 
        'content-type': 'text/html; charset=utf-8',
        'cache-control': 'public, max-age=3600'
      }
    });
  }
  
  // ========================================
  // /app：献立作成チャット画面を返す
  // ========================================
  if (pathname === "/app") {
    return new Response(appHtml, {
      headers: { 
        'content-type': 'text/html; charset=utf-8',
        'cache-control': 'public, max-age=3600'
      }
    });
  }

  // ========================================
  // /login：ユーザーログイン画面
  // ========================================
  if (pathname === "/login") {
    return new Response(LOGIN_HTML, {
      headers: { 
        'content-type': 'text/html; charset=utf-8',
        'cache-control': 'no-store'
      }
    });
  }

  // ========================================
  // /admin/login：管理者ログイン画面
  // ========================================
  if (pathname === "/admin/login") {
    return new Response(ADMIN_LOGIN_HTML, {
      headers: { 
        'content-type': 'text/html; charset=utf-8',
        'cache-control': 'no-store'
      }
    });
  }

  // ========================================
  // /register：会員登録画面
  // ========================================
  if (pathname === "/register") {
    return new Response(REGISTER_HTML, {
      headers: { 
        'content-type': 'text/html; charset=utf-8',
        'cache-control': 'no-store'
      }
    });
  }

  // ========================================
  // /dashboard：ユーザーダッシュボード
  // ========================================
  if (pathname === "/dashboard") {
    return new Response(USER_DASHBOARD_HTML, {
      headers: { 
        'content-type': 'text/html; charset=utf-8',
        'cache-control': 'no-store'
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
