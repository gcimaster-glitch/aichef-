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
        
        /* 月表示カレンダー用スタイル */
        .calendar-grid-month {
            display: grid;
            grid-template-columns: repeat(7, 1fr);
            gap: 1px;
            background-color: #e5e7eb;
            border: 1px solid #e5e7eb;
        }
        
        .calendar-header {
            background-color: #f3f4f6;
            padding: 8px;
            text-align: center;
            font-weight: bold;
            font-size: 14px;
        }
        
        .calendar-day-cell {
            background-color: white;
            padding: 8px;
            min-height: 120px;
            position: relative;
            cursor: pointer;
            transition: all 0.2s;
        }
        
        .calendar-day-cell:hover {
            background-color: #f9fafb;
        }
        
        .calendar-day-empty {
            background-color: #f9fafb;
            padding: 8px;
            min-height: 120px;
        }
        
        .calendar-day-number {
            font-weight: bold;
            font-size: 16px;
            margin-bottom: 4px;
            color: #374151;
        }
        
        .calendar-day-content {
            font-size: 11px;
            color: #6b7280;
        }
        
        .calendar-day-actions {
            position: absolute;
            bottom: 4px;
            right: 4px;
            display: flex;
            gap: 4px;
            opacity: 0;
            transition: opacity 0.2s;
        }
        
        .calendar-day-cell:hover .calendar-day-actions {
            opacity: 1;
        }
        
        .calendar-btn {
            background-color: #3b82f6;
            color: white;
            border: none;
            padding: 4px 8px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 12px;
            transition: background-color 0.2s;
        }
        
        .calendar-btn:hover {
            background-color: #2563eb;
        }
        
        /* アニメーションバナー用スタイル */
        @keyframes gradient {
            0% {
                background-position: 0% 50%;
            }
            50% {
                background-position: 100% 50%;
            }
            100% {
                background-position: 0% 50%;
            }
        }
        
        @keyframes fade-in {
            from {
                opacity: 0;
                transform: translateY(-10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .animate-gradient {
            background-size: 200% 200%;
            animation: gradient 4s ease infinite;
        }
        
        .animate-fade-in {
            animation: fade-in 1s ease-out;
        }
    </style>
</head>
<body class="bg-gray-50">
    <div id="app" class="container mx-auto px-4 py-8 max-w-6xl">
        <!-- ヘッダー -->
        <!-- アプリヘッダー - 横長バナー -->
        <div class="no-print mb-8 relative overflow-hidden rounded-2xl" style="height: 200px;">
            <div class="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 animate-gradient"></div>
            <div class="absolute inset-0 flex items-center justify-center">
                <div class="text-center text-white px-4">
                    <div class="flex items-center justify-center gap-3 mb-2">
                        <i class="fas fa-utensils text-5xl"></i>
                        <h1 class="text-5xl md:text-6xl font-bold" style="text-shadow: 3px 3px 6px rgba(0,0,0,0.3);">
                            AICHEFS
                        </h1>
                    </div>
                    <h2 class="text-2xl md:text-3xl font-bold mb-3" style="text-shadow: 2px 2px 4px rgba(0,0,0,0.3);">
                        AIシェフ
                    </h2>
                    <p class="text-lg md:text-xl opacity-95" style="text-shadow: 1px 1px 2px rgba(0,0,0,0.3);">
                        考えなくていい、悩まなくていい。今日から1ヶ月分の晩ごはんが決まります。
                    </p>
                </div>
            </div>
            <div class="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/20 to-transparent"></div>
        </div>

        <!-- TOPページヘッダー広告 -->
        <div id="ad-top-header" class="ad-container no-print mb-6" style="display:flex;justify-content:center;"></div>

        <!-- チャットエリア -->
        <div id="chat-container" class="bg-white rounded-lg shadow-lg p-6 mb-6">
            <div id="messages" class="space-y-4 mb-6"></div>
            <div id="input-area"></div>
        </div>

        <!-- 献立カレンダー（生成後に表示） -->
        <div id="calendar-container" class="hidden bg-white rounded-lg shadow-lg p-6">
            <!-- 献立ページ上部アニメーションバナー -->
            <div class="no-print mb-6 relative overflow-hidden rounded-2xl" style="height: 160px;">
                <div class="absolute inset-0 bg-gradient-to-r from-orange-400 via-pink-500 to-purple-600 animate-gradient"></div>
                <div class="absolute inset-0 flex items-center justify-center">
                    <div class="text-center text-white px-4">
                        <div class="flex items-center justify-center gap-3 mb-2">
                            <i class="fas fa-calendar-alt text-4xl"></i>
                            <h2 class="text-4xl md:text-5xl font-bold" style="text-shadow: 2px 2px 4px rgba(0,0,0,0.3);">
                                今日の献立、明日の笑顔
                            </h2>
                        </div>
                        <p class="text-lg md:text-xl opacity-90" style="text-shadow: 1px 1px 2px rgba(0,0,0,0.3);">
                            30日分の献立があなたの毎日を彩ります
                        </p>
                    </div>
                </div>
                <!-- アニメーション装飾 -->
                <div class="absolute top-4 left-4 animate-bounce" style="animation-delay: 0.2s;">
                    <i class="fas fa-utensils text-white text-2xl opacity-30"></i>
                </div>
                <div class="absolute bottom-4 right-4 animate-bounce" style="animation-delay: 0.5s;">
                    <i class="fas fa-heart text-white text-2xl opacity-30"></i>
                </div>
                <div class="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white/20 to-transparent"></div>
            </div>
            
            <div class="flex justify-between items-center mb-6 no-print">
                <h2 class="text-3xl font-bold">
                    <i class="fas fa-calendar-alt mr-2"></i>
                    1ヶ月分の献立
                </h2>
                <div class="flex gap-2 flex-wrap">
                    <button onclick="showHistory()" class="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition flex items-center gap-2 text-sm">
                        <i class="fas fa-history"></i>
                        履歴
                    </button>
                    <button onclick="showFavorites()" class="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition flex items-center gap-2 text-sm">
                        <i class="fas fa-heart"></i>
                        お気に入り
                    </button>
                    <button onclick="toggleCalendarView()" class="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition flex items-center gap-2 text-sm">
                        <i class="fas fa-calendar"></i>
                        <span id="view-toggle-text">月表示</span>
                    </button>
                    <button onclick="generateShoppingList()" class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition flex items-center gap-2 text-sm">
                        <i class="fas fa-shopping-cart"></i>
                        買い物リスト
                    </button>
                    <button onclick="exportToGoogleCalendar()" class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition flex items-center gap-2 text-sm">
                        <i class="fab fa-google"></i>
                        カレンダー連携
                    </button>
                    <button onclick="window.print()" class="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition flex items-center gap-2">
                        <i class="fas fa-print"></i>
                        印刷する
                    </button>
                </div>
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
        <footer class="no-print mt-8 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-4">
            <div class="flex flex-col md:flex-row items-center justify-between gap-4 max-w-4xl mx-auto">
                <!-- メルマガ登録（コンパクト） -->
                <div class="flex items-center gap-2 flex-1 w-full md:w-auto">
                    <i class="fas fa-envelope text-gray-400"></i>
                    <input type="email" id="newsletter-email" placeholder="メールアドレス" 
                           class="flex-1 px-3 py-1.5 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-blue-500">
                    <button onclick="subscribeNewsletter()" 
                            class="px-4 py-1.5 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition whitespace-nowrap">
                        登録
                    </button>
                </div>
                
                <!-- お問い合わせ（コンパクト） -->
                <button onclick="openContactForm()" 
                        class="px-4 py-1.5 text-sm text-gray-600 hover:text-blue-500 transition whitespace-nowrap">
                    <i class="fas fa-comment-dots mr-1"></i>
                    お問い合わせ
                </button>
            </div>
            
            <p id="newsletter-message" class="text-xs text-center mt-2"></p>
            
            <!-- サイドバー広告枠 -->
            <div id="ad-sidebar" class="ad-container mt-4" style="display:flex;justify-content:center;"></div>
            
            <div class="text-center text-gray-400 text-xs mt-4">
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
                id: 'supervisor_mode',
                type: 'choice',
                text: 'どんな献立スタイルがお好みですか？<br>（監修者を選んでください）',
                field: 'supervisor_mode',
                options: [
                    { label: '一般（バランス重視）', value: 'general' },
                    { label: '栄養士監修（栄養バランス最優先）', value: 'nutritionist' },
                    { label: 'イケイケママ監修（おしゃれ＆映える料理）', value: 'trendy_mom' },
                    { label: '家族ダイエット（低カロリー重視）', value: 'diet' },
                    { label: '高カロリー好きパパ監修（ボリューム満点）', value: 'high_calorie_dad' },
                    { label: '時短ママ監修（15分で完成）', value: 'quick_mom' },
                    { label: '節約主婦監修（コスパ最優先）', value: 'budget_conscious' },
                    { label: 'グルメパパ監修（本格派レストラン風）', value: 'gourmet_dad' },
                    { label: '和食中心（伝統的な日本料理）', value: 'japanese_traditional' },
                    { label: '洋食中心（パスタ・グラタン多め）', value: 'western' },
                    { label: '中華好き（中華料理多め）', value: 'chinese' },
                    { label: 'エスニック好き（アジア料理）', value: 'ethnic' },
                    { label: '子供大好きメニュー（子供ウケ重視）', value: 'kids_favorite' },
                    { label: 'アスリート家族（高タンパク質）', value: 'athlete' },
                    { label: 'ベジタリアン寄り（野菜中心）', value: 'vegetarian_oriented' },
                    { label: '魚好き家族（魚料理多め）', value: 'fish_lover' },
                    { label: '肉好き家族（肉料理多め）', value: 'meat_lover' },
                    { label: 'シニア向け（やわらかめ・薄味）', value: 'senior_friendly' },
                    { label: '作り置き中心（週末まとめて調理）', value: 'meal_prep' },
                    { label: 'ワンプレート（カフェ風盛り付け）', value: 'one_plate' }
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
                id: 'title',
                type: 'text',
                text: 'この献立にタイトルをつけてください<br>（例：「岩間家の1月」「我が家の献立」）',
                field: 'title',
                placeholder: '献立のタイトル'
            },
            {
                id: 'email',
                type: 'text',
                text: '献立をメールで受け取りますか？<br>メールアドレスを入力してください（任意）',
                field: 'email',
                placeholder: 'example@gmail.com',
                optional: true
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
                input.type = question.field === 'email' ? 'email' : 'text';
                input.className = 'w-full px-4 py-2 border rounded';
                input.placeholder = question.placeholder || '';
                
                const btnGroup = document.createElement('div');
                btnGroup.className = 'flex gap-2 mt-2';
                
                // 戻るボタン
                if (appState.step > 0) {
                    const backBtn = document.createElement('button');
                    backBtn.className = 'px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400';
                    backBtn.textContent = '← 戻る';
                    backBtn.onclick = () => prevStep();
                    btnGroup.appendChild(backBtn);
                }
                
                const btn = document.createElement('button');
                btn.className = 'flex-1 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600';
                btn.textContent = '次へ';
                btn.onclick = () => {
                    const value = input.value.trim();
                    // optionalフィールドは空でもOK
                    if (value || question.optional) {
                        if (value) {
                            appState.data[question.field] = value;
                            addMessage(value, false);
                        } else {
                            addMessage('（スキップ）', false);
                        }
                        nextStep();
                    } else {
                        alert('入力してください');
                    }
                };
                btnGroup.appendChild(btn);
                
                // optionalフィールドにはスキップボタンを追加
                if (question.optional) {
                    const skipBtn = document.createElement('button');
                    skipBtn.className = 'px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400';
                    skipBtn.textContent = 'スキップ';
                    skipBtn.onclick = () => {
                        addMessage('（スキップ）', false);
                        nextStep();
                    };
                    btnGroup.appendChild(skipBtn);
                }
                
                inputAreaEl.appendChild(input);
                inputAreaEl.appendChild(btnGroup);
            }
            else if (question.type === 'date') {
                const input = document.createElement('input');
                input.type = 'date';
                input.className = 'w-full px-4 py-2 border rounded';
                input.value = new Date().toISOString().split('T')[0];
                
                const btnGroup = document.createElement('div');
                btnGroup.className = 'flex gap-2 mt-2';
                
                // 戻るボタン
                if (appState.step > 0) {
                    const backBtn = document.createElement('button');
                    backBtn.className = 'px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400';
                    backBtn.textContent = '← 戻る';
                    backBtn.onclick = () => prevStep();
                    btnGroup.appendChild(backBtn);
                }
                
                const btn = document.createElement('button');
                btn.className = 'flex-1 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600';
                btn.textContent = '次へ';
                btn.onclick = () => {
                    appState.data[question.field] = input.value;
                    addMessage(input.value, false);
                    nextStep();
                };
                btnGroup.appendChild(btn);
                
                inputAreaEl.appendChild(input);
                inputAreaEl.appendChild(btnGroup);
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
                const container = document.createElement('div');
                
                const btnContainer = document.createElement('div');
                btnContainer.className = 'flex flex-wrap gap-2 mb-2';
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
                container.appendChild(btnContainer);
                
                // 戻るボタン
                if (appState.step > 0) {
                    const backBtn = document.createElement('button');
                    backBtn.className = 'mt-2 px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400';
                    backBtn.textContent = '← 戻る';
                    backBtn.onclick = () => prevStep();
                    container.appendChild(backBtn);
                }
                
                inputAreaEl.appendChild(container);
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
                confirmBtn.className = 'flex-1 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600';
                confirmBtn.textContent = '次へ';
                confirmBtn.onclick = () => {
                    appState.data.allergies.standard = Array.from(selected).filter(v => v !== 'none');
                    const msg = selected.size === 0 || selected.has('none') ? 'なし' : Array.from(selected).join(', ');
                    addMessage(msg, false);
                    nextStep();
                };
                
                const btnGroup = document.createElement('div');
                btnGroup.className = 'flex gap-2';
                
                // 戻るボタン
                if (appState.step > 0) {
                    const backBtn = document.createElement('button');
                    backBtn.className = 'px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400';
                    backBtn.textContent = '← 戻る';
                    backBtn.onclick = () => prevStep();
                    btnGroup.appendChild(backBtn);
                }
                
                btnGroup.appendChild(confirmBtn);
                
                inputAreaEl.appendChild(btnContainer);
                inputAreaEl.appendChild(btnGroup);
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
                
                const btnGroup = document.createElement('div');
                btnGroup.className = 'flex gap-2';
                
                // 戻るボタン
                const backBtn = document.createElement('button');
                backBtn.className = 'px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400';
                backBtn.textContent = '← 戻る';
                backBtn.onclick = () => prevStep();
                btnGroup.appendChild(backBtn);
                
                const btn = document.createElement('button');
                btn.className = 'flex-1 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600';
                btn.textContent = '献立を作成する';
                btn.onclick = async () => {
                    btn.disabled = true;
                    btn.textContent = '生成中...';
                    await generatePlan();
                };
                btnGroup.appendChild(btn);
                
                inputAreaEl.appendChild(btnGroup);
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
        
        function prevStep() {
            // 最初の質問より前には戻れない
            if (appState.step <= 0) {
                return;
            }
            
            // 条件付き質問を考慮して前の質問を探す
            let prevIndex = appState.step - 1;
            while (prevIndex >= 0) {
                const question = questions[prevIndex];
                // condition関数がある場合は条件をチェック
                if (question.condition && !question.condition(appState.data)) {
                    prevIndex--;
                    continue;
                }
                break;
            }
            
            if (prevIndex >= 0) {
                appState.step = prevIndex;
                const question = questions[appState.step];
                
                // メッセージエリアをクリア
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
                    menu_variety: appState.data.menu_variety || 'balanced',
                    supervisor_mode: appState.data.supervisor_mode || 'general'
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
                console.error('献立生成エラー:', error);
                console.error('エラー詳細:', error.response?.data);
                console.error('エラーステータス:', error.response?.status);
                console.error('エラーメッセージ:', error.message);
                console.error('完全なエラーオブジェクト:', JSON.stringify(error, null, 2));
                
                let errorMessage = 'もう一度お試しください';
                let errorDetails = '';
                
                if (error.response) {
                    // サーバーからのレスポンスがある場合
                    if (error.response.data?.error?.message) {
                        errorMessage = error.response.data.error.message;
                        errorDetails = error.response.data.error.details || '';
                    } else if (error.response.data?.message) {
                        errorMessage = error.response.data.message;
                    } else {
                        errorMessage = \`サーバーエラー (ステータス: \${error.response.status})\`;
                        errorDetails = JSON.stringify(error.response.data);
                    }
                } else if (error.request) {
                    // リクエストは送られたがレスポンスがない
                    errorMessage = 'サーバーに接続できませんでした';
                    errorDetails = 'ネットワーク接続を確認してください';
                } else if (error.message) {
                    // リクエスト設定時のエラー
                    errorMessage = error.message;
                }
                
                messagesEl.innerHTML = \`
                    <div class="flex flex-col items-center justify-center py-12">
                        <div class="text-6xl mb-4">😢</div>
                        <h3 class="text-2xl font-bold text-red-600 mb-2">エラーが発生しました</h3>
                        <p class="text-gray-600 mb-2">\${errorMessage}</p>
                        \${errorDetails ? \`<p class="text-sm text-gray-500 mb-4">\${errorDetails}</p>\` : ''}
                        <button onclick="location.reload()" class="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                            最初からやり直す
                        </button>
                    </div>
                \`;
            }
        }

        let currentViewMode = 'grid'; // 'grid' or 'calendar'
        let calendarData = [];
        
        function showCalendar(days) {
            calendarData = days; // データを保存
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
                        <div class="day-card" data-plan-day-id="\${day.plan_day_id || ''}" data-date="\${day.date}" 
                             draggable="true" ondragstart="handleDragStart(event)" ondragover="handleDragOver(event)" 
                             ondrop="handleDrop(event)" ondragend="handleDragEnd(event)" style="cursor: move;">
                            <div class="day-date text-lg font-bold text-gray-800 mb-3 border-b pb-2 flex justify-between items-center">
                                <span>\${day.date} (\${dayOfWeek})</span>
                                <i class="fas fa-grip-vertical text-gray-400 text-sm"></i>
                            </div>
                            <div class="space-y-2 text-sm">
                                \${main ? \`<div class="recipe-item flex items-start"><span class="recipe-badge badge-main mt-1"></span><span class="flex-1"><span class="font-semibold text-red-600">主菜:</span> <a href="javascript:void(0)" onclick="showRecipeDetail('\${main.recipe_id}', '\${main.title}')" class="text-blue-600 hover:underline cursor-pointer">\${main.title}</a></span></div>\` : ''}
                                \${side ? \`<div class="recipe-item flex items-start"><span class="recipe-badge badge-side mt-1"></span><span class="flex-1"><span class="font-semibold text-green-600">副菜:</span> <a href="javascript:void(0)" onclick="showRecipeDetail('\${side.recipe_id}', '\${side.title}')" class="text-blue-600 hover:underline cursor-pointer">\${side.title}</a></span></div>\` : ''}
                                \${soup ? \`<div class="recipe-item flex items-start"><span class="recipe-badge badge-soup mt-1"></span><span class="flex-1"><span class="font-semibold text-blue-600">汁物:</span> <a href="javascript:void(0)" onclick="showRecipeDetail('\${soup.recipe_id}', '\${soup.title}')" class="text-blue-600 hover:underline cursor-pointer">\${soup.title}</a></span></div>\` : ''}
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
                
                // 代替レシピのHTML生成
                let alternativesHtml = '';
                if (res.data.alternatives && res.data.alternatives.length > 0) {
                    alternativesHtml = \`
                        <div class="mt-4 pt-4 border-t">
                            <p class="text-sm font-semibold text-gray-700 mb-3">💡 おすすめの代替レシピ（クリックで差し替え）</p>
                            <div class="space-y-2">
                                \${res.data.alternatives.map((alt, index) => \`
                                    <button onclick="replaceRecipe('\${planDayId}', '\${alt.role}', '\${alt.recipe_id}', '\${alt.title}')" 
                                            class="w-full text-left px-4 py-3 bg-white border-2 border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-all">
                                        <div class="flex items-center justify-between">
                                            <div>
                                                <span class="font-medium text-gray-800">\${index + 1}. \${alt.title}</span>
                                                <span class="text-xs text-gray-500 ml-2">約\${alt.time_min}分</span>
                                            </div>
                                            <i class="fas fa-arrow-right text-green-600"></i>
                                        </div>
                                    </button>
                                \`).join('')}
                            </div>
                        </div>
                    \`;
                }
                
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
                        \${alternativesHtml}
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
        
        async function replaceRecipe(planDayId, role, newRecipeId, newRecipeTitle) {
            if (!confirm(\`「\${newRecipeTitle}」に差し替えますか？\`)) {
                return;
            }
            
            try {
                const res = await axios.post('/api/plans/replace-recipe', {
                    plan_day_id: planDayId,
                    role: role,
                    new_recipe_id: newRecipeId
                });
                
                if (res.data.success) {
                    alert('献立を差し替えました！');
                    closeAIModal();
                    // 献立を再取得して表示を更新
                    await refreshCalendar();
                } else {
                    alert('差し替えに失敗しました');
                }
            } catch (error) {
                console.error(error);
                alert('エラーが発生しました');
            }
        }
        
        // ========================================
        // 表示切り替え機能
        // ========================================
        async function refreshCalendar() {
            if (!appState.planId) {
                return;
            }
            
            try {
                // プランの献立を再取得
                const res = await axios.get(\`/api/plans/\${appState.planId}\`);
                const days = res.data.days;
                
                // データを更新
                calendarData = days;
                
                // 現在の表示モードで再描画
                if (currentViewMode === 'calendar') {
                    renderCalendarView(days);
                } else {
                    renderGridView(days);
                }
            } catch (error) {
                console.error('カレンダー更新エラー:', error);
            }
        }
        
        function toggleCalendarView() {
            currentViewMode = currentViewMode === 'grid' ? 'calendar' : 'grid';
            const toggleText = document.getElementById('view-toggle-text');
            
            if (currentViewMode === 'calendar') {
                toggleText.textContent = 'リスト表示';
                renderCalendarView(calendarData);
            } else {
                toggleText.textContent = '月表示';
                renderGridView(calendarData);
            }
        }
        
        function renderCalendarView(days) {
            if (days.length === 0) return;
            
            const startDate = new Date(days[0].date);
            const endDate = new Date(days[days.length - 1].date);
            
            let html = '<div class="calendar-month-view">';
            
            // 月ごとに分割
            let currentMonth = startDate.getMonth();
            let currentYear = startDate.getFullYear();
            let monthDays = [];
            
            for (const day of days) {
                const dayDate = new Date(day.date);
                if (dayDate.getMonth() !== currentMonth || dayDate.getFullYear() !== currentYear) {
                    html += renderMonth(currentYear, currentMonth, monthDays);
                    monthDays = [];
                    currentMonth = dayDate.getMonth();
                    currentYear = dayDate.getFullYear();
                }
                monthDays.push(day);
            }
            
            // 最後の月
            if (monthDays.length > 0) {
                html += renderMonth(currentYear, currentMonth, monthDays);
            }
            
            html += '</div>';
            calendarContentEl.innerHTML = html;
        }
        
        function renderMonth(year, month, days) {
            const monthNames = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
            const daysInMonth = new Date(year, month + 1, 0).getDate();
            const firstDay = new Date(year, month, 1).getDay();
            
            let html = \`
                <div class="calendar-month mb-8">
                    <h3 class="text-2xl font-bold mb-4">\${year}年 \${monthNames[month]}</h3>
                    <div class="calendar-grid-month">
                        <div class="calendar-header">日</div>
                        <div class="calendar-header">月</div>
                        <div class="calendar-header">火</div>
                        <div class="calendar-header">水</div>
                        <div class="calendar-header">木</div>
                        <div class="calendar-header">金</div>
                        <div class="calendar-header">土</div>
            \`;
            
            // 空白セル（月の最初の日より前）
            for (let i = 0; i < firstDay; i++) {
                html += '<div class="calendar-day-empty"></div>';
            }
            
            // 日付セル
            const dayMap = {};
            days.forEach(day => {
                const date = new Date(day.date);
                dayMap[date.getDate()] = day;
            });
            
            for (let date = 1; date <= daysInMonth; date++) {
                const day = dayMap[date];
                
                if (day) {
                    const recipes = day.recipes || [];
                    const main = recipes.find(r => r.role === 'main');
                    const side = recipes.find(r => r.role === 'side');
                    const soup = recipes.find(r => r.role === 'soup');
                    
                    html += \`
                        <div class="calendar-day-cell" data-plan-day-id="\${day.plan_day_id}" data-date="\${day.date}"
                             draggable="true" ondragstart="handleDragStart(event)" ondragover="handleDragOver(event)" 
                             ondrop="handleDrop(event)" ondragend="handleDragEnd(event)" style="cursor: move;">
                            <div class="calendar-day-number">\${date} <i class="fas fa-grip-vertical text-gray-300 text-xs ml-1"></i></div>
                            <div class="calendar-day-content">
                                \${main ? \`<div class="text-xs truncate">🍖 \${main.title}</div>\` : ''}
                                \${side ? \`<div class="text-xs truncate">🥗 \${side.title}</div>\` : ''}
                                \${soup ? \`<div class="text-xs truncate">🍲 \${soup.title}</div>\` : ''}
                            </div>
                            <div class="calendar-day-actions no-print">
                                <button onclick="explainMenu('\${day.plan_day_id}', '\${day.date}')" class="calendar-btn">
                                    <i class="fas fa-comment-dots"></i>
                                </button>
                                <button onclick="suggestChange('\${day.plan_day_id}', '\${day.date}')" class="calendar-btn">
                                    <i class="fas fa-sync-alt"></i>
                                </button>
                            </div>
                        </div>
                    \`;
                } else {
                    html += \`<div class="calendar-day-empty">\${date}</div>\`;
                }
            }
            
            html += '</div></div>';
            return html;
        }
        
        function renderGridView(days) {
            // 元のグリッド表示に戻す
            let html = '';
            
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
                        <div class="day-card" data-plan-day-id="\${day.plan_day_id || ''}" data-date="\${day.date}" 
                             draggable="true" ondragstart="handleDragStart(event)" ondragover="handleDragOver(event)" 
                             ondrop="handleDrop(event)" ondragend="handleDragEnd(event)" style="cursor: move;">
                            <div class="day-date text-lg font-bold text-gray-800 mb-3 border-b pb-2 flex justify-between items-center">
                                <span>\${day.date} (\${dayOfWeek})</span>
                                <i class="fas fa-grip-vertical text-gray-400 text-sm"></i>
                            </div>
                            <div class="space-y-2 text-sm">
                                \${main ? \`<div class="recipe-item flex items-start"><span class="recipe-badge badge-main mt-1"></span><span class="flex-1"><span class="font-semibold text-red-600">主菜:</span> <a href="javascript:void(0)" onclick="showRecipeDetail('\${main.recipe_id}', '\${main.title}')" class="text-blue-600 hover:underline cursor-pointer">\${main.title}</a></span></div>\` : ''}
                                \${side ? \`<div class="recipe-item flex items-start"><span class="recipe-badge badge-side mt-1"></span><span class="flex-1"><span class="font-semibold text-green-600">副菜:</span> <a href="javascript:void(0)" onclick="showRecipeDetail('\${side.recipe_id}', '\${side.title}')" class="text-blue-600 hover:underline cursor-pointer">\${side.title}</a></span></div>\` : ''}
                                \${soup ? \`<div class="recipe-item flex items-start"><span class="recipe-badge badge-soup mt-1"></span><span class="flex-1"><span class="font-semibold text-blue-600">汁物:</span> <a href="javascript:void(0)" onclick="showRecipeDetail('\${soup.recipe_id}', '\${soup.title}')" class="text-blue-600 hover:underline cursor-pointer">\${soup.title}</a></span></div>\` : ''}
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
        }
        
        // ========================================
        // 買い物リスト生成
        // ========================================
        async function generateShoppingList() {
            if (!appState.planId) {
                alert('献立データがありません');
                return;
            }
            
            try {
                const res = await axios.get(\`/api/shopping-list/\${appState.planId}\`);
                const data = res.data;
                
                // モーダルを表示
                showShoppingListModal(data);
            } catch (error) {
                console.error('買い物リスト生成エラー:', error);
                alert('買い物リストの生成に失敗しました');
            }
        }
        
        function showShoppingListModal(data) {
            const modal = document.getElementById('shopping-modal');
            const content = document.getElementById('shopping-modal-content');
            
            // 期間情報を取得
            const periodInfo = data.weeks && data.weeks.length > 0 
                ? \`\${data.weeks[0].startDate} 〜 \${data.weeks[data.weeks.length - 1].endDate}\`
                : '期間不明';
            
            let html = \`
                <div class="mb-6 p-6 bg-gradient-to-r from-blue-50 to-green-50 rounded-xl border-2 border-blue-200">
                    <div class="flex items-center justify-between mb-3">
                        <h4 class="font-bold text-2xl text-gray-800 flex items-center gap-2">
                            <i class="fas fa-shopping-cart text-blue-600"></i>
                            買い物リスト
                        </h4>
                    </div>
                    <div class="flex items-center gap-4 text-sm">
                        <div class="flex items-center gap-2 bg-white px-3 py-2 rounded-lg shadow-sm">
                            <i class="fas fa-calendar-alt text-blue-600"></i>
                            <span class="font-semibold text-gray-700">期間:</span>
                            <span class="text-gray-900">\${periodInfo}</span>
                        </div>
                        <div class="flex items-center gap-2 bg-white px-3 py-2 rounded-lg shadow-sm">
                            <i class="fas fa-list text-green-600"></i>
                            <span class="font-semibold text-gray-700">合計:</span>
                            <span class="text-gray-900">\${data.totalItems} 品目</span>
                        </div>
                    </div>
                    <p class="text-xs text-gray-600 mt-2">
                        <i class="fas fa-info-circle"></i> この期間の全献立に必要な食材をまとめています
                    </p>
                </div>
            \`;
            
            // カテゴリ別に表示
            const categories = Object.keys(data.shoppingList).sort();
            
            categories.forEach(category => {
                const items = data.shoppingList[category];
                
                html += \`
                    <div class="mb-6">
                        <h5 class="font-bold text-md mb-3 pb-2 border-b border-gray-300 flex items-center gap-2">
                            <span class="text-xl">\${getCategoryIcon(category)}</span>
                            <span>\${category}</span>
                            <span class="text-sm text-gray-500">（\${items.length}品）</span>
                        </h5>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
                            \${items.map(item => \`
                                <div class="flex items-center p-2 bg-gray-50 rounded">
                                    <input type="checkbox" class="mr-3 w-4 h-4">
                                    <span class="flex-1">\${item.name}</span>
                                    <span class="text-sm text-gray-600 ml-2">\${item.quantity}\${item.unit}</span>
                                </div>
                            \`).join('')}
                        </div>
                    </div>
                \`;
            });
            
            // 週ごとの情報を表示
            if (data.weeks && data.weeks.length > 0) {
                html += \`
                    <div class="mt-6 p-4 bg-green-50 rounded-lg">
                        <h5 class="font-bold text-md mb-2">📅 週ごとの買い物スケジュール</h5>
                        <div class="space-y-2">
                            \${data.weeks.map(week => \`
                                <div class="text-sm">
                                    <strong>第\${week.weekNumber}週</strong>: \${week.startDate} 〜 \${week.endDate}
                                </div>
                            \`).join('')}
                        </div>
                    </div>
                \`;
            }
            
            html += \`
                <div class="mt-6 flex gap-2 justify-end">
                    <button onclick="printShoppingList()" class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                        <i class="fas fa-print"></i> 印刷
                    </button>
                    <button onclick="closeShoppingModal()" class="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600">
                        閉じる
                    </button>
                </div>
            \`;
            
            content.innerHTML = html;
            modal.classList.remove('hidden');
            modal.classList.add('flex');
        }
        
        function getCategoryIcon(category) {
            const icons = {
                '野菜': '🥬',
                '肉・魚': '🥩',
                '卵・乳製品': '🥚',
                '豆腐・豆類': '🫘',
                '調味料': '🧂',
                'その他': '📦'
            };
            return icons[category] || '📦';
        }
        
        function closeShoppingModal() {
            const modal = document.getElementById('shopping-modal');
            modal.classList.add('hidden');
            modal.classList.remove('flex');
        }
        
        function printShoppingList() {
            window.print();
        }
        
        // ========================================
        // レシピ詳細表示
        // ========================================
        async function showRecipeDetail(recipeId, recipeTitle) {
            if (!recipeId) {
                alert('レシピ情報がありません');
                return;
            }
            
            const modal = document.getElementById('recipe-modal');
            const title = document.getElementById('recipe-modal-title');
            const content = document.getElementById('recipe-modal-content');
            
            title.textContent = recipeTitle || 'レシピ詳細';
            content.innerHTML = '<div class="text-center py-8"><i class="fas fa-spinner fa-spin text-3xl text-blue-500"></i><p class="mt-4 text-gray-600">レシピ情報を読み込み中...</p></div>';
            
            modal.classList.remove('hidden');
            modal.classList.add('flex');
            
            try {
                const res = await axios.get(\`/api/recipes/\${recipeId}\`);
                const recipe = res.data;
                
                // 難易度の表示
                const difficultyMap = {
                    'easy': '簡単',
                    'normal': '普通',
                    'hard': '難しい'
                };
                
                // 料理ジャンルの表示
                const cuisineMap = {
                    'japanese': '和食',
                    'western': '洋食',
                    'chinese': '中華',
                    'other': 'その他'
                };
                
                // カテゴリ名の日本語化
                const categoryMap = {
                    'vegetables': '野菜',
                    'meat_fish': '肉・魚',
                    'dairy_eggs': '卵・乳製品',
                    'tofu_beans': '豆腐・豆類',
                    'seasonings': '調味料',
                    'others': 'その他'
                };
                
                let html = \`
                    <div class="space-y-6">
                        <!-- 基本情報 -->
                        <div class="flex gap-4 flex-wrap text-sm">
                            <div class="flex items-center gap-2">
                                <i class="fas fa-clock text-blue-500"></i>
                                <span><strong>調理時間:</strong> 約\${recipe.time_min}分</span>
                            </div>
                            <div class="flex items-center gap-2">
                                <i class="fas fa-signal text-green-500"></i>
                                <span><strong>難易度:</strong> \${difficultyMap[recipe.difficulty] || '普通'}</span>
                            </div>
                            <div class="flex items-center gap-2">
                                <i class="fas fa-utensils text-purple-500"></i>
                                <span><strong>ジャンル:</strong> \${cuisineMap[recipe.cuisine] || 'その他'}</span>
                            </div>
                            <div class="flex items-center gap-2">
                                <i class="fas fa-yen-sign text-orange-500"></i>
                                <span><strong>予算:</strong> 約\${recipe.cost_tier}円/人</span>
                            </div>
                        </div>
                        
                        <!-- 説明 -->
                        \${recipe.description ? \`
                            <div class="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                                <p class="text-gray-700">\${recipe.description}</p>
                            </div>
                        \` : ''}
                        
                        <!-- 材料 -->
                        <div>
                            <h4 class="text-lg font-bold mb-3 flex items-center gap-2">
                                <i class="fas fa-list text-green-600"></i>
                                材料
                            </h4>
                            <div class="bg-gray-50 rounded-lg p-4">
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    \${(recipe.ingredients || []).map(ing => \`
                                        <div class="flex justify-between items-center border-b border-gray-200 pb-2">
                                            <span class="text-gray-800">
                                                \${ing.name}
                                                \${ing.is_optional ? '<span class="text-xs text-gray-500">(お好みで)</span>' : ''}
                                            </span>
                                            <span class="text-gray-600 font-medium">\${ing.quantity}\${ing.unit}</span>
                                        </div>
                                    \`).join('')}
                                </div>
                            </div>
                        </div>
                        
                        <!-- 調理手順 -->
                        <div>
                            <h4 class="text-lg font-bold mb-3 flex items-center gap-2">
                                <i class="fas fa-tasks text-orange-600"></i>
                                作り方
                            </h4>
                            <div class="space-y-3">
                                \${(recipe.steps || []).map((step, index) => \`
                                    <div class="flex gap-3">
                                        <div class="flex-shrink-0 w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold">
                                            \${index + 1}
                                        </div>
                                        <div class="flex-1 bg-gray-50 rounded-lg p-3">
                                            <p class="text-gray-800">\${step}</p>
                                        </div>
                                    </div>
                                \`).join('')}
                                
                                \${recipe.steps.length === 0 ? '<p class="text-gray-500 text-center py-4">手順情報はまだ登録されていません</p>' : ''}
                            </div>
                        </div>
                        
                        <!-- 調理のコツ -->
                        \${recipe.tags && recipe.tags.length > 0 ? \`
                            <div>
                                <h4 class="text-lg font-bold mb-3 flex items-center gap-2">
                                    <i class="fas fa-lightbulb text-yellow-600"></i>
                                    ポイント・コツ
                                </h4>
                                <div class="flex flex-wrap gap-2">
                                    \${recipe.tags.map(tag => \`
                                        <span class="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
                                            \${tag}
                                        </span>
                                    \`).join('')}
                                </div>
                            </div>
                        \` : ''}
                        
                        <!-- アクションボタン -->
                        <div class="flex gap-2 pt-4 border-t">
                            <button onclick="addToFavorites('\${recipe.recipe_id}', '\${recipe.title}')" 
                                    class="flex-1 px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition">
                                <i class="fas fa-heart"></i> お気に入りに追加
                            </button>
                            <button onclick="shareRecipe('\${recipe.recipe_id}', '\${recipe.title}')" 
                                    class="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">
                                <i class="fas fa-share-alt"></i> 共有
                            </button>
                        </div>
                    </div>
                \`;
                
                content.innerHTML = html;
            } catch (error) {
                console.error('レシピ詳細取得エラー:', error);
                content.innerHTML = \`
                    <div class="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
                        <p class="text-red-700">レシピ情報の取得に失敗しました</p>
                    </div>
                \`;
            }
        }
        
        function closeRecipeModal() {
            const modal = document.getElementById('recipe-modal');
            modal.classList.add('hidden');
            modal.classList.remove('flex');
        }
        
        // ========================================
        // お気に入り機能
        // ========================================
        function addToFavorites(recipeId, recipeTitle) {
            // ローカルストレージに保存
            const favorites = JSON.parse(localStorage.getItem('favoriteRecipes') || '[]');
            
            // 重複チェック
            if (favorites.some(f => f.recipe_id === recipeId)) {
                alert('このレシピは既にお気に入りに追加されています');
                return;
            }
            
            favorites.push({
                recipe_id: recipeId,
                title: recipeTitle,
                added_at: new Date().toISOString()
            });
            
            localStorage.setItem('favoriteRecipes', JSON.stringify(favorites));
            alert(\`「\${recipeTitle}」をお気に入りに追加しました！\`);
        }
        
        // ========================================
        // 献立履歴機能
        // ========================================
        async function showHistory() {
            if (!appState.householdId) {
                alert('履歴を表示するにはログインが必要です');
                return;
            }
            
            try {
                const res = await axios.get(\`/api/history/\${appState.householdId}\`);
                const history = res.data.history || [];
                
                if (history.length === 0) {
                    alert('まだ履歴がありません');
                    return;
                }
                
                // 履歴モーダルを表示
                let html = '<div class="space-y-4">';
                history.forEach(item => {
                    html += \`
                        <div class="border rounded-lg p-4 hover:bg-gray-50 transition">
                            <div class="flex justify-between items-start mb-2">
                                <div>
                                    <h4 class="font-bold text-lg">\${item.title}</h4>
                                    <p class="text-sm text-gray-500">
                                        \${item.start_date} 〜 (\${item.months}ヶ月)
                                    </p>
                                    <p class="text-xs text-gray-400">
                                        作成日: \${new Date(item.created_at).toLocaleDateString('ja-JP')}
                                    </p>
                                </div>
                                <div class="flex gap-2">
                                    <button onclick="loadHistory('\${item.plan_id}')" 
                                            class="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm">
                                        <i class="fas fa-eye"></i> 表示
                                    </button>
                                    <button onclick="archiveHistory('\${item.history_id}')" 
                                            class="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 text-sm">
                                        <i class="fas fa-archive"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    \`;
                });
                html += '</div>';
                
                // モーダルに表示
                showModal('献立履歴', html);
            } catch (error) {
                console.error('履歴取得エラー:', error);
                alert('履歴の取得に失敗しました');
            }
        }
        
        async function loadHistory(planId) {
            try {
                const res = await axios.get(\`/api/plans/\${planId}\`);
                appState.planId = planId;
                calendarData = res.data.days;
                
                // モーダルを閉じて献立を表示
                closeModal();
                showCalendar(res.data.days);
                
                // 成功メッセージ
                const toast = document.createElement('div');
                toast.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
                toast.textContent = '✓ 履歴から献立を読み込みました';
                document.body.appendChild(toast);
                setTimeout(() => toast.remove(), 2000);
            } catch (error) {
                console.error('献立読み込みエラー:', error);
                alert('献立の読み込みに失敗しました');
            }
        }
        
        async function archiveHistory(historyId) {
            if (!confirm('この履歴をアーカイブしますか？')) return;
            
            try {
                await axios.post('/api/history/archive', { history_id: historyId });
                showHistory(); // 再読み込み
            } catch (error) {
                console.error('アーカイブエラー:', error);
                alert('アーカイブに失敗しました');
            }
        }
        
        function showModal(title, content) {
            const modal = document.createElement('div');
            modal.id = 'history-modal';
            modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4';
            modal.innerHTML = \`
                <div class="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
                    <div class="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-4 flex justify-between items-center">
                        <h3 class="text-xl font-bold text-white">
                            <i class="fas fa-history mr-2"></i>
                            \${title}
                        </h3>
                        <button onclick="closeModal()" class="text-white hover:text-gray-200 transition-colors">
                            <i class="fas fa-times text-2xl"></i>
                        </button>
                    </div>
                    <div class="p-6 overflow-y-auto" style="max-height: calc(90vh - 80px);">
                        \${content}
                    </div>
                </div>
            \`;
            document.body.appendChild(modal);
        }
        
        function closeModal() {
            const modal = document.getElementById('history-modal');
            if (modal) modal.remove();
        }
        
        // ========================================
        // ドラッグ&ドロップ機能
        // ========================================
        let draggedElement = null;
        let draggedData = null;
        
        function handleDragStart(event) {
            draggedElement = event.currentTarget;
            draggedData = {
                planDayId: draggedElement.dataset.planDayId,
                date: draggedElement.dataset.date
            };
            event.dataTransfer.effectAllowed = 'move';
            draggedElement.style.opacity = '0.4';
        }
        
        function handleDragOver(event) {
            if (event.preventDefault) {
                event.preventDefault();
            }
            event.dataTransfer.dropEffect = 'move';
            
            const dropTarget = event.currentTarget;
            if (dropTarget !== draggedElement) {
                dropTarget.style.borderColor = '#3b82f6';
                dropTarget.style.borderWidth = '2px';
                dropTarget.style.borderStyle = 'dashed';
            }
            return false;
        }
        
        async function handleDrop(event) {
            if (event.stopPropagation) {
                event.stopPropagation();
            }
            
            const dropTarget = event.currentTarget;
            dropTarget.style.border = '';
            
            if (draggedElement !== dropTarget) {
                const targetData = {
                    planDayId: dropTarget.dataset.planDayId,
                    date: dropTarget.dataset.date
                };
                
                // サーバーに献立の入れ替えをリクエスト
                try {
                    const res = await axios.post('/api/plans/swap-days', {
                        plan_id: appState.planId,
                        day1_id: draggedData.planDayId,
                        day2_id: targetData.planDayId
                    });
                    
                    if (res.data.success) {
                        // 献立データを再取得して更新
                        const planRes = await axios.get(\`/api/plans/\${appState.planId}\`);
                        calendarData = planRes.data.days;
                        
                        // 現在のビューモードで再描画
                        if (currentViewMode === 'calendar') {
                            renderCalendarView(calendarData);
                        } else {
                            renderGridView(calendarData);
                        }
                        
                        // 成功メッセージ
                        const toast = document.createElement('div');
                        toast.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
                        toast.textContent = '✓ 献立を入れ替えました';
                        document.body.appendChild(toast);
                        setTimeout(() => toast.remove(), 2000);
                    }
                } catch (error) {
                    console.error('献立の入れ替えエラー:', error);
                    alert('献立の入れ替えに失敗しました');
                }
            }
            
            return false;
        }
        
        function handleDragEnd(event) {
            event.currentTarget.style.opacity = '1';
            
            // すべてのボーダーをリセット
            document.querySelectorAll('.day-card').forEach(card => {
                card.style.border = '';
            });
        }
        
        function showFavorites() {
            const favorites = JSON.parse(localStorage.getItem('favoriteRecipes') || '[]');
            
            if (favorites.length === 0) {
                alert('お気に入りレシピはまだありません');
                return;
            }
            
            const modal = document.getElementById('recipe-modal');
            const title = document.getElementById('recipe-modal-title');
            const content = document.getElementById('recipe-modal-content');
            
            title.textContent = 'お気に入りレシピ';
            
            let html = \`
                <div class="space-y-3">
                    \${favorites.map((fav, index) => \`
                        <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                            <div class="flex-1">
                                <a href="javascript:void(0)" onclick="showRecipeDetail('\${fav.recipe_id}', '\${fav.title}')" 
                                   class="text-blue-600 hover:underline font-medium">
                                    \${fav.title}
                                </a>
                                <p class="text-xs text-gray-500 mt-1">追加日: \${new Date(fav.added_at).toLocaleDateString('ja-JP')}</p>
                            </div>
                            <button onclick="removeFromFavorites(\${index})" class="ml-3 px-3 py-1 text-red-600 hover:bg-red-50 rounded">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    \`).join('')}
                </div>
            \`;
            
            content.innerHTML = html;
            modal.classList.remove('hidden');
            modal.classList.add('flex');
        }
        
        function removeFromFavorites(index) {
            const favorites = JSON.parse(localStorage.getItem('favoriteRecipes') || '[]');
            favorites.splice(index, 1);
            localStorage.setItem('favoriteRecipes', JSON.stringify(favorites));
            showFavorites(); // 再表示
        }
        
        // ========================================
        // SNS共有機能
        // ========================================
        function shareRecipe(recipeId, recipeTitle) {
            const url = \`\${window.location.origin}/recipe/\${recipeId}\`;
            const text = \`【Aメニュー】\${recipeTitle}のレシピを見つけました！\`;
            
            // Web Share API対応ブラウザの場合
            if (navigator.share) {
                navigator.share({
                    title: recipeTitle,
                    text: text,
                    url: url
                }).then(() => {
                    console.log('共有成功');
                }).catch(err => {
                    console.error('共有エラー:', err);
                    showShareModal(recipeId, recipeTitle);
                });
            } else {
                showShareModal(recipeId, recipeTitle);
            }
        }
        
        function showShareModal(recipeId, recipeTitle) {
            const url = encodeURIComponent(\`\${window.location.origin}/recipe/\${recipeId}\`);
            const text = encodeURIComponent(\`【Aメニュー】\${recipeTitle}のレシピ\`);
            
            const modal = document.getElementById('recipe-modal');
            const title = document.getElementById('recipe-modal-title');
            const content = document.getElementById('recipe-modal-content');
            
            title.textContent = 'レシピを共有';
            
            const html = \`
                <div class="space-y-3">
                    <p class="text-gray-600 mb-4">SNSで共有する：</p>
                    
                    <a href="https://twitter.com/intent/tweet?text=\${text}&url=\${url}" 
                       target="_blank" 
                       class="flex items-center gap-3 p-4 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition">
                        <i class="fab fa-twitter text-2xl"></i>
                        <span class="font-medium">Xで共有</span>
                    </a>
                    
                    <a href="https://www.facebook.com/sharer/sharer.php?u=\${url}" 
                       target="_blank" 
                       class="flex items-center gap-3 p-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                        <i class="fab fa-facebook text-2xl"></i>
                        <span class="font-medium">Facebookで共有</span>
                    </a>
                    
                    <a href="https://line.me/R/msg/text/?\${text}%20\${url}" 
                       target="_blank" 
                       class="flex items-center gap-3 p-4 bg-green-500 text-white rounded-lg hover:bg-green-600 transition">
                        <i class="fab fa-line text-2xl"></i>
                        <span class="font-medium">LINEで共有</span>
                    </a>
                    
                    <button onclick="copyToClipboard('\${decodeURIComponent(url)}')" 
                            class="w-full flex items-center gap-3 p-4 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition">
                        <i class="fas fa-copy text-2xl"></i>
                        <span class="font-medium">URLをコピー</span>
                    </button>
                </div>
            \`;
            
            content.innerHTML = html;
            modal.classList.remove('hidden');
            modal.classList.add('flex');
        }
        
        function copyToClipboard(text) {
            navigator.clipboard.writeText(text).then(() => {
                alert('URLをコピーしました！');
            }).catch(err => {
                console.error('コピー失敗:', err);
                alert('コピーに失敗しました');
            });
        }
        
        // ========================================
        // Googleカレンダー連携
        // ========================================
        function exportToGoogleCalendar() {
            if (calendarData.length === 0) {
                alert('献立データがありません');
                return;
            }
            
            // .icsファイルを生成
            let icsContent = 'BEGIN:VCALENDAR\\nVERSION:2.0\\nPRODID:-//Aメニュー//献立カレンダー//JP\\n';
            
            calendarData.forEach(day => {
                const recipes = day.recipes || [];
                const main = recipes.find(r => r.role === 'main');
                const side = recipes.find(r => r.role === 'side');
                const soup = recipes.find(r => r.role === 'soup');
                
                const title = \`🍽️ 今日の献立\`;
                const description = [
                    main ? \`主菜: \${main.title}\` : '',
                    side ? \`副菜: \${side.title}\` : '',
                    soup ? \`汁物: \${soup.title}\` : ''
                ].filter(Boolean).join('\\\\n');
                
                const dateStr = day.date.replace(/-/g, '');
                
                icsContent += \`BEGIN:VEVENT\\n\`;
                icsContent += \`UID:\${day.plan_day_id || Date.now()}@aichef.com\\n\`;
                icsContent += \`DTSTAMP:\${dateStr}T180000Z\\n\`;
                icsContent += \`DTSTART:\${dateStr}T180000Z\\n\`;
                icsContent += \`DTEND:\${dateStr}T190000Z\\n\`;
                icsContent += \`SUMMARY:\${title}\\n\`;
                icsContent += \`DESCRIPTION:\${description}\\n\`;
                icsContent += \`END:VEVENT\\n\`;
            });
            
            icsContent += 'END:VCALENDAR';
            
            // ダウンロード
            const blob = new Blob([icsContent], { type: 'text/calendar' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'aichef-kondate.ics';
            a.click();
            URL.revokeObjectURL(url);
            
            alert('カレンダーファイルをダウンロードしました！\\n\\nGoogleカレンダーを開いて：\\n1. 設定 → カレンダーをインポート\\n2. ダウンロードしたファイルを選択\\n3. インポート完了！');
        }
        
        // ========================================
        // グローバルスコープに公開（onclick から呼び出すため）
        // ========================================
        window.showHistory = showHistory;
        window.showFavorites = showFavorites;
        window.toggleCalendarView = toggleCalendarView;
        window.generateShoppingList = generateShoppingList;
        window.exportToGoogleCalendar = exportToGoogleCalendar;
        window.subscribeNewsletter = subscribeNewsletter;
        window.openContactForm = openContactForm;
        window.closeContactForm = closeContactForm;
        window.submitContact = submitContact;
        window.explainMenu = explainMenu;
        window.suggestChange = suggestChange;
        window.closeAIModal = closeAIModal;
        window.replaceRecipe = replaceRecipe;
        window.showRecipeDetail = showRecipeDetail;
        window.addToFavorites = addToFavorites;
        window.removeFromFavorites = removeFromFavorites;
        window.shareRecipe = shareRecipe;
        window.copyToClipboard = copyToClipboard;
        window.closeModal = closeModal;
        window.closeRecipeModal = closeRecipeModal;
        window.closeShoppingModal = closeShoppingModal;
        window.printShoppingList = printShoppingList;
        window.trackAdClick = trackAdClick;
        window.loadHistory = loadHistory;
        window.archiveHistory = archiveHistory;
        
        // ドラッグ&ドロップ用のグローバル変数
        window.handleDragStart = handleDragStart;
        window.handleDragOver = handleDragOver;
        window.handleDragLeave = handleDragLeave;
        window.handleDrop = handleDrop;
        window.handleDragEnd = handleDragEnd;

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
    
    <!-- 買い物リストモーダル -->
    <div id="shopping-modal" class="hidden fixed inset-0 bg-black bg-opacity-50 items-center justify-center z-50 p-4" style="backdrop-filter: blur(4px);">
        <div class="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div class="bg-gradient-to-r from-green-500 to-emerald-600 px-6 py-4 flex justify-between items-center">
                <h3 class="text-xl font-bold text-white">
                    <i class="fas fa-shopping-cart mr-2"></i>
                    買い物リスト
                </h3>
                <button onclick="closeShoppingModal()" class="text-white hover:text-gray-200 transition-colors">
                    <i class="fas fa-times text-2xl"></i>
                </button>
            </div>
            <div id="shopping-modal-content" class="p-6 overflow-y-auto" style="max-height: calc(90vh - 80px);">
                <!-- コンテンツはJavaScriptで動的に挿入 -->
            </div>
        </div>
    </div>
    
    <!-- レシピ詳細モーダル -->
    <div id="recipe-modal" class="hidden fixed inset-0 bg-black bg-opacity-50 items-center justify-center z-50 p-4" style="backdrop-filter: blur(4px);">
        <div class="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div class="bg-gradient-to-r from-orange-500 to-red-600 px-6 py-4 flex justify-between items-center">
                <h3 id="recipe-modal-title" class="text-xl font-bold text-white">レシピ詳細</h3>
                <button onclick="closeRecipeModal()" class="text-white hover:text-gray-200 transition-colors">
                    <i class="fas fa-times text-2xl"></i>
                </button>
            </div>
            <div id="recipe-modal-content" class="p-6 overflow-y-auto" style="max-height: calc(90vh - 80px);">
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
    
    // 期間計算
    console.log('期間計算開始 - start_date:', household.start_date, 'months:', household.months);
    const period = buildPeriod(household.start_date, household.months);
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
    
    // 直近N日間の重複をチェックして選択
    const selectRecipeWithoutRecent = (recipes: any[], recentRecipes: any[], minDays: number = 7) => {
      // 直近minDays日間に使われていないレシピを探す
      const recentIds = recentRecipes.slice(-minDays).map(r => r?.recipe_id);
      const available = recipes.filter(r => !recentIds.includes(r.recipe_id));
      
      // 利用可能なレシピがない場合は全体からランダムに選択
      const pool = available.length > 0 ? available : recipes;
      return pool[Math.floor(Math.random() * pool.length)];
    };
    
    // カレー系のレシピ判定（より厳密に）
    const isCurryOrStew = (recipe: any) => {
      const curryKeywords = ['カレー', 'シチュー', 'ハヤシライス', 'ドリア', 'グラタン'];
      return curryKeywords.some(keyword => recipe.title?.includes(keyword));
    };
    
    // 同じカテゴリの連続を避ける関数
    const avoidSameCategory = (recipes: any[], lastRecipe: any, recentRecipes: any[], minDays: number) => {
      const recentIds = recentRecipes.slice(-minDays).map(r => r?.recipe_id);
      
      // 直前がカレー系の場合、カレー系を除外
      let available = recipes.filter(r => !recentIds.includes(r.recipe_id));
      if (lastRecipe && isCurryOrStew(lastRecipe)) {
        available = available.filter(r => !isCurryOrStew(r));
      }
      
      // 利用可能なレシピがない場合は全体から選択（ただしカレー系は除外）
      if (available.length === 0) {
        available = recipes.filter(r => !isCurryOrStew(r));
        if (available.length === 0) {
          available = recipes; // 最終手段
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
      
      // レシピの食材を集計
      const ingredientMap: Record<string, {
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
          if (ingredientMap[key]) {
            // 同じ食材を合算
            ingredientMap[key].quantity += ing.quantity;
          } else {
            ingredientMap[key] = {
              name: ing.name,
              category: ing.category,
              quantity: ing.quantity,
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
      
      const shoppingList: Record<string, any[]> = {};
      
      Object.values(ingredientMap).forEach((ing: any) => {
        const categoryJa = categoryNames[ing.category] || 'その他';
        if (!shoppingList[categoryJa]) {
          shoppingList[categoryJa] = [];
        }
        shoppingList[categoryJa].push({
          name: ing.name,
          quantity: Math.ceil(ing.quantity), // 切り上げ
          unit: ing.unit
        });
      });
      
      // 週ごとに分割（7日間ずつ）
      const weeks = [];
      const daysArray = planDays.results as any[];
      for (let i = 0; i < daysArray.length; i += 7) {
        const weekDays = daysArray.slice(i, i + 7);
        weeks.push({
          weekNumber: Math.floor(i / 7) + 1,
          startDate: weekDays[0].date,
          endDate: weekDays[weekDays.length - 1].date
        });
      }
      
      return json({
        plan_id,
        weeks,
        totalItems: Object.values(ingredientMap).length,
        shoppingList
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
  
  // POST /api/history/archive - 献立履歴をアーカイブ
  if (pathname === "/api/history/archive" && req.method === "POST") {
    const body = await readJson(req);
    const { history_id } = body;
    
    if (!history_id) {
      return badRequest("history_id is required");
    }
    
    try {
      await env.DB.prepare(
        `UPDATE plan_history SET is_archived = 1 WHERE history_id = ?`
      ).bind(history_id).run();
      
      return json({ success: true });
    } catch (error: any) {
      console.error('Archive error:', error);
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
  // /admin：管理画面を返す
  // ========================================
  if (pathname === "/admin" || pathname === "/admin/") {
    // admin.htmlの内容を読み込んで返す
    // 本番環境では静的ファイルとして配信
    return new Response("", {
      status: 302,
      headers: {
        'Location': '/admin.html'
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
