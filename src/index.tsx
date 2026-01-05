import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { serveStatic } from 'hono/cloudflare-workers'

type Bindings = {
  DB?: D1Database;
}

type Json = Record<string, unknown>;

// ========================================
// Landing Page (TOPページ)
// ========================================
const landingHtml = `<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Aメニュー - 毎日の献立を考える負担から解放</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
    <style>
        /* スムーススクロール */
        html {
            scroll-behavior: smooth;
        }
        
        /* ヒーローセクションの背景 */
        .hero-bg {
            background: linear-gradient(135deg, rgba(249,115,22,0.1) 0%, rgba(251,146,60,0.05) 100%);
        }
        
        /* フェードインアニメーション */
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .fade-in-up {
            animation: fadeInUp 0.8s ease-out forwards;
        }
        
        .delay-1 { animation-delay: 0.2s; opacity: 0; }
        .delay-2 { animation-delay: 0.4s; opacity: 0; }
        .delay-3 { animation-delay: 0.6s; opacity: 0; }
    </style>
</head>
<body class="bg-white">
    <!-- ヒーローセクション -->
    <section class="hero-bg min-h-screen flex items-center justify-center relative overflow-hidden">
        <div class="container mx-auto px-4 py-20 max-w-6xl">
            <div class="grid md:grid-cols-2 gap-12 items-center">
                <!-- 左側：テキストコンテンツ -->
                <div class="space-y-6 fade-in-up">
                    <h1 class="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
                        考えなくていい、<br>
                        悩まなくていい。
                    </h1>
                    <p class="text-2xl md:text-3xl text-gray-700">
                        今日から1ヶ月分の<br>
                        晩ごはんが決まります。
                    </p>
                    <p class="text-lg text-gray-600">
                        AIが家族構成・予算・好みに合わせて<br>
                        献立を自動生成。毎日の「何作ろう？」から解放されます。
                    </p>
                    <div class="pt-4">
                        <a href="/app" class="inline-block px-8 py-4 bg-orange-500 text-white text-xl font-semibold rounded-full hover:bg-orange-600 transition-all transform hover:scale-105 shadow-lg">
                            <i class="fas fa-magic mr-2"></i>
                            今すぐ始める（無料）
                        </a>
                    </div>
                </div>
                
                <!-- 右側：画像 -->
                <div class="fade-in-up delay-1">
                    <img src="/static/images/family-cooking.jpg" alt="家族で料理" class="rounded-3xl shadow-2xl w-full">
                </div>
            </div>
        </div>
        
        <!-- スクロールダウンインジケーター -->
        <div class="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
            <i class="fas fa-chevron-down text-3xl text-gray-400"></i>
        </div>
    </section>

    <!-- 問題提起セクション -->
    <section class="py-20 bg-gray-50">
        <div class="container mx-auto px-4 max-w-6xl">
            <h2 class="text-4xl font-bold text-center text-gray-900 mb-4 fade-in-up">
                毎日の献立、こんなお悩みありませんか？
            </h2>
            <p class="text-center text-gray-600 mb-16 fade-in-up delay-1">主婦・主夫の8割が感じている献立ストレス</p>
            
            <div class="grid md:grid-cols-3 gap-8">
                <div class="bg-white p-8 rounded-2xl shadow-lg text-center fade-in-up delay-1">
                    <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <i class="fas fa-clock text-3xl text-red-500"></i>
                    </div>
                    <h3 class="text-xl font-bold text-gray-900 mb-3">時間がない</h3>
                    <p class="text-gray-600">毎日の献立を考える時間が<br>もったいない...</p>
                </div>
                
                <div class="bg-white p-8 rounded-2xl shadow-lg text-center fade-in-up delay-2">
                    <div class="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <i class="fas fa-sync-alt text-3xl text-orange-500"></i>
                    </div>
                    <h3 class="text-xl font-bold text-gray-900 mb-3">マンネリ化</h3>
                    <p class="text-gray-600">いつも同じメニューに<br>なってしまう...</p>
                </div>
                
                <div class="bg-white p-8 rounded-2xl shadow-lg text-center fade-in-up delay-3">
                    <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <i class="fas fa-wallet text-3xl text-blue-500"></i>
                    </div>
                    <h3 class="text-xl font-bold text-gray-900 mb-3">予算管理が難しい</h3>
                    <p class="text-gray-600">食費の計画が<br>立てづらい...</p>
                </div>
            </div>
        </div>
    </section>

    <!-- ソリューションセクション -->
    <section class="py-20 bg-white">
        <div class="container mx-auto px-4 max-w-6xl">
            <div class="grid md:grid-cols-2 gap-12 items-center">
                <div class="order-2 md:order-1 fade-in-up">
                    <img src="/static/images/rich-menu.jpg" alt="豊富な献立" class="rounded-3xl shadow-2xl w-full">
                </div>
                
                <div class="order-1 md:order-2 space-y-6 fade-in-up delay-1">
                    <h2 class="text-4xl font-bold text-gray-900">
                        AIが1ヶ月分の献立を<br>
                        自動生成
                    </h2>
                    <p class="text-xl text-gray-700">
                        600品以上のレシピから<br>
                        あなたの家族に最適な献立をお届け
                    </p>
                    <ul class="space-y-4">
                        <li class="flex items-start">
                            <i class="fas fa-check-circle text-2xl text-green-500 mr-3 mt-1"></i>
                            <div>
                                <strong class="text-lg">3分で完成</strong>
                                <p class="text-gray-600">簡単な質問に答えるだけで1ヶ月分の献立が完成</p>
                            </div>
                        </li>
                        <li class="flex items-start">
                            <i class="fas fa-check-circle text-2xl text-green-500 mr-3 mt-1"></i>
                            <div>
                                <strong class="text-lg">バラエティ豊か</strong>
                                <p class="text-gray-600">和食・洋食・中華から毎日違うメニューを提案</p>
                            </div>
                        </li>
                        <li class="flex items-start">
                            <i class="fas fa-check-circle text-2xl text-green-500 mr-3 mt-1"></i>
                            <div>
                                <strong class="text-lg">印刷OK</strong>
                                <p class="text-gray-600">A4サイズで印刷して冷蔵庫に貼れる</p>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </section>

    <!-- 特徴セクション（3カラム） -->
    <section class="py-20 bg-gray-50">
        <div class="container mx-auto px-4 max-w-6xl">
            <h2 class="text-4xl font-bold text-center text-gray-900 mb-16 fade-in-up">
                Aメニューの3つの特徴
            </h2>
            
            <div class="grid md:grid-cols-3 gap-12">
                <div class="text-center fade-in-up delay-1">
                    <div class="w-24 h-24 bg-gradient-to-br from-orange-400 to-orange-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl">
                        <i class="fas fa-comments text-4xl text-white"></i>
                    </div>
                    <h3 class="text-2xl font-bold text-gray-900 mb-4">AIチャットで簡単入力</h3>
                    <p class="text-gray-600 leading-relaxed">
                        家族構成、予算、調理時間、アレルギーなど、<br>
                        会話形式で簡単に入力できます
                    </p>
                </div>
                
                <div class="text-center fade-in-up delay-2">
                    <div class="w-24 h-24 bg-gradient-to-br from-green-400 to-green-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl">
                        <i class="fas fa-book text-4xl text-white"></i>
                    </div>
                    <h3 class="text-2xl font-bold text-gray-900 mb-4">600品以上のレシピ</h3>
                    <p class="text-gray-600 leading-relaxed">
                        主菜300品、副菜200品、汁物100品から<br>
                        自動選択。マンネリ化しません
                    </p>
                </div>
                
                <div class="text-center fade-in-up delay-3">
                    <div class="w-24 h-24 bg-gradient-to-br from-blue-400 to-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl">
                        <i class="fas fa-print text-4xl text-white"></i>
                    </div>
                    <h3 class="text-2xl font-bold text-gray-900 mb-4">印刷して冷蔵庫に</h3>
                    <p class="text-gray-600 leading-relaxed">
                        A4サイズで印刷できるので、<br>
                        冷蔵庫に貼って家族みんなで確認
                    </p>
                </div>
            </div>
        </div>
    </section>

    <!-- 使い方セクション（3ステップ） -->
    <section class="py-20 bg-white">
        <div class="container mx-auto px-4 max-w-6xl">
            <h2 class="text-4xl font-bold text-center text-gray-900 mb-4 fade-in-up">
                使い方は簡単3ステップ
            </h2>
            <p class="text-center text-gray-600 mb-16 fade-in-up delay-1">たった3分で1ヶ月分の献立が完成</p>
            
            <div class="grid md:grid-cols-3 gap-8">
                <div class="relative">
                    <div class="bg-orange-500 text-white text-4xl font-bold w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                        1
                    </div>
                    <h3 class="text-2xl font-bold text-center text-gray-900 mb-4">家族構成を入力</h3>
                    <p class="text-center text-gray-600">
                        大人・子供の人数、<br>
                        お子さんの年齢を入力
                    </p>
                </div>
                
                <div class="relative">
                    <div class="bg-orange-500 text-white text-4xl font-bold w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                        2
                    </div>
                    <h3 class="text-2xl font-bold text-center text-gray-900 mb-4">予算・時間を選択</h3>
                    <p class="text-center text-gray-600">
                        1人あたりの予算、<br>
                        調理時間の上限を選択
                    </p>
                </div>
                
                <div class="relative">
                    <div class="bg-orange-500 text-white text-4xl font-bold w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                        3
                    </div>
                    <h3 class="text-2xl font-bold text-center text-gray-900 mb-4">献立が完成！</h3>
                    <p class="text-center text-gray-600">
                        1ヶ月分の献立を<br>
                        カレンダー表示で確認
                    </p>
                </div>
            </div>
        </div>
    </section>

    <!-- 料金セクション -->
    <section class="py-20 bg-gradient-to-br from-orange-50 to-orange-100">
        <div class="container mx-auto px-4 max-w-4xl text-center">
            <h2 class="text-4xl font-bold text-gray-900 mb-4 fade-in-up">
                完全無料でご利用いただけます
            </h2>
            <p class="text-xl text-gray-700 mb-8 fade-in-up delay-1">
                会員登録不要。今すぐ使えます。
            </p>
            <p class="text-gray-600 mb-12 fade-in-up delay-2">
                ※ 広告収益により無料で運営しています
            </p>
            
            <div class="bg-white rounded-3xl shadow-2xl p-12 fade-in-up delay-3">
                <div class="text-6xl font-bold text-orange-500 mb-4">¥0</div>
                <p class="text-2xl text-gray-700 mb-8">完全無料・登録不要</p>
                <ul class="text-left space-y-3 mb-8 max-w-md mx-auto">
                    <li class="flex items-center">
                        <i class="fas fa-check text-green-500 mr-3"></i>
                        600品以上のレシピから自動生成
                    </li>
                    <li class="flex items-center">
                        <i class="fas fa-check text-green-500 mr-3"></i>
                        1ヶ月分の献立カレンダー
                    </li>
                    <li class="flex items-center">
                        <i class="fas fa-check text-green-500 mr-3"></i>
                        印刷機能（A4サイズ）
                    </li>
                    <li class="flex items-center">
                        <i class="fas fa-check text-green-500 mr-3"></i>
                        買い物リスト自動生成（準備中）
                    </li>
                </ul>
                <a href="/app" class="inline-block px-12 py-5 bg-orange-500 text-white text-2xl font-bold rounded-full hover:bg-orange-600 transition-all transform hover:scale-105 shadow-xl">
                    今すぐ始める
                </a>
            </div>
        </div>
    </section>

    <!-- CTAセクション -->
    <section class="py-20 bg-gradient-to-r from-orange-500 to-orange-600 text-white">
        <div class="container mx-auto px-4 max-w-4xl text-center">
            <h2 class="text-5xl font-bold mb-6 fade-in-up">
                今日から献立の悩みから解放されませんか？
            </h2>
            <p class="text-2xl mb-10 opacity-90 fade-in-up delay-1">
                たった3分で1ヶ月分の献立が完成します
            </p>
            <a href="/app" class="inline-block px-12 py-5 bg-white text-orange-600 text-2xl font-bold rounded-full hover:bg-gray-100 transition-all transform hover:scale-105 shadow-2xl fade-in-up delay-2">
                <i class="fas fa-magic mr-2"></i>
                今すぐ無料で始める
            </a>
        </div>
    </section>

    <!-- フッター -->
    <footer class="bg-gray-900 text-white py-16">
        <div class="container mx-auto px-4 max-w-6xl">
            <div class="grid md:grid-cols-3 gap-12 mb-12">
                <!-- メルマガ登録 -->
                <div>
                    <h3 class="text-2xl font-bold mb-4">
                        <i class="fas fa-envelope mr-2"></i>
                        メルマガ登録
                    </h3>
                    <p class="text-gray-400 mb-4">週1回、おすすめレシピや献立のヒントをお届けします。</p>
                    <form id="newsletter-form" class="space-y-3">
                        <input type="email" id="newsletter-email" placeholder="メールアドレス" required class="w-full px-4 py-3 rounded-lg text-gray-900">
                        <button type="submit" class="w-full px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition">
                            登録する
                        </button>
                    </form>
                    <div id="newsletter-message" class="mt-3 text-sm"></div>
                </div>
                
                <!-- お問い合わせ -->
                <div>
                    <h3 class="text-2xl font-bold mb-4">
                        <i class="fas fa-question-circle mr-2"></i>
                        お問い合わせ
                    </h3>
                    <p class="text-gray-400 mb-4">ご質問・ご要望はお気軽にどうぞ。</p>
                    <button onclick="openContactModal()" class="px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition">
                        <i class="fas fa-comments mr-2"></i>
                        問い合わせフォーム
                    </button>
                </div>
                
                <!-- リンク -->
                <div>
                    <h3 class="text-2xl font-bold mb-4">Aメニュー</h3>
                    <p class="text-gray-400 mb-4">毎日の献立を考える負担から解放されるサービス</p>
                    <div class="space-y-2">
                        <a href="/app" class="block text-gray-400 hover:text-white transition">献立作成</a>
                        <a href="#" class="block text-gray-400 hover:text-white transition">使い方</a>
                    </div>
                </div>
            </div>
            
            <div class="border-t border-gray-700 pt-8 text-center text-gray-400">
                <p>&copy; 2024 Aメニュー. All rights reserved.</p>
            </div>
        </div>
    </footer>

    <!-- お問い合わせモーダル -->
    <div id="contact-modal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 hidden">
        <div class="bg-white rounded-2xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div class="flex justify-between items-center mb-6">
                <h2 class="text-3xl font-bold text-gray-900">
                    <i class="fas fa-comments mr-2 text-orange-500"></i>
                    お問い合わせ
                </h2>
                <button onclick="closeContactModal()" class="text-gray-500 hover:text-gray-700 text-3xl">&times;</button>
            </div>
            
            <form id="contact-form" class="space-y-4">
                <div>
                    <label class="block text-gray-700 font-semibold mb-2">お名前 *</label>
                    <input type="text" id="contact-name" required class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent">
                </div>
                
                <div>
                    <label class="block text-gray-700 font-semibold mb-2">メールアドレス *</label>
                    <input type="email" id="contact-email" required class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent">
                </div>
                
                <div>
                    <label class="block text-gray-700 font-semibold mb-2">件名 *</label>
                    <input type="text" id="contact-subject" required class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent">
                </div>
                
                <div>
                    <label class="block text-gray-700 font-semibold mb-2">メッセージ *</label>
                    <textarea id="contact-message" required rows="6" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"></textarea>
                </div>
                
                <button type="submit" class="w-full px-6 py-4 bg-orange-500 text-white text-lg font-semibold rounded-lg hover:bg-orange-600 transition">
                    送信する
                </button>
            </form>
            
            <div id="contact-message-result" class="mt-4 text-center"></div>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js"></script>
    <script>
        // メルマガ登録
        document.getElementById('newsletter-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('newsletter-email').value;
            const messageEl = document.getElementById('newsletter-message');
            
            try {
                const res = await axios.post('/api/newsletter/subscribe', { email });
                messageEl.textContent = res.data.message;
                messageEl.className = 'mt-3 text-sm text-green-400';
                document.getElementById('newsletter-email').value = '';
            } catch (error) {
                messageEl.textContent = 'エラーが発生しました';
                messageEl.className = 'mt-3 text-sm text-red-400';
            }
        });
        
        // お問い合わせモーダル
        function openContactModal() {
            document.getElementById('contact-modal').classList.remove('hidden');
        }
        
        function closeContactModal() {
            document.getElementById('contact-modal').classList.add('hidden');
        }
        
        document.getElementById('contact-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            const resultEl = document.getElementById('contact-message-result');
            
            const data = {
                name: document.getElementById('contact-name').value,
                email: document.getElementById('contact-email').value,
                subject: document.getElementById('contact-subject').value,
                message: document.getElementById('contact-message').value
            };
            
            try {
                const res = await axios.post('/api/support/create', data);
                resultEl.textContent = res.data.message;
                resultEl.className = 'mt-4 text-center text-green-600 font-semibold';
                document.getElementById('contact-form').reset();
                setTimeout(() => closeContactModal(), 2000);
            } catch (error) {
                resultEl.textContent = 'エラーが発生しました';
                resultEl.className = 'mt-4 text-center text-red-600 font-semibold';
            }
        });
    </script>
</body>
</html>
`;

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
                        <div class="day-card">
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

        window.addEventListener('DOMContentLoaded', () => {
            const question = questions[0];
            addMessage(question.text);
            showInput(question);
            
            // TOPページの広告を読み込み
            loadAds('top_page');
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
    
    // 全レシピを取得
    const allMainRecipes = await env.DB.prepare(
      `SELECT * FROM recipes WHERE role='main' ORDER BY RANDOM()`
    ).all();
    
    const allSideRecipes = await env.DB.prepare(
      `SELECT * FROM recipes WHERE role='side' ORDER BY RANDOM()`
    ).all();
    
    const allSoupRecipes = await env.DB.prepare(
      `SELECT * FROM recipes WHERE role='soup' ORDER BY RANDOM()`
    ).all();

    const mainRecipes = (allMainRecipes.results ?? []) as any[];
    const sideRecipes = (allSideRecipes.results ?? []) as any[];
    const soupRecipes = (allSoupRecipes.results ?? []) as any[];

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
    return new Response(landingHtml, {
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
