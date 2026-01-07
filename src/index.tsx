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
// Login Pages
// ========================================
const LOGIN_HTML = `
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ログイン - AICHEFS</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
</head>
<body class="bg-gradient-to-br from-purple-50 to-blue-50 min-h-screen flex items-center justify-center">
    <div class="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full mx-4">
        <div class="text-center mb-8">
            <i class="fas fa-utensils text-5xl text-purple-600 mb-4"></i>
            <h1 class="text-3xl font-bold text-gray-800">AICHEFS</h1>
            <p class="text-gray-600 mt-2">ログイン</p>
        </div>
        
        <form id="loginForm" class="space-y-6">
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">メールアドレス</label>
                <input type="email" id="email" required class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent">
            </div>
            
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">パスワード</label>
                <input type="password" id="password" required class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent">
            </div>
            
            <div id="error-message" class="hidden text-red-600 text-sm"></div>
            
            <button type="submit" class="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition">
                <i class="fas fa-sign-in-alt mr-2"></i>ログイン
            </button>
        </form>
        
        <div class="mt-6 text-center">
            <a href="/" class="text-sm text-purple-600 hover:underline">トップページに戻る</a>
        </div>
    </div>
    
    <script>
        document.getElementById('loginForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const errorDiv = document.getElementById('error-message');
            
            try {
                const response = await fetch('/api/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });
                
                const data = await response.json();
                
                if (data.success) {
                    localStorage.setItem('session_id', data.session_id);
                    localStorage.setItem('user', JSON.stringify(data.user));
                    window.location.href = '/dashboard';
                } else {
                    errorDiv.textContent = data.error || 'ログインに失敗しました';
                    errorDiv.classList.remove('hidden');
                }
            } catch (error) {
                errorDiv.textContent = 'ネットワークエラーが発生しました';
                errorDiv.classList.remove('hidden');
            }
        });
    </script>
</body>
</html>
`;

const ADMIN_LOGIN_HTML = `
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>管理者ログイン - AICHEFS</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
</head>
<body class="bg-gradient-to-br from-gray-900 to-gray-700 min-h-screen flex items-center justify-center">
    <div class="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full mx-4">
        <div class="text-center mb-8">
            <i class="fas fa-shield-alt text-5xl text-gray-800 mb-4"></i>
            <h1 class="text-3xl font-bold text-gray-800">AICHEFS</h1>
            <p class="text-gray-600 mt-2">管理者ログイン</p>
        </div>
        
        <form id="adminLoginForm" class="space-y-6">
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">ユーザー名</label>
                <input type="text" id="username" required class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent">
            </div>
            
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">パスワード</label>
                <input type="password" id="password" required class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent">
            </div>
            
            <div id="error-message" class="hidden text-red-600 text-sm"></div>
            
            <button type="submit" class="w-full bg-gradient-to-r from-gray-800 to-gray-900 text-white py-3 rounded-lg font-semibold hover:from-gray-900 hover:to-black transition">
                <i class="fas fa-user-shield mr-2"></i>管理者としてログイン
            </button>
        </form>
        
        <div class="mt-6 text-center">
            <a href="/" class="text-sm text-gray-600 hover:underline">トップページに戻る</a>
        </div>
    </div>
    
    <script>
        document.getElementById('adminLoginForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            const errorDiv = document.getElementById('error-message');
            
            try {
                const response = await fetch('/api/auth/admin-login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, password })
                });
                
                const data = await response.json();
                
                if (data.success) {
                    localStorage.setItem('admin_session_id', data.session_id);
                    localStorage.setItem('admin', JSON.stringify(data.admin));
                    window.location.href = '/admin';
                } else {
                    errorDiv.textContent = data.error || 'ログインに失敗しました';
                    errorDiv.classList.remove('hidden');
                }
            } catch (error) {
                errorDiv.textContent = 'ネットワークエラーが発生しました';
                errorDiv.classList.remove('hidden');
            }
        });
    </script>
</body>
</html>
`;

const REGISTER_HTML = `
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>会員登録 - AICHEFS</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
</head>
<body class="bg-gradient-to-br from-green-50 to-blue-50 min-h-screen flex items-center justify-center py-12">
    <div class="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full mx-4">
        <div class="text-center mb-8">
            <i class="fas fa-user-plus text-5xl text-green-600 mb-4"></i>
            <h1 class="text-3xl font-bold text-gray-800">AICHEFS</h1>
            <p class="text-gray-600 mt-2">新規会員登録</p>
        </div>
        
        <form id="registerForm" class="space-y-6">
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">お名前</label>
                <input type="text" id="name" required class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent" placeholder="山田 太郎">
            </div>
            
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">メールアドレス</label>
                <input type="email" id="email" required class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent" placeholder="example@email.com">
            </div>
            
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">パスワード</label>
                <input type="password" id="password" required minlength="8" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent" placeholder="8文字以上">
                <p class="text-xs text-gray-500 mt-1">8文字以上で入力してください</p>
            </div>
            
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">パスワード（確認）</label>
                <input type="password" id="password_confirm" required minlength="8" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent" placeholder="もう一度入力">
            </div>
            
            <div id="error-message" class="hidden text-red-600 text-sm"></div>
            <div id="success-message" class="hidden text-green-600 text-sm"></div>
            
            <button type="submit" class="w-full bg-gradient-to-r from-green-600 to-blue-600 text-white py-3 rounded-lg font-semibold hover:from-green-700 hover:to-blue-700 transition">
                <i class="fas fa-user-plus mr-2"></i>会員登録
            </button>
        </form>
        
        <div class="mt-6 text-center space-y-2">
            <p class="text-sm text-gray-600">
                すでにアカウントをお持ちの方は
                <a href="/login" class="text-green-600 hover:underline">ログイン</a>
            </p>
            <a href="/" class="text-sm text-gray-500 hover:underline block">トップページに戻る</a>
        </div>
    </div>
    
    <script>
        document.getElementById('registerForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const password_confirm = document.getElementById('password_confirm').value;
            const errorDiv = document.getElementById('error-message');
            const successDiv = document.getElementById('success-message');
            
            errorDiv.classList.add('hidden');
            successDiv.classList.add('hidden');
            
            // パスワード一致チェック
            if (password !== password_confirm) {
                errorDiv.textContent = 'パスワードが一致しません';
                errorDiv.classList.remove('hidden');
                return;
            }
            
            // パスワード長チェック
            if (password.length < 8) {
                errorDiv.textContent = 'パスワードは8文字以上で入力してください';
                errorDiv.classList.remove('hidden');
                return;
            }
            
            try {
                const response = await fetch('/api/auth/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, email, password })
                });
                
                const data = await response.json();
                
                if (data.success) {
                    successDiv.textContent = '会員登録が完了しました！ログイン画面に移動します...';
                    successDiv.classList.remove('hidden');
                    
                    setTimeout(() => {
                        window.location.href = '/login';
                    }, 2000);
                } else {
                    errorDiv.textContent = data.error || '登録に失敗しました';
                    errorDiv.classList.remove('hidden');
                }
            } catch (error) {
                errorDiv.textContent = 'ネットワークエラーが発生しました';
                errorDiv.classList.remove('hidden');
            }
        });
    </script>
</body>
</html>
`;

const USER_DASHBOARD_HTML = `
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>マイページ - AICHEFS</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
</head>
<body class="bg-gray-50 min-h-screen">
    <!-- ヘッダー -->
    <header class="bg-white shadow-sm">
        <div class="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
            <div class="flex items-center gap-4">
                <i class="fas fa-utensils text-2xl text-purple-600"></i>
                <h1 class="text-2xl font-bold text-gray-800">AICHEFS</h1>
            </div>
            <div class="flex items-center gap-4">
                <span id="user-name" class="text-gray-700"></span>
                <button onclick="logout()" class="text-sm text-red-600 hover:underline">
                    <i class="fas fa-sign-out-alt mr-1"></i>ログアウト
                </button>
            </div>
        </div>
    </header>
    
    <!-- メインコンテンツ -->
    <main class="max-w-7xl mx-auto px-4 py-8">
        <!-- ダッシュボードカード -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <!-- 献立作成 -->
            <div class="bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl p-6 text-white shadow-xl">
                <i class="fas fa-calendar-plus text-4xl mb-4"></i>
                <h2 class="text-2xl font-bold mb-2">献立作成</h2>
                <p class="mb-4 opacity-90">新しい献立を作成します</p>
                <a href="/app" class="inline-block bg-white text-purple-600 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition">
                    作成する
                </a>
            </div>
            
            <!-- 履歴 -->
            <div class="bg-gradient-to-br from-green-500 to-teal-500 rounded-2xl p-6 text-white shadow-xl">
                <i class="fas fa-history text-4xl mb-4"></i>
                <h2 class="text-2xl font-bold mb-2">献立履歴</h2>
                <p class="mb-4 opacity-90"><span id="history-count">0</span>件の履歴</p>
                <button onclick="showHistoryTab()" class="bg-white text-green-600 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition">
                    閲覧する
                </button>
            </div>
            
            <!-- お気に入り -->
            <div class="bg-gradient-to-br from-pink-500 to-rose-500 rounded-2xl p-6 text-white shadow-xl">
                <i class="fas fa-heart text-4xl mb-4"></i>
                <h2 class="text-2xl font-bold mb-2">お気に入り</h2>
                <p class="mb-4 opacity-90"><span id="favorites-count">0</span>件のレシピ</p>
                <button onclick="showFavoritesTab()" class="bg-white text-pink-600 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition">
                    閲覧する
                </button>
            </div>
        </div>
        
        <!-- タブナビゲーション -->
        <div class="bg-white rounded-lg shadow-sm mb-6">
            <div class="border-b border-gray-200 flex">
                <button onclick="switchTab('history')" id="tab-history" class="px-6 py-3 font-semibold border-b-2 border-purple-600 text-purple-600">
                    <i class="fas fa-history mr-2"></i>履歴
                </button>
                <button onclick="switchTab('favorites')" id="tab-favorites" class="px-6 py-3 font-semibold text-gray-600 hover:text-purple-600">
                    <i class="fas fa-heart mr-2"></i>お気に入り
                </button>
                <button onclick="switchTab('profile')" id="tab-profile" class="px-6 py-3 font-semibold text-gray-600 hover:text-purple-600">
                    <i class="fas fa-user mr-2"></i>プロフィール
                </button>
            </div>
        </div>
        
        <!-- タブコンテンツ -->
        <div id="content-history" class="bg-white rounded-lg shadow-sm p-6">
            <h2 class="text-2xl font-bold text-gray-800 mb-6">献立履歴</h2>
            <div id="history-list" class="space-y-4">
                <p class="text-gray-500">履歴を読み込み中...</p>
            </div>
        </div>
        
        <div id="content-favorites" class="hidden bg-white rounded-lg shadow-sm p-6">
            <h2 class="text-2xl font-bold text-gray-800 mb-6">お気に入りレシピ</h2>
            <div id="favorites-list" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <p class="text-gray-500">お気に入りを読み込み中...</p>
            </div>
        </div>
        
        <div id="content-profile" class="hidden bg-white rounded-lg shadow-sm p-6">
            <h2 class="text-2xl font-bold text-gray-800 mb-6">プロフィール</h2>
            <div class="space-y-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">お名前</label>
                    <input type="text" id="profile-name" class="w-full px-4 py-2 border border-gray-300 rounded-lg" disabled>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">メールアドレス</label>
                    <input type="email" id="profile-email" class="w-full px-4 py-2 border border-gray-300 rounded-lg" disabled>
                </div>
                <p class="text-sm text-gray-500">※ プロフィール編集機能は近日公開予定です</p>
            </div>
        </div>
    </main>
    
    <script>
        let userData = null;
        let household_id = null;
        
        // 初期化
        async function init() {
            // セッション確認
            const session_id = localStorage.getItem('session_id');
            const user = localStorage.getItem('user');
            
            if (!session_id || !user) {
                window.location.href = '/login';
                return;
            }
            
            userData = JSON.parse(user);
            household_id = userData.household_id;
            document.getElementById('user-name').textContent = userData.name;
            document.getElementById('profile-name').value = userData.name;
            document.getElementById('profile-email').value = userData.email;
            
            // データ読み込み
            await loadHistory();
            await loadFavorites();
        }
        
        // 履歴読み込み
        async function loadHistory() {
            try {
                const response = await fetch(\`/api/history/list/\${household_id}\`);
                const data = await response.json();
                
                document.getElementById('history-count').textContent = data.count || 0;
                
                const listEl = document.getElementById('history-list');
                if (data.histories && data.histories.length > 0) {
                    listEl.innerHTML = data.histories.map(h => '<div class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">' +
                        '<div class="flex justify-between items-start">' +
                            '<div>' +
                                '<h3 class="font-bold text-lg text-gray-800">' + h.title + '</h3>' +
                                '<p class="text-sm text-gray-600 mt-1">' +
                                    '<i class="far fa-calendar mr-1"></i>' + h.start_date + ' ~ ' + h.end_date +
                                '</p>' +
                                '<p class="text-sm text-gray-600">' +
                                    '<i class="fas fa-users mr-1"></i>' + h.members_count + '人分 | ' + h.total_days + '日間' +
                                '</p>' +
                            '</div>' +
                            '<div class="flex gap-2">' +
                                '<button class="history-view-btn text-blue-600 hover:text-blue-800" data-history-id="' + h.history_id + '">' +
                                    '<i class="fas fa-eye"></i>' +
                                '</button>' +
                                '<button class="history-delete-btn text-red-600 hover:text-red-800" data-history-id="' + h.history_id + '">' +
                                    '<i class="fas fa-trash"></i>' +
                                '</button>' +
                            '</div>' +
                        '</div>' +
                    '</div>').join('');
                } else {
                    listEl.innerHTML = '<p class="text-gray-500">まだ履歴がありません</p>';
                }
            } catch (error) {
                console.error('History load error:', error);
            }
        }
        
        // お気に入り読み込み
        async function loadFavorites() {
            try {
                const response = await fetch(\`/api/favorites/list/\${household_id}\`);
                const data = await response.json();
                
                document.getElementById('favorites-count').textContent = data.count || 0;
                
                const listEl = document.getElementById('favorites-list');
                if (data.favorites && data.favorites.length > 0) {
                    listEl.innerHTML = data.favorites.map(f => '<div class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">' +
                        '<h3 class="font-bold text-gray-800 mb-2">' + f.title + '</h3>' +
                        '<p class="text-sm text-gray-600 mb-2">' + (f.description || '') + '</p>' +
                        '<div class="flex justify-between items-center text-sm text-gray-500">' +
                            '<span><i class="fas fa-globe mr-1"></i>' + f.cuisine + '</span>' +
                            '<span><i class="far fa-clock mr-1"></i>' + f.time_min + '分</span>' +
                        '</div>' +
                    '</div>').join('');
                } else {
                    listEl.innerHTML = '<p class="text-gray-500 col-span-full">まだお気に入りがありません</p>';
                }
            } catch (error) {
                console.error('Favorites load error:', error);
            }
        }
        
        // タブ切り替え
        function switchTab(tab) {
            ['history', 'favorites', 'profile'].forEach(t => {
                document.getElementById(\`content-\${t}\`).classList.add('hidden');
                document.getElementById(\`tab-\${t}\`).classList.remove('border-b-2', 'border-purple-600', 'text-purple-600');
                document.getElementById(\`tab-\${t}\`).classList.add('text-gray-600');
            });
            
            document.getElementById(\`content-\${tab}\`).classList.remove('hidden');
            document.getElementById(\`tab-\${tab}\`).classList.add('border-b-2', 'border-purple-600', 'text-purple-600');
            document.getElementById(\`tab-\${tab}\`).classList.remove('text-gray-600');
        }
        
        function showHistoryTab() { switchTab('history'); }
        function showFavoritesTab() { switchTab('favorites'); }
        
        // 履歴詳細表示
        async function viewHistory(history_id) {
            alert('履歴詳細表示機能は近日実装予定です');
        }
        
        // 履歴削除
        async function deleteHistory(history_id) {
            if (!confirm('この履歴を削除してもよろしいですか？')) return;
            
            try {
                const response = await fetch(\`/api/history/delete/\${history_id}\`, { method: 'DELETE' });
                const data = await response.json();
                
                if (data.success) {
                    alert('履歴を削除しました');
                    await loadHistory();
                } else {
                    alert('削除に失敗しました');
                }
            } catch (error) {
                console.error('Delete error:', error);
                alert('エラーが発生しました');
            }
        }
        
        // ログアウト
        function logout() {
            localStorage.removeItem('session_id');
            localStorage.removeItem('user');
            window.location.href = '/';
        }
        
        // 初期化実行
        init();
    </script>
</body>
</html>
`;

const ADMIN_DASHBOARD_HTML = `
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>管理者ダッシュボード - AICHEFS</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
</head>
<body class="bg-gray-100 min-h-screen">
    <!-- ヘッダー -->
    <header class="bg-gray-900 text-white shadow-lg">
        <div class="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
            <div class="flex items-center gap-4">
                <i class="fas fa-shield-alt text-2xl"></i>
                <h1 class="text-2xl font-bold">AICHEFS 管理者</h1>
            </div>
            <button onclick="logout()" class="text-sm text-red-400 hover:text-red-300">
                <i class="fas fa-sign-out-alt mr-1"></i>ログアウト
            </button>
        </div>
    </header>
    
    <!-- メインコンテンツ -->
    <main class="max-w-7xl mx-auto px-4 py-8">
        <h2 class="text-3xl font-bold text-gray-800 mb-8">管理者ダッシュボード</h2>
        
        <!-- 統計カード -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div class="bg-white rounded-lg shadow-md p-6">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-sm text-gray-600">総ユーザー数</p>
                        <p id="total-users" class="text-3xl font-bold text-gray-800">-</p>
                    </div>
                    <i class="fas fa-users text-4xl text-blue-500"></i>
                </div>
                <p class="text-sm text-green-600 mt-2">
                    <i class="fas fa-arrow-up mr-1"></i>
                    <span id="users-growth">-</span>% 今月
                </p>
            </div>
            
            <div class="bg-white rounded-lg shadow-md p-6">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-sm text-gray-600">総献立数</p>
                        <p id="total-plans" class="text-3xl font-bold text-gray-800">-</p>
                    </div>
                    <i class="fas fa-calendar-alt text-4xl text-green-500"></i>
                </div>
                <p class="text-sm text-green-600 mt-2">
                    <i class="fas fa-arrow-up mr-1"></i>
                    <span id="plans-growth">-</span>% 今月
                </p>
            </div>
            
            <div class="bg-white rounded-lg shadow-md p-6">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-sm text-gray-600">アクティブユーザー</p>
                        <p id="active-users" class="text-3xl font-bold text-gray-800">-</p>
                    </div>
                    <i class="fas fa-user-check text-4xl text-purple-500"></i>
                </div>
                <p class="text-sm text-gray-600 mt-2">過去7日間</p>
            </div>
            
            <div class="bg-white rounded-lg shadow-md p-6">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-sm text-gray-600">メルマガ登録</p>
                        <p id="newsletter-count" class="text-3xl font-bold text-gray-800">-</p>
                    </div>
                    <i class="fas fa-envelope text-4xl text-pink-500"></i>
                </div>
                <p class="text-sm text-gray-600 mt-2">
                    開封率 <span id="open-rate">-</span>%
                </p>
            </div>
        </div>
        
        <!-- ユーザー一覧 -->
        <div class="bg-white rounded-lg shadow-md p-6 mb-8">
            <h3 class="text-xl font-bold text-gray-800 mb-4">最近のユーザー</h3>
            <div class="overflow-x-auto">
                <table class="min-w-full">
                    <thead>
                        <tr class="border-b">
                            <th class="text-left py-3 px-4 text-sm font-semibold text-gray-700">ユーザー名</th>
                            <th class="text-left py-3 px-4 text-sm font-semibold text-gray-700">家族人数</th>
                            <th class="text-left py-3 px-4 text-sm font-semibold text-gray-700">献立数</th>
                            <th class="text-left py-3 px-4 text-sm font-semibold text-gray-700">登録日</th>
                        </tr>
                    </thead>
                    <tbody id="users-table">
                        <tr>
                            <td colspan="4" class="text-center py-4 text-gray-500">読み込み中...</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        
        <!-- クイックアクション -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-md p-6 text-white">
                <i class="fas fa-utensils text-3xl mb-3"></i>
                <h3 class="text-xl font-bold mb-2">レシピ管理</h3>
                <p class="text-sm mb-4 opacity-90">レシピの追加・編集・削除</p>
                <button class="bg-white text-blue-600 px-4 py-2 rounded font-semibold hover:bg-gray-100 transition" disabled>
                    近日公開
                </button>
            </div>
            
            <div class="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-md p-6 text-white">
                <i class="fas fa-users-cog text-3xl mb-3"></i>
                <h3 class="text-xl font-bold mb-2">ユーザー管理</h3>
                <p class="text-sm mb-4 opacity-90">ユーザーの詳細管理</p>
                <button class="bg-white text-green-600 px-4 py-2 rounded font-semibold hover:bg-gray-100 transition" disabled>
                    近日公開
                </button>
            </div>
            
            <div class="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-md p-6 text-white">
                <i class="fas fa-chart-line text-3xl mb-3"></i>
                <h3 class="text-xl font-bold mb-2">詳細統計</h3>
                <p class="text-sm mb-4 opacity-90">アクセス解析・レポート</p>
                <button class="bg-white text-purple-600 px-4 py-2 rounded font-semibold hover:bg-gray-100 transition" disabled>
                    近日公開
                </button>
            </div>
        </div>
    </main>
    
    <script>
        // 初期化
        async function init() {
            // セッション確認
            const session_id = localStorage.getItem('admin_session_id');
            const admin = localStorage.getItem('admin');
            
            if (!session_id || !admin) {
                window.location.href = '/admin/login';
                return;
            }
            
            // データ読み込み
            await loadStats();
            await loadUsers();
        }
        
        // 統計データ読み込み
        async function loadStats() {
            try {
                const response = await fetch('/api/admin/stats');
                const data = await response.json();
                
                document.getElementById('total-users').textContent = data.totalUsers || 0;
                document.getElementById('total-plans').textContent = data.totalPlans || 0;
                document.getElementById('active-users').textContent = data.activeUsers || 0;
                document.getElementById('newsletter-count').textContent = data.newsletter || 0;
                document.getElementById('users-growth').textContent = data.usersGrowth || 0;
                document.getElementById('plans-growth').textContent = data.plansGrowth || 0;
                document.getElementById('open-rate').textContent = data.openRate || 0;
            } catch (error) {
                console.error('Stats load error:', error);
            }
        }
        
        // ユーザー一覧読み込み
        async function loadUsers() {
            try {
                const response = await fetch('/api/admin/users');
                const data = await response.json();
                
                const tableEl = document.getElementById('users-table');
                if (data.users && data.users.length > 0) {
                    tableEl.innerHTML = data.users.slice(0, 10).map(u => \`
                        <tr class="border-b hover:bg-gray-50">
                            <td class="py-3 px-4">\${u.title}</td>
                            <td class="py-3 px-4">\${u.members_count}人</td>
                            <td class="py-3 px-4">\${u.plan_count || 0}件</td>
                            <td class="py-3 px-4">\${new Date(u.created_at).toLocaleDateString('ja-JP')}</td>
                        </tr>
                    \`).join('');
                } else {
                    tableEl.innerHTML = '<tr><td colspan="4" class="text-center py-4 text-gray-500">ユーザーがいません</td></tr>';
                }
            } catch (error) {
                console.error('Users load error:', error);
            }
        }
        
        // ログアウト
        function logout() {
            localStorage.removeItem('admin_session_id');
            localStorage.removeItem('admin');
            window.location.href = '/';
        }
        
        // 初期化実行
        init();
    </script>
</body>
</html>
`;

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
            
            /* カレンダー印刷時のスタイル */
            .calendar-grid-month {
                display: grid !important;
                grid-template-columns: repeat(7, 1fr) !important;
                width: 100% !important;
                max-width: 100% !important;
                page-break-inside: avoid;
            }
            
            .calendar-day-cell {
                min-height: 80px !important;
                padding: 4px !important;
                border: 1px solid #ccc !important;
                page-break-inside: avoid;
            }
            
            .calendar-day-content {
                font-size: 8pt !important;
            }
            
            .calendar-day-actions {
                display: none !important;
            }
            
            /* モーダルの背景を非表示 */
            .modal-backdrop,
            .fixed.inset-0 {
                display: none !important;
            }
            
            /* 買い物リスト印刷用スタイル */
            #shopping-modal {
                position: static !important;
                background: white !important;
                backdrop-filter: none !important;
            }
            
            #shopping-modal > div {
                max-width: 100% !important;
                box-shadow: none !important;
                border-radius: 0 !important;
            }
            
            #shopping-modal .bg-gradient-to-r {
                background: white !important;
                color: black !important;
                border-bottom: 2px solid #000 !important;
            }
            
            #shopping-modal button {
                display: none !important;
            }
            
            #shopping-modal-content {
                max-height: none !important;
            }
            
            /* 週ごとの買い物リストの改ページ */
            .week-shopping-list {
                page-break-before: auto;
                page-break-after: auto;
                page-break-inside: avoid;
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
            box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
            transform: translateY(-4px);
            border-color: #3b82f6;
        }
        
        .day-card[draggable="true"]:hover {
            cursor: grab;
        }
        
        .day-card[draggable="true"]:active {
            cursor: grabbing;
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
            max-width: 100%;
            overflow-x: auto;
        }
        
        /* レスポンシブ対応 */
        @media screen and (max-width: 768px) {
            .calendar-grid-month {
                font-size: 12px;
            }
            
            .calendar-day-cell {
                min-height: 80px;
                padding: 4px;
            }
            
            .calendar-day-content {
                font-size: 9px;
            }
        }
        
        @media screen and (max-width: 480px) {
            .calendar-grid-month {
                font-size: 10px;
            }
            
            .calendar-day-cell {
                min-height: 60px;
                padding: 2px;
            }
            
            .calendar-day-content {
                font-size: 8px;
            }
            
            .calendar-day-number {
                font-size: 12px;
            }
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
        
        @keyframes slideDown {
            from {
                opacity: 0;
                transform: translate(-50%, -100%);
            }
            to {
                opacity: 1;
                transform: translate(-50%, 0);
            }
        }
        
        @keyframes fadeOut {
            from {
                opacity: 1;
            }
            to {
                opacity: 0;
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
<body class="bg-gray-50" style="overflow-x: hidden;">
    <div id="app" class="container mx-auto px-4 py-8 max-w-6xl" style="max-width: min(1536px, 100vw); overflow-x: hidden;">
        <!-- ヘッダー -->
        <!-- アプリヘッダー - 横長バナー -->
        <div class="no-print mb-8 relative overflow-hidden rounded-2xl" style="height: 200px; max-width: 100%;">
            <div class="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 animate-gradient"></div>
            <div class="absolute inset-0 flex items-center justify-center">
                <div class="text-center text-white px-4">
                    <div class="flex items-center justify-center gap-3 mb-2">
                        <i class="fas fa-utensils text-4xl md:text-5xl"></i>
                        <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold" style="text-shadow: 3px 3px 6px rgba(0,0,0,0.3);">
                            AICHEFS
                        </h1>
                    </div>
                    <h2 class="text-xl md:text-2xl lg:text-3xl font-bold mb-3" style="text-shadow: 2px 2px 4px rgba(0,0,0,0.3);">
                        AIシェフ
                    </h2>
                    <p class="text-base md:text-lg lg:text-xl opacity-95" style="text-shadow: 1px 1px 2px rgba(0,0,0,0.3);">
                        考えなくていい。<br>悩まなくていい。<br>今日から晩ごはんが決まります。
                    </p>
                </div>
            </div>
            <div class="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/20 to-transparent"></div>
        </div>

        <!-- TOPページヘッダー広告 -->
        <div id="ad-top-header" class="ad-container no-print mb-6" style="display:flex;justify-content:center;"></div>

        <!-- チャットエリア -->
        <div id="chat-container" class="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6 mb-6">
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
                            あなたの献立があなたの毎日を彩ります
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
                    <button onclick="handlePrint()" class="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition flex items-center gap-2">
                        <i class="fas fa-print"></i>
                        印刷する
                    </button>
                    <button onclick="handleDownloadCalendar()" class="px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition flex items-center gap-2">
                        <i class="fas fa-download"></i>
                        ダウンロード
                    </button>
                    <div id="user-info" class="hidden px-4 py-2 bg-gray-100 rounded-lg flex items-center gap-2">
                        <i class="fas fa-user-circle text-gray-600"></i>
                        <span id="user-name" class="text-sm font-medium text-gray-700"></span>
                        <button onclick="logout()" class="text-xs text-red-600 hover:underline ml-2">ログアウト</button>
                    </div>
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
        
        <!-- フッターセクション（完全レスポンシブ版） -->
        <footer class="no-print mt-12 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 text-white rounded-2xl shadow-2xl" style="overflow: hidden; max-width: 100%; width: 100%; box-sizing: border-box;">
            <!-- 波のアニメーション背景 -->
            <div class="relative" style="overflow: hidden;">
                <div class="absolute inset-0 opacity-20" style="pointer-events: none;">
                    <svg class="absolute bottom-0 w-full h-32" viewBox="0 0 1200 120" preserveAspectRatio="none" style="overflow: hidden;">
                        <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" 
                              fill="currentColor" class="text-purple-700 opacity-50 animate-wave"></path>
                    </svg>
                </div>
                
                <div class="relative z-10 p-4 sm:p-6 md:p-8 lg:p-12" style="max-width: 100%; overflow: hidden;">
                    <!-- メインコンテンツエリア -->
                    <div class="max-w-6xl mx-auto" style="max-width: 100%; overflow: hidden; word-wrap: break-word;">
                        <!-- トップセクション -->
                        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-8">
                            <!-- ブランド情報 -->
                            <div class="space-y-4" style="overflow: hidden; word-wrap: break-word;">
                                <div class="flex items-center gap-2 sm:gap-3 flex-wrap">
                                    <div class="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg flex-shrink-0">
                                        <i class="fas fa-utensils text-xl sm:text-2xl text-white"></i>
                                    </div>
                                    <div style="overflow: hidden;">
                                        <h3 class="text-xl sm:text-2xl font-bold" style="word-wrap: break-word;">Aメニュー</h3>
                                        <p class="text-xs sm:text-sm text-purple-200" style="word-wrap: break-word;">今日の献立、明日の笑顔</p>
                                    </div>
                                </div>
                                <p class="text-xs sm:text-sm text-purple-200 leading-relaxed" style="word-wrap: break-word; overflow-wrap: break-word;">
                                    AIが考える、あなたの家族にぴったりの献立。毎日の食事が楽しくなります。
                                </p>
                                <div class="flex gap-2 sm:gap-3 flex-wrap">
                                    <a href="#" class="w-9 h-9 sm:w-10 sm:h-10 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full flex items-center justify-center transition transform hover:scale-110 flex-shrink-0">
                                        <i class="fab fa-twitter text-sm sm:text-base"></i>
                                    </a>
                                    <a href="#" class="w-9 h-9 sm:w-10 sm:h-10 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full flex items-center justify-center transition transform hover:scale-110 flex-shrink-0">
                                        <i class="fab fa-facebook text-sm sm:text-base"></i>
                                    </a>
                                    <a href="#" class="w-9 h-9 sm:w-10 sm:h-10 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full flex items-center justify-center transition transform hover:scale-110 flex-shrink-0">
                                        <i class="fab fa-instagram text-sm sm:text-base"></i>
                                    </a>
                                </div>
                            </div>
                            
                            <!-- クイックリンク -->
                            <div style="overflow: hidden; word-wrap: break-word;">
                                <h4 class="text-base sm:text-lg font-bold mb-3 sm:mb-4 flex items-center gap-2">
                                    <i class="fas fa-link text-yellow-400 text-sm sm:text-base"></i>
                                    <span style="word-wrap: break-word;">クイックリンク</span>
                                </h4>
                                <ul class="space-y-2 text-xs sm:text-sm">
                                    <li><a href="/app" class="text-purple-200 hover:text-white transition flex items-center gap-2 group" style="word-wrap: break-word;">
                                        <i class="fas fa-chevron-right text-xs group-hover:translate-x-1 transition flex-shrink-0"></i>
                                        <span>献立作成</span>
                                    </a></li>
                                    <li><a href="#" class="text-purple-200 hover:text-white transition flex items-center gap-2 group" style="word-wrap: break-word;">
                                        <i class="fas fa-chevron-right text-xs group-hover:translate-x-1 transition flex-shrink-0"></i>
                                        <span>使い方ガイド</span>
                                    </a></li>
                                    <li><a href="#" class="text-purple-200 hover:text-white transition flex items-center gap-2 group" style="word-wrap: break-word;">
                                        <i class="fas fa-chevron-right text-xs group-hover:translate-x-1 transition flex-shrink-0"></i>
                                        <span>よくある質問</span>
                                    </a></li>
                                    <li><a href="#" class="text-purple-200 hover:text-white transition flex items-center gap-2 group" style="word-wrap: break-word;">
                                        <i class="fas fa-chevron-right text-xs group-hover:translate-x-1 transition flex-shrink-0"></i>
                                        <span>プライバシーポリシー</span>
                                    </a></li>
                                </ul>
                            </div>
                            
                            <!-- メルマガ登録 -->
                            <div style="overflow: hidden; word-wrap: break-word;">
                                <h4 class="text-base sm:text-lg font-bold mb-3 sm:mb-4 flex items-center gap-2">
                                    <i class="fas fa-envelope text-pink-400 text-sm sm:text-base"></i>
                                    <span style="word-wrap: break-word;">メルマガ登録</span>
                                </h4>
                                <p class="text-xs sm:text-sm text-purple-200 mb-3" style="word-wrap: break-word; overflow-wrap: break-word;">
                                    お得な情報や新機能をお届けします
                                </p>
                                <div class="flex gap-2 flex-wrap">
                                    <input type="email" id="newsletter-email" placeholder="メールアドレス" 
                                           class="flex-1 min-w-0 px-3 sm:px-4 py-2 rounded-lg bg-white bg-opacity-20 border border-white border-opacity-30 text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:bg-opacity-30 transition text-xs sm:text-sm"
                                           style="max-width: 100%; word-wrap: break-word;">
                                    <button onclick="subscribeNewsletter()" 
                                            class="px-4 sm:px-6 py-2 bg-gradient-to-r from-pink-500 to-orange-500 text-white rounded-lg hover:from-pink-600 hover:to-orange-600 transition transform hover:scale-105 shadow-lg font-semibold whitespace-nowrap text-xs sm:text-sm flex-shrink-0">
                                        登録
                                    </button>
                                </div>
                                <p id="newsletter-message" class="text-xs mt-2" style="word-wrap: break-word; overflow-wrap: break-word;"></p>
                            </div>
                        </div>
                        
                        <!-- お問い合わせボタン -->
                        <div class="text-center py-4 sm:py-6 border-t border-white border-opacity-20">
                            <button onclick="openContactForm()" 
                                    class="inline-flex items-center gap-2 px-6 sm:px-8 py-2 sm:py-3 bg-white bg-opacity-10 hover:bg-opacity-20 rounded-full transition transform hover:scale-105 backdrop-blur-sm border border-white border-opacity-30 text-sm sm:text-base flex-wrap justify-center">
                                <i class="fas fa-comment-dots text-pink-400 flex-shrink-0"></i>
                                <span class="font-semibold">お問い合わせ</span>
                            </button>
                        </div>
                        
                        <!-- ログインボタン -->
                        <div class="text-center py-4 sm:py-6 border-t border-white border-opacity-20">
                            <div class="flex gap-4 justify-center flex-wrap">
                                <a href="/login" 
                                   class="inline-flex items-center gap-2 px-6 sm:px-8 py-2 sm:py-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 rounded-full transition transform hover:scale-105 shadow-lg text-sm sm:text-base font-semibold">
                                    <i class="fas fa-user flex-shrink-0"></i>
                                    <span>ユーザーログイン</span>
                                </a>
                                <a href="/admin/login" 
                                   class="inline-flex items-center gap-2 px-6 sm:px-8 py-2 sm:py-3 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 rounded-full transition transform hover:scale-105 shadow-lg text-sm sm:text-base font-semibold">
                                    <i class="fas fa-user-shield flex-shrink-0"></i>
                                    <span>管理者ログイン</span>
                                </a>
                            </div>
                        </div>
                        
                        <!-- コピーライト -->
                        <div class="text-center py-3 sm:py-4 border-t border-white border-opacity-20" style="overflow: hidden; word-wrap: break-word;">
                            <p class="text-xs sm:text-sm text-purple-200" style="word-wrap: break-word; overflow-wrap: break-word;">
                                &copy; 2026 <span class="font-bold text-white">Aメニュー</span>. All rights reserved.
                            </p>
                            <p class="text-xs text-purple-300 mt-1" style="word-wrap: break-word; overflow-wrap: break-word;">
                                Made with <i class="fas fa-heart text-pink-400 animate-pulse"></i> in Japan
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- サイドバー広告枠（改善版） -->
            <div id="ad-sidebar" class="ad-container p-4 bg-black bg-opacity-20" style="display:flex;justify-content:center;"></div>
        </footer>
        
        <style>
            @keyframes wave {
                0% { transform: translateX(0) translateY(0); }
                50% { transform: translateX(-25%) translateY(-10px); }
                100% { transform: translateX(-50%) translateY(0); }
            }
            .animate-wave {
                animation: wave 10s linear infinite;
            }
        </style>
        
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
                text: 'こんにちは！AIシェフへようこそ。<br>いくつかの質問に答えるだけで、あなたに最適な晩ごはん献立が完成します。<br><br>準備はいいですか？',
                options: [{ label: 'はじめる', value: 'start' }]
            },
            {
                id: 'consent',
                type: 'choice',
                text: '⚠️ 重要な注意事項 ⚠️<br><br>このサービスでは、アレルギーや嫌いな食材を考慮した献立を作成しますが、<strong>完全な除外を保証するものではありません</strong>。<br><br>• アレルギー情報は命に関わる重要な情報です<br>• データベースの食材情報には限界があります<br>• 調理時の交差汚染などは考慮されていません<br><br><strong>食物アレルギーをお持ちの方は、必ず献立内容を確認してからご利用ください。</strong><br><br>上記の注意事項に同意しますか？',
                field: '_consent',
                options: [
                    { label: '✅ 同意して続ける', value: 'agree' },
                    { label: '❌ 同意しない', value: 'disagree' }
                ]
            },
            {
                id: 'start_date',
                type: 'date',
                text: 'いつから始めますか？',
                field: 'start_date',
                condition: (data) => data._consent === 'agree'
            },
            {
                id: 'plan_days',
                type: 'choice',
                text: '何日分作りますか？',
                field: 'plan_days',
                options: [
                    { label: '1ヶ月（30日）', value: 30, icon: '📋' },
                    { label: '3週間（21日）', value: 21, icon: '🗓️' },
                    { label: '2週間（14日）', value: 14, icon: '📆' },
                    { label: '1週間（7日）', value: 7, icon: '📅' }
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
                    { label: '🐟 魚全般', value: 'fish' },
                    { label: '🍤 エビ', value: 'shrimp' },
                    { label: '🦀 カニ', value: 'crab' },
                    { label: '🐙 タコ', value: 'octopus' },
                    { label: '🦑 イカ', value: 'squid' },
                    { label: '🐚 貝類（あさり・しじみ・ホタテ等）', value: 'shellfish' },
                    { label: '🍖 内臓類・モツ（レバー・ハツ・ホルモン等）', value: 'offal' },
                    { label: '🍅 トマト', value: 'tomato' },
                    { label: '🍆 なす', value: 'eggplant' },
                    { label: '🫑 ピーマン', value: 'green_pepper' },
                    { label: '🥬 セロリ', value: 'celery' },
                    { label: '🌿 パクチー', value: 'cilantro' },
                    { label: '🍄 きのこ類', value: 'mushroom' },
                    { label: '🧄 にんにく', value: 'garlic' },
                    { label: '🧅 玉ねぎ', value: 'onion' },
                    { label: '🌶️ 辛いもの', value: 'spicy' }
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
                const container = document.createElement('div');
                container.className = 'max-w-lg mx-auto';
                
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
                
                container.appendChild(input);
                container.appendChild(btnGroup);
                
                inputAreaEl.appendChild(container);
            }
            else if (question.type === 'date') {
                const container = document.createElement('div');
                container.className = 'max-w-lg mx-auto';
                
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
                
                container.appendChild(input);
                container.appendChild(btnGroup);
                
                inputAreaEl.appendChild(container);
            }
            else if (question.type === 'number') {
                const container = document.createElement('div');
                container.className = 'max-w-lg mx-auto';
                
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
                
                container.appendChild(input);
                container.appendChild(btn);
                
                inputAreaEl.appendChild(container);
            }
            else if (question.type === 'choice') {
                const container = document.createElement('div');
                container.className = 'max-w-lg mx-auto';
                
                const btnContainer = document.createElement('div');
                btnContainer.className = 'space-y-3 mb-4';
                question.options.forEach(opt => {
                    const btn = document.createElement('button');
                    btn.className = 'group relative px-5 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl hover:from-blue-100 hover:to-indigo-100 hover:border-blue-400 hover:shadow-lg transition-all duration-200 transform hover:scale-105 text-left';
                    
                    // Create inner HTML elements
                    const iconDiv = document.createElement('div');
                    iconDiv.className = 'flex-shrink-0 w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-md';
                    iconDiv.innerHTML = '<i class="fas fa-check opacity-0 group-hover:opacity-100 transition-opacity"></i>';
                    
                    const labelSpan = document.createElement('span');
                    labelSpan.className = 'text-gray-800 font-medium group-hover:text-blue-700';
                    labelSpan.textContent = opt.label;
                    
                    const flexDiv = document.createElement('div');
                    flexDiv.className = 'flex items-center gap-3';
                    flexDiv.appendChild(iconDiv);
                    flexDiv.appendChild(labelSpan);
                    
                    btn.appendChild(flexDiv);
                    btn.onclick = () => {
                        appState.data[question.field] = opt.value;
                        
                        // 同意確認で「同意しない」を選んだ場合
                        if (question.id === 'consent' && opt.value === 'disagree') {
                            addMessage(opt.label, false);
                            alert('ご利用いただくには注意事項への同意が必要です。トップページに戻ります。');
                            window.location.href = '/';
                            return;
                        }
                        
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
                const container = document.createElement('div');
                container.className = 'max-w-lg mx-auto';
                
                const selected = new Set();
                const btnContainer = document.createElement('div');
                btnContainer.className = 'space-y-3 mb-4';
                
                question.options.forEach(opt => {
                    const btn = document.createElement('button');
                    btn.className = 'group relative px-4 py-3 bg-white border-2 border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-md transition-all duration-200 text-left';
                    
                    // Create inner elements
                    const checkbox = document.createElement('div');
                    checkbox.className = 'flex-shrink-0 w-6 h-6 border-2 border-gray-300 rounded-md flex items-center justify-center transition-all';
                    
                    const checkIcon = document.createElement('i');
                    checkIcon.className = 'fas fa-check text-white text-xs opacity-0';
                    checkbox.appendChild(checkIcon);
                    
                    const labelSpan = document.createElement('span');
                    labelSpan.className = 'text-sm font-medium text-gray-700';
                    labelSpan.textContent = opt.label;
                    
                    const flexDiv = document.createElement('div');
                    flexDiv.className = 'flex items-center gap-2';
                    flexDiv.appendChild(checkbox);
                    flexDiv.appendChild(labelSpan);
                    
                    btn.appendChild(flexDiv);
                    
                    btn.onclick = () => {
                        if (opt.value === 'none') {
                            selected.clear();
                            btnContainer.querySelectorAll('button').forEach(b => {
                                b.classList.remove('border-blue-500', 'bg-blue-50');
                                b.querySelector('div div').classList.remove('bg-blue-500', 'border-blue-500');
                                b.querySelector('i').classList.add('opacity-0');
                            });
                            checkbox.classList.add('bg-blue-500', 'border-blue-500');
                            checkIcon.classList.remove('opacity-0');
                            selected.add(opt.value);
                            btn.classList.add('border-blue-500', 'bg-blue-50');
                        } else {
                            // 「なし」のチェックを外す
                            const noneBtn = Array.from(btnContainer.querySelectorAll('button')).find(b => 
                                b.textContent.includes('なし')
                            );
                            if (noneBtn) {
                                noneBtn.classList.remove('border-blue-500', 'bg-blue-50');
                                noneBtn.querySelector('div div').classList.remove('bg-blue-500', 'border-blue-500');
                                noneBtn.querySelector('i').classList.add('opacity-0');
                            }
                            selected.delete('none');
                            
                            if (selected.has(opt.value)) {
                                selected.delete(opt.value);
                                btn.classList.remove('border-blue-500', 'bg-blue-50');
                                checkbox.classList.remove('bg-blue-500', 'border-blue-500');
                                checkIcon.classList.add('opacity-0');
                            } else {
                                selected.add(opt.value);
                                btn.classList.add('border-blue-500', 'bg-blue-50');
                                checkbox.classList.add('bg-blue-500', 'border-blue-500');
                                checkIcon.classList.remove('opacity-0');
                            }
                        }
                    };
                    btnContainer.appendChild(btn);
                });
                
                const confirmBtn = document.createElement('button');
                confirmBtn.className = 'flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 font-semibold';
                confirmBtn.innerHTML = '<i class="fas fa-arrow-right mr-2"></i>次へ';
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
                
                container.appendChild(btnContainer);
                container.appendChild(btnGroup);
                
                inputAreaEl.appendChild(container);
            }
            else if (question.type === 'confirm') {
                const container = document.createElement('div');
                container.className = 'max-w-lg mx-auto';
                
                const periodLabel = appState.data.plan_days === 30 ? '1ヶ月（30日）' : 
                                    appState.data.plan_days === 21 ? '3週間（21日）' :
                                    appState.data.plan_days === 14 ? '2週間（14日）' : 
                                    appState.data.plan_days === 7 ? '1週間（7日）' :
                                    appState.data.plan_days + '日間';
                const summary = \`
                    <div class="bg-gray-50 p-4 rounded mb-4">
                        <p><strong>タイトル:</strong> \${appState.data.title}</p>
                        <p><strong>開始日:</strong> \${appState.data.start_date}</p>
                        <p><strong>期間:</strong> \${periodLabel}</p>
                        <p><strong>人数:</strong> \${appState.data.members_count}人</p>
                        <p><strong>予算:</strong> \${appState.data.budget_tier_per_person}円/人</p>
                        <p><strong>調理時間:</strong> \${appState.data.cooking_time_limit_min}分</p>
                    </div>
                \`;
                container.innerHTML = summary;
                
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
                
                container.appendChild(btnGroup);
                
                inputAreaEl.appendChild(container);
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
                
                // 🔝 画面を上部にスクロール
                window.scrollTo({ top: 0, behavior: 'smooth' });
                
                // メッセージエリアをクリア（ページ分割式）
                messagesEl.innerHTML = '';
                
                // プログレスバー表示
                const progress = Math.round((appState.step / questions.length) * 100);
                const progressHtml = '<div class="mb-6">' +
                    '<div class="flex justify-between text-sm text-gray-600 mb-2">' +
                        '<span>質問 ' + (appState.step + 1) + ' / ' + questions.length + '</span>' +
                        '<span>' + progress + '% 完了</span>' +
                    '</div>' +
                    '<div class="w-full bg-gray-200 rounded-full h-2">' +
                        '<div id="progress-bar-' + appState.step + '" class="bg-blue-500 h-2 rounded-full transition-all duration-300" style="width: 0%"></div>' +
                    '</div>' +
                '</div>';
                messagesEl.innerHTML = progressHtml;
                // プログレスバーの幅を動的に設定
                setTimeout(() => {
                    const progressBar = document.getElementById('progress-bar-' + appState.step);
                    if (progressBar) {
                        progressBar.style.width = progress + '%';
                    }
                }, 10);
                
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
                const progressHtml = '<div class="mb-6">' +
                    '<div class="flex justify-between text-sm text-gray-600 mb-2">' +
                        '<span>質問 ' + (appState.step + 1) + ' / ' + questions.length + '</span>' +
                        '<span>' + progress + '% 完了</span>' +
                    '</div>' +
                    '<div class="w-full bg-gray-200 rounded-full h-2">' +
                        '<div id="progress-bar-' + appState.step + '" class="bg-blue-500 h-2 rounded-full transition-all duration-300" style="width: 0%"></div>' +
                    '</div>' +
                '</div>';
                messagesEl.innerHTML = progressHtml;
                // プログレスバーの幅を動的に設定
                setTimeout(() => {
                    const progressBar = document.getElementById('progress-bar-' + appState.step);
                    if (progressBar) {
                        progressBar.style.width = progress + '%';
                    }
                }, 10);
                
                addMessage(question.text);
                showInput(question);
            }
        }

        async function generatePlan() {
            try {
                // モーダルを表示
                const modal = document.getElementById('plan-generation-modal');
                const content = document.getElementById('plan-generation-modal-content');
                
                modal.classList.remove('hidden');
                modal.classList.add('flex');
                
                // ローディングアニメーション表示
                const loadingHtml = \`
                    <div class="flex flex-col items-center justify-center py-16 px-6">
                        <!-- メインアニメーション -->
                        <div class="relative w-48 h-48 mb-8">
                            <!-- 外側の回転リング -->
                            <div class="absolute inset-0 border-8 border-transparent border-t-blue-500 border-r-purple-500 rounded-full animate-spin" style="animation-duration: 3s;"></div>
                            <div class="absolute inset-2 border-8 border-transparent border-b-pink-500 border-l-orange-500 rounded-full animate-spin" style="animation-duration: 2s; animation-direction: reverse;"></div>
                            <div class="absolute inset-4 border-8 border-transparent border-t-green-500 border-r-yellow-500 rounded-full animate-spin" style="animation-duration: 4s;"></div>
                            
                            <!-- 中央のアイコン -->
                            <div class="absolute inset-0 flex items-center justify-center">
                                <div class="text-6xl animate-bounce">
                                    <i class="fas fa-utensils text-blue-500"></i>
                                </div>
                            </div>
                            
                            <!-- パルスエフェクト -->
                            <div class="absolute inset-0 bg-blue-500 rounded-full opacity-20 animate-ping" style="animation-duration: 2s;"></div>
                        </div>
                        
                        <!-- テキストセクション -->
                        <h3 class="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
                            献立を作成中...
                        </h3>
                        <p class="text-lg text-gray-600 mb-6 text-center max-w-md">
                            AIがあなたの家族に最適な献立を考えています
                        </p>
                        
                        <!-- プログレスステップ -->
                        <div class="w-full max-w-2xl space-y-4">
                            <div id="step-1" class="loading-step flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border-2 border-blue-200 transform transition-all duration-500">
                                <div class="flex-shrink-0 w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                                    <i class="fas fa-search text-xl"></i>
                                </div>
                                <div class="flex-1">
                                    <h4 class="font-bold text-gray-800">レシピ検索中</h4>
                                    <p class="text-sm text-gray-600">703品のレシピから最適な組み合わせを探しています</p>
                                </div>
                                <div class="loading-spinner">
                                    <i class="fas fa-spinner fa-spin text-2xl text-blue-500"></i>
                                </div>
                            </div>
                            
                            <div id="step-2" class="loading-step flex items-center gap-4 p-4 bg-gray-50 rounded-lg border-2 border-gray-200 opacity-50 transform transition-all duration-500">
                                <div class="flex-shrink-0 w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                                    <i class="fas fa-balance-scale text-xl"></i>
                                </div>
                                <div class="flex-1">
                                    <h4 class="font-bold text-gray-800">栄養バランス調整中</h4>
                                    <p class="text-sm text-gray-600">主菜・副菜・汁物のバランスを最適化しています</p>
                                </div>
                                <div class="loading-spinner hidden">
                                    <i class="fas fa-spinner fa-spin text-2xl text-purple-500"></i>
                                </div>
                            </div>
                            
                            <div id="step-3" class="loading-step flex items-center gap-4 p-4 bg-gray-50 rounded-lg border-2 border-gray-200 opacity-50 transform transition-all duration-500">
                                <div class="flex-shrink-0 w-12 h-12 bg-pink-500 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                                    <i class="fas fa-calendar-check text-xl"></i>
                                </div>
                                <div class="flex-1">
                                    <h4 class="font-bold text-gray-800">献立カレンダー作成中</h4>
                                    <p class="text-sm text-gray-600">31日分の献立を組み立てています</p>
                                </div>
                                <div class="loading-spinner hidden">
                                    <i class="fas fa-spinner fa-spin text-2xl text-pink-500"></i>
                                </div>
                            </div>
                        </div>
                        
                        <!-- プログレスバー -->
                        <div class="w-full max-w-2xl mt-8">
                            <div class="h-3 bg-gray-200 rounded-full overflow-hidden shadow-inner">
                                <div id="progress-bar" class="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full transition-all duration-1000 ease-out" style="width: 0%"></div>
                            </div>
                            <p class="text-center text-sm text-gray-500 mt-2">
                                <span id="progress-text">準備中...</span>
                            </p>
                        </div>
                        
                        <!-- 豆知識 -->
                        <div class="mt-8 p-4 bg-yellow-50 border-2 border-yellow-200 rounded-lg max-w-2xl">
                            <p class="text-sm text-gray-700 flex items-start gap-2">
                                <i class="fas fa-lightbulb text-yellow-500 mt-0.5"></i>
                                <span><strong>豆知識:</strong> カレーやシチューなどの煮込み料理は、汁物をサラダに自動変更して栄養バランスを最適化しています！</span>
                            </p>
                        </div>
                    </div>
                \`;
                content.innerHTML = loadingHtml;
                
                // アニメーションシーケンス（HTMLの外で実行）
                setTimeout(() => {
                    document.getElementById('step-1').classList.add('scale-105');
                    document.getElementById('progress-bar').style.width = '33%';
                    document.getElementById('progress-text').textContent = 'レシピ検索中... 33%';
                }, 500);
                
                setTimeout(() => {
                    document.getElementById('step-1').classList.remove('scale-105');
                    document.getElementById('step-1').querySelector('.loading-spinner').innerHTML = '<i class="fas fa-check text-2xl text-green-500"></i>';
                    
                    document.getElementById('step-2').classList.remove('opacity-50');
                    document.getElementById('step-2').classList.add('scale-105', 'bg-gradient-to-r', 'from-purple-50', 'to-purple-100', 'border-purple-200');
                    document.getElementById('step-2').querySelector('.loading-spinner').classList.remove('hidden');
                    document.getElementById('progress-bar').style.width = '66%';
                    document.getElementById('progress-text').textContent = '栄養バランス調整中... 66%';
                }, 2000);
                
                setTimeout(() => {
                    document.getElementById('step-2').classList.remove('scale-105');
                    document.getElementById('step-2').querySelector('.loading-spinner').innerHTML = '<i class="fas fa-check text-2xl text-green-500"></i>';
                    
                    document.getElementById('step-3').classList.remove('opacity-50');
                    document.getElementById('step-3').classList.add('scale-105', 'bg-gradient-to-r', 'from-pink-50', 'to-pink-100', 'border-pink-200');
                    document.getElementById('step-3').querySelector('.loading-spinner').classList.remove('hidden');
                    document.getElementById('progress-bar').style.width = '100%';
                    document.getElementById('progress-text').textContent = '献立カレンダー作成中... 100%';
                }, 4000);
                
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
                
                // 成功メッセージ（期間を動的に表示）
                const daysCount = planRes.data.days.length;
                const periodText = daysCount === 7 ? '1週間' :
                                   daysCount === 14 ? '2週間' :
                                   daysCount === 21 ? '3週間' :
                                   daysCount === 30 ? '4週間（1ヶ月）' : daysCount + '日間';
                content.innerHTML = \`
                    <div class="flex flex-col items-center justify-center py-12">
                        <div class="text-6xl mb-4 animate-bounce">🎉</div>
                        <h3 class="text-3xl font-bold text-gray-800 mb-2">献立が完成しました！</h3>
                        <p class="text-gray-600">\${periodText}分の献立をご覧ください</p>
                    </div>
                \`;
                
                setTimeout(() => {
                    modal.classList.add('hidden');
                    modal.classList.remove('flex');
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
                
                content.innerHTML = \`
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
            
            // 📍 画面トップへスムーススクロール
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
            
            // 🎉 完成通知トーストを表示（期間を動的に表示）
            const daysCount = days.length;
            const periodText = daysCount === 7 ? '1週間' :
                               daysCount === 14 ? '2週間' :
                               daysCount === 21 ? '3週間' :
                               daysCount === 30 ? '4週間（1ヶ月）' : daysCount + '日間';
            const toast = document.createElement('div');
            toast.className = 'fixed top-20 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-4 rounded-2xl shadow-2xl z-50 flex items-center gap-3 animate-bounce';
            toast.style.animation = 'slideDown 0.5s ease-out, fadeOut 0.5s ease-out 4.5s';
            toast.innerHTML = \`
                <i class="fas fa-check-circle text-3xl"></i>
                <div>
                    <div class="font-bold text-lg">🎉 献立が完成しました！</div>
                    <div class="text-sm opacity-90">\${periodText}分の献立をお楽しみください</div>
                </div>
            \`;
            document.body.appendChild(toast);
            
            // 5秒後にトーストを削除
            setTimeout(() => {
                toast.remove();
            }, 5000);
            
            // 印刷用のタイトル設定
            if (days.length > 0) {
                const startDate = days[0].date;
                const endDate = days[days.length - 1].date;
                document.getElementById('print-period').textContent = \`期間: \${startDate} 〜 \${endDate}\`;
            }
            
            // ユーザー情報を表示
            const user = getCurrentUser();
            if (user) {
                const userInfo = document.getElementById('user-info');
                const userName = document.getElementById('user-name');
                userName.textContent = user.name;
                userInfo.classList.remove('hidden');
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
                                \${main ? '<div class="recipe-item flex items-start"><span class="recipe-badge badge-main mt-1"></span><span class="flex-1"><span class="font-semibold text-red-600">主菜:</span> <a href="javascript:void(0)" class="recipe-link text-blue-600 hover:underline cursor-pointer" data-recipe-id="' + main.recipe_id + '" data-recipe-title="' + main.title + '">' + main.title + '</a></span></div>' : ''}
                                \${side ? '<div class="recipe-item flex items-start"><span class="recipe-badge badge-side mt-1"></span><span class="flex-1"><span class="font-semibold text-green-600">副菜:</span> <a href="javascript:void(0)" class="recipe-link text-blue-600 hover:underline cursor-pointer" data-recipe-id="' + side.recipe_id + '" data-recipe-title="' + side.title + '">' + side.title + '</a></span></div>' : ''}
                                \${soup ? '<div class="recipe-item flex items-start"><span class="recipe-badge badge-soup mt-1"></span><span class="flex-1"><span class="font-semibold text-blue-600">汁物:</span> <a href="javascript:void(0)" class="recipe-link text-blue-600 hover:underline cursor-pointer" data-recipe-id="' + soup.recipe_id + '" data-recipe-title="' + soup.title + '">' + soup.title + '</a></span></div>' : ''}
                            </div>
                            <div class="mt-3 text-xs text-gray-500 border-t pt-2">
                                <i class="far fa-clock"></i> 約\${day.estimated_time_min}分
                            </div>
                            <div class="mt-3 flex gap-2 no-print">
                                <button class="explain-menu-btn flex-1 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 text-xs font-medium transition-colors" data-plan-day-id="\${day.plan_day_id || ''}" data-date="\${day.date}">
                                    <i class="fas fa-comment-dots"></i> なぜこの献立？
                                </button>
                                <button class="suggest-change-btn flex-1 px-3 py-2 bg-orange-50 text-orange-600 rounded-lg hover:bg-orange-100 text-xs font-medium transition-colors" data-plan-day-id="\${day.plan_day_id || ''}" data-date="\${day.date}">
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
                        const adLink = document.createElement('a');
                        adLink.href = ad.link_url;
                        adLink.target = '_blank';
                        adLink.onclick = () => trackAdClick(ad.ad_id);
                        
                        const adImg = document.createElement('img');
                        adImg.src = ad.image_url;
                        adImg.alt = ad.title;
                        adImg.style.maxWidth = ad.width + 'px';
                        adImg.style.maxHeight = ad.height + 'px';
                        
                        adLink.appendChild(adImg);
                        container.appendChild(adLink);
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
            
            // ボタンを無効化
            const button = event?.target?.closest('button');
            if (button) {
                button.disabled = true;
                button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 考え中...';
            }
            
            // モーダルを表示
            const modal = document.getElementById('ai-modal');
            const title = document.getElementById('ai-modal-title');
            const content = document.getElementById('ai-modal-content');
            
            title.textContent = \`\${date}の献立について\`;
            content.innerHTML = \`
                <div class="flex flex-col items-center justify-center py-12">
                    <!-- AIアニメーション -->
                    <div class="relative w-24 h-24 mb-6">
                        <div class="absolute inset-0 flex items-center justify-center">
                            <i class="fas fa-brain text-5xl text-blue-500 animate-pulse"></i>
                        </div>
                        <div class="absolute inset-0 border-4 border-transparent border-t-blue-500 rounded-full animate-spin" style="animation-duration: 2s;"></div>
                        <div class="absolute inset-2 border-4 border-transparent border-b-purple-500 rounded-full animate-spin" style="animation-duration: 1.5s; animation-direction: reverse;"></div>
                    </div>
                    
                    <h3 class="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                        AIが分析中
                    </h3>
                    <p class="text-gray-600 mb-4">献立の理由を考えています...</p>
                    
                    <!-- ドットアニメーション -->
                    <div class="flex gap-2">
                        <div class="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style="animation-delay: 0s;"></div>
                        <div class="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style="animation-delay: 0.1s;"></div>
                        <div class="w-3 h-3 bg-pink-500 rounded-full animate-bounce" style="animation-delay: 0.2s;"></div>
                    </div>
                </div>
            \`;
            modal.classList.remove('hidden');
            modal.classList.add('flex');
            
            try {
                const res = await axios.post('/api/ai/explain-menu', {
                    plan_day_id: planDayId,
                    household_id: appState.householdId
                });
                
                content.innerHTML = \`
                    <div class="prose max-w-none">
                        <div class="bg-gradient-to-r from-blue-50 to-purple-50 border-l-4 border-blue-500 p-6 rounded-lg shadow-sm">
                            <div class="flex items-start gap-3 mb-3">
                                <i class="fas fa-lightbulb text-2xl text-yellow-500"></i>
                                <h4 class="text-lg font-bold text-gray-800">AIからの説明</h4>
                            </div>
                            <p class="text-gray-800 leading-relaxed">\${res.data.explanation}</p>
                        </div>
                    </div>
                \`;
            } catch (error) {
                content.innerHTML = \`
                    <div class="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
                        <div class="flex items-center gap-2 mb-2">
                            <i class="fas fa-exclamation-triangle text-red-500"></i>
                            <h4 class="font-bold text-red-800">エラーが発生しました</h4>
                        </div>
                        <p class="text-red-700">もう一度お試しください。</p>
                    </div>
                \`;
            } finally {
                // ボタンを元に戻す
                if (button) {
                    button.disabled = false;
                    button.innerHTML = '<i class="fas fa-lightbulb"></i> なぜこの献立？';
                }
            }
        }
        
        async function suggestChange(planDayId, date) {
            if (!planDayId) {
                alert('献立情報が見つかりません');
                return;
            }
            
            const userRequest = prompt(\`\${date}の献立をどのように変更しますか？\\n\\n例：\\n・魚が多いので肉料理に変えて\\n・もっと時短にして（15分以内）\\n・野菜を多めにして\`);
            
            if (!userRequest) return;
            
            // ボタンを無効化
            const button = event?.target?.closest('button');
            if (button) {
                button.disabled = true;
                button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 提案中...';
            }
            
            // モーダルを表示
            const modal = document.getElementById('ai-modal');
            const title = document.getElementById('ai-modal-title');
            const content = document.getElementById('ai-modal-content');
            
            title.textContent = '献立変更の提案';
            content.innerHTML = \`
                <div class="flex flex-col items-center justify-center py-12">
                    <!-- 変更アニメーション -->
                    <div class="relative w-24 h-24 mb-6">
                        <div class="absolute inset-0 flex items-center justify-center">
                            <i class="fas fa-exchange-alt text-5xl text-orange-500 animate-pulse"></i>
                        </div>
                        <div class="absolute inset-0 border-4 border-transparent border-t-orange-500 rounded-full animate-spin" style="animation-duration: 2s;"></div>
                        <div class="absolute inset-2 border-4 border-transparent border-b-yellow-500 rounded-full animate-spin" style="animation-duration: 1.5s; animation-direction: reverse;"></div>
                    </div>
                    
                    <h3 class="text-xl font-bold bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent mb-2">
                        代替案を考え中
                    </h3>
                    <p class="text-gray-600 mb-2">あなたの要望に合うレシピを探しています...</p>
                    <p class="text-sm text-gray-500">「\${userRequest}」</p>
                    
                    <!-- プログレス -->
                    <div class="w-full max-w-md mt-6 space-y-2">
                        <div class="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
                            <i class="fas fa-spinner fa-spin text-orange-500"></i>
                            <span class="text-sm text-gray-700">要望を分析中...</span>
                        </div>
                        <div class="flex items-center gap-3 p-3 bg-gray-50 rounded-lg opacity-50">
                            <i class="fas fa-search text-yellow-500"></i>
                            <span class="text-sm text-gray-700">最適なレシピを検索中...</span>
                        </div>
                    </div>
                </div>
            \`;
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
                                \${res.data.alternatives.map((alt, index) => '<button class="replace-recipe-btn w-full text-left px-4 py-3 bg-white border-2 border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-all" data-plan-day-id="' + planDayId + '" data-role="' + alt.role + '" data-recipe-id="' + alt.recipe_id + '" data-title="' + alt.title + '">' +
                                    '<div class="flex items-center justify-between">' +
                                        '<div>' +
                                            '<span class="font-medium text-gray-800">' + (index + 1) + '. ' + alt.title + '</span>' +
                                            '<span class="text-xs text-gray-500 ml-2">約' + alt.time_min + '分</span>' +
                                        '</div>' +
                                        '<i class="fas fa-arrow-right text-green-600"></i>' +
                                    '</div>' +
                                '</button>').join('')}
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
                        <div class="flex items-center gap-2 mb-2">
                            <i class="fas fa-exclamation-triangle text-red-500"></i>
                            <h4 class="font-bold text-red-800">エラーが発生しました</h4>
                        </div>
                        <p class="text-red-700">もう一度お試しください。</p>
                    </div>
                \`;
            } finally {
                // ボタンを元に戻す
                if (button) {
                    button.disabled = false;
                    button.innerHTML = '<i class="fas fa-exchange-alt"></i> 変更する';
                }
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
                                <button class="explain-menu-btn calendar-btn" data-plan-day-id="\${day.plan_day_id}" data-date="\${day.date}">
                                    <i class="fas fa-comment-dots"></i>
                                </button>
                                <button class="suggest-change-btn calendar-btn" data-plan-day-id="\${day.plan_day_id}" data-date="\${day.date}">
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
                                \${main ? '<div class="recipe-item flex items-start"><span class="recipe-badge badge-main mt-1"></span><span class="flex-1"><span class="font-semibold text-red-600">主菜:</span> <a href="javascript:void(0)" class="recipe-link text-blue-600 hover:underline cursor-pointer" data-recipe-id="' + main.recipe_id + '" data-recipe-title="' + main.title + '">' + main.title + '</a></span></div>' : ''}
                                \${side ? '<div class="recipe-item flex items-start"><span class="recipe-badge badge-side mt-1"></span><span class="flex-1"><span class="font-semibold text-green-600">副菜:</span> <a href="javascript:void(0)" class="recipe-link text-blue-600 hover:underline cursor-pointer" data-recipe-id="' + side.recipe_id + '" data-recipe-title="' + side.title + '">' + side.title + '</a></span></div>' : ''}
                                \${soup ? '<div class="recipe-item flex items-start"><span class="recipe-badge badge-soup mt-1"></span><span class="flex-1"><span class="font-semibold text-blue-600">汁物:</span> <a href="javascript:void(0)" class="recipe-link text-blue-600 hover:underline cursor-pointer" data-recipe-id="' + soup.recipe_id + '" data-recipe-title="' + soup.title + '">' + soup.title + '</a></span></div>' : ''}
                            </div>
                            <div class="mt-3 text-xs text-gray-500 border-t pt-2">
                                <i class="far fa-clock"></i> 約\${day.estimated_time_min}分
                            </div>
                            <div class="mt-3 flex gap-2 no-print">
                                <button class="explain-menu-btn flex-1 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 text-xs font-medium transition-colors" data-plan-day-id="\${day.plan_day_id || ''}" data-date="\${day.date}">
                                    <i class="fas fa-comment-dots"></i> なぜこの献立？
                                </button>
                                <button class="suggest-change-btn flex-1 px-3 py-2 bg-orange-50 text-orange-600 rounded-lg hover:bg-orange-100 text-xs font-medium transition-colors" data-plan-day-id="\${day.plan_day_id || ''}" data-date="\${day.date}">
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
            
            // ボタンを無効化してローディング表示
            const button = event?.target;
            if (button) {
                button.disabled = true;
                button.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>生成中...';
            }
            
            // モーダルを先に開いてローディング表示
            const modal = document.getElementById('shopping-modal');
            const content = document.getElementById('shopping-modal-content');
            
            modal.classList.remove('hidden');
            modal.classList.add('flex');
            
            content.innerHTML = \`
                <div class="flex flex-col items-center justify-center py-16">
                    <!-- メインアニメーション -->
                    <div class="relative w-32 h-32 mb-6">
                        <!-- 回転するカート -->
                        <div class="absolute inset-0 flex items-center justify-center">
                            <i class="fas fa-shopping-cart text-6xl text-blue-500 animate-bounce"></i>
                        </div>
                        <!-- 回転リング -->
                        <div class="absolute inset-0 border-8 border-transparent border-t-blue-500 rounded-full animate-spin" style="animation-duration: 1s;"></div>
                        <div class="absolute inset-2 border-8 border-transparent border-b-green-500 rounded-full animate-spin" style="animation-duration: 1.5s; animation-direction: reverse;"></div>
                    </div>
                    
                    <h3 class="text-2xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent mb-3">
                        買い物リストを作成中
                    </h3>
                    <p class="text-gray-600 mb-4 text-center">
                        献立から食材を集計しています
                    </p>
                    
                    <!-- プログレス表示 -->
                    <div class="w-full max-w-md space-y-3">
                        <div class="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                            <i class="fas fa-spinner fa-spin text-blue-500"></i>
                            <span class="text-sm text-gray-700">レシピから食材を抽出中...</span>
                        </div>
                        <div class="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200 opacity-50">
                            <i class="fas fa-calculator text-green-500"></i>
                            <span class="text-sm text-gray-700">数量を集計中...</span>
                        </div>
                        <div class="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200 opacity-50">
                            <i class="fas fa-layer-group text-purple-500"></i>
                            <span class="text-sm text-gray-700">カテゴリ別に整理中...</span>
                        </div>
                    </div>
                    
                    <div class="mt-6 text-xs text-gray-500">
                        <i class="fas fa-clock mr-1"></i>
                        通常 2〜3秒で完了します
                    </div>
                </div>
            \`;
            
            try {
                const res = await axios.get(\`/api/shopping-list/\${appState.planId}\`);
                const data = res.data;
                
                // モーダルを表示
                showShoppingListModal(data);
            } catch (error) {
                console.error('買い物リスト生成エラー:', error);
                content.innerHTML = \`
                    <div class="flex flex-col items-center justify-center py-16">
                        <div class="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-4">
                            <i class="fas fa-exclamation-triangle text-4xl text-red-500"></i>
                        </div>
                        <h3 class="text-xl font-bold text-gray-800 mb-2">エラーが発生しました</h3>
                        <p class="text-gray-600 mb-4">買い物リストの生成に失敗しました</p>
                        <button onclick="closeShoppingModal()" 
                                class="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition">
                            閉じる
                        </button>
                    </div>
                \`;
            } finally {
                // ボタンを元に戻す
                if (button) {
                    button.disabled = false;
                    button.innerHTML = '<i class="fas fa-shopping-cart"></i> 買い物リスト';
                }
            }
        }
        
        function showShoppingListModal(data) {
            const modal = document.getElementById('shopping-modal');
            const content = document.getElementById('shopping-modal-content');
            
            // 期間情報
            const periodInfo = data.startDate && data.endDate
                ? \`\${data.startDate} 〜 \${data.endDate}\`
                : '期間不明';
            
            let html = \`
                <div class="mb-6 p-6 bg-gradient-to-r from-blue-50 to-green-50 rounded-xl border-2 border-blue-200">
                    <div class="flex items-center justify-between mb-3">
                        <h4 class="font-bold text-2xl text-gray-800 flex items-center gap-2">
                            <i class="fas fa-shopping-cart text-blue-600"></i>
                            買い物リスト
                        </h4>
                    </div>
                    <div class="flex items-center gap-4 text-sm flex-wrap">
                        <div class="flex items-center gap-2 bg-white px-3 py-2 rounded-lg shadow-sm">
                            <i class="fas fa-users text-orange-600"></i>
                            <span class="font-semibold text-gray-700">人数:</span>
                            <span class="text-gray-900">\${data.membersCount || 2} 人分</span>
                        </div>
                        <div class="flex items-center gap-2 bg-white px-3 py-2 rounded-lg shadow-sm">
                            <i class="fas fa-calendar-alt text-blue-600"></i>
                            <span class="font-semibold text-gray-700">期間:</span>
                            <span class="text-gray-900">\${periodInfo}</span>
                        </div>
                        <div class="flex items-center gap-2 bg-white px-3 py-2 rounded-lg shadow-sm">
                            <i class="fas fa-hourglass-half text-purple-600"></i>
                            <span class="font-semibold text-gray-700">日数:</span>
                            <span class="text-gray-900">\${data.totalDays || 0} 日分</span>
                        </div>
                        <div class="flex items-center gap-2 bg-white px-3 py-2 rounded-lg shadow-sm">
                            <i class="fas fa-list text-green-600"></i>
                            <span class="font-semibold text-gray-700">合計:</span>
                            <span class="text-gray-900">\${data.totalItems} 品目</span>
                        </div>
                    </div>
                    <p class="text-xs text-gray-600 mt-2">
                        <i class="fas fa-info-circle"></i> この期間の全献立に必要な食材（\${data.membersCount || 2}人分）をまとめています
                    </p>
                </div>
                
                <!-- タブ切り替え -->
                <div class="mb-4">
                    <div class="flex border-b border-gray-300 overflow-x-auto">
                        <button onclick="switchShoppingTab('all')" 
                                id="tab-all"
                                class="shopping-tab px-4 py-2 font-semibold border-b-2 border-blue-500 text-blue-600">
                            月全体
                        </button>
                        \${(data.weeklyLists || []).map((week, index) => \`
                            <button class="shopping-tab-btn shopping-tab px-4 py-2 font-semibold border-b-2 border-transparent text-gray-600 hover:text-gray-800" 
                                    id="tab-week-\${index}"
                                    data-week-id="week-\${index}">
                                第\${week.weekNumber}週 (\${week.totalItems}品)
                            </button>
                        \`).join('')}
                    </div>
                </div>
                
                <!-- 月全体の買い物リスト -->
                <div id="content-all" class="shopping-content">
                    <div class="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded mb-4">
                        <p class="text-sm text-gray-700">
                            <i class="fas fa-lightbulb text-yellow-600"></i>
                            <strong>月まとめ買い推奨:</strong> 調味料や保存のきく食材は月初めに一括購入がお得です
                        </p>
                    </div>
                    \${renderShoppingList(data.shoppingList)}
                </div>
                
                <!-- 週ごとの買い物リスト -->
                \${(data.weeklyLists || []).map((week, index) => \`
                    <div id="content-week-\${index}" class="shopping-content week-shopping-list hidden">
                        <div class="bg-blue-50 border-l-4 border-blue-500 p-4 rounded mb-4">
                            <div class="flex items-center justify-between mb-2">
                                <h5 class="font-bold text-lg text-gray-800">
                                    <i class="fas fa-calendar-week text-blue-600"></i>
                                    第\${week.weekNumber}週の買い物
                                </h5>
                                <span class="text-sm text-gray-600">\${week.totalItems} 品目</span>
                            </div>
                            <p class="text-sm text-gray-700">
                                <i class="fas fa-calendar-alt text-blue-600"></i>
                                期間: <strong>\${week.startDate} 〜 \${week.endDate}</strong>
                            </p>
                        </div>
                        \${renderShoppingList(week.shoppingList)}
                    </div>
                \`).join('')}
            \`;
            
            html += \`
                <div class="mt-6 flex gap-2 justify-end print:hidden">
                    <button onclick="printShoppingList()" class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">
                        <i class="fas fa-print"></i> 印刷
                    </button>
                    <button onclick="closeShoppingModal()" class="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition">
                        <i class="fas fa-times"></i> 閉じる
                    </button>
                </div>
            \`;
            
            content.innerHTML = html;
            modal.classList.remove('hidden');
            modal.classList.add('flex');
        }
        
        function renderShoppingList(shoppingList) {
            const categories = Object.keys(shoppingList).sort();
            
            return categories.map(category => {
                const items = shoppingList[category];
                
                return \`
                    <div class="mb-6">
                        <h5 class="font-bold text-md mb-3 pb-2 border-b-2 border-gray-300 flex items-center gap-2">
                            <span class="text-2xl">\${getCategoryIcon(category)}</span>
                            <span>\${category}</span>
                            <span class="text-sm text-gray-500 font-normal">（\${items.length}品）</span>
                        </h5>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
                            \${items.map(item => \`
                                <div class="flex items-center p-3 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition">
                                    <input type="checkbox" class="mr-3 w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500">
                                    <span class="flex-1 font-medium text-gray-800">\${item.name}</span>
                                    <span class="text-sm font-semibold text-blue-600 ml-2 bg-blue-50 px-2 py-1 rounded">
                                        \${item.quantity}\${item.unit}
                                    </span>
                                </div>
                            \`).join('')}
                        </div>
                    </div>
                \`;
            }).join('');
        }
        
        function switchShoppingTab(tabId) {
            // すべてのタブとコンテンツを非表示
            document.querySelectorAll('.shopping-tab').forEach(tab => {
                tab.classList.remove('border-blue-500', 'text-blue-600');
                tab.classList.add('border-transparent', 'text-gray-600');
            });
            document.querySelectorAll('.shopping-content').forEach(content => {
                content.classList.add('hidden');
            });
            
            // 選択されたタブとコンテンツを表示
            const selectedTab = document.getElementById(\`tab-\${tabId}\`);
            const selectedContent = document.getElementById(\`content-\${tabId}\`);
            
            if (selectedTab) {
                selectedTab.classList.add('border-blue-500', 'text-blue-600');
                selectedTab.classList.remove('border-transparent', 'text-gray-600');
            }
            if (selectedContent) {
                selectedContent.classList.remove('hidden');
            }
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
                
                // JSON文字列をパース
                recipe.steps = recipe.steps_json ? JSON.parse(recipe.steps_json) : [];
                recipe.tags = recipe.tags_json ? JSON.parse(recipe.tags_json) : [];
                recipe.substitutes = recipe.substitutes_json ? JSON.parse(recipe.substitutes_json) : [];
                
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
                        
                        <!-- 外部レシピリンク -->
                        <div>
                            <h4 class="text-lg font-bold mb-3 flex items-center gap-2">
                                <i class="fas fa-external-link-alt text-indigo-600"></i>
                                もっと詳しいレシピを探す
                            </h4>
                            <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
                                <a href="https://cookpad.com/search/\${encodeURIComponent(recipe.title)}" 
                                   target="_blank" rel="noopener noreferrer"
                                   class="flex items-center gap-3 p-4 bg-gradient-to-r from-orange-400 to-orange-500 text-white rounded-lg hover:from-orange-500 hover:to-orange-600 transition shadow-md">
                                    <i class="fas fa-book text-2xl"></i>
                                    <div>
                                        <div class="font-bold">クックパッド</div>
                                        <div class="text-xs opacity-90">300万品以上のレシピ</div>
                                    </div>
                                </a>
                                <a href="https://www.kurashiru.com/search?query=\${encodeURIComponent(recipe.title)}" 
                                   target="_blank" rel="noopener noreferrer"
                                   class="flex items-center gap-3 p-4 bg-gradient-to-r from-red-400 to-red-500 text-white rounded-lg hover:from-red-500 hover:to-red-600 transition shadow-md">
                                    <i class="fas fa-video text-2xl"></i>
                                    <div>
                                        <div class="font-bold">クラシル</div>
                                        <div class="text-xs opacity-90">動画でわかりやすい</div>
                                    </div>
                                </a>
                                <a href="https://delishkitchen.tv/search?q=\${encodeURIComponent(recipe.title)}" 
                                   target="_blank" rel="noopener noreferrer"
                                   class="flex items-center gap-3 p-4 bg-gradient-to-r from-pink-400 to-pink-500 text-white rounded-lg hover:from-pink-500 hover:to-pink-600 transition shadow-md">
                                    <i class="fas fa-heart text-2xl"></i>
                                    <div>
                                        <div class="font-bold">デリッシュキッチン</div>
                                        <div class="text-xs opacity-90">簡単で美味しい</div>
                                    </div>
                                </a>
                            </div>
                            <p class="text-xs text-gray-500 mt-2 text-center">
                                <i class="fas fa-info-circle"></i> 
                                各サイトで「\${recipe.title}」の詳しいレシピや作り方動画をご覧いただけます
                            </p>
                        </div>
                        
                        <!-- アクションボタン -->
                        <div class="flex gap-2 pt-4 border-t">
                            <button class="add-favorite-btn flex-1 px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition" 
                                    data-recipe-id="\${recipe.recipe_id}" 
                                    data-recipe-title="\${recipe.title}">
                                <i class="fas fa-heart"></i> お気に入りに追加
                            </button>
                            <button class="share-recipe-btn flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                                    data-recipe-id="\${recipe.recipe_id}" 
                                    data-recipe-title="\${recipe.title}">
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
                                    <button class="load-history-btn px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                                            data-plan-id="\${item.plan_id}">
                                        <i class="fas fa-eye"></i> 表示
                                    </button>
                                    <button class="archive-history-btn px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 text-sm"
                                            data-history-id="\${item.history_id}">
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
        
        function handleDragLeave(event) {
            const dropTarget = event.currentTarget;
            dropTarget.style.border = '';
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
                
                // ローディング表示
                const loadingToast = document.createElement('div');
                loadingToast.id = 'drag-loading-toast';
                loadingToast.className = 'fixed top-4 right-4 bg-blue-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center gap-2';
                const spinnerDiv = document.createElement('div');
                spinnerDiv.className = 'animate-spin rounded-full h-5 w-5 border-b-2 border-white';
                const spanText = document.createElement('span');
                spanText.textContent = '献立を入れ替え中...';
                loadingToast.appendChild(spinnerDiv);
                loadingToast.appendChild(spanText);
                document.body.appendChild(loadingToast);
                
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
                        
                        // ローディングを削除
                        loadingToast.remove();
                        
                        // 成功メッセージ
                        const toast = document.createElement('div');
                        toast.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-bounce';
                        toast.innerHTML = '<i class="fas fa-check-circle mr-2"></i>✓ 献立を入れ替えました';
                        document.body.appendChild(toast);
                        setTimeout(() => toast.remove(), 2000);
                    }
                } catch (error) {
                    console.error('献立の入れ替えエラー:', error);
                    // ローディングを削除
                    if (document.getElementById('drag-loading-toast')) {
                        document.getElementById('drag-loading-toast').remove();
                    }
                    // エラーメッセージ
                    const errorToast = document.createElement('div');
                    errorToast.className = 'fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
                    errorToast.innerHTML = '<i class="fas fa-exclamation-triangle mr-2"></i>献立の入れ替えに失敗しました';
                    document.body.appendChild(errorToast);
                    setTimeout(() => errorToast.remove(), 3000);
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
                                <a href="javascript:void(0)" class="recipe-link text-blue-600 hover:underline font-medium"
                                   data-recipe-id="\${fav.recipe_id}" 
                                   data-recipe-title="\${fav.title}">
                                    \${fav.title}
                                </a>
                                <p class="text-xs text-gray-500 mt-1">追加日: \${new Date(fav.added_at).toLocaleDateString('ja-JP')}</p>
                            </div>
                            <button class="remove-favorite-btn ml-3 px-3 py-1 text-red-600 hover:bg-red-50 rounded" data-index="\${index}">
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
                    
                    <button class="copy-clipboard-btn w-full flex items-center gap-3 p-4 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
                            data-url="\${decodeURIComponent(url)}">
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
        
        // ========================================
        // 会員登録・ログイン機能
        // ========================================
        
        // 現在のユーザーをローカルストレージから取得
        function getCurrentUser() {
            const userJson = localStorage.getItem('aichef_user');
            return userJson ? JSON.parse(userJson) : null;
        }
        
        // ユーザーをローカルストレージに保存
        function saveUser(user) {
            localStorage.setItem('aichef_user', JSON.stringify(user));
        }
        
        // ログアウト
        function logout() {
            localStorage.removeItem('aichef_user');
            alert('ログアウトしました');
            location.reload();
        }
        
        // 会員登録モーダルを開く
        function showAuthModal(action = 'register') {
            const modal = document.getElementById('auth-modal');
            const title = document.getElementById('auth-modal-title');
            const form = document.getElementById('auth-form');
            const nameField = document.getElementById('auth-name');
            const submitBtn = form.querySelector('button[type="submit"]');
            const switchLink = document.getElementById('auth-switch-link');
            
            if (action === 'login') {
                title.textContent = 'ログイン';
                nameField.parentElement.classList.add('hidden');
                submitBtn.innerHTML = '<i class="fas fa-sign-in-alt mr-2"></i>ログインして続ける';
                switchLink.innerHTML = 'アカウントをお持ちでない方は<button onclick="switchToRegister()" class="text-blue-600 hover:underline font-medium">会員登録</button>';
            } else {
                title.textContent = '会員登録';
                nameField.parentElement.classList.remove('hidden');
                submitBtn.innerHTML = '<i class="fas fa-user-plus mr-2"></i>会員登録して続ける';
                switchLink.innerHTML = 'すでにアカウントをお持ちの方は<button onclick="switchToLogin()" class="text-blue-600 hover:underline font-medium">ログイン</button>';
            }
            
            modal.classList.remove('hidden');
            modal.classList.add('flex');
        }
        
        // 会員登録モーダルを閉じる
        function closeAuthModal() {
            const modal = document.getElementById('auth-modal');
            modal.classList.add('hidden');
            modal.classList.remove('flex');
            
            // フォームをリセット
            document.getElementById('auth-form').reset();
            document.getElementById('auth-error').classList.add('hidden');
        }
        
        // ログインに切り替え
        function switchToLogin() {
            showAuthModal('login');
        }
        
        // 会員登録に切り替え
        function switchToRegister() {
            showAuthModal('register');
        }
        
        // 会員登録フォーム送信
        document.getElementById('auth-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const name = document.getElementById('auth-name').value;
            const email = document.getElementById('auth-email').value;
            const password = document.getElementById('auth-password').value;
            const errorDiv = document.getElementById('auth-error');
            const errorText = errorDiv.querySelector('p');
            const title = document.getElementById('auth-modal-title').textContent;
            const isLogin = title === 'ログイン';
            
            // バリデーション
            if (!isLogin && password.length < 8) {
                errorDiv.classList.remove('hidden');
                errorText.textContent = 'パスワードは8文字以上で設定してください';
                return;
            }
            
            try {
                // 簡易的な実装：ローカルストレージに保存
                // 本番環境では必ずサーバーサイドで認証を実装してください
                const user = {
                    name: name || email.split('@')[0],
                    email: email,
                    registered_at: new Date().toISOString()
                };
                
                saveUser(user);
                closeAuthModal();
                
                alert(isLogin ? 'ログインしました！' : '会員登録が完了しました！');
                
                // 印刷を実行（元の処理を続行）
                window.print();
                
            } catch (error) {
                console.error('認証エラー:', error);
                errorDiv.classList.remove('hidden');
                errorText.textContent = 'エラーが発生しました。もう一度お試しください。';
            }
        });
        
        // 印刷ボタンのハンドラー
        function handlePrint() {
            const user = getCurrentUser();
            if (!user) {
                showAuthModal('register');
            } else {
                window.print();
            }
        }
        
        // カレンダーダウンロードのハンドラー
        function handleDownloadCalendar() {
            const user = getCurrentUser();
            if (!user) {
                showAuthModal('register');
            } else {
                downloadCalendar();
            }
        }
        
        // カレンダーダウンロード機能
        function downloadCalendar() {
            if (!calendarData || calendarData.length === 0) {
                alert('献立データがありません');
                return;
            }
            
            // iCalendar形式で出力
            let icsContent = 'BEGIN:VCALENDAR\\nVERSION:2.0\\nPRODID:-//AIシェフ//献立カレンダー//JP\\nCALSCALE:GREGORIAN\\nMETHOD:PUBLISH\\n';
            
            calendarData.forEach(day => {
                const date = day.date.replace(/-/g, '');
                const dtstart = date + 'T180000'; // 18:00
                const dtend = date + 'T190000';   // 19:00
                
                const mainTitle = (day.main && day.main.title) || '未定';
                const sideTitle = (day.side && day.side.title) || '未定';
                const soupTitle = (day.soup && day.soup.title) || '未定';
                const summary = mainTitle + ' / ' + sideTitle + ' / ' + soupTitle;
                
                icsContent += 'BEGIN:VEVENT\\n';
                icsContent += 'DTSTART:' + dtstart + '\\n';
                icsContent += 'DTEND:' + dtend + '\\n';
                icsContent += 'SUMMARY:' + summary + '\\n';
                icsContent += 'DESCRIPTION:主菜: ' + mainTitle + '\\\\n副菜: ' + sideTitle + '\\\\n汁物: ' + soupTitle + '\\n';
                icsContent += 'END:VEVENT\\n';
            });
            
            icsContent += 'END:VCALENDAR';
            
            // ダウンロード
            const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            const today = new Date().toISOString().split('T')[0];
            a.href = url;
            a.download = 'aichef_menu_' + today + '.ics';
            a.click();
            URL.revokeObjectURL(url);
            
            alert('カレンダーファイルをダウンロードしました！\\n\\nGoogleカレンダーやAppleカレンダーにインポートしてご利用ください。');
        }
        
        window.printShoppingList = printShoppingList;
        window.trackAdClick = trackAdClick;
        window.loadHistory = loadHistory;
        window.archiveHistory = archiveHistory;
        
        // 会員登録・ログイン関連
        window.showAuthModal = showAuthModal;
        window.closeAuthModal = closeAuthModal;
        window.switchToLogin = switchToLogin;
        window.switchToRegister = switchToRegister;
        window.handlePrint = handlePrint;
        window.handleDownloadCalendar = handleDownloadCalendar;
        window.logout = logout;
        
        // ドラッグ&ドロップ用のグローバル変数
        window.handleDragStart = handleDragStart;
        window.handleDragOver = handleDragOver;
        window.handleDragLeave = handleDragLeave;
        window.handleDrop = handleDrop;
        window.handleDragEnd = handleDragEnd;
        
        // 買い物リスト用のグローバル関数
        window.switchShoppingTab = switchShoppingTab;
        window.renderShoppingList = renderShoppingList;

        window.addEventListener('DOMContentLoaded', () => {
            const question = questions[0];
            addMessage(question.text);
            showInput(question);
            
            // TOPページの広告を読み込み
            loadAds('top_page');
            
            // イベントデリゲーション設定
            document.addEventListener('click', (e) => {
                const target = e.target;
                const recipeLink = target.closest('.recipe-link');
                if (recipeLink) {
                    e.preventDefault();
                    const recipeId = recipeLink.getAttribute('data-recipe-id');
                    const recipeTitle = recipeLink.getAttribute('data-recipe-title');
                    if (recipeId && recipeTitle) {
                        showRecipeDetail(recipeId, recipeTitle);
                    }
                }
                
                // 履歴ボタンのイベントデリゲーション
                const historyViewBtn = target.closest('.history-view-btn');
                if (historyViewBtn) {
                    e.preventDefault();
                    const historyId = historyViewBtn.getAttribute('data-history-id');
                    if (historyId) {
                        viewHistory(historyId);
                    }
                }
                
                const historyDeleteBtn = target.closest('.history-delete-btn');
                if (historyDeleteBtn) {
                    e.preventDefault();
                    const historyId = historyDeleteBtn.getAttribute('data-history-id');
                    if (historyId) {
                        deleteHistory(historyId);
                    }
                }
                
                // 献立説明ボタン
                const explainBtn = target.closest('.explain-menu-btn');
                if (explainBtn) {
                    e.preventDefault();
                    const planDayId = explainBtn.getAttribute('data-plan-day-id');
                    const date = explainBtn.getAttribute('data-date');
                    if (date) {
                        explainMenu(planDayId || '', date);
                    }
                }
                
                // 献立変更ボタン
                const suggestBtn = target.closest('.suggest-change-btn');
                if (suggestBtn) {
                    e.preventDefault();
                    const planDayId = suggestBtn.getAttribute('data-plan-day-id');
                    const date = suggestBtn.getAttribute('data-date');
                    if (date) {
                        suggestChange(planDayId || '', date);
                    }
                }
                
                // レシピ差し替えボタン
                const replaceBtn = target.closest('.replace-recipe-btn');
                if (replaceBtn) {
                    e.preventDefault();
                    const planDayId = replaceBtn.getAttribute('data-plan-day-id');
                    const role = replaceBtn.getAttribute('data-role');
                    const recipeId = replaceBtn.getAttribute('data-recipe-id');
                    const title = replaceBtn.getAttribute('data-title');
                    if (planDayId && role && recipeId && title) {
                        replaceRecipe(planDayId, role, recipeId, title);
                    }
                }
                
                // 買い物リストタブ切り替え
                const shoppingTabBtn = target.closest('.shopping-tab-btn');
                if (shoppingTabBtn) {
                    e.preventDefault();
                    const weekId = shoppingTabBtn.getAttribute('data-week-id');
                    if (weekId) {
                        switchShoppingTab(weekId);
                    }
                }
                
                // お気に入り追加ボタン
                const addFavoriteBtn = target.closest('.add-favorite-btn');
                if (addFavoriteBtn) {
                    e.preventDefault();
                    const recipeId = addFavoriteBtn.getAttribute('data-recipe-id');
                    const recipeTitle = addFavoriteBtn.getAttribute('data-recipe-title');
                    if (recipeId && recipeTitle) {
                        addToFavorites(recipeId, recipeTitle);
                    }
                }
                
                // レシピ共有ボタン
                const shareRecipeBtn = target.closest('.share-recipe-btn');
                if (shareRecipeBtn) {
                    e.preventDefault();
                    const recipeId = shareRecipeBtn.getAttribute('data-recipe-id');
                    const recipeTitle = shareRecipeBtn.getAttribute('data-recipe-title');
                    if (recipeId && recipeTitle) {
                        shareRecipe(recipeId, recipeTitle);
                    }
                }
                
                // 履歴読み込みボタン
                const loadHistoryBtn = target.closest('.load-history-btn');
                if (loadHistoryBtn) {
                    e.preventDefault();
                    const planId = loadHistoryBtn.getAttribute('data-plan-id');
                    if (planId) {
                        loadHistory(planId);
                    }
                }
                
                // 履歴アーカイブボタン
                const archiveHistoryBtn = target.closest('.archive-history-btn');
                if (archiveHistoryBtn) {
                    e.preventDefault();
                    const historyId = archiveHistoryBtn.getAttribute('data-history-id');
                    if (historyId) {
                        archiveHistory(historyId);
                    }
                }
                
                // お気に入り削除ボタン
                const removeFavoriteBtn = target.closest('.remove-favorite-btn');
                if (removeFavoriteBtn) {
                    e.preventDefault();
                    const index = parseInt(removeFavoriteBtn.getAttribute('data-index') || '0');
                    removeFromFavorites(index);
                }
                
                // クリップボードコピーボタン
                const copyClipboardBtn = target.closest('.copy-clipboard-btn');
                if (copyClipboardBtn) {
                    e.preventDefault();
                    const url = copyClipboardBtn.getAttribute('data-url');
                    if (url) {
                        copyToClipboard(url);
                    }
                }
            });
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
    <!-- 献立生成モーダル -->
    <div id="plan-generation-modal" class="hidden fixed inset-0 bg-black bg-opacity-50 items-center justify-center z-50 p-4" style="backdrop-filter: blur(4px);">
        <div class="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div class="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 px-6 py-4 flex justify-between items-center">
                <h3 class="text-xl font-bold text-white">
                    <i class="fas fa-utensils mr-2"></i>
                    献立作成中
                </h3>
            </div>
            <div id="plan-generation-modal-content" class="p-6 overflow-y-auto" style="max-height: calc(90vh - 80px);">
                <!-- コンテンツはJavaScriptで動的に挿入 -->
            </div>
        </div>
    </div>
    
    <!-- 会員登録・ログインモーダル -->
    <div id="auth-modal" class="hidden fixed inset-0 bg-black bg-opacity-50 items-center justify-center z-50 p-4" style="backdrop-filter: blur(4px);">
        <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full">
            <div class="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-4 flex justify-between items-center">
                <h3 class="text-xl font-bold text-white">
                    <i class="fas fa-user-circle mr-2"></i>
                    <span id="auth-modal-title">会員登録</span>
                </h3>
                <button onclick="closeAuthModal()" class="text-white hover:text-gray-200 transition-colors">
                    <i class="fas fa-times text-2xl"></i>
                </button>
            </div>
            <div id="auth-modal-content" class="p-6">
                <p class="text-gray-600 mb-4">
                    <i class="fas fa-info-circle text-blue-500 mr-2"></i>
                    印刷・ダウンロード機能をご利用いただくには会員登録が必要です。
                </p>
                
                <form id="auth-form" class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">お名前</label>
                        <input type="text" id="auth-name" required
                               class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                               placeholder="山田太郎">
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">メールアドレス</label>
                        <input type="email" id="auth-email" required
                               class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                               placeholder="example@gmail.com">
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">パスワード</label>
                        <input type="password" id="auth-password" required
                               class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                               placeholder="8文字以上">
                        <p class="text-xs text-gray-500 mt-1">8文字以上で設定してください</p>
                    </div>
                    
                    <button type="submit" class="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition font-semibold">
                        <i class="fas fa-user-plus mr-2"></i>
                        会員登録して続ける
                    </button>
                </form>
                
                <div id="auth-error" class="hidden mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p class="text-sm text-red-600"></p>
                </div>
                
                <div class="mt-4 text-center">
                    <p id="auth-switch-link" class="text-sm text-gray-600">
                        すでにアカウントをお持ちの方は
                        <button onclick="switchToLogin()" class="text-blue-600 hover:underline font-medium">ログイン</button>
                    </p>
                </div>
            </div>
        </div>
    </div>
    
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

// ログイン画面HTML
const loginHTML = `
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ログイン - Aメニュー</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
</head>
<body class="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 min-h-screen flex items-center justify-center p-4">
    <div class="max-w-md w-full">
        <!-- ロゴ部分 -->
        <div class="text-center mb-8">
            <a href="/" class="inline-block">
                <div class="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-2xl">
                    <i class="fas fa-utensils text-4xl text-white"></i>
                </div>
                <h1 class="text-3xl font-bold text-gray-800">Aメニュー</h1>
                <p class="text-gray-600">今日の献立、明日の笑顔</p>
            </a>
        </div>

        <!-- ログインカード -->
        <div class="bg-white rounded-2xl shadow-2xl p-8">
            <h2 class="text-2xl font-bold text-gray-800 mb-6 text-center">
                <i class="fas fa-sign-in-alt text-indigo-600 mr-2"></i>
                ログイン
            </h2>

            <form id="login-form" class="space-y-6">
                <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-2">
                        <i class="fas fa-envelope text-indigo-600 mr-2"></i>
                        メールアドレス
                    </label>
                    <input type="email" id="email" required
                           class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                           placeholder="example@email.com">
                </div>

                <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-2">
                        <i class="fas fa-lock text-indigo-600 mr-2"></i>
                        パスワード
                    </label>
                    <input type="password" id="password" required
                           class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                           placeholder="••••••••">
                </div>

                <div class="flex items-center justify-between">
                    <label class="flex items-center">
                        <input type="checkbox" id="remember" 
                               class="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500">
                        <span class="ml-2 text-sm text-gray-600">ログイン状態を保持</span>
                    </label>
                    <a href="#" class="text-sm text-indigo-600 hover:text-indigo-700 font-semibold">
                        パスワードを忘れた？
                    </a>
                </div>

                <button type="submit" 
                        class="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold py-3 rounded-lg hover:from-indigo-600 hover:to-purple-700 transition transform hover:scale-105 shadow-lg">
                    <i class="fas fa-sign-in-alt mr-2"></i>
                    ログイン
                </button>
            </form>

            <div class="mt-6 text-center">
                <p class="text-sm text-gray-600">
                    アカウントをお持ちでない方は
                    <a href="/register" class="text-indigo-600 hover:text-indigo-700 font-semibold">
                        新規登録
                    </a>
                </p>
            </div>

            <div class="mt-6 pt-6 border-t border-gray-200">
                <a href="/" class="block text-center text-sm text-gray-600 hover:text-gray-800">
                    <i class="fas fa-arrow-left mr-2"></i>
                    トップページに戻る
                </a>
            </div>
        </div>

        <!-- 管理者ログインへのリンク -->
        <div class="mt-6 text-center">
            <a href="/admin/login" class="text-sm text-purple-600 hover:text-purple-700 font-semibold">
                <i class="fas fa-user-shield mr-2"></i>
                管理者の方はこちら
            </a>
        </div>
    </div>

    <script>
        document.getElementById('login-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const remember = document.getElementById('remember').checked;

            try {
                // TODO: 実際のAPI呼び出しに置き換え
                alert('ログイン機能は現在開発中です。\\nメール: ' + email);
                
                // 仮のリダイレクト
                // window.location.href = '/app';
            } catch (error) {
                alert('ログインに失敗しました。もう一度お試しください。');
            }
        });
    </script>
</body>
</html>
`;

// 管理者ログイン画面HTML
const adminLoginHTML = `
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>管理者ログイン - Aメニュー</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
</head>
<body class="bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 min-h-screen flex items-center justify-center p-4">
    <div class="max-w-md w-full">
        <!-- ロゴ部分 -->
        <div class="text-center mb-8">
            <a href="/" class="inline-block">
                <div class="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-2xl border-4 border-white border-opacity-20">
                    <i class="fas fa-user-shield text-4xl text-white"></i>
                </div>
                <h1 class="text-3xl font-bold text-white">Aメニュー</h1>
                <p class="text-purple-200">管理者専用ページ</p>
            </a>
        </div>

        <!-- ログインカード -->
        <div class="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white border-opacity-20">
            <h2 class="text-2xl font-bold text-white mb-6 text-center">
                <i class="fas fa-shield-alt text-purple-400 mr-2"></i>
                管理者ログイン
            </h2>

            <form id="admin-login-form" class="space-y-6">
                <div>
                    <label class="block text-sm font-semibold text-purple-200 mb-2">
                        <i class="fas fa-user text-purple-400 mr-2"></i>
                        管理者ID
                    </label>
                    <input type="text" id="admin-id" required
                           class="w-full px-4 py-3 bg-white bg-opacity-20 border border-white border-opacity-30 rounded-lg text-white placeholder-purple-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                           placeholder="admin">
                </div>

                <div>
                    <label class="block text-sm font-semibold text-purple-200 mb-2">
                        <i class="fas fa-key text-purple-400 mr-2"></i>
                        パスワード
                    </label>
                    <input type="password" id="admin-password" required
                           class="w-full px-4 py-3 bg-white bg-opacity-20 border border-white border-opacity-30 rounded-lg text-white placeholder-purple-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                           placeholder="••••••••">
                </div>

                <button type="submit" 
                        class="w-full bg-gradient-to-r from-purple-500 to-pink-600 text-white font-bold py-3 rounded-lg hover:from-purple-600 hover:to-pink-700 transition transform hover:scale-105 shadow-lg">
                    <i class="fas fa-sign-in-alt mr-2"></i>
                    ログイン
                </button>
            </form>

            <div class="mt-6 pt-6 border-t border-white border-opacity-20">
                <a href="/" class="block text-center text-sm text-purple-200 hover:text-white">
                    <i class="fas fa-arrow-left mr-2"></i>
                    トップページに戻る
                </a>
            </div>
        </div>

        <!-- ユーザーログインへのリンク -->
        <div class="mt-6 text-center">
            <a href="/login" class="text-sm text-purple-300 hover:text-white font-semibold">
                <i class="fas fa-user mr-2"></i>
                一般ユーザーの方はこちら
            </a>
        </div>
    </div>

    <script>
        document.getElementById('admin-login-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const adminId = document.getElementById('admin-id').value;
            const password = document.getElementById('admin-password').value;

            try {
                // TODO: 実際のAPI呼び出しに置き換え
                alert('管理者ログイン機能は現在開発中です。\\n管理者ID: ' + adminId);
                
                // 仮のリダイレクト
                // window.location.href = '/admin/dashboard';
            } catch (error) {
                alert('ログインに失敗しました。もう一度お試しください。');
            }
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
