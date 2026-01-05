import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { serveStatic } from 'hono/cloudflare-workers'
import { LANDING_HTML } from './landing-content'
import { explainMenuChoice, suggestMenuAdjustment } from './openai-helper'

type Bindings = {
  DB?: D1Database;
  OPENAI_API_KEY?: string;
}

type Json = Record<string, unknown>;

// ========================================
// Landing Page (TOPページ) - 静的ファイルとして配信
// ========================================
// landingHtmlは削除しました。landing.htmlは静的ファイルとして配信されます。

// ========================================
// App Page (献立作成チャット)
// ========================================
const appHtml = `<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Aメニュー - 毎日の献立を考える負担から解放</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
    <style>
        /* 印刷用スタイル */
        @media print {
            body {
                font-size: 10pt;
                line-height: 1.3;
            }
            
            .no-print {
                display: none !important;
            }
            
            #calendar-container {
                box-shadow: none !important;
                padding: 0 !important;
            }
            
            .calendar-week {
                page-break-inside: avoid;
                break-inside: avoid;
            }
            
            /* 10日ごとに改ページ */
            .page-break-after-10 {
                page-break-after: always;
            }
            
            .day-card {
                border: 1px solid #ccc !important;
                padding: 8px !important;
                margin-bottom: 6px !important;
                box-shadow: none !important;
            }
            
            .day-date {
                font-size: 11pt;
                font-weight: bold;
                margin-bottom: 4px;
            }
            
            .recipe-item {
                font-size: 9pt;
                margin-bottom: 2px;
            }
            
            @page {
                size: A4;
                margin: 15mm;
            }
        }
        
        /* 画面表示用スタイル */
        .calendar-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 1rem;
        }
        
        .day-card {
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            padding: 1rem;
            transition: all 0.3s;
            background: white;
        }
        
        .day-card:hover {
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            transform: translateY(-2px);
        }
        
        .recipe-badge {
            display: inline-block;
            width: 8px;
            height: 8px;
            border-radius: 50%;
            margin-right: 6px;
        }
        
        .badge-main { background-color: #ef4444; }
        .badge-side { background-color: #10b981; }
        .badge-soup { background-color: #3b82f6; }
    </style>
</head>
<body class="bg-gray-50">
    <div id="app" class="container mx-auto px-4 py-8 max-w-6xl">
        <!-- ヘッダー -->
        <header class="text-center mb-8 no-print">
            <h1 class="text-4xl font-bold text-gray-800 mb-2">
                <i class="fas fa-utensils mr-2"></i>
                Aメニュー
            </h1>
            <p class="text-gray-600">
                考えなくていい、悩まなくていい。<br>
                今日から1ヶ月分の晩ごはんが決まります。
            </p>
        </header>

        <!-- TOPページヘッダー広告 -->
        <div id="ad-top-header" class="ad-container no-print mb-6" style="display:flex;justify-content:center;"></div>

        <!-- チャットエリア -->
        <div id="chat-container" class="bg-white rounded-lg shadow-lg p-6 mb-6">
            <div id="messages" class="space-y-4 mb-6"></div>
            <div id="input-area"></div>
        </div>

        <!-- 献立カレンダー（生成後に表示） -->
        <div id="calendar-container" class="hidden bg-white rounded-lg shadow-lg p-6">
            <div class="flex justify-between items-center mb-6 no-print">
                <h2 class="text-3xl font-bold">
                    <i class="fas fa-calendar-alt mr-2"></i>
                    1ヶ月分の献立
                </h2>
                <button onclick="window.print()" class="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition flex items-center gap-2">
                    <i class="fas fa-print"></i>
                    印刷する
                </button>
            </div>
            
            <div id="print-title" class="hidden print:block text-center mb-4">
                <h1 class="text-xl font-bold">献立カレンダー</h1>
                <p id="print-period" class="text-sm text-gray-600"></p>
            </div>
            
            <div id="calendar-content"></div>
            
            <!-- カレンダー下部広告 -->
            <div id="ad-calendar-bottom" class="ad-container no-print mt-8" style="display:flex;justify-content:center;"></div>
        </div>
        
        <!-- フッターセクション（メルマガ・お問い合わせ） -->
        <footer class="no-print mt-12 bg-white rounded-lg shadow-lg p-8">
            <div class="grid md:grid-cols-2 gap-8">
                <!-- メルマガ登録 -->
                <div>
                    <h3 class="text-xl font-bold mb-4">
                        <i class="fas fa-envelope mr-2"></i>
                        メルマガ登録
                    </h3>
                    <p class="text-gray-600 mb-4 text-sm">
                        週1回、おすすめレシピや献立のヒントをお届けします。
                    </p>
                    <div class="flex gap-2">
                        <input type="email" id="newsletter-email" placeholder="メールアドレス" 
                               class="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <button onclick="subscribeNewsletter()" 
                                class="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition">
                            登録
                        </button>
                    </div>
                    <p id="newsletter-message" class="text-sm mt-2"></p>
                </div>
                
                <!-- お問い合わせ -->
                <div>
                    <h3 class="text-xl font-bold mb-4">
                        <i class="fas fa-comment-dots mr-2"></i>
                        お問い合わせ
                    </h3>
                    <p class="text-gray-600 mb-4 text-sm">
                        ご質問やご要望がございましたら、お気軽にお問い合わせください。
                    </p>
                    <button onclick="openContactForm()" 
                            class="w-full px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">
                        お問い合わせフォームを開く
                    </button>
                </div>
            </div>
            
            <!-- サイドバー広告枠 -->
            <div id="ad-sidebar" class="ad-container mt-8" style="display:flex;justify-content:center;"></div>
            
            <div class="text-center text-gray-500 text-sm mt-8 pt-8 border-t">
                <p>&copy; 2026 Aメニュー. All rights reserved.</p>
            </div>
        </footer>
        
        <!-- お問い合わせモーダル -->
        <div id="contact-modal" class="fixed inset-0 bg-black bg-opacity-50 hidden items-center justify-center z-50">
            <div class="bg-white rounded-lg p-8 max-w-md w-full mx-4">
                <div class="flex justify-between items-center mb-4">
                    <h3 class="text-xl font-bold">お問い合わせ</h3>
                    <button onclick="closeContactForm()" class="text-gray-500 hover:text-gray-700">
                        <i class="fas fa-times text-xl"></i>
                    </button>
                </div>
                <div class="space-y-4">
                    <input type="text" id="contact-name" placeholder="お名前" 
                           class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <input type="email" id="contact-email" placeholder="メールアドレス" 
                           class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <input type="text" id="contact-subject" placeholder="件名" 
                           class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <textarea id="contact-message" placeholder="お問い合わせ内容" rows="5"
                              class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
                    <button onclick="submitContact()" 
                            class="w-full px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">
                        送信
                    </button>
                    <p id="contact-message-result" class="text-sm text-center"></p>
                </div>
            </div>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js"></script>
    <script>
        const appState = {
            step: 0,
            householdId: null,
            planId: null,
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
                    { label: '1ヶ月', value: 1 }
                ]
            },
            {
                id: 'adults_count',
                type: 'choice',
                text: '大人は何人ですか？',
                field: 'adults_count',
                options: [
                    { label: '1人', value: 1 },
                    { label: '2人', value: 2 },
                    { label: '3人', value: 3 },
                    { label: '4人', value: 4 }
                ]
            },
            {
                id: 'children_count',
                type: 'choice',
                text: 'お子さんは何人ですか？',
                field: 'children_count',
                options: [
                    { label: 'いない', value: 0 },
                    { label: '1人', value: 1 },
                    { label: '2人', value: 2 },
                    { label: '3人', value: 3 }
                ]
            },
            {
                id: 'children_ages',
                type: 'multi-choice',
                text: 'お子さんの年齢を教えてください（複数選択可）',
                field: 'children_ages',
                condition: (data) => data.children_count > 0,
                options: [
                    { label: '0-2歳（離乳食・幼児食）', value: '0-2' },
                    { label: '3-5歳（幼児）', value: '3-5' },
                    { label: '6-12歳（小学生）', value: '6-12' },
                    { label: '13-18歳（中高生）', value: '13-18' }
                ]
            },
            {
                id: 'children_dislikes',
                type: 'multi-choice',
                text: 'お子さんの好き嫌いはありますか？（複数選択可）',
                field: 'children_dislikes',
                condition: (data) => data.children_count > 0,
                options: [
                    { label: 'なし', value: 'none' },
                    { label: '野菜全般', value: 'vegetables' },
                    { label: '魚', value: 'fish' },
                    { label: '肉', value: 'meat' },
                    { label: 'ピーマン・にんじん', value: 'green_veg' },
                    { label: 'きのこ類', value: 'mushrooms' },
                    { label: '辛いもの', value: 'spicy' }
                ]
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
                    { label: '1200円（贅沢）', value: 1200 }
                ]
            },
            {
                id: 'time',
                type: 'choice',
                text: '平日の調理時間の目安は？',
                field: 'cooking_time_limit_min',
                options: [
                    { label: '15分（超時短）', value: 15 },
                    { label: '30分（時短）', value: 30 },
                    { label: '45分（標準）', value: 45 },
                    { label: '60分（じっくり）', value: 60 }
                ]
            },
            {
                id: 'menu_variety',
                type: 'choice',
                text: '定番メニューの頻度は？',
                field: 'menu_variety',
                options: [
                    { label: '定番中心（唐揚げ・ハンバーグ多め）', value: 'popular' },
                    { label: 'バランス（定番とバラエティ）', value: 'balanced' },
                    { label: 'バラエティ重視（珍しい料理も）', value: 'variety' }
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
                id: 'dislikes',
                type: 'multi-choice',
                text: '家族全員が苦手な食材はありますか？（複数選択可）',
                field: 'dislikes',
                options: [
                    { label: 'なし', value: 'none' },
                    { label: 'トマト', value: 'tomato' },
                    { label: 'なす', value: 'eggplant' },
                    { label: 'ピーマン', value: 'green_pepper' },
                    { label: 'セロリ', value: 'celery' },
                    { label: 'パクチー', value: 'cilantro' },
                    { label: 'きのこ', value: 'mushroom' }
                ]
            },
            {
                id: 'confirm',
                type: 'confirm',
                text: '設定完了です！<br>これで1ヶ月分の献立を作成します。よろしいですか？',
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
            // 条件付き質問のスキップ処理
            let nextIndex = appState.step + 1;
            while (nextIndex < questions.length) {
                const question = questions[nextIndex];
                // condition関数がある場合は条件をチェック
                if (question.condition && !question.condition(appState.data)) {
                    nextIndex++;
                    continue;
                }
                break;
            }
            
            if (nextIndex < questions.length) {
                appState.step = nextIndex;
                const question = questions[appState.step];
                
                // メッセージエリアをクリア（ページ分割式）
                messagesEl.innerHTML = '';
                
                // プログレスバー表示
                const progress = Math.round((appState.step / questions.length) * 100);
                const progressHtml = \`
                    <div class="mb-6">
                        <div class="flex justify-between text-sm text-gray-600 mb-2">
                            <span>質問 \${appState.step + 1} / \${questions.length}</span>
                            <span>\${progress}% 完了</span>
                        </div>
                        <div class="w-full bg-gray-200 rounded-full h-2">
                            <div class="bg-blue-500 h-2 rounded-full transition-all duration-300" style="width: \${progress}%"></div>
                        </div>
                    </div>
                \`;
                messagesEl.innerHTML = progressHtml;
                
                addMessage(question.text);
                showInput(question);
            }
        }

        async function generatePlan() {
            try {
                // ローディングアニメーション表示
                messagesEl.innerHTML = '';
                inputAreaEl.innerHTML = '';
                
                const loadingHtml = \`
                    <div class="flex flex-col items-center justify-center py-12">
                        <div class="relative w-24 h-24 mb-6">
                            <!-- 回転するアニメーション -->
                            <div class="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
                            <div class="absolute inset-0 border-4 border-t-blue-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
                        </div>
                        <h3 class="text-2xl font-bold text-gray-800 mb-2">献立を作成中...</h3>
                        <p class="text-gray-600 mb-4">AIがあなたの家族に最適な献立を考えています</p>
                        <div class="text-sm text-gray-500">
                            <p class="animate-pulse">✨ 703品のレシピから最適な組み合わせを選択中</p>
                        </div>
                    </div>
                \`;
                messagesEl.innerHTML = loadingHtml;
                
                // 家族構成を計算
                const adults_count = appState.data.adults_count || 2;
                const children_count = appState.data.children_count || 0;
                appState.data.members_count = adults_count + children_count;
                
                // 子供の年齢帯を設定
                const childAgeBands = [];
                if (appState.data.children_ages && appState.data.children_ages.length > 0) {
                    for (const ageRange of appState.data.children_ages) {
                        if (ageRange === '0-2') childAgeBands.push('preschool');
                        else if (ageRange === '3-5') childAgeBands.push('preschool');
                        else if (ageRange === '6-12') childAgeBands.push('elementary');
                        else if (ageRange === '13-18') childAgeBands.push('junior_high');
                        else childAgeBands.push('preschool');
                    }
                }
                
                // 年齢が指定されていない子供はpreschoolをデフォルトに
                while (childAgeBands.length < children_count) {
                    childAgeBands.push('preschool');
                }
                
                appState.data.members = [
                    ...Array(adults_count).fill({ gender: 'unknown', age_band: 'adult' }),
                    ...childAgeBands.map(band => ({ gender: 'unknown', age_band: band }))
                ];
                
                // 必須フィールドのデフォルト値を設定
                appState.data.budget_distribution = appState.data.budget_distribution || 'average';
                appState.data.dislikes = appState.data.family_dislikes || [];
                appState.data.allergies = appState.data.allergies || { standard: [], free_text: [] };
                
                const householdRes = await axios.post('/api/households', appState.data);
                const household_id = householdRes.data.household_id;
                appState.householdId = household_id; // household_idを保存

                const planRes = await axios.post('/api/plans/generate', { 
                    household_id,
                    menu_variety: appState.data.menu_variety || 'balanced'
                });
                appState.planId = planRes.data.plan_id;
                
                // 成功メッセージ
                messagesEl.innerHTML = \`
                    <div class="flex flex-col items-center justify-center py-12">
                        <div class="text-6xl mb-4">🎉</div>
                        <h3 class="text-3xl font-bold text-gray-800 mb-2">献立が完成しました！</h3>
                        <p class="text-gray-600">30日分の献立をご覧ください</p>
                    </div>
                \`;
                
                setTimeout(() => {
                    document.getElementById('chat-container').classList.add('hidden');
                    showCalendar(planRes.data.days);
                }, 2000);

            } catch (error) {
                console.error(error);
                messagesEl.innerHTML = \`
                    <div class="flex flex-col items-center justify-center py-12">
                        <div class="text-6xl mb-4">😢</div>
                        <h3 class="text-2xl font-bold text-red-600 mb-2">エラーが発生しました</h3>
                        <p class="text-gray-600 mb-4">もう一度お試しください</p>
                        <button onclick="location.reload()" class="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                            最初からやり直す
                        </button>
                    </div>
                \`;
            }
        }

        function showCalendar(days) {
            calendarContainerEl.classList.remove('hidden');
            
            // 印刷用のタイトル設定
            if (days.length > 0) {
                const startDate = days[0].date;
                const endDate = days[days.length - 1].date;
                document.getElementById('print-period').textContent = \`期間: \${startDate} 〜 \${endDate}\`;
            }
            
            let html = '';
            
            // 10日ごとにグループ化
            for (let i = 0; i < days.length; i += 10) {
                const chunk = days.slice(i, i + 10);
                const pageBreakClass = (i + 10 < days.length) ? 'page-break-after-10' : '';
                
                html += \`<div class="calendar-page \${pageBreakClass}">\`;
                html += '<div class="calendar-grid">';
                
                chunk.forEach(day => {
                    const recipes = day.recipes || [];
                    const main = recipes.find(r => r.role === 'main');
                    const side = recipes.find(r => r.role === 'side');
                    const soup = recipes.find(r => r.role === 'soup');
                    
                    const dayOfWeek = ['日', '月', '火', '水', '木', '金', '土'][new Date(day.date).getDay()];

                    html += \`
                        <div class="day-card" data-plan-day-id="\${day.plan_day_id || ''}" data-date="\${day.date}">
                            <div class="day-date text-lg font-bold text-gray-800 mb-3 border-b pb-2">
                                \${day.date} (\${dayOfWeek})
                            </div>
                            <div class="space-y-2 text-sm">
                                \${main ? \`<div class="recipe-item flex items-start"><span class="recipe-badge badge-main mt-1"></span><span class="flex-1"><span class="font-semibold text-red-600">主菜:</span> \${main.title}</span></div>\` : ''}
                                \${side ? \`<div class="recipe-item flex items-start"><span class="recipe-badge badge-side mt-1"></span><span class="flex-1"><span class="font-semibold text-green-600">副菜:</span> \${side.title}</span></div>\` : ''}
                                \${soup ? \`<div class="recipe-item flex items-start"><span class="recipe-badge badge-soup mt-1"></span><span class="flex-1"><span class="font-semibold text-blue-600">汁物:</span> \${soup.title}</span></div>\` : ''}
                            </div>
                            <div class="mt-3 text-xs text-gray-500 border-t pt-2">
                                <i class="far fa-clock"></i> 約\${day.estimated_time_min}分
                            </div>
                            <div class="mt-3 flex gap-2 no-print">
                                <button onclick="explainMenu('\${day.plan_day_id || ''}', '\${day.date}')" class="flex-1 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 text-xs font-medium transition-colors">
                                    <i class="fas fa-comment-dots"></i> なぜこの献立？
                                </button>
                                <button onclick="suggestChange('\${day.plan_day_id || ''}', '\${day.date}')" class="flex-1 px-3 py-2 bg-orange-50 text-orange-600 rounded-lg hover:bg-orange-100 text-xs font-medium transition-colors">
                                    <i class="fas fa-sync-alt"></i> 変更する
                                </button>
                            </div>
                        </div>
                    \`;
                });
                
                html += '</div></div>';
            }
            
            calendarContentEl.innerHTML = html;
            
            // カレンダー下部の広告を読み込み
            loadAds('calendar_page');
        }
        
        // ========================================
        // 広告読み込み
        // ========================================
        async function loadAds(page_location) {
            try {
                const res = await axios.get(\`/api/ads/\${page_location}\`);
                const ads = res.data.ads || [];
                
                ads.forEach(ad => {
                    const containerId = getAdContainerId(ad.slot_name);
                    const container = document.getElementById(containerId);
                    if (!container) return;
                    
                    // 広告を表示
                    if (ad.html_code) {
                        container.innerHTML = ad.html_code;
                    } else if (ad.image_url) {
                        container.innerHTML = \`<a href="\${ad.link_url}" target="_blank" onclick="trackAdClick('\${ad.ad_id}')">
                            <img src="\${ad.image_url}" alt="\${ad.title}" style="max-width:\${ad.width}px;max-height:\${ad.height}px;">
                        </a>\`;
                    }
                    
                    // インプレッション記録
                    trackAdImpression(ad.ad_id, page_location);
                });
            } catch (error) {
                console.error('広告読み込みエラー:', error);
            }
        }
        
        function getAdContainerId(slot_name) {
            const map = {
                'TOPページヘッダーバナー': 'ad-top-header',
                'TOPページサイドバー': 'ad-sidebar',
                'カレンダーページ下部バナー': 'ad-calendar-bottom'
            };
            return map[slot_name] || 'ad-container';
        }
        
        async function trackAdClick(ad_id) {
            try {
                await axios.post('/api/ads/track/click', { ad_id });
            } catch (error) {
                console.error('クリック追跡エラー:', error);
            }
        }
        
        async function trackAdImpression(ad_id, page_location) {
            try {
                await axios.post('/api/ads/track/impression', { ad_id, page_location });
            } catch (error) {
                console.error('表示追跡エラー:', error);
            }
        }
        
        // ========================================
        // メルマガ登録
        // ========================================
        async function subscribeNewsletter() {
            const emailInput = document.getElementById('newsletter-email');
            const messageEl = document.getElementById('newsletter-message');
            const email = emailInput.value.trim();
            
            if (!email) {
                messageEl.textContent = 'メールアドレスを入力してください';
                messageEl.className = 'text-sm mt-2 text-red-500';
                return;
            }
            
            try {
                const res = await axios.post('/api/newsletter/subscribe', { email });
                messageEl.textContent = res.data.message;
                messageEl.className = 'text-sm mt-2 text-green-600';
                emailInput.value = '';
            } catch (error) {
                messageEl.textContent = 'エラーが発生しました';
                messageEl.className = 'text-sm mt-2 text-red-500';
            }
        }
        
        // ========================================
        // お問い合わせフォーム
        // ========================================
        function openContactForm() {
            const modal = document.getElementById('contact-modal');
            modal.classList.remove('hidden');
            modal.classList.add('flex');
        }
        
        function closeContactForm() {
            const modal = document.getElementById('contact-modal');
            modal.classList.add('hidden');
            modal.classList.remove('flex');
            
            // フォームをクリア
            document.getElementById('contact-name').value = '';
            document.getElementById('contact-email').value = '';
            document.getElementById('contact-subject').value = '';
            document.getElementById('contact-message').value = '';
            document.getElementById('contact-message-result').textContent = '';
        }
        
        async function submitContact() {
            const name = document.getElementById('contact-name').value.trim();
            const email = document.getElementById('contact-email').value.trim();
            const subject = document.getElementById('contact-subject').value.trim();
            const message = document.getElementById('contact-message').value.trim();
            const resultEl = document.getElementById('contact-message-result');
            
            if (!name || !email || !subject || !message) {
                resultEl.textContent = 'すべての項目を入力してください';
                resultEl.className = 'text-sm text-center text-red-500';
                return;
            }
            
            try {
                const res = await axios.post('/api/support/create', { name, email, subject, message });
                resultEl.textContent = res.data.message;
                resultEl.className = 'text-sm text-center text-green-600';
                
                setTimeout(() => {
                    closeContactForm();
                }, 2000);
            } catch (error) {
                resultEl.textContent = 'エラーが発生しました';
                resultEl.className = 'text-sm text-center text-red-500';
            }
        }

        // ========================================
        // AI対話機能
        // ========================================
        async function explainMenu(planDayId, date) {
            if (!planDayId) {
                alert('献立情報が見つかりません');
                return;
            }
            
            // モーダルを表示
            const modal = document.getElementById('ai-modal');
            const title = document.getElementById('ai-modal-title');
            const content = document.getElementById('ai-modal-content');
            
            title.textContent = \`\${date}の献立について\`;
            content.innerHTML = '<div class="text-center py-8"><i class="fas fa-spinner fa-spin text-3xl text-blue-500"></i><p class="mt-4 text-gray-600">AIが説明を生成中...</p></div>';
            modal.classList.remove('hidden');
            modal.classList.add('flex');
            
            try {
                const res = await axios.post('/api/ai/explain-menu', {
                    plan_day_id: planDayId,
                    household_id: appState.householdId
                });
                
                content.innerHTML = \`
                    <div class="prose max-w-none">
                        <div class="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg">
                            <p class="text-gray-800 leading-relaxed">\${res.data.explanation}</p>
                        </div>
                    </div>
                \`;
            } catch (error) {
                content.innerHTML = \`
                    <div class="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
                        <p class="text-red-700">エラーが発生しました。もう一度お試しください。</p>
                    </div>
                \`;
            }
        }
        
        async function suggestChange(planDayId, date) {
            if (!planDayId) {
                alert('献立情報が見つかりません');
                return;
            }
            
            const userRequest = prompt(\`\${date}の献立をどのように変更しますか？\\n\\n例：\\n・魚が多いので肉料理に変えて\\n・もっと時短にして（15分以内）\\n・野菜を多めにして\`);
            
            if (!userRequest) return;
            
            // モーダルを表示
            const modal = document.getElementById('ai-modal');
            const title = document.getElementById('ai-modal-title');
            const content = document.getElementById('ai-modal-content');
            
            title.textContent = '献立変更の提案';
            content.innerHTML = '<div class="text-center py-8"><i class="fas fa-spinner fa-spin text-3xl text-orange-500"></i><p class="mt-4 text-gray-600">AIが提案を作成中...</p></div>';
            modal.classList.remove('hidden');
            modal.classList.add('flex');
            
            try {
                const res = await axios.post('/api/ai/suggest-adjustment', {
                    plan_day_id: planDayId,
                    household_id: appState.householdId,
                    user_request: userRequest
                });
                
                content.innerHTML = \`
                    <div class="prose max-w-none">
                        <div class="bg-orange-50 border-l-4 border-orange-500 p-4 rounded-lg mb-4">
                            <p class="text-sm text-gray-600 mb-2"><strong>あなたの要望：</strong></p>
                            <p class="text-gray-800">\${userRequest}</p>
                        </div>
                        <div class="bg-green-50 border-l-4 border-green-500 p-4 rounded-lg">
                            <p class="text-sm text-gray-600 mb-2"><strong>AIの提案：</strong></p>
                            <p class="text-gray-800 leading-relaxed whitespace-pre-wrap">\${res.data.suggestion}</p>
                        </div>
                    </div>
                \`;
            } catch (error) {
                content.innerHTML = \`
                    <div class="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
                        <p class="text-red-700">エラーが発生しました。もう一度お試しください。</p>
                    </div>
                \`;
            }
        }
        
        function closeAIModal() {
            const modal = document.getElementById('ai-modal');
            modal.classList.add('hidden');
            modal.classList.remove('flex');
        }

        window.addEventListener('DOMContentLoaded', () => {
            const question = questions[0];
            addMessage(question.text);
            showInput(question);
            
            // TOPページの広告を読み込み
            loadAds('top_page');
        });
    </script>
    
    <!-- AIモーダル -->
    <div id="ai-modal" class="hidden fixed inset-0 bg-black bg-opacity-50 items-center justify-center z-50 p-4" style="backdrop-filter: blur(4px);">
        <div class="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
            <div class="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-4 flex justify-between items-center">
                <h3 id="ai-modal-title" class="text-xl font-bold text-white"></h3>
                <button onclick="closeAIModal()" class="text-white hover:text-gray-200 transition-colors">
                    <i class="fas fa-times text-2xl"></i>
                </button>
            </div>
            <div id="ai-modal-content" class="p-6 overflow-y-auto" style="max-height: calc(80vh - 80px);">
                <!-- コンテンツはJavaScriptで動的に挿入 -->
            </div>
        </div>
    </div>

</body>
</html>
`;

const app = new Hono<{ Bindings: Bindings }>()

// CORS有効化
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
      body.months,
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
    const body = await readJson(req);
    if (!body.household_id) return badRequest("household_id is required");

    const household = await env.DB.prepare(
      `SELECT * FROM households WHERE household_id = ?`
    ).bind(body.household_id).first() as any;

    if (!household) return badRequest("household not found");

    const plan_id = uuid();
    const menu_variety = body.menu_variety || 'balanced';
    
    // 期間計算
    const period = buildPeriod(household.start_date, household.months);
    
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
    
    // 全レシピを人気度順に取得
    const allMainRecipes = await env.DB.prepare(
      `SELECT * FROM recipes WHERE role='main' ${popularityFilter} ORDER BY popularity DESC, RANDOM()`
    ).all();
    
    const allSideRecipes = await env.DB.prepare(
      `SELECT * FROM recipes WHERE role='side' ${popularityFilter} ORDER BY popularity DESC, RANDOM()`
    ).all();
    
    const allSoupRecipes = await env.DB.prepare(
      `SELECT * FROM recipes WHERE role='soup' ${popularityFilter} ORDER BY popularity DESC, RANDOM()`
    ).all();

    let mainRecipes = (allMainRecipes.results ?? []) as any[];
    let sideRecipes = (allSideRecipes.results ?? []) as any[];
    let soupRecipes = (allSoupRecipes.results ?? []) as any[];
    
    // レシピが不足している場合は全体から取得
    if (mainRecipes.length < 30) {
      const fallback = await env.DB.prepare(
        `SELECT * FROM recipes WHERE role='main' ORDER BY popularity DESC, RANDOM()`
      ).all();
      mainRecipes = (fallback.results ?? []) as any[];
    }
    if (sideRecipes.length < 30) {
      const fallback = await env.DB.prepare(
        `SELECT * FROM recipes WHERE role='side' ORDER BY popularity DESC, RANDOM()`
      ).all();
      sideRecipes = (fallback.results ?? []) as any[];
    }
    if (soupRecipes.length < 30) {
      const fallback = await env.DB.prepare(
        `SELECT * FROM recipes WHERE role='soup' ORDER BY popularity DESC, RANDOM()`
      ).all();
      soupRecipes = (fallback.results ?? []) as any[];
    }

    if (mainRecipes.length === 0 || sideRecipes.length === 0 || soupRecipes.length === 0) {
      return badRequest("Not enough recipes in database");
    }

    // プラン作成
    await env.DB.prepare(
      `INSERT INTO meal_plans (plan_id, household_id, start_date, months, status)
       VALUES (?, ?, ?, ?, 'generated')`
    ).bind(plan_id, body.household_id, household.start_date, household.months).run();

    // 各日の献立作成（バラエティを持たせる）
    const days: any[] = [];
    let mainIndex = 0;
    let sideIndex = 0;
    let soupIndex = 0;
    
    for (const date of period.dates) {
      // 循環させて選択（同じレシピが連続しないように）
      const main = mainRecipes[mainIndex % mainRecipes.length];
      const side = sideRecipes[sideIndex % sideRecipes.length];
      const soup = soupRecipes[soupIndex % soupRecipes.length];
      
      mainIndex++;
      sideIndex++;
      soupIndex++;
      
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
        date,
        recipes: [
          { role: "main", recipe_id: main.recipe_id, title: main.title, time_min: main.time_min },
          { role: "side", recipe_id: side.recipe_id, title: side.title, time_min: side.time_min },
          { role: "soup", recipe_id: soup.recipe_id, title: soup.title, time_min: soup.time_min }
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
      
      return json({ suggestion });
    } catch (error: any) {
      console.error('OpenAI API error:', error);
      return json({ error: { message: error.message } }, 500);
    }
  }

  // ========================================
  // メルマガAPI（簡易版）
  // ========================================
  
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
