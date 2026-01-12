import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { serveStatic } from 'hono/cloudflare-workers'
import { LANDING_HTML } from './landing-content'
import { ABOUT_HTML, PRICING_HTML, LEGAL_HTML } from './static-html'
import { explainMenuChoice, suggestMenuAdjustment } from './openai-helper'
import { 
  getStripeClient, 
  createDonationCheckout, 
  createSubscriptionCheckout,
  verifyWebhookSignature,
  recordPaymentTransaction,
  recordSubscription,
  recordEmailNotification
} from './lib/stripe'

type Bindings = {
  DB?: D1Database;
  OPENAI_API_KEY?: string;
  STRIPE_SECRET_KEY?: string;
  STRIPE_WEBHOOK_SECRET?: string;
  STRIPE_MONTHLY_PRICE_ID?: string;
  APP_URL?: string;
  RESEND_API_KEY?: string;
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

// ========================================
// 管理者ダッシュボード（統合） HTML
// ========================================
const ADMIN_DASHBOARD_HTML = `
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>管理者ダッシュボード - AICHEFS</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
</head>
<body class="bg-gray-50">
    <!-- ヘッダー -->
    <header class="bg-gradient-to-r from-gray-800 to-gray-900 text-white shadow-lg sticky top-0 z-50">
        <div class="max-w-7xl mx-auto px-4 py-4">
            <div class="flex items-center justify-between">
                <div class="flex items-center gap-4">
                    <i class="fas fa-shield-alt text-3xl"></i>
                    <div>
                        <h1 class="text-2xl font-bold">AICHEFS 管理者</h1>
                        <p class="text-sm text-gray-300">Admin Dashboard</p>
                    </div>
                </div>
                <div class="flex items-center gap-4">
                    <span id="admin-name" class="text-sm"></span>
                    <button onclick="logout()" class="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition">
                        <i class="fas fa-sign-out-alt mr-2"></i>ログアウト
                    </button>
                </div>
            </div>
        </div>
    </header>

    <!-- メインコンテンツ -->
    <main class="max-w-7xl mx-auto px-4 py-8">
        <!-- 統計カード -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <!-- ユーザー数 -->
            <div class="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
                <div class="flex items-center justify-between mb-4">
                    <div>
                        <p class="text-blue-100 text-sm mb-1">総ユーザー数</p>
                        <h3 class="text-3xl font-bold" id="total-users">-</h3>
                    </div>
                    <div class="bg-white bg-opacity-20 rounded-full p-4">
                        <i class="fas fa-users text-3xl"></i>
                    </div>
                </div>
                <p class="text-blue-100 text-sm">
                    <span id="new-users-today">-</span> 人が本日登録
                </p>
            </div>

            <!-- 献立数 -->
            <div class="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg">
                <div class="flex items-center justify-between mb-4">
                    <div>
                        <p class="text-green-100 text-sm mb-1">生成献立数</p>
                        <h3 class="text-3xl font-bold" id="total-plans">-</h3>
                    </div>
                    <div class="bg-white bg-opacity-20 rounded-full p-4">
                        <i class="fas fa-calendar-alt text-3xl"></i>
                    </div>
                </div>
                <p class="text-green-100 text-sm">
                    <span id="plans-today">-</span> 件が本日生成
                </p>
            </div>

            <!-- 寄付総額 -->
            <div class="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
                <div class="flex items-center justify-between mb-4">
                    <div>
                        <p class="text-purple-100 text-sm mb-1">寄付総額</p>
                        <h3 class="text-3xl font-bold" id="total-donations">-</h3>
                    </div>
                    <div class="bg-white bg-opacity-20 rounded-full p-4">
                        <i class="fas fa-heart text-3xl"></i>
                    </div>
                </div>
                <p class="text-purple-100 text-sm">
                    <span id="donations-count">-</span> 件の寄付
                </p>
            </div>

            <!-- メルマガ購読者 -->
            <div class="bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl p-6 text-white shadow-lg">
                <div class="flex items-center justify-between mb-4">
                    <div>
                        <p class="text-pink-100 text-sm mb-1">メルマガ購読者</p>
                        <h3 class="text-3xl font-bold" id="total-subscribers">-</h3>
                    </div>
                    <div class="bg-white bg-opacity-20 rounded-full p-4">
                        <i class="fas fa-envelope text-3xl"></i>
                    </div>
                </div>
                <p class="text-pink-100 text-sm">
                    購読率 <span id="subscription-rate">-</span>%
                </p>
            </div>
        </div>

        <!-- ナビゲーションタブ -->
        <div class="bg-white rounded-xl shadow-lg mb-6">
            <div class="border-b border-gray-200 flex overflow-x-auto">
                <button onclick="switchTab('overview')" id="tab-overview" class="admin-tab px-6 py-4 font-semibold border-b-2 border-blue-500 text-blue-600 whitespace-nowrap">
                    <i class="fas fa-chart-line mr-2"></i>概要
                </button>
                <button onclick="switchTab('users')" id="tab-users" class="admin-tab px-6 py-4 font-semibold border-b-2 border-transparent text-gray-600 hover:text-gray-800 whitespace-nowrap">
                    <i class="fas fa-users mr-2"></i>ユーザー管理
                </button>
                <button onclick="switchTab('donations')" id="tab-donations" class="admin-tab px-6 py-4 font-semibold border-b-2 border-transparent text-gray-600 hover:text-gray-800 whitespace-nowrap">
                    <i class="fas fa-heart mr-2"></i>寄付管理
                </button>
                <button onclick="switchTab('analytics')" id="tab-analytics" class="admin-tab px-6 py-4 font-semibold border-b-2 border-transparent text-gray-600 hover:text-gray-800 whitespace-nowrap">
                    <i class="fas fa-chart-bar mr-2"></i>アクセス解析
                </button>
                <button onclick="switchTab('newsletter')" id="tab-newsletter" class="admin-tab px-6 py-4 font-semibold border-b-2 border-transparent text-gray-600 hover:text-gray-800 whitespace-nowrap">
                    <i class="fas fa-envelope mr-2"></i>メルマガ管理
                </button>
            </div>
        </div>

        <!-- タブコンテンツ -->
        <!-- 概要タブ -->
        <div id="content-overview" class="tab-content">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <!-- ユーザー登録推移グラフ -->
                <div class="bg-white rounded-xl shadow-lg p-6">
                    <h3 class="text-xl font-bold text-gray-800 mb-4">
                        <i class="fas fa-user-plus text-blue-600 mr-2"></i>ユーザー登録推移（過去7日間）
                    </h3>
                    <canvas id="user-chart"></canvas>
                </div>

                <!-- 献立生成推移グラフ -->
                <div class="bg-white rounded-xl shadow-lg p-6">
                    <h3 class="text-xl font-bold text-gray-800 mb-4">
                        <i class="fas fa-calendar-check text-green-600 mr-2"></i>献立生成推移（過去7日間）
                    </h3>
                    <canvas id="plan-chart"></canvas>
                </div>

                <!-- 最近のアクティビティ -->
                <div class="bg-white rounded-xl shadow-lg p-6 lg:col-span-2">
                    <h3 class="text-xl font-bold text-gray-800 mb-4">
                        <i class="fas fa-history text-purple-600 mr-2"></i>最近のアクティビティ
                    </h3>
                    <div id="recent-activity" class="space-y-3">
                        <p class="text-gray-500 text-center py-8">読み込み中...</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- ユーザー管理タブ -->
        <div id="content-users" class="tab-content hidden">
            <div class="bg-white rounded-xl shadow-lg p-6">
                <div class="flex items-center justify-between mb-6">
                    <h3 class="text-xl font-bold text-gray-800">
                        <i class="fas fa-users text-blue-600 mr-2"></i>ユーザー一覧
                    </h3>
                    <div class="flex gap-2">
                        <input type="text" id="user-search" placeholder="検索..." 
                               class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                        <button onclick="refreshUsers()" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                            <i class="fas fa-sync"></i>
                        </button>
                    </div>
                </div>
                <div class="overflow-x-auto">
                    <table class="w-full">
                        <thead class="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">名前</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">メール</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">登録日</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">献立数</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">操作</th>
                            </tr>
                        </thead>
                        <tbody id="users-table" class="divide-y divide-gray-200">
                            <tr>
                                <td colspan="6" class="px-6 py-8 text-center text-gray-500">読み込み中...</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div id="users-pagination" class="mt-4 flex justify-center"></div>
            </div>
        </div>

        <!-- 寄付管理タブ -->
        <div id="content-donations" class="tab-content hidden">
            <!-- 寄付統計カード -->
            <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                <div class="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl shadow-lg p-6">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-green-100 text-sm font-medium mb-1">寄付総額</p>
                            <p class="text-3xl font-bold" id="donation-total-amount">¥0</p>
                        </div>
                        <i class="fas fa-yen-sign text-5xl text-green-200 opacity-50"></i>
                    </div>
                </div>
                
                <div class="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl shadow-lg p-6">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-blue-100 text-sm font-medium mb-1">寄付件数</p>
                            <p class="text-3xl font-bold" id="donation-total-count">0</p>
                        </div>
                        <i class="fas fa-hand-holding-heart text-5xl text-blue-200 opacity-50"></i>
                    </div>
                </div>
                
                <div class="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl shadow-lg p-6">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-purple-100 text-sm font-medium mb-1">今月の寄付</p>
                            <p class="text-3xl font-bold" id="donation-month-amount">¥0</p>
                        </div>
                        <i class="fas fa-calendar-alt text-5xl text-purple-200 opacity-50"></i>
                    </div>
                </div>
                
                <div class="bg-gradient-to-br from-pink-500 to-pink-600 text-white rounded-xl shadow-lg p-6">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-pink-100 text-sm font-medium mb-1">今月の件数</p>
                            <p class="text-3xl font-bold" id="donation-month-count">0</p>
                        </div>
                        <i class="fas fa-heart text-5xl text-pink-200 opacity-50"></i>
                    </div>
                </div>
            </div>
            
            <!-- 寄付一覧テーブル -->
            <div class="bg-white rounded-xl shadow-lg p-6">
                <div class="flex justify-between items-center mb-6">
                    <h3 class="text-xl font-bold text-gray-800">
                        <i class="fas fa-heart text-red-600 mr-2"></i>寄付一覧
                    </h3>
                    <div class="flex gap-2">
                        <input type="text" id="donation-search" placeholder="寄付者名・メールで検索..." class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <button onclick="refreshDonations()" class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition">
                            <i class="fas fa-sync-alt mr-2"></i>更新
                        </button>
                    </div>
                </div>
                
                <div class="overflow-x-auto">
                    <table class="min-w-full divide-y divide-gray-200">
                        <thead class="bg-gray-50">
                            <tr>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">寄付ID</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">寄付者</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">金額</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">証明書番号</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">日付</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ステータス</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
                            </tr>
                        </thead>
                        <tbody id="donations-table-body" class="bg-white divide-y divide-gray-200">
                            <tr>
                                <td colspan="7" class="px-6 py-8 text-center text-gray-500">読み込み中...</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <!-- アクセス解析タブ -->
        <div id="content-analytics" class="tab-content hidden">
            <div class="bg-white rounded-xl shadow-lg p-6">
                <h3 class="text-xl font-bold text-gray-800 mb-6">
                    <i class="fas fa-chart-bar text-green-600 mr-2"></i>アクセス解析（準備中）
                </h3>
                <p class="text-gray-500">Cloudflare Analytics連携を実装予定です。</p>
            </div>
        </div>

        <!-- メルマガ管理タブ -->
        <div id="content-newsletter" class="tab-content hidden">
            <div class="bg-white rounded-xl shadow-lg p-6">
                <h3 class="text-xl font-bold text-gray-800 mb-6">
                    <i class="fas fa-envelope text-purple-600 mr-2"></i>メールマガジン購読者
                </h3>
                <div id="newsletter-list">
                    <p class="text-gray-500 text-center py-8">読み込み中...</p>
                </div>
            </div>
        </div>
    </main>

    <!-- ユーザー詳細モーダル -->
    <div id="user-detail-modal" class="hidden fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div class="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div class="sticky top-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-2xl">
                <div class="flex items-center justify-between">
                    <h3 class="text-2xl font-bold">
                        <i class="fas fa-user-circle mr-2"></i>ユーザー詳細
                    </h3>
                    <button onclick="closeUserModal()" class="text-white hover:text-gray-200 text-2xl">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            </div>
            
            <div id="user-detail-content" class="p-6">
                <div class="flex items-center justify-center py-12">
                    <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            </div>
        </div>
    </div>

    <script>
        // 管理者認証チェック
        const adminToken = localStorage.getItem('admin_token');
        if (!adminToken) {
            window.location.href = '/admin/login';
        }

        // タブ切り替え
        function switchTab(tab) {
            document.querySelectorAll('.tab-content').forEach(el => el.classList.add('hidden'));
            document.querySelectorAll('.admin-tab').forEach(el => {
                el.classList.remove('border-blue-500', 'text-blue-600');
                el.classList.add('border-transparent', 'text-gray-600');
            });
            
            document.getElementById('content-' + tab).classList.remove('hidden');
            document.getElementById('tab-' + tab).classList.add('border-blue-500', 'text-blue-600');
            document.getElementById('tab-' + tab).classList.remove('border-transparent', 'text-gray-600');
            
            // タブごとのデータ読み込み
            if (tab === 'users') {
                refreshUsers();
            } else if (tab === 'donations') {
                loadDonationStats();
                refreshDonations();
            }
        }

        // 統計データ読み込み
        async function loadStats() {
            try {
                const res = await axios.get('/api/admin/stats', {
                    headers: { 'Authorization': 'Bearer ' + adminToken }
                });
                const data = res.data;
                
                document.getElementById('total-users').textContent = data.total_users || 0;
                document.getElementById('new-users-today').textContent = data.new_users_today || 0;
                document.getElementById('total-plans').textContent = data.total_plans || 0;
                document.getElementById('plans-today').textContent = data.plans_today || 0;
                document.getElementById('total-donations').textContent = '¥' + (data.total_donation_amount || 0).toLocaleString();
                document.getElementById('donations-count').textContent = data.total_donations || 0;
                document.getElementById('total-subscribers').textContent = data.total_subscribers || 0;
                
                const subRate = data.total_users > 0 
                    ? ((data.total_subscribers / data.total_users) * 100).toFixed(1)
                    : 0;
                document.getElementById('subscription-rate').textContent = subRate;
            } catch (error) {
                console.error('Stats load error:', error);
            }
        }

        // ユーザー一覧読み込み
        async function refreshUsers(searchQuery = '') {
            try {
                const url = searchQuery 
                    ? '/api/admin/users?search=' + encodeURIComponent(searchQuery)
                    : '/api/admin/users';
                    
                const res = await axios.get(url, {
                    headers: { 'Authorization': 'Bearer ' + adminToken }
                });
                const users = res.data.users || [];
                
                const tbody = document.getElementById('users-table');
                if (users.length === 0) {
                    tbody.innerHTML = '<tr><td colspan="6" class="px-6 py-8 text-center text-gray-500">ユーザーがいません</td></tr>';
                    return;
                }
                
                tbody.innerHTML = users.slice(0, 20).map(u => 
                    '<tr class="hover:bg-gray-50">' +
                        '<td class="px-6 py-4 text-sm text-gray-900">' + (u.household_id?.substring(0, 8) || '') + '...</td>' +
                        '<td class="px-6 py-4 text-sm text-gray-900">' + (u.name || '-') + '</td>' +
                        '<td class="px-6 py-4 text-sm text-gray-600">' + (u.email || '-') + '</td>' +
                        '<td class="px-6 py-4 text-sm text-gray-600">' + new Date(u.created_at).toLocaleDateString('ja-JP') + '</td>' +
                        '<td class="px-6 py-4 text-sm text-gray-600">' + (u.plan_count || 0) + '</td>' +
                        '<td class="px-6 py-4 text-sm">' +
                            '<button onclick="viewUser(\'' + u.household_id + '\')" class="text-blue-600 hover:text-blue-800">' +
                                '<i class="fas fa-eye"></i> 詳細' +
                            '</button>' +
                        '</td>' +
                    '</tr>'
                ).join('');
            } catch (error) {
                console.error('Users load error:', error);
            }
        }
        
        // 検索機能
        let searchTimeout;
        document.addEventListener('DOMContentLoaded', () => {
            const searchInput = document.getElementById('user-search');
            if (searchInput) {
                searchInput.addEventListener('input', (e) => {
                    clearTimeout(searchTimeout);
                    searchTimeout = setTimeout(() => {
                        refreshUsers(e.target.value);
                    }, 500);
                });
            }
        });
        }

        async function viewUser(householdId) {
            const modal = document.getElementById('user-detail-modal');
            const content = document.getElementById('user-detail-content');
            modal.classList.remove('hidden');
            
            // ローディング表示
            content.innerHTML = '<div class="text-center py-8"><i class="fas fa-spinner fa-spin text-4xl text-indigo-600 mb-4"></i><p class="text-gray-600">ユーザー詳細を読み込み中...</p></div>';
            
            try {
                const adminToken = localStorage.getItem('admin_token');
                const response = await fetch('/api/admin/users/' + householdId, {
                    headers: { 'Authorization': 'Bearer ' + adminToken }
                });
                const data = await response.json();
                const user = data.user;
                
                // 嫌いな食材とアレルギー情報をパース
                const dislikes = user.dislikes_json ? JSON.parse(user.dislikes_json) : [];
                const allergies = user.allergies_json ? JSON.parse(user.allergies_json) : { standard: [], free_text: [] };
                
                // ユーザー詳細HTMLを組み立て
                let html = '<div class="bg-white rounded-lg shadow-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">';
                html += '<div class="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 flex justify-between items-center">';
                html += '<h2 class="text-2xl font-bold"><i class="fas fa-user-circle mr-2"></i>ユーザー詳細</h2>';
                html += '<button onclick="closeUserModal()" class="text-white hover:text-gray-200 transition"><i class="fas fa-times text-2xl"></i></button>';
                html += '</div>';
                html += '<div class="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">';
                
                // 基本情報
                html += '<div class="bg-gray-50 rounded-lg p-4">';
                html += '<h3 class="text-lg font-bold text-gray-800 mb-4 border-b border-gray-300 pb-2"><i class="fas fa-info-circle text-indigo-600 mr-2"></i>基本情報</h3>';
                html += '<div class="space-y-3">';
                html += '<div class="flex justify-between"><span class="text-gray-600">世帯ID:</span><span class="font-semibold text-gray-800">' + user.household_id + '</span></div>';
                html += '<div class="flex justify-between"><span class="text-gray-600">名前:</span><span class="font-semibold text-gray-800">' + (user.name || '未設定') + '</span></div>';
                html += '<div class="flex justify-between"><span class="text-gray-600">メールアドレス:</span><span class="font-semibold text-gray-800">' + (user.email || '未設定') + '</span></div>';
                html += '<div class="flex justify-between"><span class="text-gray-600">家族構成:</span><span class="font-semibold text-gray-800">' + user.title + '</span></div>';
                html += '<div class="flex justify-between"><span class="text-gray-600">人数:</span><span class="font-semibold text-gray-800">' + user.members_count + '人</span></div>';
                html += '<div class="flex justify-between"><span class="text-gray-600">登録日:</span><span class="font-semibold text-gray-800">' + new Date(user.created_at).toLocaleDateString('ja-JP') + '</span></div>';
                html += '<div class="flex justify-between"><span class="text-gray-600">予算:</span><span class="font-semibold text-gray-800">¥' + user.budget_tier_per_person + '/人</span></div>';
                html += '<div class="flex justify-between"><span class="text-gray-600">調理時間:</span><span class="font-semibold text-gray-800">' + user.cooking_time_limit_min + '分以内</span></div>';
                html += '</div></div>';
                
                // 統計情報
                html += '<div class="bg-gray-50 rounded-lg p-4">';
                html += '<h3 class="text-lg font-bold text-gray-800 mb-4 border-b border-gray-300 pb-2"><i class="fas fa-chart-line text-indigo-600 mr-2"></i>統計情報</h3>';
                html += '<div class="space-y-3">';
                html += '<div class="flex justify-between"><span class="text-gray-600">作成献立数:</span><span class="font-semibold text-indigo-600">' + (data.stats ? data.stats.total_plans : 0) + '件</span></div>';
                html += '<div class="flex justify-between"><span class="text-gray-600">お気に入り数:</span><span class="font-semibold text-pink-600">' + (data.stats ? data.stats.total_favorites : 0) + '件</span></div>';
                html += '<div class="flex justify-between"><span class="text-gray-600">寄付回数:</span><span class="font-semibold text-green-600">' + (data.stats ? data.stats.total_donations : 0) + '回</span></div>';
                html += '<div class="flex justify-between"><span class="text-gray-600">寄付総額:</span><span class="font-semibold text-green-600">¥' + (data.stats && data.stats.total_donation_amount ? data.stats.total_donation_amount.toLocaleString() : '0') + '</span></div>';
                html += '</div></div>';
                
                // 嫌いな食材
                html += '<div class="bg-gray-50 rounded-lg p-4">';
                html += '<h3 class="text-lg font-bold text-gray-800 mb-4 border-b border-gray-300 pb-2"><i class="fas fa-ban text-red-600 mr-2"></i>嫌いな食材</h3>';
                html += '<div class="flex flex-wrap gap-2">';
                if (dislikes.length > 0) {
                    dislikes.forEach(function(item) {
                        html += '<span class="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm">' + item + '</span>';
                    });
                } else {
                    html += '<span class="text-gray-500">設定なし</span>';
                }
                html += '</div></div>';
                
                // アレルギー情報
                html += '<div class="bg-gray-50 rounded-lg p-4">';
                html += '<h3 class="text-lg font-bold text-gray-800 mb-4 border-b border-gray-300 pb-2"><i class="fas fa-exclamation-triangle text-orange-600 mr-2"></i>アレルギー</h3>';
                html += '<div class="space-y-2">';
                html += '<div><span class="text-gray-600 font-semibold">7大アレルゲン:</span>';
                html += '<div class="flex flex-wrap gap-2 mt-2">';
                if (allergies.standard && allergies.standard.length > 0) {
                    allergies.standard.forEach(function(item) {
                        html += '<span class="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm">' + item + '</span>';
                    });
                } else {
                    html += '<span class="text-gray-500">設定なし</span>';
                }
                html += '</div></div>';
                html += '<div><span class="text-gray-600 font-semibold">その他:</span>';
                html += '<div class="flex flex-wrap gap-2 mt-2">';
                if (allergies.free_text && allergies.free_text.length > 0) {
                    allergies.free_text.forEach(function(item) {
                        html += '<span class="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm">' + item + '</span>';
                    });
                } else {
                    html += '<span class="text-gray-500">設定なし</span>';
                }
                html += '</div></div></div></div>';
                
                // 最近の献立
                html += '<div class="md:col-span-2 bg-gray-50 rounded-lg p-4">';
                html += '<h3 class="text-lg font-bold text-gray-800 mb-4 border-b border-gray-300 pb-2"><i class="fas fa-history text-indigo-600 mr-2"></i>最近の献立</h3>';
                html += '<div class="space-y-2">';
                if (data.plans && data.plans.length > 0) {
                    data.plans.forEach(function(plan) {
                        html += '<div class="flex justify-between items-center bg-white p-3 rounded-lg hover:shadow-md transition">';
                        html += '<div><span class="font-semibold text-gray-800">' + (plan.cuisine_style || '和食') + ' - ' + plan.plan_days + '日分</span>';
                        html += '<span class="text-gray-500 text-sm ml-2">' + new Date(plan.created_at).toLocaleDateString('ja-JP') + '</span></div>';
                        html += '<span class="text-sm text-gray-600">' + (plan.status === 'active' ? '使用中' : '完了') + '</span></div>';
                    });
                } else {
                    html += '<span class="text-gray-500">献立履歴がありません</span>';
                }
                html += '</div></div>';
                
                // メールマガジン
                html += '<div class="md:col-span-2 bg-gray-50 rounded-lg p-4">';
                html += '<h3 class="text-lg font-bold text-gray-800 mb-4 border-b border-gray-300 pb-2"><i class="fas fa-envelope text-indigo-600 mr-2"></i>メールマガジン購読状況</h3>';
                html += '<div class="flex items-center gap-4"><span class="text-gray-600">ステータス:</span>';
                html += '<span class="font-semibold ' + (data.newsletter && data.newsletter.status === 'active' ? 'text-green-600' : 'text-gray-500') + '">';
                html += (data.newsletter && data.newsletter.status === 'active' ? '購読中' : '未購読') + '</span>';
                if (data.newsletter && data.newsletter.subscribed_at) {
                    html += '<span class="text-gray-500 text-sm">購読開始: ' + new Date(data.newsletter.subscribed_at).toLocaleDateString('ja-JP') + '</span>';
                }
                html += '</div></div>';
                
                html += '</div>';
                html += '<div class="bg-gray-100 p-4 flex justify-end">';
                html += '<button onclick="closeUserModal()" class="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-6 rounded-lg transition">閉じる</button>';
                html += '</div></div>';
                
                content.innerHTML = html;
            } catch (error) {
                console.error('User detail error:', error);
                content.innerHTML = '<div class="bg-white rounded-lg shadow-lg p-6 max-w-md"><div class="text-center"><i class="fas fa-exclamation-triangle text-4xl text-red-600 mb-4"></i><p class="text-gray-800 font-semibold mb-4">ユーザー詳細の読み込みに失敗しました</p><button onclick="closeUserModal()" class="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-6 rounded-lg transition">閉じる</button></div></div>';
            }
        }

        function closeUserModal() {
            document.getElementById('user-detail-modal').classList.add('hidden');
        }
        
        // 寄付統計を読み込む
        async function loadDonationStats() {
            try {
                const adminToken = localStorage.getItem('admin_token');
                const response = await fetch('/api/admin/donations/stats', {
                    headers: { 'Authorization': 'Bearer ' + adminToken }
                });
                const data = await response.json();
                
                document.getElementById('donation-total-amount').textContent = '¥' + data.total_amount.toLocaleString();
                document.getElementById('donation-total-count').textContent = data.total_count.toLocaleString();
                document.getElementById('donation-month-amount').textContent = '¥' + data.month_amount.toLocaleString();
                document.getElementById('donation-month-count').textContent = data.month_count.toLocaleString();
            } catch (error) {
                console.error('Donation stats error:', error);
            }
        }
        
        // 寄付一覧を読み込む
        async function refreshDonations() {
            try {
                const adminToken = localStorage.getItem('admin_token');
                const search = document.getElementById('donation-search').value;
                const url = '/api/admin/donations' + (search ? '?search=' + encodeURIComponent(search) : '');
                
                const response = await fetch(url, {
                    headers: { 'Authorization': 'Bearer ' + adminToken }
                });
                const data = await response.json();
                
                const tbody = document.getElementById('donations-table-body');
                if (data.donations.length === 0) {
                    tbody.innerHTML = '<tr><td colspan="7" class="px-6 py-8 text-center text-gray-500">寄付データがありません</td></tr>';
                    return;
                }
                
                let html = '';
                data.donations.forEach(function(donation) {
                    const statusBadge = donation.status === 'completed' 
                        ? '<span class="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">完了</span>'
                        : '<span class="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">保留</span>';
                    
                    html += '<tr class="hover:bg-gray-50">';
                    html += '<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">' + donation.donation_id + '</td>';
                    html += '<td class="px-6 py-4 whitespace-nowrap"><div class="text-sm font-medium text-gray-900">' + donation.donor_name + '</div><div class="text-sm text-gray-500">' + donation.donor_email + '</div></td>';
                    html += '<td class="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">¥' + donation.amount.toLocaleString() + '</td>';
                    html += '<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">' + (donation.certificate_number || '-') + '</td>';
                    html += '<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">' + new Date(donation.created_at).toLocaleDateString('ja-JP') + '</td>';
                    html += '<td class="px-6 py-4 whitespace-nowrap">' + statusBadge + '</td>';
                    html += '<td class="px-6 py-4 whitespace-nowrap text-sm font-medium">';
                    html += '<button onclick="viewDonation(' + donation.donation_id + ')" class="text-blue-600 hover:text-blue-900 mr-3"><i class="fas fa-eye mr-1"></i>詳細</button>';
                    if (donation.certificate_number) {
                        html += '<button onclick="downloadCertificate(\'' + donation.certificate_number + '\')" class="text-green-600 hover:text-green-900"><i class="fas fa-download mr-1"></i>証明書</button>';
                    }
                    html += '</td></tr>';
                });
                
                tbody.innerHTML = html;
            } catch (error) {
                console.error('Donations load error:', error);
                document.getElementById('donations-table-body').innerHTML = '<tr><td colspan="7" class="px-6 py-8 text-center text-red-500">エラーが発生しました</td></tr>';
            }
        }
        
        // 寄付詳細を表示（TODO: 実装）
        function viewDonation(donationId) {
            alert('寄付詳細機能は実装予定です (ID: ' + donationId + ')');
        }
        
        // 証明書ダウンロード（TODO: 実装）
        function downloadCertificate(certificateNumber) {
            alert('証明書ダウンロード機能は実装予定です (証明書番号: ' + certificateNumber + ')');
        }

        function logout() {
            localStorage.removeItem('admin_token');
            window.location.href = '/admin/login';
        }

        // 初期化
        loadStats();
        refreshUsers();
        
        // 検索イベントリスナー
        document.getElementById('donation-search').addEventListener('input', function() {
            clearTimeout(this.searchTimeout);
            this.searchTimeout = setTimeout(function() {
                refreshDonations();
            }, 500);
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
                <a href="/dashboard" class="text-blue-600 hover:text-blue-800 hover:underline cursor-pointer">
                    <span id="user-name"></span>
                </a>
                <a href="/profile" class="text-sm text-purple-600 hover:underline">
                    <i class="fas fa-user-edit mr-1"></i>プロフィール編集
                </a>
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
            
            <!-- ワンクリック献立生成 -->
            <div id="quick-mode-card" class="bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl p-6 text-white shadow-xl hidden">
                <i class="fas fa-bolt text-4xl mb-4"></i>
                <h2 class="text-2xl font-bold mb-2">ワンクリック献立</h2>
                <p class="mb-4 opacity-90">保存済み設定で即座に生成</p>
                <button onclick="quickGeneratePlan()" class="bg-white text-orange-600 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition">
                    <i class="fas fa-magic mr-2"></i>生成する
                </button>
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
            <div class="border-b border-gray-200 flex overflow-x-auto">
                <button onclick="switchTab('history')" id="tab-history" class="px-6 py-3 font-semibold border-b-2 border-purple-600 text-purple-600 whitespace-nowrap">
                    <i class="fas fa-history mr-2"></i>履歴
                </button>
                <button onclick="switchTab('favorites')" id="tab-favorites" class="px-6 py-3 font-semibold text-gray-600 hover:text-purple-600 whitespace-nowrap">
                    <i class="fas fa-heart mr-2"></i>お気に入り
                </button>
                <button onclick="switchTab('family')" id="tab-family" class="px-6 py-3 font-semibold text-gray-600 hover:text-purple-600 whitespace-nowrap">
                    <i class="fas fa-users mr-2"></i>家族設定
                </button>
                <button onclick="switchTab('donations')" id="tab-donations" class="px-6 py-3 font-semibold text-gray-600 hover:text-purple-600">
                    <i class="fas fa-heart mr-2"></i>寄付履歴
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
        
        <div id="content-donations" class="hidden bg-white rounded-lg shadow-sm p-6">
            <h2 class="text-2xl font-bold text-gray-800 mb-6">
                <i class="fas fa-heart text-red-500 mr-2"></i>寄付履歴
            </h2>
            <div id="donations-list" class="space-y-4">
                <p class="text-gray-500">寄付履歴を読み込み中...</p>
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
        
        <!-- 家族設定タブ -->
        <div id="content-family" class="hidden bg-white rounded-lg shadow-sm p-6">
            <div class="mb-6">
                <h2 class="text-2xl font-bold text-gray-800 mb-2">
                    <i class="fas fa-users text-purple-600 mr-2"></i>家族メンバー管理
                </h2>
                <p class="text-gray-600">家族のメールアドレスを登録すると、毎日「今日の晩ご飯」が自動で通知されます。</p>
            </div>
            
            <!-- 家族メンバー追加フォーム -->
            <div class="bg-purple-50 rounded-lg p-6 mb-6">
                <h3 class="text-lg font-semibold text-gray-800 mb-4">
                    <i class="fas fa-user-plus mr-2"></i>メンバーを追加
                </h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">お名前 <span class="text-red-500">*</span></label>
                        <input type="text" id="family-name" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent" placeholder="例: 田中 花子">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">メールアドレス <span class="text-red-500">*</span></label>
                        <input type="email" id="family-email" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent" placeholder="例: hanako@example.com">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">続柄</label>
                        <select id="family-relationship" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                            <option value="spouse">配偶者</option>
                            <option value="child">子供</option>
                            <option value="parent">親</option>
                            <option value="other">その他</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">通知時刻</label>
                        <input type="time" id="family-notification-time" value="15:00" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                    </div>
                </div>
                <button onclick="addFamilyMember()" class="mt-4 bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-semibold transition">
                    <i class="fas fa-plus mr-2"></i>追加する
                </button>
            </div>
            
            <!-- 家族メンバー一覧 -->
            <div>
                <h3 class="text-lg font-semibold text-gray-800 mb-4">
                    <i class="fas fa-list mr-2"></i>登録済みメンバー
                </h3>
                <div id="family-members-list" class="space-y-3">
                    <p class="text-gray-500 text-center py-8">メンバーを追加してください</p>
                </div>
            </div>
        </div>
    </main>
    
    <script>
        let userData = null;
        let household_id = null;
        
        // 初期化
        async function init() {
            // セッション確認（統一されたキー名を使用）
            const auth_token = localStorage.getItem('auth_token');
            const userJson = localStorage.getItem('aichef_user');
            
            if (!auth_token || !userJson) {
                // 未ログインの場合はログインページへ
                window.location.href = '/';
                return;
            }
            
            userData = JSON.parse(userJson);
            household_id = userData.household_id;
            
            // ユーザー名とプロフィール情報を表示
            if (document.getElementById('user-name')) {
                document.getElementById('user-name').textContent = userData.name || '未設定';
            }
            if (document.getElementById('profile-name')) {
                document.getElementById('profile-name').value = userData.name || '';
            }
            if (document.getElementById('profile-email')) {
                document.getElementById('profile-email').value = userData.email || '';
            }
            
            // データ読み込み
            try {
                await loadHistory();
                await loadFavorites();
                await loadDonations();
                await checkQuickMode();
            } catch (error) {
                console.error('Dashboard init error:', error);
            }
            
            // 家族タブが選択されている場合は家族メンバーを読み込む
            if (window.location.hash === '#family') {
                switchTab('family');
                await loadFamilyMembers();
            }
        }
        
        // 履歴読み込み
        async function loadHistory() {
            try {
                const token = localStorage.getItem('auth_token');
                if (!token) {
                    window.location.href = '/login';
                    return;
                }

                const response = await fetch('/api/plans/history?page=1&limit=10', {
                    headers: { 'Authorization': 'Bearer ' + token }
                });
                const data = await response.json();
                
                document.getElementById('history-count').textContent = data.pagination?.total || 0;
                
                const listEl = document.getElementById('history-list');
                if (data.plans && data.plans.length > 0) {
                    listEl.innerHTML = data.plans.map(h => '<div class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">' +
                        '<div class="flex justify-between items-start">' +
                            '<div>' +
                                '<h3 class="font-bold text-lg text-gray-800">献立 (' + h.start_date + ')</h3>' +
                                '<p class="text-sm text-gray-600 mt-1">' +
                                    '<i class="far fa-calendar mr-1"></i>' + h.start_date + ' から' + (h.months || 1) + 'ヶ月分' +
                                '</p>' +
                                '<p class="text-sm text-gray-600">' +
                                    '<i class="far fa-clock mr-1"></i>作成日: ' + new Date(h.created_at).toLocaleDateString('ja-JP') +
                                '</p>' +
                            '</div>' +
                            '<div class="flex gap-2">' +
                                '<button class="load-history-btn text-blue-600 hover:text-blue-800 px-3 py-1 bg-blue-50 rounded" data-plan-id="' + h.plan_id + '">' +
                                    '<i class="fas fa-eye mr-1"></i>表示' +
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
        
        // 寄付履歴読み込み
        async function loadDonations() {
            try {
                const token = localStorage.getItem('auth_token');
                if (!token) {
                    return;
                }

                const response = await fetch('/api/donations/my-history', {
                    headers: { 'Authorization': 'Bearer ' + token }
                });
                const data = await response.json();
                
                const listEl = document.getElementById('donations-list');
                if (data.donations && data.donations.length > 0) {
                    listEl.innerHTML = data.donations.map(d => {
                        const date = new Date(d.created_at).toLocaleDateString('ja-JP');
                        const statusText = d.status === 'completed' ? '完了' : d.status === 'pending' ? '保留中' : d.status;
                        const statusColor = d.status === 'completed' ? 'text-green-600' : 'text-yellow-600';
                        
                        return '<div class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">' +
                            '<div class="flex justify-between items-start">' +
                                '<div class="flex-1">' +
                                    '<div class="flex items-center gap-2 mb-2">' +
                                        '<h3 class="font-bold text-lg text-gray-800">¥' + d.amount.toLocaleString() + '</h3>' +
                                        '<span class="text-xs px-2 py-1 rounded ' + statusColor + ' bg-opacity-10">' + statusText + '</span>' +
                                    '</div>' +
                                    '<p class="text-sm text-gray-600 mb-1">' +
                                        '<i class="fas fa-certificate mr-1 text-purple-600"></i>証明書番号: ' + d.certificate_number +
                                    '</p>' +
                                    '<p class="text-sm text-gray-600 mb-1">' +
                                        '<i class="far fa-calendar mr-1"></i>寄付日: ' + date +
                                    '</p>' +
                                    '<p class="text-sm text-gray-600">' +
                                        '<i class="fas fa-coins mr-1"></i>支援単位: ' + d.unit_count + '口' +
                                    '</p>' +
                                    (d.message ? '<p class="text-sm text-gray-500 mt-2 italic">' + d.message + '</p>' : '') +
                                '</div>' +
                            '</div>' +
                        '</div>';
                    }).join('');
                } else {
                    listEl.innerHTML = '<div class="text-center py-8">' +
                        '<i class="fas fa-heart text-gray-300 text-6xl mb-4"></i>' +
                        '<p class="text-gray-500">まだ寄付履歴がありません</p>' +
                        '<p class="text-sm text-gray-400 mt-2">AICHEFSを応援して、献立作成を快適に！</p>' +
                        '<a href="/donate" class="inline-block mt-4 bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition">' +
                            '<i class="fas fa-heart mr-2"></i>寄付をする' +
                        '</a>' +
                    '</div>';
                }
            } catch (error) {
                console.error('Donations load error:', error);
            }
        }
        
        // タブ切り替え
        function switchTab(tab) {
            ['history', 'favorites', 'donations', 'profile', 'family'].forEach(t => {
                document.getElementById('content-' + t).classList.add('hidden');
                document.getElementById('tab-' + t).classList.remove('border-b-2', 'border-purple-600', 'text-purple-600');
                document.getElementById('tab-' + t).classList.add('text-gray-600');
            });
            
            document.getElementById('content-' + tab).classList.remove('hidden');
            document.getElementById('tab-' + tab).classList.add('border-b-2', 'border-purple-600', 'text-purple-600');
            document.getElementById('tab-' + tab).classList.remove('text-gray-600');
            
            // 家族タブが選択されたら家族メンバーを読み込む
            if (tab === 'family') {
                loadFamilyMembers();
            }
        }
        }
        
        function showHistoryTab() { switchTab('history'); }
        function showFavoritesTab() { switchTab('favorites'); }
        function showFamilyTab() { switchTab('family'); }
        
        // ワンクリック献立生成
        async function quickGeneratePlan() {
            if (!confirm('保存済みの設定で献立を生成します。よろしいですか？')) return;
            
            try {
                const response = await fetch('/api/preferences/quick-generate', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ household_id: household_id })
                });
                const data = await response.json();
                
                if (data.success) {
                    alert('献立を生成しました！カレンダーページで確認できます。');
                    // TODO: カレンダーページへリダイレクト
                } else {
                    alert('エラー: ' + (data.error || '献立生成に失敗しました'));
                }
            } catch (error) {
                console.error('Quick generate error:', error);
                alert('エラーが発生しました');
            }
        }
        
        // 家族メンバー追加
        async function addFamilyMember() {
            const name = document.getElementById('family-name').value.trim();
            const email = document.getElementById('family-email').value.trim();
            const relationship = document.getElementById('family-relationship').value;
            const notificationTime = document.getElementById('family-notification-time').value;
            
            if (!name || !email) {
                alert('名前とメールアドレスを入力してください');
                return;
            }
            
            try {
                const response = await fetch('/api/family-members/add', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        household_id: household_id,
                        name: name,
                        email: email,
                        relationship: relationship,
                        notification_time: notificationTime
                    })
                });
                const data = await response.json();
                
                if (data.success) {
                    alert('家族メンバーを追加しました');
                    document.getElementById('family-name').value = '';
                    document.getElementById('family-email').value = '';
                    await loadFamilyMembers();
                } else {
                    alert('エラー: ' + (data.error || 'メンバー追加に失敗しました'));
                }
            } catch (error) {
                console.error('Add family member error:', error);
                alert('エラーが発生しました');
            }
        }
        
        // 家族メンバー一覧読み込み
        async function loadFamilyMembers() {
            try {
                const response = await fetch('/api/family-members/' + household_id);
                const data = await response.json();
                
                const listEl = document.getElementById('family-members-list');
                if (data.members && data.members.length > 0) {
                    listEl.innerHTML = data.members.map(function(m) {
                        const statusBadge = m.is_notification_enabled === 1 
                            ? '<span class="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800"><i class="fas fa-bell mr-1"></i>通知ON</span>'
                            : '<span class="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800"><i class="fas fa-bell-slash mr-1"></i>通知OFF</span>';
                        
                        return '<div class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">' +
                            '<div class="flex justify-between items-start">' +
                                '<div>' +
                                    '<h3 class="font-bold text-gray-800">' + m.name + '</h3>' +
                                    '<p class="text-sm text-gray-600 mt-1"><i class="fas fa-envelope mr-1"></i>' + m.email + '</p>' +
                                    '<p class="text-sm text-gray-600"><i class="fas fa-user-friends mr-1"></i>' + m.relationship + '</p>' +
                                    '<p class="text-sm text-gray-600"><i class="fas fa-clock mr-1"></i>通知時刻: ' + m.notification_time + '</p>' +
                                '</div>' +
                                '<div class="flex flex-col gap-2">' +
                                    statusBadge +
                                    '<button onclick="toggleNotification(' + m.member_id + ')" class="text-xs text-blue-600 hover:text-blue-800 px-2 py-1 bg-blue-50 rounded">切り替え</button>' +
                                    '<button onclick="deleteFamilyMember(' + m.member_id + ')" class="text-xs text-red-600 hover:text-red-800 px-2 py-1 bg-red-50 rounded">削除</button>' +
                                '</div>' +
                            '</div>' +
                        '</div>';
                    }).join('');
                } else {
                    listEl.innerHTML = '<p class="text-gray-500 text-center py-8">メンバーを追加してください</p>';
                }
            } catch (error) {
                console.error('Load family members error:', error);
            }
        }
        
        // 通知ON/OFF切り替え
        async function toggleNotification(memberId) {
            try {
                const response = await fetch('/api/family-members/' + memberId + '/toggle', {
                    method: 'PUT'
                });
                const data = await response.json();
                
                if (data.success) {
                    await loadFamilyMembers();
                } else {
                    alert('エラー: ' + (data.error || '切り替えに失敗しました'));
                }
            } catch (error) {
                console.error('Toggle notification error:', error);
                alert('エラーが発生しました');
            }
        }
        
        // 家族メンバー削除
        async function deleteFamilyMember(memberId) {
            if (!confirm('このメンバーを削除してもよろしいですか？')) return;
            
            try {
                const response = await fetch('/api/family-members/' + memberId, {
                    method: 'DELETE'
                });
                const data = await response.json();
                
                if (data.success) {
                    alert('メンバーを削除しました');
                    await loadFamilyMembers();
                } else {
                    alert('エラー: ' + (data.error || '削除に失敗しました'));
                }
            } catch (error) {
                console.error('Delete family member error:', error);
                alert('エラーが発生しました');
            }
        }
        
        // ユーザー設定を確認してワンクリックカードを表示
        async function checkQuickMode() {
            try {
                const response = await fetch('/api/preferences/' + household_id);
                const data = await response.json();
                
                if (data.is_quick_mode_enabled === 1) {
                    document.getElementById('quick-mode-card').classList.remove('hidden');
                }
            } catch (error) {
                console.error('Check quick mode error:', error);
            }
        }
        
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
            localStorage.removeItem('aichef_user');
            localStorage.removeItem('auth_token');
            localStorage.removeItem('household_id');
            localStorage.removeItem('email');
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
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script>
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
                    <span id="plan-title">1ヶ月分の献立</span>
                </h2>
                <div class="flex gap-2 flex-wrap">
                    <button onclick="window.location.href='/dashboard'" class="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition flex items-center gap-2 text-sm font-semibold shadow-md">
                        <i class="fas fa-home"></i>
                        マイページ
                    </button>
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
                    <div class="relative">
                        <button onclick="toggleDownloadMenu()" class="px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition flex items-center gap-2">
                            <i class="fas fa-download"></i>
                            ダウンロード
                            <i class="fas fa-chevron-down text-xs"></i>
                        </button>
                        <div id="download-menu" class="hidden absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl z-50 border border-gray-200">
                            <button onclick="downloadAsPDF()" class="w-full text-left px-4 py-3 hover:bg-purple-50 transition flex items-center gap-3 border-b border-gray-100">
                                <i class="fas fa-file-pdf text-red-500"></i>
                                <div>
                                    <div class="font-semibold text-gray-800">PDF形式</div>
                                    <div class="text-xs text-gray-500">印刷向け</div>
                                </div>
                            </button>
                            <button onclick="handleDownloadCalendar()" class="w-full text-left px-4 py-3 hover:bg-purple-50 transition flex items-center gap-3">
                                <i class="fas fa-calendar text-purple-500"></i>
                                <div>
                                    <div class="font-semibold text-gray-800">カレンダー形式</div>
                                    <div class="text-xs text-gray-500">Google/Appleカレンダー</div>
                                </div>
                            </button>
                        </div>
                    </div>
                    <div id="user-info" class="hidden px-4 py-2 bg-gray-100 rounded-lg flex items-center gap-2">
                        <i class="fas fa-user-circle text-gray-600"></i>
                        <a href="/dashboard" class="text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline cursor-pointer">
                            <span id="user-name"></span>
                        </a>
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
                                    <li><a href="/donation" class="text-yellow-300 hover:text-yellow-100 transition flex items-center gap-2 group font-semibold" style="word-wrap: break-word;">
                                        <i class="fas fa-heart text-xs group-hover:translate-x-1 transition flex-shrink-0"></i>
                                        <span>子ども食堂を支援する</span>
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
                plan_days: 30,  // デフォルト値を追加
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
                optional: true,
                // ログイン済みユーザーはスキップ
                condition: (data) => !localStorage.getItem('auth_token')
            },
            {
                id: 'confirm',
                type: 'confirm',
                text: function(data) {
                    const planDays = data.plan_days || 30;
                    const periodText = planDays === 7 ? '1週間' :
                                       planDays === 14 ? '2週間' :
                                       planDays === 21 ? '3週間' :
                                       planDays === 30 ? '1ヶ月' : planDays + '日間';
                    return '設定完了です！<br>これで' + periodText + '分の献立を作成します。よろしいですか？';
                },
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
                
                const messageText = typeof question.text === 'function' ? question.text(appState.data) : question.text;
                addMessage(messageText);
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
                
                const messageText = typeof question.text === 'function' ? question.text(appState.data) : question.text;
                addMessage(messageText);
                showInput(question);
            }
        }

        async function generatePlan() {
            try {
                // モーダルを表示
                const modal = document.getElementById('plan-generation-modal');
                const content = document.getElementById('plan-generation-modal-content');
                
                if (!modal || !content) {
                    console.error('モーダル要素が見つかりません');
                    alert('エラー: モーダル要素が見つかりません。ページをリロードしてください。');
                    return;
                }
                
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
                    supervisor_mode: appState.data.supervisor_mode || 'general',
                    plan_days: appState.data.plan_days || 30
                });
                appState.planId = planRes.data.plan_id;
                // planIdをlocalStorageに保存（ページリロード後も使用可能に）
                localStorage.setItem('current_plan_id', planRes.data.plan_id);
                
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
                
                // content要素の取得（catchブロック内で再取得）
                const modal = document.getElementById('plan-generation-modal');
                const content = document.getElementById('plan-generation-modal-content');
                
                if (!modal || !content) {
                    console.error('エラー表示用のモーダル要素が見つかりません');
                    alert('エラーが発生しました。ページをリロードしてください。');
                    return;
                }
                
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
            
            // 🎯 ヘッダータイトルを動的に更新
            const planTitleEl = document.getElementById('plan-title');
            if (planTitleEl) {
                planTitleEl.textContent = periodText + '分の献立';
            }
            
            const toast = document.createElement('div');
            toast.className = 'fixed top-20 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-4 rounded-2xl shadow-2xl z-50 flex items-center gap-3 animate-bounce';
            toast.style.animation = 'slideDown 0.5s ease-out, fadeOut 0.5s ease-out 4.5s';
            toast.innerHTML = '<i class="fas fa-check-circle text-3xl"></i><div><div class="font-bold text-lg">\uD83C\uDF89 献立が完成しました！</div><div class="text-sm opacity-90">' + periodText + '分の献立をお楽しみください</div></div>';
            document.body.appendChild(toast);
            
            // 5秒後にトーストを削除
            setTimeout(() => {
                toast.remove();
            }, 5000);
            
            // 印刷用のタイトル設定
            if (days.length > 0) {
                const startDate = days[0].date;
                const endDate = days[days.length - 1].date;
                const printPeriodEl = document.getElementById('print-period');
                if (printPeriodEl) {
                    printPeriodEl.textContent = '期間: ' + startDate + ' 〜 ' + endDate;
                }
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
            // localStorageからplanIdを取得（appState.planIdがない場合）
            const planId = appState.planId || localStorage.getItem('current_plan_id');
            
            if (!planId) {
                alert('献立情報がありません。先に献立を生成してください。');
                return;
            }
            
            try {
                // プランの献立を再取得
                const res = await axios.get(\`/api/plans/\${planId}\`);
                const days = res.data.days;
                
                // データを更新
                calendarData = days;
                appState.planId = planId; // appStateも更新
                
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
            // データを保存（PDF生成用）
            currentShoppingData = data;
            
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
                    <button onclick="downloadShoppingListPDF()" class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition">
                        <i class="fas fa-file-pdf"></i> PDFダウンロード
                    </button>
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
        
        // 買い物リストPDFダウンロード
        let currentShoppingData = null; // 買い物リストデータを保持
        
        async function downloadShoppingListPDF() {
            if (!currentShoppingData) {
                alert('買い物リストデータがありません');
                return;
            }
            
            // ローディング表示
            const loadingToast = document.createElement('div');
            loadingToast.className = 'fixed top-4 right-4 bg-blue-500 text-white px-6 py-4 rounded-lg shadow-lg z-50 flex items-center gap-3';
            loadingToast.innerHTML = '<div class="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div><span>買い物リストPDFを生成中...</span>';
            document.body.appendChild(loadingToast);
            
            try {
                const { jsPDF } = window.jspdf;
                const doc = new jsPDF({
                    orientation: 'portrait',
                    unit: 'mm',
                    format: 'a4'
                });
                
                doc.setFont('helvetica');
                
                // タイトル
                doc.setFontSize(18);
                doc.text('買い物リスト', 105, 20, { align: 'center' });
                
                // 期間情報
                doc.setFontSize(10);
                const periodInfo = currentShoppingData.startDate && currentShoppingData.endDate
                    ? currentShoppingData.startDate + ' ~ ' + currentShoppingData.endDate
                    : '期間不明';
                doc.text('期間: ' + periodInfo, 105, 27, { align: 'center' });
                doc.text('人数: ' + (currentShoppingData.membersCount || 2) + '人分', 105, 32, { align: 'center' });
                doc.text('合計: ' + currentShoppingData.totalItems + '品目', 105, 37, { align: 'center' });
                
                let y = 48;
                
                // カテゴリ別リスト
                const categories = Object.keys(currentShoppingData.shoppingList || {});
                
                categories.forEach((category, catIndex) => {
                    const items = currentShoppingData.shoppingList[category] || [];
                    
                    if (items.length === 0) return;
                    
                    // ページ分割チェック
                    if (y > 250) {
                        doc.addPage();
                        y = 20;
                    }
                    
                    // カテゴリ名
                    doc.setFontSize(12);
                    doc.setFont('helvetica', 'bold');
                    doc.text(category, 15, y);
                    y += 6;
                    
                    // アイテム
                    doc.setFontSize(10);
                    doc.setFont('helvetica', 'normal');
                    
                    items.forEach((item, index) => {
                        if (y > 270) {
                            doc.addPage();
                            y = 20;
                        }
                        
                        // チェックボックス風
                        doc.rect(17, y - 3, 3, 3);
                        
                        // アイテム名と数量
                        const text = item.ingredient_name + ' ... ' + item.quantity;
                        doc.text(text, 22, y);
                        
                        y += 5;
                    });
                    
                    y += 3; // カテゴリ間の余白
                });
                
                // フッター
                const pageCount = doc.internal.getNumberOfPages();
                for (let i = 1; i <= pageCount; i++) {
                    doc.setPage(i);
                    doc.setFontSize(8);
                    doc.setTextColor(150);
                    doc.text('AICHEFS - AI献立 買い物リスト', 105, 287, { align: 'center' });
                    doc.text('Page ' + i + ' of ' + pageCount, 195, 287, { align: 'right' });
                }
                
                // ダウンロード
                const filename = 'aichef_shopping_' + new Date().toISOString().split('T')[0] + '.pdf';
                doc.save(filename);
                
                // 成功メッセージ
                document.body.removeChild(loadingToast);
                const successToast = document.createElement('div');
                successToast.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg z-50 flex items-center gap-3';
                successToast.innerHTML = '<i class="fas fa-check-circle"></i><span>買い物リストPDFをダウンロードしました！</span>';
                document.body.appendChild(successToast);
                setTimeout(() => document.body.removeChild(successToast), 3000);
                
            } catch (error) {
                console.error('買い物リストPDF生成エラー:', error);
                document.body.removeChild(loadingToast);
                alert('PDFの生成に失敗しました。もう一度お試しください。');
            }
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
                // localStorageにも保存
                localStorage.setItem('current_plan_id', planId);
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
                    // ローディングを削除（即座に完了したように見せる）
                    loadingToast.remove();
                    
                    // バックグラウンドでサーバーに送信
                    const res = await axios.post('/api/plans/swap-days', {
                        plan_id: appState.planId || localStorage.getItem('current_plan_id'),
                        day1_id: draggedData.planDayId,
                        day2_id: targetData.planDayId
                    });
                    
                    if (res.data.success) {
                        // 成功したら全体を再読み込みして表示を更新
                        const currentPlanId = appState.planId || localStorage.getItem('current_plan_id');
                        const planRes = await axios.get('/api/plans/' + currentPlanId);
                        calendarData = planRes.data.days;
                        
                        // デバッグ: 入れ替え後の日付を確認
                        console.log('🔄 献立入れ替え完了', {
                            draggedDayId: draggedData.planDayId,
                            targetDayId: targetData.planDayId,
                            updatedDays: calendarData.slice(0, 5).map(function(d) { 
                                return { 
                                    date: d.date, 
                                    recipes: d.recipes.map(function(r) { return r.title; }) 
                                }; 
                            })
                        });
                        if (currentViewMode === 'calendar') {
                            renderCalendarView(calendarData);
                        } else {
                            renderGridView(calendarData);
                        }
                        
                        // 成功メッセージ
                        const toast = document.createElement('div');
                        toast.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-bounce';
                        toast.innerHTML = '<i class="fas fa-check-circle mr-2"></i>✓ 献立を入れ替えました';
                        document.body.appendChild(toast);
                        setTimeout(() => toast.remove(), 2000);
                    } else {
                        alert('献立の入れ替えに失敗しました。もう一度お試しください。');
                    }
                } catch (error) {
                    console.error('献立の入れ替えエラー:', error);
                    // エラー時は全体を再読み込み
                    const planRes = await axios.get(\`/api/plans/\${appState.planId || localStorage.getItem('current_plan_id')}\`);
                    calendarData = planRes.data.days;
                    if (currentViewMode === 'calendar') {
                        renderCalendarView(calendarData);
                    } else {
                        renderGridView(calendarData);
                    }
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
            // household_idとemailも個別に保存（献立作成などで使用）
            if (user.household_id) {
                localStorage.setItem('household_id', user.household_id);
            }
            if (user.email) {
                localStorage.setItem('email', user.email);
            }
        }
        
        // ログアウト
        function logout() {
            localStorage.removeItem('aichef_user');
            localStorage.removeItem('auth_token');
            localStorage.removeItem('household_id');
            localStorage.removeItem('email');
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
        
        // ダウンロードメニューの表示/非表示
        function toggleDownloadMenu() {
            const menu = document.getElementById('download-menu');
            menu.classList.toggle('hidden');
        }
        
        // メニュー外クリックで閉じる
        document.addEventListener('click', function(e) {
            const menu = document.getElementById('download-menu');
            const btn = e.target.closest('button');
            if (menu && !menu.contains(e.target) && (!btn || btn.textContent.indexOf('ダウンロード') === -1)) {
                menu.classList.add('hidden');
            }
        });
        
        // PDF生成関数
        async function downloadAsPDF() {
            if (!calendarData || calendarData.length === 0) {
                alert('献立データがありません');
                return;
            }
            
            // メニューを閉じる
            document.getElementById('download-menu').classList.add('hidden');
            
            // ローディング表示
            const loadingToast = document.createElement('div');
            loadingToast.className = 'fixed top-4 right-4 bg-blue-500 text-white px-6 py-4 rounded-lg shadow-lg z-50 flex items-center gap-3';
            loadingToast.innerHTML = '<div class="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div><span>PDFを生成中...</span>';
            document.body.appendChild(loadingToast);
            
            try {
                const { jsPDF } = window.jspdf;
                const doc = new jsPDF({
                    orientation: 'portrait',
                    unit: 'mm',
                    format: 'a4'
                });
                
                // 日本語フォント設定（簡易版 - ブラウザのデフォルトフォント使用）
                doc.setFont('helvetica');
                
                // タイトル
                const title = document.getElementById('plan-title').textContent || '献立カレンダー';
                doc.setFontSize(20);
                doc.text(title, 105, 20, { align: 'center' });
                
                // 作成日
                const today = new Date().toLocaleDateString('ja-JP');
                doc.setFontSize(10);
                doc.text('作成日: ' + today, 105, 28, { align: 'center' });
                
                // 献立一覧
                let y = 40;
                doc.setFontSize(12);
                
                calendarData.forEach((day, index) => {
                    // ページ分割チェック
                    if (y > 260) {
                        doc.addPage();
                        y = 20;
                    }
                    
                    // 日付
                    const date = new Date(day.date).toLocaleDateString('ja-JP', { 
                        month: 'long', 
                        day: 'numeric',
                        weekday: 'short'
                    });
                    doc.setFontSize(11);
                    doc.setFont('helvetica', 'bold');
                    doc.text(date, 15, y);
                    
                    // レシピ
                    doc.setFont('helvetica', 'normal');
                    doc.setFontSize(10);
                    
                    const mainTitle = (day.main && day.main.title) || '未定';
                    const sideTitle = (day.side && day.side.title) || '未定';
                    const soupTitle = (day.soup && day.soup.title) || '未定';
                    
                    doc.text('主菜: ' + mainTitle, 20, y + 5);
                    doc.text('副菜: ' + sideTitle, 20, y + 10);
                    doc.text('汁物: ' + soupTitle, 20, y + 15);
                    
                    // 区切り線
                    doc.setDrawColor(200, 200, 200);
                    doc.line(15, y + 18, 195, y + 18);
                    
                    y += 23;
                });
                
                // フッター
                const pageCount = doc.internal.getNumberOfPages();
                for (let i = 1; i <= pageCount; i++) {
                    doc.setPage(i);
                    doc.setFontSize(8);
                    doc.setTextColor(150);
                    doc.text('AICHEFS - AI献立カレンダー', 105, 287, { align: 'center' });
                    doc.text('Page ' + i + ' of ' + pageCount, 195, 287, { align: 'right' });
                }
                
                // ダウンロード
                const filename = 'aichef_menu_' + new Date().toISOString().split('T')[0] + '.pdf';
                doc.save(filename);
                
                // 成功メッセージ
                document.body.removeChild(loadingToast);
                const successToast = document.createElement('div');
                successToast.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg z-50 flex items-center gap-3';
                successToast.innerHTML = '<i class="fas fa-check-circle"></i><span>PDFをダウンロードしました！</span>';
                document.body.appendChild(successToast);
                setTimeout(() => document.body.removeChild(successToast), 3000);
                
            } catch (error) {
                console.error('PDF生成エラー:', error);
                document.body.removeChild(loadingToast);
                alert('PDFの生成に失敗しました。もう一度お試しください。');
            }
        }
        
        window.printShoppingList = printShoppingList;
        window.downloadShoppingListPDF = downloadShoppingListPDF;
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
        window.downloadAsPDF = downloadAsPDF;
        window.toggleDownloadMenu = toggleDownloadMenu;
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
            // ログイン状態を確認
            const authToken = localStorage.getItem('auth_token');
            if (authToken) {
                // ログイン済みの場合、メールアドレスはDB登録済みなのでスキップ
                console.log('✅ ログイン済みユーザー - メール質問をスキップ');
                appState.email = 'logged_in_user';  // メール質問をスキップするフラグ
            }
            
            const question = questions[0];
            const messageText = typeof question.text === 'function' ? question.text(appState.data) : question.text;
            addMessage(messageText);
            showInput(question);
            
            // TOPページの広告を読み込み
            loadAds('top_page');
            
            // 会員登録フォーム送信
            const authForm = document.getElementById('auth-form');
            if (authForm) {
                authForm.addEventListener('submit', async (e) => {
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
                    
                    if (!email || !password || (!isLogin && !name)) {
                        errorDiv.classList.remove('hidden');
                        errorText.textContent = '必須項目を入力してください';
                        return;
                    }
                    
                    try {
                        // API呼び出し
                        const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
                        const payload = isLogin ? 
                            { email, password } : 
                            { name, email, password };
                        
                        const response = await fetch(endpoint, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(payload)
                        });
                        
                        const data = await response.json();
                        
                        if (data.success || response.ok) {
                            // トークンまたはセッションIDを保存
                            if (data.session_id) {
                                localStorage.setItem('auth_token', data.session_id);
                            }
                            
                            // ユーザー情報を保存
                            if (data.user) {
                                saveUser(data.user);
                            } else if (data.household_id) {
                                // 会員登録の場合
                                const user = {
                                    household_id: data.household_id,
                                    name: name,
                                    email: email
                                };
                                saveUser(user);
                                localStorage.setItem('auth_token', data.household_id); // 仮トークン
                            }
                            
                            // エラーをクリア
                            errorDiv.classList.add('hidden');
                            
                            // モーダルを閉じる
                            closeAuthModal();
                            
                            // 成功メッセージとリダイレクト
                            if (isLogin) {
                                console.log('ログイン成功');
                                // ログイン成功後はダッシュボードへリダイレクト
                                setTimeout(() => {
                                    window.location.href = '/dashboard';
                                }, 500);
                            } else {
                                alert('会員登録が完了しました！');
                                // 会員登録後もダッシュボードへリダイレクト
                                setTimeout(() => {
                                    window.location.href = '/dashboard';
                                }, 1000);
                            }
                        } else {
                            errorDiv.classList.remove('hidden');
                            errorText.textContent = data.error || '処理に失敗しました';
                        }
                    } catch (error) {
                        console.error('認証エラー:', error);
                        errorDiv.classList.remove('hidden');
                        errorText.textContent = 'ネットワークエラーが発生しました';
                    }
                });
            }
            
            // イベントデリゲーション設定
            // レシピリンクのクリックイベント（モバイル対応）
            document.addEventListener('click', (e) => {
                const target = e.target;
                const recipeLink = target.closest('.recipe-link');
                if (recipeLink) {
                    e.preventDefault();
                    e.stopPropagation();  // イベント伝播を停止
                    const recipeId = recipeLink.getAttribute('data-recipe-id');
                    const recipeTitle = recipeLink.getAttribute('data-recipe-title');
                    if (recipeId && recipeTitle) {
                        showRecipeDetail(recipeId, recipeTitle);
                    }
                }
                
                // タッチイベントでも同様に処理（モバイル対応）
                if (e.type === 'touchend' && recipeLink) {
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
            });
            
            // モバイル専用: タッチイベントリスナー
            document.addEventListener('touchend', (e) => {
                const target = e.target;
                const recipeLink = target.closest('.recipe-link');
                if (recipeLink) {
                    e.preventDefault();
                    e.stopPropagation();
                    const recipeId = recipeLink.getAttribute('data-recipe-id');
                    const recipeTitle = recipeLink.getAttribute('data-recipe-title');
                    if (recipeId && recipeTitle) {
                        console.log('📱 モバイルタッチ: レシピ表示', recipeId, recipeTitle);
                        showRecipeDetail(recipeId, recipeTitle);
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
app.use('/payment/*', serveStatic({ root: './public' }))

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

  // ページルート（HTMLを直接返す）
  if (pathname === "/about" || pathname === "/about.html") {
    return new Response(ABOUT_HTML, {
      headers: { 'content-type': 'text/html; charset=utf-8' }
    });
  }
  if (pathname === "/pricing" || pathname === "/pricing.html") {
    return new Response(PRICING_HTML, {
      headers: { 'content-type': 'text/html; charset=utf-8' }
    });
  }
  if (pathname === "/legal" || pathname === "/legal.html") {
    return new Response(LEGAL_HTML, {
      headers: { 'content-type': 'text/html; charset=utf-8' }
    });
  }

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
    
    // budget_distributionはaverage/swing/customのみ許可
    // オブジェクトが渡された場合は'custom'として扱う
    const budgetDistribution = typeof body.budget_distribution === 'object' 
      ? 'custom'
      : (body.budget_distribution as string) || 'average';
    
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
      console.log('=== 献立生成API開始 ===');
      const body = await readJson(req);
      console.log('リクエストボディ:', JSON.stringify(body, null, 2));
      
      if (!body.household_id) return badRequest("household_id is required");

      console.log('[Step 1] household_id:', body.household_id);
      
      const household = await env.DB.prepare(
        `SELECT * FROM households WHERE household_id = ?`
      ).bind(body.household_id).first() as any;
      
      console.log('[Step 2] household取得結果:', household ? 'あり' : 'なし');
      if (!household) return badRequest("household not found");

      const plan_id = uuid();
      const menu_variety = body.menu_variety || 'balanced';
      const supervisor_mode = body.supervisor_mode || 'general';
      
      console.log('[Step 3] plan_id:', plan_id);
      console.log('[Step 3] menu_variety:', menu_variety);
      console.log('[Step 3] supervisor_mode:', supervisor_mode);
      
      // 期間計算（plan_daysを使用、なければmonthsから計算）
      const planDays = body.plan_days || (household.months * 30);
      console.log('[Step 4] 期間計算開始 - start_date:', household.start_date, 'plan_days:', planDays);
      
      const period = buildPeriodByDays(household.start_date, planDays);
      console.log('[Step 5] 期間計算完了 - 日数:', period.dates.length);
      
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
        // 和食中心：和食レシピ優先
        supervisorFilter = "AND cuisine = 'japanese'";
        break;
      case 'western':
        // 洋食中心：洋食レシピ優先
        supervisorFilter = "AND cuisine = 'western'";
        break;
      case 'chinese':
        // 中華好き：中華レシピ優先
        supervisorFilter = "AND cuisine = 'chinese'";
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
    console.log('[Step 6] combinedFilter:', combinedFilter);
    
    // 全レシピをランダム順に取得（人気度を無視）
    // ✅ 改善委員会決定：人気度順ではなく完全ランダム化で多様性を確保
    console.log('[Step 7] レシピ取得開始（完全ランダム順）');
    
    let mainRecipes, sideRecipes, soupRecipes;
    try {
      const allMainRecipes = await env.DB.prepare(
        `SELECT * FROM recipes WHERE role='main' AND popularity >= 5 ${combinedFilter} ORDER BY RANDOM()`
      ).all();
      
      const allSideRecipes = await env.DB.prepare(
        `SELECT * FROM recipes WHERE role='side' AND popularity >= 5 ${combinedFilter} ORDER BY RANDOM()`
      ).all();
      
      const allSoupRecipes = await env.DB.prepare(
        `SELECT * FROM recipes WHERE role='soup' AND popularity >= 5 ${combinedFilter} ORDER BY RANDOM()`
      ).all();

      mainRecipes = (allMainRecipes.results ?? []) as any[];
      sideRecipes = (allSideRecipes.results ?? []) as any[];
      soupRecipes = (allSoupRecipes.results ?? []) as any[];
      
      console.log('[Step 8] 取得レシピ数 - main:', mainRecipes.length, 'side:', sideRecipes.length, 'soup:', soupRecipes.length);
    } catch (recipeError) {
      console.error('[ERROR] レシピ取得エラー:', recipeError);
      throw recipeError;
    }
    
    // 🚨 嫌いな食材・アレルギーのフィルタリング
    console.log('[Step 9] === 嫌いな食材・アレルギーフィルタリング開始 ===');
    
    // household の嫌いな食材とアレルギーを取得
    const dislikesJson = household.dislikes_json || '[]';
    const allergiesStandardJson = household.allergies_standard_json || '[]';
    const dislikes = JSON.parse(dislikesJson);
    const allergiesStandard = JSON.parse(allergiesStandardJson);
    
    // 子供のdislikes/allergiesを統合
    const children = await env.DB.prepare(`
      SELECT dislikes_json, allergies_json
      FROM children_profiles
      WHERE household_id = ?
    `).bind(body.household_id).all();
    
    // 子供の嫌いなものとアレルギーを家族全体に統合
    if (children.results && children.results.length > 0) {
      for (const child of children.results) {
        const childDislikes = JSON.parse((child as any).dislikes_json || '[]');
        const childAllergies = JSON.parse((child as any).allergies_json || '[]');
        
        // 重複を避けて追加
        childDislikes.forEach((dislike: string) => {
          if (!dislikes.includes(dislike)) {
            dislikes.push(dislike);
          }
        });
        
        childAllergies.forEach((allergy: string) => {
          if (!allergiesStandard.includes(allergy)) {
            allergiesStandard.push(allergy);
          }
        });
      }
    }
    
    console.log('[Step 10] 嫌いな食材（家族全体+子供）:', dislikes);
    console.log('[Step 10] アレルギー（家族全体+子供）:', allergiesStandard);
    
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
      
      // レシピが空の場合は早期リターン
      if (recipes.length === 0) {
        console.log('レシピが0件のためフィルタリングスキップ');
        return recipes;
      }
      
      // 🚀 Step 1: 全レシピの食材を一括取得（N+1問題を解決 + SQLite変数制限対応）
      const recipeIds = recipes.map(r => r.recipe_id);
      
      // SQLiteの変数制限（999個）を考慮して100件ずつ分割
      const chunkSize = 100;
      const chunks = [];
      for (let i = 0; i < recipeIds.length; i += chunkSize) {
        chunks.push(recipeIds.slice(i, i + chunkSize));
      }
      
      // 全チャンクの食材を取得
      const allIngredientsResults: any[] = [];
      for (const chunk of chunks) {
        const query = `
          SELECT recipe_id, ingredient_id 
          FROM recipe_ingredients 
          WHERE recipe_id IN (${chunk.map(() => '?').join(',')})
        `;
        const result = await env.DB.prepare(query).bind(...chunk).all();
        allIngredientsResults.push(...(result.results || []));
      }
      
      // レシピIDごとの食材IDマップを作成
      const recipeIngredientsMap = new Map<string, string[]>();
      for (const ing of allIngredientsResults) {
        const recipeId = (ing as any).recipe_id;
        const ingredientId = (ing as any).ingredient_id;
        if (!recipeIngredientsMap.has(recipeId)) {
          recipeIngredientsMap.set(recipeId, []);
        }
        recipeIngredientsMap.get(recipeId)!.push(ingredientId);
      }
      
      const filteredRecipes = [];
      
      for (const recipe of recipes) {
        // 🐟 primary_proteinベースのフィルタリング（魚嫌い・魚アレルギー対応）
        if ((dislikes.includes('fish') || allergiesStandard.includes('fish')) && recipe.primary_protein === 'fish') {
          console.log(`除外: ${recipe.title} (primary_protein=fish - 魚嫌い/アレルギー)`);
          continue;
        }
        
        // 🐟 タイトルベースの魚フィルタリング（primary_proteinが"other"の魚料理対応）
        // ✅ 改善委員会決定：シーフード系の完全除外キーワードリスト
        const fishKeywords = [
          '鮭', 'サバ', 'アジ', 'サンマ', 'ブリ', 'タラ', '魚', '白身魚', 
          'シーフード', '海鮮', 'まぐろ', 'マグロ', 'いわし', 'イワシ', 
          'かつお', 'カツオ', 'さんま', 'ぶり', 'たら', 'サーモン',
          '魚介', '魚卵', 'イクラ', 'タラコ', '明太子', 
          'かつお節', 'だし', '魚醤', 'ナンプラー',
          '海老', 'エビ', 'カニ', '蟹', 'イカ', 'タコ',
          '貝', 'ホタテ', 'アサリ', 'シジミ', '牡蠣'
        ];
        if ((dislikes.includes('fish') || allergiesStandard.includes('fish')) && fishKeywords.some(keyword => recipe.title.includes(keyword))) {
          console.log(`除外: ${recipe.title} (タイトルに魚名/シーフード - 魚嫌い/アレルギー)`);
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
        
        // 🐙 イカ・タコ嫌い・アレルギー対応
        if ((dislikes.includes('squid') || dislikes.includes('octopus') || 
             allergiesStandard.includes('squid') || allergiesStandard.includes('octopus')) && 
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
        
        // 🫘 内臓嫌い・アレルギー対応
        if ((dislikes.includes('offal') || allergiesStandard.includes('offal')) && 
            (recipe.title.includes('レバー') || recipe.title.includes('ホルモン') || 
             recipe.title.includes('ハツ') || recipe.title.includes('砂肝'))) {
          console.log(`除外: ${recipe.title} (内臓料理)`);
          continue;
        }
        
        // 🌶️ 辛い料理除外対応（dislikes_jsonに'spicy'が含まれる場合）
        const spicyKeywords = [
          '麻婆', 'マーボー', 'キムチ', 'カレー', '担々', 'タンタン', 
          '激辛', '辛口', '唐辛子', 'ピリ辛', '四川', '韓国', 
          'チリ', 'ハバネロ', 'ジャーク', 'ラー油', '豆板醤'
        ];
        if (dislikes.includes('spicy') && spicyKeywords.some(keyword => recipe.title.includes(keyword))) {
          console.log(`除外: ${recipe.title} (辛い料理)`);
          continue;
        }
        
        // 🍖 肉嫌い対応（primary_proteinベース + タイトルベース）
        // 全肉嫌い
        if (dislikes.includes('meat')) {
          if (['chicken', 'pork', 'beef'].includes(recipe.primary_protein)) {
            console.log(`除外: ${recipe.title} (肉嫌い - primary_protein=${recipe.primary_protein})`);
            continue;
          }
          // タイトルベースで肉を除外
          const meatKeywords = ['肉', '豚', '牛', '鶏', 'チキン', 'ポーク', 'ビーフ', '焼肉', 'ステーキ', 'ハンバーグ', '唐揚げ', 'から揚げ', '生姜焼き', 'しょうが焼き', '照り焼き'];
          if (meatKeywords.some(keyword => recipe.title.includes(keyword))) {
            console.log(`除外: ${recipe.title} (肉嫌い - タイトルに肉関連キーワード)`);
            continue;
          }
        }
        
        // 豚肉嫌い
        if (dislikes.includes('pork') && (recipe.primary_protein === 'pork' || recipe.title.includes('豚'))) {
          console.log(`除外: ${recipe.title} (豚肉嫌い)`);
          continue;
        }
        
        // 牛肉嫌い
        if (dislikes.includes('beef') && (recipe.primary_protein === 'beef' || recipe.title.includes('牛'))) {
          console.log(`除外: ${recipe.title} (牛肉嫌い)`);
          continue;
        }
        
        // 鶏肉嫌い
        if (dislikes.includes('chicken') && (recipe.primary_protein === 'chicken' || recipe.title.includes('鶏') || recipe.title.includes('チキン'))) {
          console.log(`除外: ${recipe.title} (鶏肉嫌い)`);
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
    
    // 直近N日間の重複をチェックして選択（厳格版 + タイトル重複チェック + 全期間重複最小化）
    // ✅ 改善委員会決定：重複を最小化するため、全期間でのレシピ使用状況を管理（デフォルト10日間）
    const selectRecipeWithoutRecent = (recipes: any[], recentRecipes: any[], minDays: number = 10) => {
      // 直近minDays日間に使われていないレシピIDをチェック
      const recentIds = recentRecipes.slice(-minDays).map(r => r?.recipe_id);
      // 直近minDays日間に使われていないタイトルもチェック（重複レシピ対策）
      const recentTitles = recentRecipes.slice(-minDays).map(r => r?.title);
      
      // 全期間での使用回数をカウント（重複最小化）
      const usageCount = new Map<string, number>();
      for (const r of recentRecipes) {
        if (r && r.recipe_id) {
          usageCount.set(r.recipe_id, (usageCount.get(r.recipe_id) || 0) + 1);
        }
      }
      
      let available = recipes.filter(r => 
        !recentIds.includes(r.recipe_id) && 
        !recentTitles.includes(r.title)  // タイトル重複もチェック
      );
      
      // 利用可能なレシピがない場合（簡略化版）
      if (available.length === 0) {
        // 使用回数が最も少ないレシピを選択（間隔条件を無視）
        let minUsage = Infinity;
        let leastUsedRecipes = [];
        for (const r of recipes) {
          const count = usageCount.get(r.recipe_id) || 0;
          if (count < minUsage) {
            minUsage = count;
            leastUsedRecipes = [r];
          } else if (count === minUsage) {
            leastUsedRecipes.push(r);
          }
        }
        return leastUsedRecipes[Math.floor(Math.random() * leastUsedRecipes.length)];
      }
      
      // 使用回数が少ないレシピを優先（同じ重複回数なら最近使われていないものを優先）
      available.sort((a, b) => {
        const countA = usageCount.get(a.recipe_id) || 0;
        const countB = usageCount.get(b.recipe_id) || 0;
        return countA - countB;
      });
      
      // 使用回数が最も少ないグループからランダム選択（多様性確保）
      const minUsageInAvailable = usageCount.get(available[0].recipe_id) || 0;
      const leastUsed = available.filter(r => (usageCount.get(r.recipe_id) || 0) === minUsageInAvailable);
      
      // ✅ 改善：popularity による重み付け選択（低い popularity は選ばれにくく）
      // popularity 3 → 重み 30%、popularity 5 → 重み 50%、popularity 8 → 重み 80%
      const weightedSelection = (recipes: any[]) => {
        const weights = recipes.map(r => (r.popularity || 5) * 10);
        const totalWeight = weights.reduce((sum, w) => sum + w, 0);
        let random = Math.random() * totalWeight;
        
        for (let i = 0; i < recipes.length; i++) {
          random -= weights[i];
          if (random <= 0) {
            return recipes[i];
          }
        }
        return recipes[recipes.length - 1];
      };
      
      return weightedSelection(leastUsed);
    };
    
    // カレー系のレシピ判定（より厳密に）
    const isCurryOrStew = (recipe: any) => {
      const curryKeywords = ['カレー', 'シチュー', 'ハヤシライス', 'ドリア', 'グラタン'];
      return curryKeywords.some(keyword => recipe.title?.includes(keyword));
    };
    
    // 同じカテゴリの連続を避ける関数（10日間厳守 + カレー系の10日間隔厳守 + タイトル重複防止 + 全期間重複最小化）
    // ✅ 改善委員会決定：カテゴリ多様性を最大化（デフォルト10日間）
    const avoidSameCategory = (recipes: any[], lastRecipe: any, recentRecipes: any[], minDays: number) => {
      const recentIds = recentRecipes.slice(-minDays).map(r => r?.recipe_id);
      const recentTitles = recentRecipes.slice(-minDays).map(r => r?.title);
      
      // 全期間での使用回数をカウント
      const usageCount = new Map<string, number>();
      for (const r of recentRecipes) {
        if (r && r.recipe_id) {
          usageCount.set(r.recipe_id, (usageCount.get(r.recipe_id) || 0) + 1);
        }
      }
      
      // 直近10日間に使われていないレシピ（IDとタイトル両方チェック）
      let available = recipes.filter(r => 
        !recentIds.includes(r.recipe_id) && 
        !recentTitles.includes(r.title)  // タイトル重複もチェック
      );
      
      // カレー系のレシピIDを直近10日間から抽出
      const recentCurryIds = recentRecipes.slice(-minDays)
        .filter(r => r && isCurryOrStew(r))
        .map(r => r.recipe_id);
      
      // カレー系を選択する場合は、直近10日間にカレー系がないかチェック
      available = available.filter(r => {
        if (isCurryOrStew(r)) {
          // このレシピがカレー系の場合、直近10日間にカレー系がないことを確認
          return recentCurryIds.length === 0;
        }
        return true;
      });
      
      // 直前がカレー系の場合、さらにカレー系を除外（連続防止）
      if (lastRecipe && isCurryOrStew(lastRecipe)) {
        available = available.filter(r => !isCurryOrStew(r));
      }
      
      // 利用可能なレシピがない場合（簡略化版）
      if (available.length === 0) {
        // 間隔条件を無視して、使用回数が最も少ないレシピを選択
        let minUsage = Infinity;
        let leastUsedRecipes = [];
        for (const r of recipes) {
          if (isCurryOrStew(r)) continue; // カレー系だけは避ける
          const count = usageCount.get(r.recipe_id) || 0;
          if (count < minUsage) {
            minUsage = count;
            leastUsedRecipes = [r];
          } else if (count === minUsage) {
            leastUsedRecipes.push(r);
          }
        }
        if (leastUsedRecipes.length === 0) {
          // カレー系を含めて選択
          leastUsedRecipes = recipes;
        }
        return leastUsedRecipes[Math.floor(Math.random() * leastUsedRecipes.length)];
      }
      
      // 使用回数が少ないレシピを優先
      available.sort((a, b) => {
        const countA = usageCount.get(a.recipe_id) || 0;
        const countB = usageCount.get(b.recipe_id) || 0;
        return countA - countB;
      });
      
      // 使用回数が最も少ないグループからランダム選択
      const minUsageInAvailable = usageCount.get(available[0].recipe_id) || 0;
      const leastUsed = available.filter(r => (usageCount.get(r.recipe_id) || 0) === minUsageInAvailable);
      
      // ✅ 改善：popularity による重み付け選択（低い popularity は選ばれにくく）
      const weightedSelection = (recipes: any[]) => {
        const weights = recipes.map(r => (r.popularity || 5) * 10);
        const totalWeight = weights.reduce((sum, w) => sum + w, 0);
        let random = Math.random() * totalWeight;
        
        for (let i = 0; i < recipes.length; i++) {
          random -= weights[i];
          if (random <= 0) {
            return recipes[i];
          }
        }
        return recipes[recipes.length - 1];
      };
      
      return weightedSelection(leastUsed);
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
      
      // ✅ 改善委員会決定：重複間隔を10日間に設定（30日で最大3回）
      // 重複を避けてレシピを選択（カレー系の連続も避ける）
      const lastMain = usedMainRecipes.length > 0 ? usedMainRecipes[usedMainRecipes.length - 1] : null;
      const main = avoidSameCategory(shuffledMainRecipes, lastMain, usedMainRecipes, 10);
      const side = selectRecipeWithoutRecent(shuffledSideRecipes, usedSideRecipes, 10);
      
      // カレー系の場合は汁物をサラダ系に変更
      let soup;
      if (isCurryOrStew(main)) {
        // サラダ系の副菜を汁物として使用
        const saladRecipes = shuffledSideRecipes.filter(r => 
          r.title?.includes('サラダ') || r.title?.includes('和え')
        );
        soup = saladRecipes.length > 0 
          ? selectRecipeWithoutRecent(saladRecipes, usedSoupRecipes, 10)
          : selectRecipeWithoutRecent(shuffledSoupRecipes, usedSoupRecipes, 10);
      } else {
        soup = selectRecipeWithoutRecent(shuffledSoupRecipes, usedSoupRecipes, 10);
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
  // プロフィールAPI
  // ========================================

  // GET /api/profile - プロフィール取得
  if (pathname === "/api/profile" && req.method === "GET") {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return json({ error: 'Unauthorized' }, 401);
    }

    const token = authHeader.substring(7);
    
    // トークンからhousehold_idを取得（簡易実装：tokenがhousehold_idそのもの）
    const household_id = token;

    // household情報を取得
    const household = await env.DB.prepare(`
      SELECT 
        household_id,
        title,
        email,
        members_count,
        budget_tier_per_person,
        cooking_time_limit_min,
        children_ages_json,
        dislikes_json,
        allergies_standard_json,
        created_at
      FROM households
      WHERE household_id = ?
    `).bind(household_id).first();

    if (!household) {
      return json({ error: 'Household not found' }, 404);
    }

    return json(household);
  }

  // PUT /api/profile/update - プロフィール更新
  if (pathname === "/api/profile/update" && req.method === "PUT") {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return json({ error: 'Unauthorized' }, 401);
    }

    const token = authHeader.substring(7);
    const household_id = token;

    const body = await readJson(req);
    const {
      email,
      title,
      members_count,
      budget_tier_per_person,
      cooking_time_limit_min,
      children_ages_json,
      dislikes_json,
      allergies_standard_json,
      new_password
    } = body;

    // バリデーション
    if (!email || !title || !members_count) {
      return json({ error: '必須項目を入力してください' }, 400);
    }

    // パスワード変更がある場合はハッシュ化
    let password_hash = null;
    if (new_password) {
      // SHA-256でハッシュ化（簡易実装）
      const encoder = new TextEncoder();
      const data = encoder.encode(new_password);
      const hashBuffer = await crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      password_hash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }

    // プロフィール更新
    try {
      if (password_hash) {
        // パスワード変更あり
        await env.DB.prepare(`
          UPDATE households
          SET 
            email = ?,
            title = ?,
            members_count = ?,
            budget_tier_per_person = ?,
            cooking_time_limit_min = ?,
            children_ages_json = ?,
            dislikes_json = ?,
            allergies_standard_json = ?,
            password_hash = ?,
            updated_at = datetime('now')
          WHERE household_id = ?
        `).bind(
          email,
          title,
          members_count,
          budget_tier_per_person,
          cooking_time_limit_min,
          children_ages_json || '[]',
          dislikes_json || '[]',
          allergies_standard_json || '[]',
          password_hash,
          household_id
        ).run();
      } else {
        // パスワード変更なし
        await env.DB.prepare(`
          UPDATE households
          SET 
            email = ?,
            title = ?,
            members_count = ?,
            budget_tier_per_person = ?,
            cooking_time_limit_min = ?,
            children_ages_json = ?,
            dislikes_json = ?,
            allergies_standard_json = ?,
            updated_at = datetime('now')
          WHERE household_id = ?
        `).bind(
          email,
          title,
          members_count,
          budget_tier_per_person,
          cooking_time_limit_min,
          children_ages_json || '[]',
          dislikes_json || '[]',
          allergies_standard_json || '[]',
          household_id
        ).run();
      }

      return json({ 
        success: true, 
        message: 'プロフィールを更新しました'
      });

    } catch (error: any) {
      console.error('プロフィール更新エラー:', error);
      return json({ error: 'プロフィールの更新に失敗しました' }, 500);
    }
  }

  // ========================================
  // 子供プロフィールAPI
  // ========================================

  // GET /api/children - 子供プロフィール一覧取得
  if (pathname === "/api/children" && req.method === "GET") {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return json({ error: 'Unauthorized' }, 401);
    }

    const token = authHeader.substring(7);
    const household_id = token;

    const children = await env.DB.prepare(`
      SELECT child_id, household_id, name, age, dislikes_json, allergies_json, notes, created_at, updated_at
      FROM children_profiles
      WHERE household_id = ?
      ORDER BY age ASC
    `).bind(household_id).all();

    return json({ children: children.results || [] });
  }

  // POST /api/children - 子供プロフィール作成
  if (pathname === "/api/children" && req.method === "POST") {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return json({ error: 'Unauthorized' }, 401);
    }

    const token = authHeader.substring(7);
    const household_id = token;

    const body = await readJson(req);
    const { name, age, dislikes_json, allergies_json, notes } = body;

    if (!name || age === undefined) {
      return badRequest('名前と年齢は必須です');
    }

    const child_id = uuid();

    await env.DB.prepare(`
      INSERT INTO children_profiles (
        child_id, household_id, name, age, dislikes_json, allergies_json, notes, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `).bind(
      child_id,
      household_id,
      name,
      age,
      dislikes_json || '[]',
      allergies_json || '[]',
      notes || ''
    ).run();

    return json({ 
      success: true, 
      child_id,
      message: '子供のプロフィールを作成しました'
    });
  }

  // PUT /api/children/:child_id - 子供プロフィール更新
  if (pathname.startsWith("/api/children/") && req.method === "PUT") {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return json({ error: 'Unauthorized' }, 401);
    }

    const token = authHeader.substring(7);
    const household_id = token;
    const child_id = pathname.split('/')[3];

    const body = await readJson(req);
    const { name, age, dislikes_json, allergies_json, notes } = body;

    // 権限チェック（自分の家族の子供のみ編集可能）
    const child = await env.DB.prepare(`
      SELECT child_id FROM children_profiles WHERE child_id = ? AND household_id = ?
    `).bind(child_id, household_id).first();

    if (!child) {
      return json({ error: 'Child not found or unauthorized' }, 404);
    }

    await env.DB.prepare(`
      UPDATE children_profiles
      SET name = ?, age = ?, dislikes_json = ?, allergies_json = ?, notes = ?, updated_at = CURRENT_TIMESTAMP
      WHERE child_id = ?
    `).bind(
      name,
      age,
      dislikes_json || '[]',
      allergies_json || '[]',
      notes || '',
      child_id
    ).run();

    return json({ 
      success: true, 
      message: '子供のプロフィールを更新しました'
    });
  }

  // DELETE /api/children/:child_id - 子供プロフィール削除
  if (pathname.startsWith("/api/children/") && req.method === "DELETE") {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return json({ error: 'Unauthorized' }, 401);
    }

    const token = authHeader.substring(7);
    const household_id = token;
    const child_id = pathname.split('/')[3];

    // 権限チェック
    const child = await env.DB.prepare(`
      SELECT child_id FROM children_profiles WHERE child_id = ? AND household_id = ?
    `).bind(child_id, household_id).first();

    if (!child) {
      return json({ error: 'Child not found or unauthorized' }, 404);
    }

    await env.DB.prepare(`
      DELETE FROM children_profiles WHERE child_id = ?
    `).bind(child_id).run();

    return json({ 
      success: true, 
      message: '子供のプロフィールを削除しました'
    });
  }

  // ========================================
  // 献立履歴・お気に入りAPI
  // ========================================

  // GET /api/plans/history - 献立履歴一覧取得
  if (pathname === "/api/plans/history" && req.method === "GET") {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return json({ error: 'Unauthorized' }, 401);
    }

    const token = authHeader.substring(7);
    const household_id = token;

    // ページネーション
    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '10');
    const offset = (page - 1) * limit;

    // 献立履歴を取得（新しい順）
    const plans = await env.DB.prepare(`
      SELECT 
        plan_id,
        household_id,
        start_date,
        months,
        created_at
      FROM meal_plan_history
      WHERE household_id = ?
      ORDER BY created_at DESC
      LIMIT ? OFFSET ?
    `).bind(household_id, limit, offset).all();

    // 総数を取得
    const countResult = await env.DB.prepare(`
      SELECT COUNT(*) as total
      FROM meal_plan_history
      WHERE household_id = ?
    `).bind(household_id).first();

    const total = countResult?.total || 0;

    return json({
      plans: plans.results || [],
      pagination: {
        page,
        limit,
        total,
        total_pages: Math.ceil(total / limit)
      }
    });
  }

  // GET /api/plans/:plan_id/details - 献立詳細取得
  if (pathname.startsWith("/api/plans/") && pathname.endsWith("/details") && req.method === "GET") {
    const plan_id = pathname.split('/')[3];

    // 献立の基本情報を取得
    const plan = await env.DB.prepare(`
      SELECT 
        plan_id,
        household_id,
        start_date,
        months,
        created_at
      FROM meal_plan_history
      WHERE plan_id = ?
    `).bind(plan_id).first();

    if (!plan) {
      return json({ error: 'Plan not found' }, 404);
    }

    // 献立の日別詳細を取得
    const days = await env.DB.prepare(`
      SELECT 
        pd.plan_day_id,
        pd.date,
        pd.estimated_time_min,
        pd.estimated_cost_tier,
        r.recipe_id,
        r.title,
        r.role,
        r.cuisine,
        r.difficulty,
        r.time_min,
        r.primary_protein,
        r.cost_tier
      FROM plan_days pd
      LEFT JOIN recipes r ON pd.main_recipe_id = r.recipe_id 
        OR pd.side_recipe_id = r.recipe_id 
        OR pd.soup_recipe_id = r.recipe_id
      WHERE pd.plan_id = ?
      ORDER BY pd.date ASC
    `).bind(plan_id).all();

    return json({
      plan,
      days: days.results || []
    });
  }

  // GET /api/favorites/list - お気に入りレシピ一覧
  if (pathname === "/api/favorites/list" && req.method === "GET") {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return json({ error: 'Unauthorized' }, 401);
    }

    const token = authHeader.substring(7);
    const household_id = token;

    // カテゴリーフィルター
    const url = new URL(req.url);
    const role = url.searchParams.get('role'); // 'main', 'side', 'soup' or null (all)

    let query = `
      SELECT 
        f.favorite_id,
        f.recipe_id,
        f.created_at,
        r.title,
        r.role,
        r.cuisine,
        r.difficulty,
        r.time_min,
        r.primary_protein,
        r.cost_tier,
        r.child_friendly_score
      FROM favorite_recipes f
      INNER JOIN recipes r ON f.recipe_id = r.recipe_id
      WHERE f.household_id = ?
    `;

    const bindings: any[] = [household_id];

    if (role) {
      query += ` AND r.role = ?`;
      bindings.push(role);
    }

    query += ` ORDER BY f.created_at DESC`;

    const favorites = await env.DB.prepare(query).bind(...bindings).all();

    return json({
      favorites: favorites.results || [],
      total: favorites.results?.length || 0
    });
  }

  // DELETE /api/favorites/:recipe_id - お気に入り削除
  if (pathname.startsWith("/api/favorites/") && req.method === "DELETE") {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return json({ error: 'Unauthorized' }, 401);
    }

    const token = authHeader.substring(7);
    const household_id = token;
    const recipe_id = pathname.split('/')[3];

    await env.DB.prepare(`
      DELETE FROM favorite_recipes
      WHERE household_id = ? AND recipe_id = ?
    `).bind(household_id, recipe_id).run();

    return json({ success: true, message: 'お気に入りを削除しました' });
  }

  // ========================================
  // 寄付API（子ども食堂支援）
  // ========================================
  
  // POST /api/donations/create - 寄付を登録
  if (pathname === "/api/donations/create" && req.method === "POST") {
    const body = await readJson(req);
    
    // 必須フィールドのチェック
    if (!body.donor_name || !body.donor_email || !body.unit_count) {
      return badRequest("donor_name, donor_email, and unit_count are required");
    }
    
    // 口数の検証（1〜10口）
    if (body.unit_count < 1 || body.unit_count > 10) {
      return badRequest("unit_count must be between 1 and 10");
    }
    
    const donation_id = uuid();
    const certificate_id = uuid();
    const amount = body.unit_count * 300;
    
    // 証明書番号を生成（DC-2026-001 形式）
    const now = new Date();
    const year = now.getFullYear();
    
    // 今年の寄付件数を取得して証明書番号を生成
    const countResult = await env.DB.prepare(`
      SELECT COUNT(*) as count FROM donations
      WHERE strftime('%Y', created_at) = ?
    `).bind(year.toString()).first() as any;
    
    const nextNumber = (countResult?.count || 0) + 1;
    const certificate_number = `DC-${year}-${String(nextNumber).padStart(3, '0')}`;
    
    try {
      // 寄付を登録
      await env.DB.prepare(`
        INSERT INTO donations (
          donation_id, household_id, donor_name, donor_email, donor_phone,
          amount, unit_count, message, status, payment_method, payment_intent_id, is_public
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).bind(
        donation_id,
        body.household_id || null,
        body.donor_name,
        body.donor_email,
        body.donor_phone || null,
        amount,
        body.unit_count,
        body.message || null,
        'completed',
        body.payment_method || 'bank_transfer',
        body.payment_intent_id || null,
        body.is_public !== undefined ? body.is_public : 1
      ).run();
      
      // 証明書を発行
      await env.DB.prepare(`
        INSERT INTO donation_certificates (
          certificate_id, donation_id, certificate_number, issue_date
        ) VALUES (?, ?, ?, DATE('now'))
      `).bind(certificate_id, donation_id, certificate_number).run();
      
      return json({
        donation_id,
        certificate_id,
        certificate_number,
        amount,
        message: '寄付を受け付けました。ありがとうございます！'
      }, 201);
    } catch (error: any) {
      console.error('寄付登録エラー:', error);
      return new Response(JSON.stringify({
        error: '寄付の登録に失敗しました',
        details: error.message
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }
  
  // POST /api/donations/create-payment-intent - Stripe決済インテント作成
  if (pathname === "/api/donations/create-payment-intent" && req.method === "POST") {
    const body = await readJson(req);
    
    if (!body.unit_count || body.unit_count < 1 || body.unit_count > 10) {
      return badRequest("unit_count must be between 1 and 10");
    }
    
    const amount = body.unit_count * 300; // 1口300円
    
    try {
      // Stripe Payment Intentを作成
      const stripeResponse = await fetch('https://api.stripe.com/v1/payment_intents', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${env.STRIPE_SECRET_KEY}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          amount: (amount * 100).toString(), // 円→セント（Stripeは最小通貨単位）
          currency: 'jpy',
          'metadata[donor_name]': body.donor_name || '',
          'metadata[donor_email]': body.donor_email || '',
          'metadata[unit_count]': body.unit_count.toString(),
          'metadata[message]': body.message || '',
        }).toString(),
      });
      
      if (!stripeResponse.ok) {
        const errorData = await stripeResponse.json();
        console.error('Stripe API エラー:', errorData);
        return new Response(JSON.stringify({
          error: 'Stripe決済の作成に失敗しました',
          details: errorData
        }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      
      const paymentIntent = await stripeResponse.json();
      
      return json({
        clientSecret: paymentIntent.client_secret,
        amount: amount
      });
    } catch (error: any) {
      console.error('Payment Intent作成エラー:', error);
      return new Response(JSON.stringify({
        error: '決済の作成に失敗しました',
        details: error.message
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }
  
  // POST /api/donations/send-thank-you-email - 寄付完了メール送信
  if (pathname === "/api/donations/send-thank-you-email" && req.method === "POST") {
    const body = await readJson(req);
    
    if (!body.donor_email || !body.donor_name || !body.certificate_number || !body.amount) {
      return badRequest("donor_email, donor_name, certificate_number, and amount are required");
    }
    
    try {
      // Resendでメール送信
      const resendResponse = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'AICHEFS <noreply@aichefs.net>',
          to: [body.donor_email],
          subject: '【AICHEFS】ご寄付ありがとうございます',
          html: `
            <!DOCTYPE html>
            <html lang="ja">
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>ご寄付ありがとうございます</title>
            </head>
            <body style="font-family: 'Hiragino Sans', 'Hiragino Kaku Gothic ProN', 'Meiryo', sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb;">
              <div style="background-color: white; border-radius: 12px; padding: 40px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                <div style="text-align: center; margin-bottom: 30px;">
                  <h1 style="color: #667eea; font-size: 32px; margin: 0;">🍽️ AICHEFS</h1>
                  <p style="color: #6b7280; font-size: 16px; margin-top: 8px;">AI献立システム</p>
                </div>
                
                <h2 style="color: #1f2937; font-size: 24px; margin-bottom: 20px;">ご寄付ありがとうございます</h2>
                
                <p style="margin-bottom: 16px;">${body.donor_name} 様</p>
                
                <p style="margin-bottom: 20px;">
                  この度は、AICHEFSへのご寄付をいただき、誠にありがとうございます。<br>
                  皆様のご支援が、より良いサービスの提供につながります。
                </p>
                
                <div style="background-color: #f3f4f6; border-radius: 8px; padding: 20px; margin: 30px 0;">
                  <h3 style="color: #374151; font-size: 18px; margin-top: 0; margin-bottom: 16px;">📋 寄付詳細</h3>
                  <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                      <td style="padding: 8px 0; color: #6b7280;">証明書番号</td>
                      <td style="padding: 8px 0; font-weight: bold;">${body.certificate_number}</td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0; color: #6b7280;">寄付金額</td>
                      <td style="padding: 8px 0; font-weight: bold; color: #667eea;">¥${body.amount.toLocaleString()}</td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0; color: #6b7280;">寄付日</td>
                      <td style="padding: 8px 0;">${new Date().toLocaleDateString('ja-JP')}</td>
                    </tr>
                  </table>
                </div>
                
                ${body.message ? `
                <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 16px; margin: 20px 0; border-radius: 4px;">
                  <p style="margin: 0; color: #92400e;"><strong>応援メッセージ:</strong></p>
                  <p style="margin: 8px 0 0 0; color: #78350f;">${body.message}</p>
                </div>
                ` : ''}
                
                <div style="margin-top: 30px; padding-top: 20px; border-top: 2px solid #e5e7eb;">
                  <p style="margin-bottom: 12px; color: #6b7280; font-size: 14px;">
                    今後とも、AICHEFSをよろしくお願いいたします。
                  </p>
                  
                  <div style="text-align: center; margin-top: 30px;">
                    <a href="https://aichefs.net" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; padding: 12px 32px; border-radius: 8px; font-weight: bold;">
                      AICHEFSにアクセス
                    </a>
                  </div>
                </div>
                
                <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center; color: #9ca3af; font-size: 12px;">
                  <p style="margin: 0;">© 2026 AICHEFS. All rights reserved.</p>
                  <p style="margin: 8px 0 0 0;">
                    <a href="https://aichefs.net" style="color: #667eea; text-decoration: none;">https://aichefs.net</a>
                  </p>
                </div>
              </div>
            </body>
            </html>
          `,
        }),
      });
      
      if (!resendResponse.ok) {
        const errorData = await resendResponse.json();
        console.error('Resend API エラー:', errorData);
        return new Response(JSON.stringify({
          error: 'メール送信に失敗しました',
          details: errorData
        }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      
      const emailResult = await resendResponse.json();
      
      return json({
        success: true,
        email_id: emailResult.id,
        message: 'お礼メールを送信しました'
      });
    } catch (error: any) {
      console.error('メール送信エラー:', error);
      return new Response(JSON.stringify({
        error: 'メール送信に失敗しました',
        details: error.message
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }
  
  // ========================================
  // メールマガジンAPI
  // ========================================
  
  // POST /api/newsletter/subscribe - メールマガジン購読登録
  if (pathname === "/api/newsletter/subscribe" && req.method === "POST") {
    const body = await readJson(req);
    
    if (!body.email) {
      return badRequest("email is required");
    }
    
    // メールアドレスの検証
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return badRequest("Invalid email format");
    }
    
    try {
      const subscriber_id = 'sub_' + Date.now() + '_' + Math.random().toString(36).substring(7);
      const verification_token = Math.random().toString(36).substring(2) + Date.now().toString(36);
      
      // 既存購読者チェック
      const existing = await env.DB.prepare(
        'SELECT subscriber_id, status FROM newsletter_subscribers WHERE email = ?'
      ).bind(body.email).first();
      
      if (existing) {
        if (existing.status === 'active') {
          return json({ 
            message: 'すでに購読登録されています',
            already_subscribed: true
          });
        } else {
          // 再購読
          await env.DB.prepare(`
            UPDATE newsletter_subscribers 
            SET status = 'active', 
                unsubscribed_at = NULL,
                subscribed_at = CURRENT_TIMESTAMP,
                verification_token = ?
            WHERE email = ?
          `).bind(verification_token, body.email).run();
          
          return json({ 
            success: true,
            message: 'メールマガジンの購読を再開しました'
          });
        }
      }
      
      // 新規購読者登録
      await env.DB.prepare(`
        INSERT INTO newsletter_subscribers (
          subscriber_id, email, household_id, name, verification_token
        ) VALUES (?, ?, ?, ?, ?)
      `).bind(
        subscriber_id,
        body.email,
        body.household_id || null,
        body.name || null,
        verification_token
      ).run();
      
      // ウェルカムメール送信（Resend使用）
      if (env.RESEND_API_KEY) {
        try {
          const resendResponse = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${env.RESEND_API_KEY}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              from: 'AICHEFS <noreply@aichefs.net>',
              to: [body.email],
              subject: '【AICHEFS】メールマガジンのご登録ありがとうございます',
              html: `
                <!DOCTYPE html>
                <html lang="ja">
                <head>
                  <meta charset="UTF-8">
                  <title>Welcome to AICHEFS Newsletter</title>
                </head>
                <body style="font-family: sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
                  <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 12px 12px 0 0;">
                    <h1 style="margin: 0; font-size: 28px;">🍽️ AICHEFS</h1>
                    <p style="margin: 10px 0 0 0; font-size: 16px;">メールマガジン</p>
                  </div>
                  
                  <div style="background-color: white; padding: 40px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px;">
                    <h2 style="color: #1f2937; margin-top: 0;">ご登録ありがとうございます！</h2>
                    
                    <p>\${body.name ? body.name + ' 様' : 'お客様'}</p>
                    
                    <p>
                      AICHEFSメールマガジンにご登録いただき、ありがとうございます。<br>
                      今後、以下の情報をお届けします：
                    </p>
                    
                    <ul style="line-height: 2;">
                      <li>📅 季節のおすすめ献立</li>
                      <li>🍳 簡単レシピのご紹介</li>
                      <li>💡 献立作成のヒントやコツ</li>
                      <li>🎁 新機能のお知らせ</li>
                    </ul>
                    
                    <div style="background-color: #f3f4f6; border-radius: 8px; padding: 20px; margin: 30px 0;">
                      <p style="margin: 0; font-size: 14px; color: #6b7280;">
                        <strong>配信頻度：</strong>月2回程度<br>
                        <strong>次回配信予定：</strong>毎月1日・15日
                      </p>
                    </div>
                    
                    <div style="text-align: center; margin-top: 30px;">
                      <a href="https://aichefs.net/app" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; padding: 14px 40px; border-radius: 8px; font-weight: bold;">
                        献立を作成する
                      </a>
                    </div>
                    
                    <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center; color: #9ca3af; font-size: 12px;">
                      <p>配信停止をご希望の場合は、<a href="https://aichefs.net/unsubscribe?token=\${verification_token}" style="color: #667eea;">こちら</a>からお手続きください。</p>
                      <p style="margin-top: 12px;">© 2026 AICHEFS. All rights reserved.</p>
                    </div>
                  </div>
                </body>
                </html>
              `,
            }),
          });
          
          if (!resendResponse.ok) {
            console.error('ウェルカムメール送信失敗:', await resendResponse.text());
          }
        } catch (emailError) {
          console.error('ウェルカムメール送信エラー:', emailError);
          // メール送信失敗してもsubscribe自体は成功とする
        }
      }
      
      return json({ 
        success: true,
        subscriber_id,
        message: 'メールマガジンの購読を開始しました'
      });
    } catch (error: any) {
      console.error('Newsletter subscribe error:', error);
      return new Response(JSON.stringify({
        error: 'Failed to subscribe',
        details: error.message
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }
  
  // POST /api/newsletter/unsubscribe - メールマガジン購読解除
  if (pathname === "/api/newsletter/unsubscribe" && req.method === "POST") {
    const body = await readJson(req);
    
    if (!body.email && !body.token) {
      return badRequest("email or token is required");
    }
    
    try {
      let query = 'UPDATE newsletter_subscribers SET status = ?, unsubscribed_at = CURRENT_TIMESTAMP WHERE ';
      let bindValue;
      
      if (body.token) {
        query += 'verification_token = ?';
        bindValue = body.token;
      } else {
        query += 'email = ?';
        bindValue = body.email;
      }
      
      const result = await env.DB.prepare(query).bind('unsubscribed', bindValue).run();
      
      if (result.meta.changes === 0) {
        return badRequest("購読者が見つかりません");
      }
      
      return json({ 
        success: true,
        message: 'メールマガジンの購読を解除しました'
      });
    } catch (error: any) {
      console.error('Newsletter unsubscribe error:', error);
      return new Response(JSON.stringify({
        error: 'Failed to unsubscribe',
        details: error.message
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }
  
  // GET /api/newsletter/subscribers - 購読者一覧（管理者用）
  if (pathname === "/api/newsletter/subscribers" && req.method === "GET") {
    // TODO: 管理者認証チェック
    
    const url = new URL(req.url);
    const status = url.searchParams.get("status") || "active";
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "50");
    const offset = (page - 1) * limit;
    
    try {
      const subscribers = await env.DB.prepare(`
        SELECT 
          subscriber_id,
          email,
          name,
          status,
          subscribed_at,
          unsubscribed_at
        FROM newsletter_subscribers
        WHERE status = ?
        ORDER BY subscribed_at DESC
        LIMIT ? OFFSET ?
      `).bind(status, limit, offset).all();
      
      const countResult = await env.DB.prepare(
        'SELECT COUNT(*) as total FROM newsletter_subscribers WHERE status = ?'
      ).bind(status).first();
      
      return json({
        subscribers: subscribers.results,
        pagination: {
          page,
          limit,
          total: countResult?.total || 0,
          total_pages: Math.ceil((countResult?.total || 0) / limit)
        }
      });
    } catch (error: any) {
      console.error('Newsletter subscribers list error:', error);
      return new Response(JSON.stringify({
        error: 'Failed to get subscribers',
        details: error.message
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }
  
  // GET /api/donations/list - 公開された寄付一覧を取得
  if (pathname === "/api/donations/list" && req.method === "GET") {
    const donations = await env.DB.prepare(`
      SELECT 
        donation_id,
        donor_name,
        amount,
        unit_count,
        message,
        created_at
      FROM donations
      WHERE status = 'completed' AND is_public = 1
      ORDER BY created_at DESC
      LIMIT 50
    `).all();
    
    return json({ donations: donations.results || [] });
  }
  
  // GET /api/donations/stats - 寄付統計を取得
  if (pathname === "/api/donations/stats" && req.method === "GET") {
    const stats = await env.DB.prepare(`
      SELECT 
        COUNT(*) as total_count,
        SUM(amount) as total_amount,
        SUM(unit_count) as total_units,
        AVG(amount) as avg_amount
      FROM donations
      WHERE status = 'completed'
    `).first();
    
    return json({ stats: stats || {} });
  }
  
  // GET /api/donations/my-history - ユーザー別寄付履歴を取得
  if (pathname === "/api/donations/my-history" && req.method === "GET") {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return new Response("Unauthorized", { status: 401 });
    }
    
    const token = authHeader.substring(7);
    const household_id = token; // tokenをhousehold_idとして使用
    
    const donations = await env.DB.prepare(`
      SELECT 
        d.donation_id,
        d.donor_name,
        d.donor_email,
        d.amount,
        d.unit_count,
        d.message,
        d.status,
        d.payment_method,
        d.created_at,
        dc.certificate_number,
        dc.issue_date
      FROM donations d
      LEFT JOIN donation_certificates dc ON d.donation_id = dc.donation_id
      WHERE d.household_id = ?
      ORDER BY d.created_at DESC
    `).bind(household_id).all();
    
    return json({ donations: donations.results || [] });
  }
  
  // GET /api/donations/certificate/:donation_id - 寄付証明書を取得
  if (pathname.match(/^\/api\/donations\/certificate\/[^/]+$/) && req.method === "GET") {
    const donation_id = pathname.split("/").pop();
    
    const result = await env.DB.prepare(`
      SELECT 
        d.donation_id,
        d.donor_name,
        d.donor_email,
        d.amount,
        d.unit_count,
        d.created_at,
        dc.certificate_id,
        dc.certificate_number,
        dc.issue_date
      FROM donations d
      JOIN donation_certificates dc ON d.donation_id = dc.donation_id
      WHERE d.donation_id = ?
    `).bind(donation_id).first();
    
    if (!result) {
      return badRequest("Certificate not found");
    }
    
    return json({ certificate: result });
  }
  
  // GET /api/admin/donations - 管理者用寄付一覧
  if (pathname === "/api/admin/donations" && req.method === "GET") {
    // TODO: 管理者認証チェック
    
    const url = new URL(req.url);
    const search = url.searchParams.get("search") || "";
    
    let query = `
      SELECT 
        d.donation_id,
        d.household_id,
        d.donor_name,
        d.donor_email,
        d.donor_phone,
        d.amount,
        d.unit_count,
        d.message,
        d.status,
        d.payment_method,
        d.is_public,
        d.created_at,
        dc.certificate_number
      FROM donations d
      LEFT JOIN donation_certificates dc ON d.donation_id = dc.donation_id
    `;
    
    if (search) {
      query += ` WHERE d.donor_name LIKE ? OR d.donor_email LIKE ?`;
    }
    
    query += ` ORDER BY d.created_at DESC LIMIT 100`;
    
    const donations = search 
      ? await env.DB.prepare(query).bind(`%${search}%`, `%${search}%`).all()
      : await env.DB.prepare(query).all();
    
    return json({ donations: donations.results || [] });
  }
  
  // GET /api/admin/donations/stats - 寄付統計情報
  if (pathname === "/api/admin/donations/stats" && req.method === "GET") {
    // TODO: 管理者認証チェック
    
    try {
      // 寄付総額と件数
      const totalStats = await env.DB.prepare(`
        SELECT 
          COUNT(*) as total_count,
          COALESCE(SUM(amount), 0) as total_amount
        FROM donations
        WHERE status = 'completed'
      `).first();
      
      // 今月の寄付統計
      const monthStats = await env.DB.prepare(`
        SELECT 
          COUNT(*) as month_count,
          COALESCE(SUM(amount), 0) as month_amount
        FROM donations
        WHERE status = 'completed'
          AND created_at >= date('now', 'start of month')
      `).first();
      
      // 過去7日間の寄付推移
      const dailyStats = await env.DB.prepare(`
        SELECT 
          DATE(created_at) as date,
          COUNT(*) as count,
          COALESCE(SUM(amount), 0) as amount
        FROM donations
        WHERE status = 'completed'
          AND created_at >= date('now', '-7 days')
        GROUP BY DATE(created_at)
        ORDER BY date ASC
      `).all();
      
      return json({
        total_count: totalStats?.total_count || 0,
        total_amount: totalStats?.total_amount || 0,
        month_count: monthStats?.month_count || 0,
        month_amount: monthStats?.month_amount || 0,
        daily_stats: dailyStats.results || []
      });
    } catch (error) {
      console.error("Donation stats error:", error);
      return json({ error: "Failed to fetch donation stats" }, { status: 500 });
    }
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
        AND popularity >= 5
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
      
      // 本日の新規ユーザー数
      const newUsersTodayRes = await env.DB.prepare(`
        SELECT COUNT(*) as count FROM households 
        WHERE DATE(created_at) = DATE('now')
      `).first();
      const newUsersToday = newUsersTodayRes?.count || 0;
      
      // 総献立数
      const totalPlansRes = await env.DB.prepare(
        `SELECT COUNT(*) as count FROM meal_plan_history`
      ).first();
      const totalPlans = totalPlansRes?.count || 0;
      
      // 本日の献立生成数
      const plansTodayRes = await env.DB.prepare(`
        SELECT COUNT(*) as count FROM meal_plan_history 
        WHERE DATE(created_at) = DATE('now')
      `).first();
      const plansToday = plansTodayRes?.count || 0;
      
      // 寄付総額と件数
      const donationsRes = await env.DB.prepare(`
        SELECT 
          COUNT(*) as count,
          COALESCE(SUM(amount), 0) as total_amount
        FROM donations 
        WHERE status = 'completed'
      `).first();
      const totalDonations = donationsRes?.count || 0;
      const totalDonationAmount = donationsRes?.total_amount || 0;
      
      // メルマガ購読者数
      const subscribersRes = await env.DB.prepare(
        `SELECT COUNT(*) as count FROM newsletter_subscribers WHERE status = 'active'`
      ).first();
      const totalSubscribers = subscribersRes?.count || 0;
      
      // アクティブユーザー数（過去7日間に献立を作成したユーザー）
      const activeUsersRes = await env.DB.prepare(`
        SELECT COUNT(DISTINCT household_id) as count 
        FROM meal_plan_history 
        WHERE created_at >= datetime('now', '-7 days')
      `).first();
      const activeUsers = activeUsersRes?.count || 0;
      
      return json({
        total_users: totalUsers,
        new_users_today: newUsersToday,
        total_plans: totalPlans,
        plans_today: plansToday,
        total_donations: totalDonations,
        total_donation_amount: totalDonationAmount,
        total_subscribers: totalSubscribers,
        active_users: activeUsers
      });
    } catch (error: any) {
      console.error('Admin stats error:', error);
      return json({ error: { message: error.message } }, 500);
    }
  }
  
  // GET /api/admin/users - ユーザー一覧
  if (pathname === "/api/admin/users" && req.method === "GET") {
    try {
      const url = new URL(req.url);
      const search = url.searchParams.get("search") || "";
      
      let query = `
        SELECT 
          h.household_id,
          h.title,
          h.members_count,
          h.created_at,
          u.name,
          u.email,
          COUNT(DISTINCT mp.plan_id) as plan_count
        FROM households h
        LEFT JOIN users u ON h.household_id = u.household_id
        LEFT JOIN meal_plan_history mp ON h.household_id = mp.household_id
      `;
      
      const bindings = [];
      if (search) {
        query += ` WHERE u.name LIKE ? OR u.email LIKE ? OR h.title LIKE ?`;
        const searchPattern = `%${search}%`;
        bindings.push(searchPattern, searchPattern, searchPattern);
      }
      
      query += ` GROUP BY h.household_id ORDER BY h.created_at DESC LIMIT 100`;
      
      const users = await env.DB.prepare(query).bind(...bindings).all();
      
      return json({ users: users.results || [] });
    } catch (error: any) {
      console.error('Admin users error:', error);
      return json({ error: { message: error.message } }, 500);
    }
  }
  
  // GET /api/admin/users/:household_id - ユーザー詳細
  if (pathname.match(/^\/api\/admin\/users\/[^/]+$/) && req.method === "GET") {
    const household_id = pathname.split("/").pop();
    
    try {
      // 基本情報
      const user = await env.DB.prepare(`
        SELECT 
          h.household_id,
          h.title,
          h.members_count,
          h.budget_tier_per_person,
          h.cooking_time_limit_min,
          h.dislikes_json,
          h.allergies_json,
          h.created_at,
          u.name,
          u.email
        FROM households h
        LEFT JOIN users u ON h.household_id = u.household_id
        WHERE h.household_id = ?
      `).bind(household_id).first();
      
      if (!user) {
        return json({ error: { message: "User not found" } }, 404);
      }
      
      // 献立履歴
      const plans = await env.DB.prepare(`
        SELECT 
          plan_id,
          start_date,
          months,
          created_at
        FROM meal_plan_history
        WHERE household_id = ?
        ORDER BY created_at DESC
        LIMIT 10
      `).bind(household_id).all();
      
      // お気に入りレシピ
      const favorites = await env.DB.prepare(`
        SELECT 
          r.recipe_id,
          r.title,
          fr.created_at
        FROM favorite_recipes fr
        JOIN recipes r ON fr.recipe_id = r.recipe_id
        WHERE fr.household_id = ?
        ORDER BY fr.created_at DESC
        LIMIT 10
      `).bind(household_id).all();
      
      // 寄付履歴
      const donations = await env.DB.prepare(`
        SELECT 
          donation_id,
          amount,
          unit_count,
          status,
          created_at
        FROM donations
        WHERE household_id = ?
        ORDER BY created_at DESC
        LIMIT 5
      `).bind(household_id).all();
      
      // メルマガ購読状態
      const newsletter = await env.DB.prepare(`
        SELECT 
          subscriber_id,
          email,
          status,
          subscribed_at
        FROM newsletter_subscribers
        WHERE household_id = ?
        LIMIT 1
      `).bind(household_id).first();
      
      // 統計
      const stats = {
        total_plans: plans.results?.length || 0,
        total_favorites: favorites.results?.length || 0,
        total_donations: donations.results?.length || 0,
        total_donation_amount: donations.results?.reduce((sum, d) => sum + (d.amount || 0), 0) || 0
      };
      
      return json({
        user,
        plans: plans.results || [],
        favorites: favorites.results || [],
        donations: donations.results || [],
        newsletter,
        stats
      });
    } catch (error: any) {
      console.error('Admin user detail error:', error);
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
  
  // POST /api/admin/ads - 広告作成
  if (pathname === "/api/admin/ads" && req.method === "POST") {
    try {
      const body = await readJson(req);
      const { slot_id, title, description, image_url, link_url, is_active } = body;

      if (!slot_id || !title) {
        return badRequest('slot_idとtitleは必須です');
      }

      const ad_id = uuid();

      await env.DB.prepare(`
        INSERT INTO ad_contents (
          ad_id, slot_id, title, description, image_url, link_url, is_active, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      `).bind(
        ad_id,
        slot_id,
        title,
        description || '',
        image_url || '',
        link_url || '',
        is_active !== undefined ? (is_active ? 1 : 0) : 1
      ).run();

      return json({ success: true, ad_id, message: '広告を作成しました' });
    } catch (error: any) {
      console.error('Admin ads create error:', error);
      return json({ error: { message: error.message } }, 500);
    }
  }

  // PUT /api/admin/ads/:ad_id - 広告更新
  if (pathname.startsWith("/api/admin/ads/") && req.method === "PUT") {
    try {
      const ad_id = pathname.split('/')[4];
      const body = await readJson(req);
      const { title, description, image_url, link_url, is_active } = body;

      await env.DB.prepare(`
        UPDATE ad_contents
        SET title = ?, description = ?, image_url = ?, link_url = ?, is_active = ?, updated_at = CURRENT_TIMESTAMP
        WHERE ad_id = ?
      `).bind(
        title,
        description || '',
        image_url || '',
        link_url || '',
        is_active !== undefined ? (is_active ? 1 : 0) : 1,
        ad_id
      ).run();

      return json({ success: true, message: '広告を更新しました' });
    } catch (error: any) {
      console.error('Admin ads update error:', error);
      return json({ error: { message: error.message } }, 500);
    }
  }

  // DELETE /api/admin/ads/:ad_id - 広告削除
  if (pathname.startsWith("/api/admin/ads/") && req.method === "DELETE") {
    try {
      const ad_id = pathname.split('/')[4];

      await env.DB.prepare(`
        DELETE FROM ad_contents WHERE ad_id = ?
      `).bind(ad_id).run();

      return json({ success: true, message: '広告を削除しました' });
    } catch (error: any) {
      console.error('Admin ads delete error:', error);
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
  // /donation：子ども食堂寄付LP
  // ========================================
  if (pathname === "/donation") {
    return new Response(DONATION_LP_HTML, {
      headers: { 
        'content-type': 'text/html; charset=utf-8',
        'cache-control': 'no-store'
      }
    });
  }
  
  // ========================================
  // /donation/thanks：寄付完了ページ
  // ========================================
  if (pathname === "/donation/thanks") {
    return new Response(DONATION_THANKS_HTML, {
      headers: { 
        'content-type': 'text/html; charset=utf-8',
        'cache-control': 'no-store'
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
  // ========================================
  // /admin：管理者ダッシュボード（統合）
  // ========================================
  if (pathname === "/admin") {
    return new Response(ADMIN_DASHBOARD_HTML, {
      headers: { 
        'content-type': 'text/html; charset=utf-8',
        'cache-control': 'no-store'
      }
    });
  }

  // /admin/donations：管理者寄付ダッシュボード
  // ========================================
  if (pathname === "/admin/donations") {
    return new Response(ADMIN_DONATION_DASHBOARD_HTML, {
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
  // /profile：プロフィール編集画面
  // ========================================
  if (pathname === "/profile") {
    return new Response(PROFILE_HTML, {
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
  
  // ========================================
  // /unsubscribe：メールマガジン購読解除
  // ========================================
  if (pathname === "/unsubscribe") {
    return new Response(UNSUBSCRIBE_HTML, {
      headers: { 
        'content-type': 'text/html; charset=utf-8',
        'cache-control': 'no-store'
      }
    });
  }
  
  // ========================================
  // User Preferences API
  // ========================================
  
  // POST /api/preferences/save - ユーザー設定保存
  if (pathname === "/api/preferences/save" && req.method === "POST") {
    const body = await readJson(req);
    const { household_id, cuisine_style, plan_days, budget_tier, cooking_time_limit } = body;
    
    if (!household_id) {
      return badRequest("Missing household_id");
    }
    
    try {
      // 既存の設定を確認
      const existing = await env.DB.prepare(`
        SELECT preference_id FROM user_preferences WHERE household_id = ?
      `).bind(household_id).first();
      
      if (existing) {
        // 更新
        await env.DB.prepare(`
          UPDATE user_preferences 
          SET is_quick_mode_enabled = 1,
              saved_cuisine_style = ?,
              saved_plan_days = ?,
              saved_budget_tier = ?,
              saved_cooking_time_limit = ?,
              updated_at = CURRENT_TIMESTAMP
          WHERE household_id = ?
        `).bind(cuisine_style, plan_days, budget_tier, cooking_time_limit, household_id).run();
      } else {
        // 新規作成
        await env.DB.prepare(`
          INSERT INTO user_preferences 
            (household_id, is_quick_mode_enabled, saved_cuisine_style, saved_plan_days, 
             saved_budget_tier, saved_cooking_time_limit)
          VALUES (?, 1, ?, ?, ?, ?)
        `).bind(household_id, cuisine_style, plan_days, budget_tier, cooking_time_limit).run();
      }
      
      return json({ success: true, message: "設定を保存しました" });
    } catch (error) {
      console.error("Save preferences error:", error);
      return json({ error: "Failed to save preferences" }, { status: 500 });
    }
  }
  
  // GET /api/preferences/:household_id - ユーザー設定取得
  if (pathname.startsWith("/api/preferences/") && req.method === "GET") {
    const household_id = pathname.split("/")[3];
    
    if (!household_id) {
      return badRequest("Missing household_id");
    }
    
    try {
      const preferences = await env.DB.prepare(`
        SELECT * FROM user_preferences WHERE household_id = ?
      `).bind(household_id).first();
      
      if (!preferences) {
        return json({ 
          is_quick_mode_enabled: 0,
          saved_cuisine_style: '和食',
          saved_plan_days: 7,
          saved_budget_tier: null,
          saved_cooking_time_limit: null
        });
      }
      
      return json(preferences);
    } catch (error) {
      console.error("Get preferences error:", error);
      return json({ error: "Failed to get preferences" }, { status: 500 });
    }
  }
  
  // POST /api/preferences/quick-generate - ワンクリック献立生成
  if (pathname === "/api/preferences/quick-generate" && req.method === "POST") {
    const body = await readJson(req);
    const { household_id } = body;
    
    if (!household_id) {
      return badRequest("Missing household_id");
    }
    
    try {
      // 保存された設定を取得
      const preferences = await env.DB.prepare(`
        SELECT * FROM user_preferences WHERE household_id = ?
      `).bind(household_id).first();
      
      if (!preferences || !preferences.is_quick_mode_enabled) {
        return json({ error: "Quick mode not enabled" }, { status: 400 });
      }
      
      // 世帯情報を取得
      const household = await env.DB.prepare(`
        SELECT * FROM households WHERE household_id = ?
      `).bind(household_id).first();
      
      if (!household) {
        return json({ error: "Household not found" }, { status: 404 });
      }
      
      // 献立生成処理（既存のロジックを再利用）
      // この部分は後で実装します - とりあえず保存された設定を返す
      return json({
        success: true,
        preferences: {
          cuisine_style: preferences.saved_cuisine_style,
          plan_days: preferences.saved_plan_days,
          budget_tier: preferences.saved_budget_tier,
          cooking_time_limit: preferences.saved_cooking_time_limit
        },
        household: household
      });
    } catch (error) {
      console.error("Quick generate error:", error);
      return json({ error: "Failed to generate meal plan" }, { status: 500 });
    }
  }
  
  // ========================================
  // Family Members API
  // ========================================
  
  // POST /api/family-members/add - 家族メンバー追加
  if (pathname === "/api/family-members/add" && req.method === "POST") {
    const body = await readJson(req);
    const { household_id, name, email, relationship, notification_time } = body;
    
    if (!household_id || !name || !email) {
      return badRequest("Missing required fields");
    }
    
    try {
      // 既存メンバーチェック
      const existing = await env.DB.prepare(`
        SELECT member_id FROM family_members 
        WHERE household_id = ? AND email = ?
      `).bind(household_id, email).first();
      
      if (existing) {
        return json({ error: "このメールアドレスは既に登録されています" }, { status: 400 });
      }
      
      // メンバー追加
      const result = await env.DB.prepare(`
        INSERT INTO family_members 
          (household_id, name, email, relationship, notification_time, is_notification_enabled, status)
        VALUES (?, ?, ?, ?, ?, 1, 'active')
      `).bind(household_id, name, email, relationship || 'family', notification_time || '15:00').run();
      
      return json({ 
        success: true, 
        member_id: result.meta.last_row_id,
        message: "家族メンバーを追加しました" 
      });
    } catch (error) {
      console.error("Add family member error:", error);
      return json({ error: "Failed to add family member" }, { status: 500 });
    }
  }
  
  // GET /api/family-members/:household_id - 家族メンバー一覧
  if (pathname.startsWith("/api/family-members/") && req.method === "GET") {
    const household_id = pathname.split("/")[3];
    
    if (!household_id) {
      return badRequest("Missing household_id");
    }
    
    try {
      const members = await env.DB.prepare(`
        SELECT 
          member_id, name, email, relationship, 
          is_notification_enabled, notification_time, 
          status, created_at
        FROM family_members 
        WHERE household_id = ?
        ORDER BY created_at ASC
      `).bind(household_id).all();
      
      return json({ members: members.results || [] });
    } catch (error) {
      console.error("Get family members error:", error);
      return json({ error: "Failed to get family members" }, { status: 500 });
    }
  }
  
  // PUT /api/family-members/:member_id/toggle - 通知ON/OFF切り替え
  if (pathname.match(/^\/api\/family-members\/\d+\/toggle$/) && req.method === "PUT") {
    const member_id = pathname.split("/")[3];
    
    try {
      // 現在の状態を取得
      const member = await env.DB.prepare(`
        SELECT is_notification_enabled FROM family_members WHERE member_id = ?
      `).bind(member_id).first();
      
      if (!member) {
        return json({ error: "Member not found" }, { status: 404 });
      }
      
      // トグル
      const newStatus = member.is_notification_enabled === 1 ? 0 : 1;
      await env.DB.prepare(`
        UPDATE family_members 
        SET is_notification_enabled = ?, updated_at = CURRENT_TIMESTAMP
        WHERE member_id = ?
      `).bind(newStatus, member_id).run();
      
      return json({ 
        success: true, 
        is_notification_enabled: newStatus,
        message: newStatus === 1 ? "通知を有効にしました" : "通知を無効にしました"
      });
    } catch (error) {
      console.error("Toggle notification error:", error);
      return json({ error: "Failed to toggle notification" }, { status: 500 });
    }
  }
  
  // DELETE /api/family-members/:member_id - メンバー削除
  if (pathname.match(/^\/api\/family-members\/\d+$/) && req.method === "DELETE") {
    const member_id = pathname.split("/")[3];
    
    try {
      await env.DB.prepare(`
        DELETE FROM family_members WHERE member_id = ?
      `).bind(member_id).run();
      
      return json({ success: true, message: "メンバーを削除しました" });
    } catch (error) {
      console.error("Delete family member error:", error);
      return json({ error: "Failed to delete family member" }, { status: 500 });
    }
  }

  // ========================================
  // Stripe決済API
  // ========================================
  
  // POST /api/payment/donation - 寄付決済Checkout作成
  if (pathname === "/api/payment/donation" && req.method === "POST") {
    try {
      const body = await readJson(req);
      const { household_id, email, amount } = body;
      
      if (!household_id || !email) {
        return badRequest("household_id and email are required");
      }

      const stripe = getStripeClient(env);
      const checkoutUrl = await createDonationCheckout(
        stripe,
        env,
        household_id as string,
        email as string,
        (amount as number) || 1000
      );

      return json({ url: checkoutUrl });
    } catch (error: any) {
      console.error('寄付決済エラー:', error);
      return json({ error: error.message }, 500);
    }
  }

  // POST /api/payment/subscription - 月額サブスクリプションCheckout作成
  if (pathname === "/api/payment/subscription" && req.method === "POST") {
    try {
      const body = await readJson(req);
      const { household_id, email, price_id } = body;
      
      if (!household_id || !email) {
        return badRequest("household_id and email are required");
      }

      const stripe = getStripeClient(env);
      const checkoutUrl = await createSubscriptionCheckout(
        stripe,
        env,
        household_id as string,
        email as string,
        price_id as string | undefined
      );

      return json({ url: checkoutUrl });
    } catch (error: any) {
      console.error('サブスクリプション作成エラー:', error);
      return json({ error: error.message }, 500);
    }
  }

  // POST /api/payment/webhook - Stripe Webhook処理
  if (pathname === "/api/payment/webhook" && req.method === "POST") {
    try {
      const signature = req.headers.get('stripe-signature');
      if (!signature) {
        return badRequest("Stripe signature missing");
      }

      const payload = await req.text();
      const stripe = getStripeClient(env);
      
      const event = verifyWebhookSignature(
        stripe,
        payload,
        signature,
        env.STRIPE_WEBHOOK_SECRET || ''
      );

      // イベント処理
      switch (event.type) {
        case 'checkout.session.completed': {
          const session = event.data.object as any;
          const householdId = session.metadata?.household_id;

          if (session.mode === 'payment') {
            // 寄付決済完了
            await recordPaymentTransaction(env.DB!, {
              household_id: householdId,
              stripe_payment_intent_id: session.payment_intent,
              stripe_customer_id: session.customer,
              payment_type: 'donation',
              amount: session.amount_total,
              currency: session.currency,
              status: 'succeeded',
              receipt_email: session.customer_email,
              metadata_json: JSON.stringify(session.metadata)
            });

            // メール通知記録
            await recordEmailNotification(env.DB!, {
              household_id: householdId,
              email_to: session.customer_email,
              email_type: 'payment_success',
              subject: 'AIシェフ - ご寄付ありがとうございます',
              content_text: `ご寄付いただき、ありがとうございます！\n\n金額: ¥${session.amount_total.toLocaleString()}\n\nAIシェフを無料でご利用いただけます。`,
              status: 'pending'
            });
          } else if (session.mode === 'subscription') {
            // サブスクリプション開始
            const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
            
            await recordSubscription(env.DB!, {
              household_id: householdId,
              stripe_subscription_id: subscription.id,
              stripe_customer_id: subscription.customer as string,
              status: subscription.status,
              plan_type: 'monthly',
              amount: subscription.items.data[0].price.unit_amount || 0,
              current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
              current_period_end: new Date(subscription.current_period_end * 1000).toISOString()
            });

            // メール通知記録
            await recordEmailNotification(env.DB!, {
              household_id: householdId,
              email_to: session.customer_email,
              email_type: 'subscription_start',
              subject: 'AIシェフ - サブスクリプション開始',
              content_text: `月額プランへのご登録ありがとうございます！\n\n30日間の無料トライアル期間をお楽しみください。`,
              status: 'pending'
            });
          }
          break;
        }

        case 'customer.subscription.updated':
        case 'customer.subscription.deleted': {
          const subscription = event.data.object as any;
          const householdId = subscription.metadata?.household_id;

          if (householdId) {
            await recordSubscription(env.DB!, {
              household_id: householdId,
              stripe_subscription_id: subscription.id,
              stripe_customer_id: subscription.customer,
              status: subscription.status,
              plan_type: 'monthly',
              amount: subscription.items.data[0].price.unit_amount || 0,
              current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
              current_period_end: new Date(subscription.current_period_end * 1000).toISOString()
            });
          }
          break;
        }

        case 'invoice.payment_succeeded': {
          const invoice = event.data.object as any;
          const subscription = await stripe.subscriptions.retrieve(invoice.subscription);
          const householdId = subscription.metadata?.household_id;

          if (householdId) {
            await recordPaymentTransaction(env.DB!, {
              household_id: householdId,
              stripe_payment_intent_id: invoice.payment_intent,
              stripe_customer_id: invoice.customer,
              payment_type: 'subscription',
              amount: invoice.amount_paid,
              currency: invoice.currency,
              status: 'succeeded',
              receipt_email: invoice.customer_email,
              receipt_url: invoice.hosted_invoice_url,
              metadata_json: JSON.stringify(subscription.metadata)
            });
          }
          break;
        }

        case 'invoice.payment_failed': {
          const invoice = event.data.object as any;
          const subscription = await stripe.subscriptions.retrieve(invoice.subscription);
          const householdId = subscription.metadata?.household_id;

          if (householdId) {
            await recordPaymentTransaction(env.DB!, {
              household_id: householdId,
              stripe_payment_intent_id: invoice.payment_intent,
              stripe_customer_id: invoice.customer,
              payment_type: 'subscription',
              amount: invoice.amount_due,
              currency: invoice.currency,
              status: 'failed',
              receipt_email: invoice.customer_email,
              metadata_json: JSON.stringify(subscription.metadata)
            });
          }
          break;
        }
      }

      return json({ received: true });
    } catch (error: any) {
      console.error('Webhook処理エラー:', error);
      return json({ error: error.message }, 500);
    }
  }

  // GET /api/payment/status/:household_id - 決済ステータス確認
  if (pathname.match(/^\/api\/payment\/status\/[^/]+$/) && req.method === "GET") {
    try {
      const householdId = pathname.split("/").pop();

      // サブスクリプション確認
      const subscription = await env.DB.prepare(`
        SELECT * FROM subscriptions
        WHERE household_id = ?
        AND status IN ('active', 'trialing')
        ORDER BY created_at DESC
        LIMIT 1
      `).bind(householdId).first();

      // 寄付確認
      const donation = await env.DB.prepare(`
        SELECT * FROM payment_transactions
        WHERE household_id = ?
        AND payment_type = 'donation'
        AND status = 'succeeded'
        ORDER BY created_at DESC
        LIMIT 1
      `).bind(householdId).first();

      const hasAccess = !!(subscription || donation);
      const accessType = subscription ? 'subscription' : (donation ? 'donation' : 'none');

      return json({
        has_access: hasAccess,
        access_type: accessType,
        subscription,
        donation
      });
    } catch (error: any) {
      console.error('ステータス確認エラー:', error);
      return json({ error: error.message }, 500);
    }
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

// ========================================
// プロフィール編集ページ HTML
// ========================================
const PROFILE_HTML = `
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>プロフィール編集 - AICHEFS</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
</head>
<body class="bg-gradient-to-br from-purple-50 via-white to-pink-50 min-h-screen">
    <!-- ヘッダー -->
    <header class="bg-white shadow-sm sticky top-0 z-50">
        <div class="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
            <div class="flex items-center space-x-4">
                <a href="/dashboard" class="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    <i class="fas fa-utensils mr-2"></i>AICHEFS
                </a>
            </div>
            <div class="flex items-center space-x-4">
                <a href="/dashboard" class="text-gray-600 hover:text-purple-600 transition-colors">
                    <i class="fas fa-home mr-2"></i>ダッシュボード
                </a>
                <button onclick="logout()" class="text-gray-600 hover:text-purple-600 transition-colors">
                    <i class="fas fa-sign-out-alt mr-2"></i>ログアウト
                </button>
            </div>
        </div>
    </header>

    <!-- メインコンテンツ -->
    <main class="max-w-4xl mx-auto px-4 py-8">
        <div class="bg-white rounded-2xl shadow-xl p-8">
            <div class="flex items-center justify-between mb-8">
                <h1 class="text-3xl font-bold text-gray-800">
                    <i class="fas fa-user-edit text-purple-600 mr-3"></i>
                    プロフィール編集
                </h1>
            </div>

            <!-- ローディング表示 -->
            <div id="loading" class="text-center py-12">
                <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
                <p class="mt-4 text-gray-600">プロフィールを読み込み中...</p>
            </div>

            <!-- プロフィールフォーム -->
            <div id="profile-form" class="hidden">
                <!-- 基本情報 -->
                <div class="mb-8">
                    <h2 class="text-xl font-bold text-gray-800 mb-4 flex items-center">
                        <i class="fas fa-info-circle text-purple-600 mr-2"></i>
                        基本情報
                    </h2>
                    <div class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">メールアドレス</label>
                            <input type="email" id="email" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent" placeholder="your-email@example.com">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">家族のニックネーム</label>
                            <input type="text" id="title" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent" placeholder="例: 田中家">
                        </div>
                    </div>
                </div>

                <!-- 家族構成 -->
                <div class="mb-8">
                    <h2 class="text-xl font-bold text-gray-800 mb-4 flex items-center">
                        <i class="fas fa-users text-purple-600 mr-2"></i>
                        家族構成
                    </h2>
                    <div class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">家族人数</label>
                            <input type="number" id="members_count" min="1" max="10" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                        </div>
                    </div>
                </div>

                <!-- 子供のプロフィール -->
                <div class="mb-8">
                    <h2 class="text-xl font-bold text-gray-800 mb-4 flex items-center justify-between">
                        <span>
                            <i class="fas fa-child text-purple-600 mr-2"></i>
                            子供のプロフィール
                        </span>
                        <button type="button" onclick="addChild()" class="text-sm bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700">
                            <i class="fas fa-plus mr-1"></i>子供を追加
                        </button>
                    </h2>
                    <div id="children-list" class="space-y-4">
                        <!-- 子供のプロフィールがここに動的に追加されます -->
                    </div>
                    <p class="mt-2 text-sm text-gray-500">※ 子供がいない場合は空欄のままで構いません</p>
                </div>

                <!-- 予算・調理時間 -->
                <div class="mb-8">
                    <h2 class="text-xl font-bold text-gray-800 mb-4 flex items-center">
                        <i class="fas fa-yen-sign text-purple-600 mr-2"></i>
                        予算・調理時間
                    </h2>
                    <div class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">1人あたりの予算（1食分）</label>
                            <select id="budget_tier_per_person" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                                <option value="300">300円（節約志向）</option>
                                <option value="500">500円（標準）</option>
                                <option value="800">800円（ゆとり）</option>
                                <option value="1000">1000円（充実）</option>
                                <option value="1200">1200円（贅沢）</option>
                                <option value="1500">1500円（プレミアム）</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">調理時間の上限</label>
                            <select id="cooking_time_limit_min" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                                <option value="15">15分（超時短）</option>
                                <option value="30">30分（標準）</option>
                                <option value="45">45分（ゆっくり）</option>
                                <option value="60">60分（じっくり）</option>
                            </select>
                        </div>
                    </div>
                </div>

                <!-- 好き嫌い・アレルギー -->
                <div class="mb-8">
                    <h2 class="text-xl font-bold text-gray-800 mb-4 flex items-center">
                        <i class="fas fa-exclamation-triangle text-purple-600 mr-2"></i>
                        好き嫌い・アレルギー
                    </h2>
                    <div class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">嫌いな食材（複数選択可）</label>
                            <div id="dislikes-container" class="grid grid-cols-2 md:grid-cols-3 gap-2">
                                <!-- JavaScript で動的生成 -->
                            </div>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">アレルギー（複数選択可）</label>
                            <div id="allergies-container" class="grid grid-cols-2 md:grid-cols-3 gap-2">
                                <!-- JavaScript で動的生成 -->
                            </div>
                        </div>
                    </div>
                </div>

                <!-- パスワード変更（オプション） -->
                <div class="mb-8">
                    <h2 class="text-xl font-bold text-gray-800 mb-4 flex items-center">
                        <i class="fas fa-lock text-purple-600 mr-2"></i>
                        パスワード変更（変更する場合のみ入力）
                    </h2>
                    <div class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">新しいパスワード</label>
                            <input type="password" id="new_password" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent" placeholder="8文字以上">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">パスワード確認</label>
                            <input type="password" id="confirm_password" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent" placeholder="もう一度入力">
                        </div>
                    </div>
                </div>

                <!-- 保存ボタン -->
                <div class="flex items-center space-x-4">
                    <button onclick="saveProfile()" class="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-4 px-8 rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200">
                        <i class="fas fa-save mr-2"></i>
                        変更を保存
                    </button>
                    <a href="/dashboard" class="px-8 py-4 border-2 border-gray-300 text-gray-700 font-bold rounded-lg hover:bg-gray-50 transition-colors">
                        キャンセル
                    </a>
                </div>
            </div>

            <!-- エラーメッセージ -->
            <div id="error-message" class="hidden mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                <i class="fas fa-exclamation-circle mr-2"></i>
                <span id="error-text"></span>
            </div>

            <!-- 成功メッセージ -->
            <div id="success-message" class="hidden mt-4 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
                <i class="fas fa-check-circle mr-2"></i>
                <span id="success-text"></span>
            </div>
        </div>
    </main>

    <script src="https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js"></script>
    <script>
        let household_id = null;

        // 嫌いな食材の選択肢
        const dislikesOptions = [
            '辛い物', '貝類', 'エビ', 'カニ', 'イカ', 'タコ', '魚', '肉', '豚肉', '牛肉', '鶏肉',
            '卵', '乳製品', 'ナス', 'ピーマン', 'トマト', 'キノコ', '海藻', '豆腐', '納豆', 'レバー'
        ];

        // アレルギーの選択肢（7大アレルゲン）
        const allergiesOptions = [
            '卵', '乳', '小麦', 'エビ', 'カニ', 'そば', 'ピーナッツ'
        ];

        // ページ読み込み時にプロフィールを取得
        document.addEventListener('DOMContentLoaded', async () => {
            try {
                const token = localStorage.getItem('auth_token');
                if (!token) {
                    window.location.href = '/login';
                    return;
                }

                // プロフィール取得
                const response = await axios.get('/api/profile', {
                    headers: { 'Authorization': \`Bearer \${token}\` }
                });

                const profile = response.data;
                household_id = profile.household_id;

                // フォームに値をセット
                document.getElementById('email').value = profile.email || '';
                document.getElementById('title').value = profile.title || '';
                document.getElementById('members_count').value = profile.members_count || 1;
                document.getElementById('budget_tier_per_person').value = profile.budget_tier_per_person || 500;
                document.getElementById('cooking_time_limit_min').value = profile.cooking_time_limit_min || 30;

                // 子どもの年齢
                const childrenAges = JSON.parse(profile.children_ages_json || '[]');
                document.getElementById('children_ages').value = childrenAges.join(', ');

                // 嫌いな食材のチェックボックス生成（英語→日本語マッピング）
                const dislikesContainer = document.getElementById('dislikes-container');
                const currentDislikes = JSON.parse(profile.dislikes_json || '[]');
                const reverseDislikesMapping = {
                    'spicy': '辛い物',
                    'shellfish': '貝類',
                    'shrimp': 'エビ',
                    'crab': 'カニ',
                    'squid': 'イカ',
                    'octopus': 'タコ',
                    'fish': '魚',
                    'meat': '肉',
                    'pork': '豚肉',
                    'beef': '牛肉',
                    'chicken': '鶏肉',
                    'offal': 'レバー'
                };
                dislikesOptions.forEach(item => {
                    const div = document.createElement('div');
                    div.className = 'flex items-center';
                    // DBに保存されている英語キーを日本語に変換してチェック
                    const isChecked = currentDislikes.some(dislike => {
                        return reverseDislikesMapping[dislike] === item || dislike === item;
                    });
                    div.innerHTML = \`
                        <input type="checkbox" id="dislike-\${item}" value="\${item}" class="mr-2 w-4 h-4 text-purple-600 focus:ring-purple-500" \${isChecked ? 'checked' : ''}>
                        <label for="dislike-\${item}" class="text-sm text-gray-700">\${item}</label>
                    \`;
                    dislikesContainer.appendChild(div);
                });

                // アレルギーのチェックボックス生成
                const allergiesContainer = document.getElementById('allergies-container');
                const currentAllergies = JSON.parse(profile.allergies_standard_json || '[]');
                allergiesOptions.forEach(item => {
                    const div = document.createElement('div');
                    div.className = 'flex items-center';
                    div.innerHTML = \`
                        <input type="checkbox" id="allergy-\${item}" value="\${item}" class="mr-2 w-4 h-4 text-red-600 focus:ring-red-500" \${currentAllergies.includes(item) ? 'checked' : ''}>
                        <label for="allergy-\${item}" class="text-sm text-gray-700">\${item}</label>
                    \`;
                    allergiesContainer.appendChild(div);
                });

                // 子供のプロフィールを読み込み
                await loadChildren();

                // ローディング非表示、フォーム表示
                document.getElementById('loading').classList.add('hidden');
                document.getElementById('profile-form').classList.remove('hidden');

            } catch (error) {
                console.error('プロフィール取得エラー:', error);
                showError('プロフィールの読み込みに失敗しました。再度ログインしてください。');
                setTimeout(() => {
                    window.location.href = '/login';
                }, 2000);
            }
        });

        // 子供のプロフィール管理
        let childrenData = [];

        async function loadChildren() {
            try {
                const token = localStorage.getItem('auth_token');
                const response = await axios.get('/api/children', {
                    headers: { 'Authorization': \`Bearer \${token}\` }
                });
                childrenData = response.data.children || [];
                renderChildren();
            } catch (error) {
                console.error('子供プロフィール取得エラー:', error);
            }
        }

        function renderChildren() {
            const container = document.getElementById('children-list');
            container.innerHTML = '';
            
            if (childrenData.length === 0) {
                container.innerHTML = '<p class="text-gray-500 text-sm">まだ子供のプロフィールが登録されていません</p>';
                return;
            }

            childrenData.forEach((child, index) => {
                const dislikes = JSON.parse(child.dislikes_json || '[]');
                const allergies = JSON.parse(child.allergies_json || '[]');
                
                const childCard = document.createElement('div');
                childCard.className = 'bg-gray-50 border border-gray-200 rounded-lg p-4';
                childCard.innerHTML = \`
                    <div class="flex justify-between items-start mb-3">
                        <div>
                            <h3 class="font-bold text-lg text-gray-800">\${child.name} （\${child.age}歳）</h3>
                        </div>
                        <button type="button" onclick="deleteChild('\${child.child_id}')" class="text-red-600 hover:text-red-700">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                    <div class="space-y-2 text-sm">
                        <div>
                            <span class="font-medium text-gray-700">嫌いなもの:</span>
                            <span class="text-gray-600">\${dislikes.length > 0 ? dislikes.join(', ') : 'なし'}</span>
                        </div>
                        <div>
                            <span class="font-medium text-gray-700">アレルギー:</span>
                            <span class="text-gray-600">\${allergies.length > 0 ? allergies.join(', ') : 'なし'}</span>
                        </div>
                    </div>
                \`;
                container.appendChild(childCard);
            });
        }

        async function addChild() {
            const name = prompt('子供の名前を入力してください:');
            if (!name) return;

            const age = parseInt(prompt('年齢を入力してください:', '5'));
            if (!age || age < 0 || age > 20) {
                alert('有効な年齢を入力してください（0-20歳）');
                return;
            }

            try {
                const token = localStorage.getItem('auth_token');
                await axios.post('/api/children', {
                    name,
                    age,
                    dislikes_json: '[]',
                    allergies_json: '[]'
                }, {
                    headers: { 
                        'Authorization': \`Bearer \${token}\`,
                        'Content-Type': 'application/json'
                    }
                });

                alert('子供のプロフィールを追加しました！');
                await loadChildren();
            } catch (error) {
                console.error('子供追加エラー:', error);
                alert('追加に失敗しました');
            }
        }

        async function deleteChild(childId) {
            if (!confirm('この子供のプロフィールを削除しますか？')) return;

            try {
                const token = localStorage.getItem('auth_token');
                await axios.delete(\`/api/children/\${childId}\`, {
                    headers: { 'Authorization': \`Bearer \${token}\` }
                });

                alert('削除しました');
                await loadChildren();
            } catch (error) {
                console.error('子供削除エラー:', error);
                alert('削除に失敗しました');
            }
        }

        // グローバルに公開
        window.addChild = addChild;
        window.deleteChild = deleteChild;

        // プロフィール保存
        async function saveProfile() {
            try {
                const token = localStorage.getItem('auth_token');
                if (!token) {
                    window.location.href = '/login';
                    return;
                }

                // バリデーション
                const email = document.getElementById('email').value.trim();
                const title = document.getElementById('title').value.trim();
                const members_count = parseInt(document.getElementById('members_count').value);
                const new_password = document.getElementById('new_password').value;
                const confirm_password = document.getElementById('confirm_password').value;

                if (!email || !title || !members_count) {
                    showError('必須項目を入力してください。');
                    return;
                }

                if (new_password && new_password !== confirm_password) {
                    showError('パスワードが一致しません。');
                    return;
                }

                if (new_password && new_password.length < 8) {
                    showError('パスワードは8文字以上で入力してください。');
                    return;
                }

                // 子どもの年齢をパース
                const childrenAgesInput = document.getElementById('children_ages').value.trim();
                const children_ages = childrenAgesInput ? childrenAgesInput.split(',').map(age => parseInt(age.trim())).filter(age => !isNaN(age)) : [];

                // 嫌いな食材を収集（日本語→英語マッピング）
                const dislikesMapping = {
                    '辛い物': 'spicy',
                    '貝類': 'shellfish',
                    'エビ': 'shrimp',
                    'カニ': 'crab',
                    'イカ': 'squid',
                    'タコ': 'octopus',
                    '魚': 'fish',
                    '肉': 'meat',
                    '豚肉': 'pork',
                    '牛肉': 'beef',
                    '鶏肉': 'chicken',
                    'レバー': 'offal'
                };
                const dislikes = [];
                dislikesOptions.forEach(item => {
                    if (document.getElementById(\`dislike-\${item}\`).checked) {
                        // マッピングがあれば英語に変換、なければそのまま
                        dislikes.push(dislikesMapping[item] || item);
                    }
                });

                // アレルギーを収集
                const allergies = [];
                allergiesOptions.forEach(item => {
                    if (document.getElementById(\`allergy-\${item}\`).checked) {
                        allergies.push(item);
                    }
                });

                // リクエストボディ作成
                const requestBody = {
                    email,
                    title,
                    members_count,
                    budget_tier_per_person: parseInt(document.getElementById('budget_tier_per_person').value),
                    cooking_time_limit_min: parseInt(document.getElementById('cooking_time_limit_min').value),
                    children_ages_json: JSON.stringify(children_ages),
                    dislikes_json: JSON.stringify(dislikes),
                    allergies_standard_json: JSON.stringify(allergies)
                };

                // パスワード変更がある場合のみ追加
                if (new_password) {
                    requestBody.new_password = new_password;
                }

                // API呼び出し
                const response = await axios.put(\`/api/profile/update\`, requestBody, {
                    headers: { 'Authorization': \`Bearer \${token}\` }
                });

                showSuccess('プロフィールを更新しました！');
                
                // パスワード変更した場合は再ログインを促す
                if (new_password) {
                    setTimeout(() => {
                        alert('パスワードが変更されました。再度ログインしてください。');
                        localStorage.removeItem('auth_token');
                        window.location.href = '/login';
                    }, 1500);
                } else {
                    setTimeout(() => {
                        window.location.href = '/dashboard';
                    }, 1500);
                }

            } catch (error) {
                console.error('プロフィール更新エラー:', error);
                showError(error.response?.data?.error || 'プロフィールの更新に失敗しました。');
            }
        }

        // ログアウト
        function logout() {
            localStorage.removeItem('auth_token');
            window.location.href = '/login';
        }

        // エラーメッセージ表示
        function showError(message) {
            document.getElementById('error-text').textContent = message;
            document.getElementById('error-message').classList.remove('hidden');
            document.getElementById('success-message').classList.add('hidden');
        }

        // 成功メッセージ表示
        function showSuccess(message) {
            document.getElementById('success-text').textContent = message;
            document.getElementById('success-message').classList.remove('hidden');
            document.getElementById('error-message').classList.add('hidden');
        }
    </script>
</body>
</html>
`;

// ========================================
// 子ども食堂寄付LP HTML
// ========================================
const DONATION_LP_HTML = `
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>子ども食堂を支援する - あなたの300円が子どもたちの笑顔を守る</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
    <script src="https://js.stripe.com/v3/"></script>
    <style>
        .hero-bg {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
        .card-hover {
            transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .card-hover:hover {
            transform: translateY(-5px);
            box-shadow: 0 20px 40px rgba(0,0,0,0.15);
        }
    </style>
</head>
<body class="bg-gray-50">
    <!-- ヒーローセクション -->
    <div class="hero-bg text-white py-20">
        <div class="max-w-6xl mx-auto px-4">
            <div class="text-center mb-12">
                <h1 class="text-5xl font-bold mb-6">
                    一杯300円の温かさが、<br>子どもたちの笑顔を守る
                </h1>
                <p class="text-2xl mb-8 opacity-90">
                    あなたの善意で、子ども食堂が蘇る
                </p>
                <a href="#donate-form" class="inline-block bg-yellow-400 text-gray-900 px-12 py-4 rounded-full text-xl font-bold hover:bg-yellow-300 transition shadow-2xl">
                    <i class="fas fa-heart mr-2"></i>
                    今すぐ寄付する
                </a>
            </div>
        </div>
    </div>

    <!-- 統計セクション -->
    <div class="bg-white py-12 shadow-md">
        <div class="max-w-6xl mx-auto px-4">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8 text-center" id="stats-section">
                <div>
                    <div class="text-5xl font-bold text-purple-600 mb-2" id="total-amount">0</div>
                    <div class="text-gray-600 font-semibold">累計寄付金額（円）</div>
                </div>
                <div>
                    <div class="text-5xl font-bold text-purple-600 mb-2" id="total-count">0</div>
                    <div class="text-gray-600 font-semibold">寄付者数（人）</div>
                </div>
                <div>
                    <div class="text-5xl font-bold text-purple-600 mb-2" id="total-units">0</div>
                    <div class="text-gray-600 font-semibold">支援食数（食）</div>
                </div>
            </div>
        </div>
    </div>

    <!-- 問題提起セクション -->
    <div class="max-w-6xl mx-auto px-4 py-16">
        <h2 class="text-4xl font-bold text-center text-gray-800 mb-12">
            いま、子ども食堂が危機に瀕しています
        </h2>
        
        <div class="grid md:grid-cols-2 gap-8 mb-12">
            <div class="bg-red-50 border-l-4 border-red-500 p-6 rounded-lg">
                <h3 class="text-2xl font-bold text-red-700 mb-4">
                    <i class="fas fa-exclamation-triangle mr-2"></i>
                    資金不足
                </h3>
                <p class="text-gray-700 leading-relaxed">
                    物価高騰により、食材費が30%以上上昇。多くの子ども食堂が運営困難に陥っています。
                </p>
            </div>
            
            <div class="bg-orange-50 border-l-4 border-orange-500 p-6 rounded-lg">
                <h3 class="text-2xl font-bold text-orange-700 mb-4">
                    <i class="fas fa-child mr-2"></i>
                    増え続ける子どもたち
                </h3>
                <p class="text-gray-700 leading-relaxed">
                    支援を必要とする子どもは年々増加。でも、予算は限られています。
                </p>
            </div>
        </div>

        <div class="text-center bg-gradient-to-r from-purple-100 to-pink-100 p-8 rounded-2xl">
            <p class="text-2xl font-bold text-gray-800 mb-4">
                だからこそ、あなたの力が必要です
            </p>
            <p class="text-lg text-gray-700">
                一口300円の寄付が、子どもたちに温かい食事と居場所を提供します
            </p>
        </div>
    </div>

    <!-- 寄付の使い道 -->
    <div class="bg-gradient-to-br from-indigo-50 to-purple-50 py-16">
        <div class="max-w-6xl mx-auto px-4">
            <h2 class="text-4xl font-bold text-center text-gray-800 mb-12">
                あなたの寄付は、こう使われます
            </h2>
            
            <div class="grid md:grid-cols-3 gap-8">
                <div class="bg-white p-6 rounded-xl shadow-lg card-hover">
                    <div class="text-center mb-4">
                        <div class="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto">
                            <i class="fas fa-utensils text-3xl text-white"></i>
                        </div>
                    </div>
                    <h3 class="text-xl font-bold text-center mb-3">食材の購入</h3>
                    <p class="text-gray-600 text-center">
                        新鮮な野菜、お肉、お魚など、栄養バランスの取れた食材を購入します
                    </p>
                </div>
                
                <div class="bg-white p-6 rounded-xl shadow-lg card-hover">
                    <div class="text-center mb-4">
                        <div class="w-20 h-20 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center mx-auto">
                            <i class="fas fa-home text-3xl text-white"></i>
                        </div>
                    </div>
                    <h3 class="text-xl font-bold text-center mb-3">運営費</h3>
                    <p class="text-gray-600 text-center">
                        会場費、光熱費など、子ども食堂を続けるための基本的な費用に使います
                    </p>
                </div>
                
                <div class="bg-white p-6 rounded-xl shadow-lg card-hover">
                    <div class="text-center mb-4">
                        <div class="w-20 h-20 bg-gradient-to-br from-pink-400 to-pink-600 rounded-full flex items-center justify-center mx-auto">
                            <i class="fas fa-smile text-3xl text-white"></i>
                        </div>
                    </div>
                    <h3 class="text-xl font-bold text-center mb-3">活動拡大</h3>
                    <p class="text-gray-600 text-center">
                        より多くの子どもたちに支援を届けるため、新しい活動に挑戦します
                    </p>
                </div>
            </div>
        </div>
    </div>

    <!-- 寄付フォーム -->
    <div class="max-w-3xl mx-auto px-4 py-16" id="donate-form">
        <div class="bg-white rounded-2xl shadow-2xl p-8">
            <h2 class="text-3xl font-bold text-center text-gray-800 mb-8">
                <i class="fas fa-heart text-red-500 mr-2"></i>
                寄付フォーム
            </h2>
            
            <form id="donation-form" class="space-y-6">
                <!-- 口数選択 -->
                <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-3">
                        寄付口数を選択（1口 = 300円）
                    </label>
                    <div class="grid grid-cols-5 gap-3">
                        <button type="button" class="unit-btn px-4 py-3 border-2 border-gray-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition font-semibold" data-units="1">
                            1口<br><span class="text-sm">300円</span>
                        </button>
                        <button type="button" class="unit-btn px-4 py-3 border-2 border-gray-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition font-semibold" data-units="2">
                            2口<br><span class="text-sm">600円</span>
                        </button>
                        <button type="button" class="unit-btn px-4 py-3 border-2 border-gray-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition font-semibold" data-units="3">
                            3口<br><span class="text-sm">900円</span>
                        </button>
                        <button type="button" class="unit-btn px-4 py-3 border-2 border-gray-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition font-semibold" data-units="5">
                            5口<br><span class="text-sm">1,500円</span>
                        </button>
                        <button type="button" class="unit-btn px-4 py-3 border-2 border-gray-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition font-semibold" data-units="10">
                            10口<br><span class="text-sm">3,000円</span>
                        </button>
                    </div>
                    <input type="hidden" id="unit_count" name="unit_count" value="1" required>
                    <div class="mt-3 text-center">
                        <span class="text-2xl font-bold text-purple-600">寄付金額: </span>
                        <span id="amount-display" class="text-3xl font-bold text-purple-600">300円</span>
                    </div>
                </div>
                
                <!-- 表示名 -->
                <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-2">
                        <i class="fas fa-user text-purple-600 mr-2"></i>
                        表示名（本名でなくてもOK）
                    </label>
                    <input type="text" id="donor_name" name="donor_name" required
                           class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                           placeholder="例：やさしいママ、応援団">
                </div>
                
                <!-- メールアドレス -->
                <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-2">
                        <i class="fas fa-envelope text-purple-600 mr-2"></i>
                        メールアドレス（寄付証明書送付用）
                    </label>
                    <input type="email" id="donor_email" name="donor_email" required
                           class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                           placeholder="example@email.com">
                </div>
                
                <!-- 電話番号（任意） -->
                <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-2">
                        <i class="fas fa-phone text-purple-600 mr-2"></i>
                        電話番号（任意）
                    </label>
                    <input type="tel" id="donor_phone" name="donor_phone"
                           class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                           placeholder="090-1234-5678">
                </div>
                
                <!-- メッセージ -->
                <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-2">
                        <i class="fas fa-comment text-purple-600 mr-2"></i>
                        メッセージ（任意）
                    </label>
                    <textarea id="message" name="message" rows="3"
                              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                              placeholder="子どもたちへの応援メッセージをどうぞ"></textarea>
                </div>
                
                <!-- 公開設定 -->
                <div>
                    <label class="flex items-center">
                        <input type="checkbox" id="is_public" name="is_public" checked
                               class="w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500">
                        <span class="ml-3 text-gray-700">寄付者一覧に表示する</span>
                    </label>
                </div>
                
                <!-- Stripeカード決済フォーム -->
                <div id="card-element-container" class="border-2 border-gray-300 rounded-lg p-4">
                    <label class="block text-sm font-semibold text-gray-700 mb-3">
                        <i class="fas fa-credit-card text-purple-600 mr-2"></i>
                        カード情報
                    </label>
                    <div id="card-element" class="p-3 border border-gray-200 rounded-lg bg-white">
                        <!-- Stripe Elements will insert the Card Element here -->
                    </div>
                    <div id="card-errors" class="text-red-600 text-sm mt-2" role="alert"></div>
                </div>
                
                <!-- 送信ボタン -->
                <button type="submit" id="submit-button"
                        class="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-lg text-xl font-bold hover:from-purple-700 hover:to-pink-700 transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed">
                    <i class="fas fa-lock mr-2"></i>
                    <span id="button-text">クレジットカードで寄付する</span>
                    <span id="button-spinner" class="hidden">
                        <i class="fas fa-spinner fa-spin mr-2"></i>処理中...
                    </span>
                </button>
                
                <p class="text-center text-sm text-gray-500 mt-4">
                    <i class="fas fa-shield-alt mr-1"></i>
                    Stripeの安全な決済システムを使用しています
                </p>
            </form>
        </div>
    </div>

    <!-- 寄付者一覧 -->
    <div class="bg-gray-100 py-16">
        <div class="max-w-6xl mx-auto px-4">
            <h2 class="text-3xl font-bold text-center text-gray-800 mb-8">
                <i class="fas fa-users text-purple-600 mr-2"></i>
                応援してくださっている皆様
            </h2>
            <div id="donors-list" class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <!-- JavaScriptで動的に挿入 -->
            </div>
        </div>
    </div>

    <script>
        // 統計情報を取得
        async function loadStats() {
            try {
                const response = await fetch('/api/donations/stats');
                const data = await response.json();
                const stats = data.stats;
                
                document.getElementById('total-amount').textContent = (stats.total_amount || 0).toLocaleString();
                document.getElementById('total-count').textContent = (stats.total_count || 0).toLocaleString();
                document.getElementById('total-units').textContent = (stats.total_units || 0).toLocaleString();
            } catch (error) {
                console.error('統計情報の取得エラー:', error);
            }
        }
        
        // 寄付者一覧を取得
        async function loadDonors() {
            try {
                const response = await fetch('/api/donations/list');
                const data = await response.json();
                const donations = data.donations || [];
                
                const listEl = document.getElementById('donors-list');
                listEl.innerHTML = donations.map(d => \`
                    <div class="bg-white p-6 rounded-lg shadow card-hover">
                        <div class="flex items-center mb-3">
                            <i class="fas fa-user-circle text-3xl text-purple-600 mr-3"></i>
                            <div>
                                <div class="font-bold text-lg">\${d.donor_name}</div>
                                <div class="text-sm text-gray-500">\${new Date(d.created_at).toLocaleDateString('ja-JP')}</div>
                            </div>
                        </div>
                        <div class="text-purple-600 font-bold mb-2">
                            \${d.amount.toLocaleString()}円（\${d.unit_count}口）
                        </div>
                        \${d.message ? \`<p class="text-gray-600 text-sm italic">"\${d.message}"</p>\` : ''}
                    </div>
                \`).join('');
            } catch (error) {
                console.error('寄付者一覧の取得エラー:', error);
            }
        }
        
        // 口数選択
        document.querySelectorAll('.unit-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.unit-btn').forEach(b => {
                    b.classList.remove('border-purple-500', 'bg-purple-50', 'font-bold');
                    b.classList.add('border-gray-300');
                });
                btn.classList.add('border-purple-500', 'bg-purple-50', 'font-bold');
                btn.classList.remove('border-gray-300');
                
                const units = parseInt(btn.dataset.units);
                document.getElementById('unit_count').value = units;
                document.getElementById('amount-display').textContent = (units * 300).toLocaleString() + '円';
            });
        });
        
        // 初期選択（1口）
        document.querySelector('.unit-btn').click();
        
        // フォーム送信
        // Stripe初期化（公開可能キーは環境変数から設定、ここではプレースホルダー）
        // 本番環境では STRIPE_PUBLISHABLE_KEY を設定してください
        const stripe = Stripe('pk_test_YOUR_PUBLISHABLE_KEY'); // TODO: 本番用に変更
        const elements = stripe.elements();
        const cardElement = elements.create('card', {
            style: {
                base: {
                    fontSize: '16px',
                    color: '#32325d',
                    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                    '::placeholder': {
                        color: '#aab7c4'
                    }
                },
                invalid: {
                    color: '#fa755a',
                    iconColor: '#fa755a'
                }
            }
        });
        cardElement.mount('#card-element');
        
        // カードエラー表示
        cardElement.on('change', (event) => {
            const displayError = document.getElementById('card-errors');
            if (event.error) {
                displayError.textContent = event.error.message;
            } else {
                displayError.textContent = '';
            }
        });
        
        document.getElementById('donation-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const submitButton = document.getElementById('submit-button');
            const buttonText = document.getElementById('button-text');
            const buttonSpinner = document.getElementById('button-spinner');
            
            // ボタンを無効化
            submitButton.disabled = true;
            buttonText.classList.add('hidden');
            buttonSpinner.classList.remove('hidden');
            
            // ログインユーザーのhousehold_idを取得
            const authToken = localStorage.getItem('auth_token');
            const userStr = localStorage.getItem('user');
            let household_id = null;
            if (authToken && userStr) {
                try {
                    const user = JSON.parse(userStr);
                    household_id = user.household_id || authToken; // household_idまたはトークンをIDとして使用
                } catch (e) {
                    console.error('ユーザー情報の解析エラー:', e);
                }
            }
            
            const formData = {
                donor_name: document.getElementById('donor_name').value,
                donor_email: document.getElementById('donor_email').value,
                donor_phone: document.getElementById('donor_phone').value || null,
                unit_count: parseInt(document.getElementById('unit_count').value),
                message: document.getElementById('message').value || null,
                is_public: document.getElementById('is_public').checked ? 1 : 0,
                household_id: household_id  // ログインユーザーのIDを追加
            };
            
            try {
                // Step 1: Payment Intentを作成
                const piResponse = await fetch('/api/donations/create-payment-intent', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                });
                
                if (!piResponse.ok) {
                    throw new Error('Payment Intent作成に失敗しました');
                }
                
                const { clientSecret, amount } = await piResponse.json();
                
                // Step 2: Stripeで決済確認
                const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
                    payment_method: {
                        card: cardElement,
                        billing_details: {
                            name: formData.donor_name,
                            email: formData.donor_email,
                            phone: formData.donor_phone
                        }
                    }
                });
                
                if (stripeError) {
                    throw new Error(stripeError.message);
                }
                
                // Step 3: 決済成功後、寄付をDBに登録
                const donationResponse = await fetch('/api/donations/create', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        ...formData,
                        payment_method: 'credit_card',
                        payment_intent_id: paymentIntent.id
                    })
                });
                
                const donationResult = await donationResponse.json();
                
                if (!donationResponse.ok) {
                    throw new Error(donationResult.error || '寄付の登録に失敗しました');
                }
                
                // Step 4: お礼メール送信
                await fetch('/api/donations/send-thank-you-email', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        donor_email: formData.donor_email,
                        donor_name: formData.donor_name,
                        certificate_number: donationResult.certificate_number,
                        amount: donationResult.amount,
                        message: formData.message
                    })
                });
                
                // Step 5: 完了ページに遷移
                window.location.href = '/donation/thanks?donation_id=' + donationResult.donation_id + 
                                       '&certificate_number=' + donationResult.certificate_number +
                                       '&amount=' + donationResult.amount;
                
            } catch (error) {
                console.error('寄付送信エラー:', error);
                alert('寄付の送信中にエラーが発生しました: ' + error.message);
                
                // ボタンを再度有効化
                submitButton.disabled = false;
                buttonText.classList.remove('hidden');
                buttonSpinner.classList.add('hidden');
            }
        });
        
        // ページ読み込み時に実行
        loadStats();
        loadDonors();
    </script>
</body>
</html>
`;

// ========================================
// 寄付完了ページ HTML
// ========================================
const DONATION_THANKS_HTML = `
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>寄付ありがとうございます - 子ども食堂支援</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
</head>
<body class="bg-gradient-to-br from-purple-50 to-pink-50 min-h-screen flex items-center justify-center p-4">
    <div class="max-w-2xl w-full bg-white rounded-2xl shadow-2xl p-8">
        <div class="text-center mb-8">
            <div class="w-24 h-24 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <i class="fas fa-check text-5xl text-white"></i>
            </div>
            <h1 class="text-4xl font-bold text-gray-800 mb-4">
                ご寄付ありがとうございます！
            </h1>
            <p class="text-xl text-gray-600 mb-6">
                あなたの善意が、子どもたちの笑顔を守ります
            </p>
        </div>
        
        <div id="donation-info" class="bg-purple-50 p-6 rounded-xl mb-6">
            <!-- JavaScriptで動的に挿入 -->
        </div>
        
        <div class="space-y-4">
            <a href="/donation" class="block w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg text-center font-semibold hover:from-purple-700 hover:to-pink-700 transition">
                <i class="fas fa-arrow-left mr-2"></i>
                寄付ページに戻る
            </a>
            <a href="/" class="block w-full bg-gray-200 text-gray-800 px-6 py-3 rounded-lg text-center font-semibold hover:bg-gray-300 transition">
                <i class="fas fa-home mr-2"></i>
                トップページへ
            </a>
        </div>
    </div>
    
    <script>
        const urlParams = new URLSearchParams(window.location.search);
        const donationId = urlParams.get('donation_id');
        
        async function loadDonationInfo() {
            if (!donationId) {
                document.getElementById('donation-info').innerHTML = \`
                    <p class="text-center text-gray-600">寄付情報を取得できませんでした</p>
                \`;
                return;
            }
            
            try {
                const response = await fetch('/api/donations/certificate/' + donationId);
                const data = await response.json();
                const cert = data.certificate;
                
                document.getElementById('donation-info').innerHTML = \`
                    <h3 class="text-xl font-bold text-gray-800 mb-4">寄付内容</h3>
                    <div class="space-y-2 text-gray-700">
                        <p><strong>寄付金額:</strong> \${(cert.amount || 0).toLocaleString()}円（\${cert.unit_count}口）</p>
                        <p><strong>寄付者名:</strong> \${cert.donor_name}</p>
                        <p><strong>証明書番号:</strong> \${cert.certificate_number}</p>
                        <p><strong>発行日:</strong> \${cert.issue_date}</p>
                    </div>
                    <div class="mt-4 p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
                        <p class="text-sm text-gray-700">
                            <i class="fas fa-info-circle text-blue-500 mr-2"></i>
                            寄付証明書は、ご登録のメールアドレスに送信されました。
                        </p>
                    </div>
                \`;
            } catch (error) {
                console.error('寄付情報の取得エラー:', error);
            }
        }
        
        loadDonationInfo();
    </script>
</body>
</html>
`;

// ========================================
// 管理者寄付ダッシュボード HTML
// ========================================
const ADMIN_DONATION_DASHBOARD_HTML = `
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>寄付管理ダッシュボード - 管理者画面</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
</head>
<body class="bg-gray-50">
    <!-- ヘッダー -->
    <header class="bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg">
        <div class="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
            <div class="flex items-center gap-3">
                <i class="fas fa-shield-alt text-3xl"></i>
                <div>
                    <h1 class="text-2xl font-bold">寄付管理ダッシュボード</h1>
                    <p class="text-sm text-purple-200">管理者専用画面</p>
                </div>
            </div>
            <div class="flex items-center gap-4">
                <a href="/donation" class="px-4 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg transition">
                    <i class="fas fa-eye mr-2"></i>
                    寄付ページを表示
                </a>
                <a href="/" class="px-4 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg transition">
                    <i class="fas fa-home mr-2"></i>
                    トップページ
                </a>
            </div>
        </div>
    </header>

    <!-- メインコンテンツ -->
    <div class="max-w-7xl mx-auto px-4 py-8">
        <!-- 統計カード -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div class="bg-white rounded-xl shadow-lg p-6">
                <div class="flex items-center justify-between mb-2">
                    <h3 class="text-gray-600 font-semibold">累計寄付金額</h3>
                    <i class="fas fa-yen-sign text-2xl text-green-500"></i>
                </div>
                <p id="total-amount" class="text-3xl font-bold text-gray-800">0円</p>
                <p class="text-sm text-gray-500 mt-1">全期間合計</p>
            </div>
            
            <div class="bg-white rounded-xl shadow-lg p-6">
                <div class="flex items-center justify-between mb-2">
                    <h3 class="text-gray-600 font-semibold">寄付者数</h3>
                    <i class="fas fa-users text-2xl text-blue-500"></i>
                </div>
                <p id="total-count" class="text-3xl font-bold text-gray-800">0人</p>
                <p class="text-sm text-gray-500 mt-1">累計寄付者</p>
            </div>
            
            <div class="bg-white rounded-xl shadow-lg p-6">
                <div class="flex items-center justify-between mb-2">
                    <h3 class="text-gray-600 font-semibold">支援食数</h3>
                    <i class="fas fa-utensils text-2xl text-purple-500"></i>
                </div>
                <p id="total-units" class="text-3xl font-bold text-gray-800">0食</p>
                <p class="text-sm text-gray-500 mt-1">提供可能な食事数</p>
            </div>
            
            <div class="bg-white rounded-xl shadow-lg p-6">
                <div class="flex items-center justify-between mb-2">
                    <h3 class="text-gray-600 font-semibold">平均寄付額</h3>
                    <i class="fas fa-chart-line text-2xl text-orange-500"></i>
                </div>
                <p id="avg-amount" class="text-3xl font-bold text-gray-800">0円</p>
                <p class="text-sm text-gray-500 mt-1">1人あたり</p>
            </div>
        </div>

        <!-- グラフセクション -->
        <div class="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h2 class="text-xl font-bold text-gray-800 mb-4">
                <i class="fas fa-chart-bar text-purple-600 mr-2"></i>
                月別寄付推移
            </h2>
            <canvas id="monthlyChart" height="80"></canvas>
        </div>

        <!-- 寄付一覧 -->
        <div class="bg-white rounded-xl shadow-lg p-6">
            <div class="flex items-center justify-between mb-6">
                <h2 class="text-xl font-bold text-gray-800">
                    <i class="fas fa-list text-purple-600 mr-2"></i>
                    寄付一覧
                </h2>
                <button onclick="exportCSV()" class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition">
                    <i class="fas fa-file-excel mr-2"></i>
                    CSVエクスポート
                </button>
            </div>
            
            <div class="overflow-x-auto">
                <table class="w-full">
                    <thead class="bg-gray-50">
                        <tr>
                            <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">日時</th>
                            <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">寄付者名</th>
                            <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">メール</th>
                            <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">電話番号</th>
                            <th class="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">金額</th>
                            <th class="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">口数</th>
                            <th class="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">公開</th>
                            <th class="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">証明書番号</th>
                            <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">メッセージ</th>
                        </tr>
                    </thead>
                    <tbody id="donations-table" class="divide-y divide-gray-200">
                        <!-- JavaScriptで動的に挿入 -->
                    </tbody>
                </table>
            </div>
        </div>
    </div>

    <script>
        let allDonations = [];
        
        // 統計情報を取得
        async function loadStats() {
            try {
                const response = await fetch('/api/donations/stats');
                const data = await response.json();
                const stats = data.stats;
                
                const totalAmount = stats.total_amount || 0;
                const totalCount = stats.total_count || 0;
                const totalUnits = stats.total_units || 0;
                const avgAmount = stats.avg_amount || 0;
                
                document.getElementById('total-amount').textContent = Math.round(totalAmount).toLocaleString() + '円';
                document.getElementById('total-count').textContent = Math.round(totalCount).toLocaleString() + '人';
                document.getElementById('total-units').textContent = Math.round(totalUnits).toLocaleString() + '食';
                document.getElementById('avg-amount').textContent = Math.round(avgAmount).toLocaleString() + '円';
            } catch (error) {
                console.error('統計情報の取得エラー:', error);
            }
        }
        
        // 寄付一覧を取得
        async function loadDonations() {
            try {
                const response = await fetch('/api/admin/donations');
                const data = await response.json();
                allDonations = data.donations || [];
                
                const tableEl = document.getElementById('donations-table');
                tableEl.innerHTML = allDonations.map(d => \`
                    <tr class="hover:bg-gray-50">
                        <td class="px-4 py-3 text-sm text-gray-700 whitespace-nowrap">
                            \${new Date(d.created_at).toLocaleString('ja-JP')}
                        </td>
                        <td class="px-4 py-3 text-sm font-medium text-gray-900">
                            \${d.donor_name}
                        </td>
                        <td class="px-4 py-3 text-sm text-gray-600">
                            \${d.donor_email}
                        </td>
                        <td class="px-4 py-3 text-sm text-gray-600">
                            \${d.donor_phone || '-'}
                        </td>
                        <td class="px-4 py-3 text-sm font-semibold text-gray-900 text-right">
                            \${d.amount.toLocaleString()}円
                        </td>
                        <td class="px-4 py-3 text-sm text-center">
                            <span class="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">
                                \${d.unit_count}口
                            </span>
                        </td>
                        <td class="px-4 py-3 text-sm text-center">
                            \${d.is_public ? '<span class="text-green-600"><i class="fas fa-check"></i></span>' : '<span class="text-gray-400"><i class="fas fa-times"></i></span>'}
                        </td>
                        <td class="px-4 py-3 text-sm text-gray-600 text-center font-mono">
                            \${d.certificate_number || '-'}
                        </td>
                        <td class="px-4 py-3 text-sm text-gray-600">
                            \${d.message ? '<span class="italic">"' + d.message.substring(0, 30) + (d.message.length > 30 ? '..."' : '"') + '</span>' : '-'}
                        </td>
                    </tr>
                \`).join('');
            } catch (error) {
                console.error('寄付一覧の取得エラー:', error);
            }
        }
        
        // CSVエクスポート
        function exportCSV() {
            const headers = ['日時', '寄付者名', 'メール', '電話番号', '金額', '口数', '公開', '証明書番号', 'メッセージ'];
            const rows = allDonations.map(d => [
                new Date(d.created_at).toLocaleString('ja-JP'),
                d.donor_name,
                d.donor_email,
                d.donor_phone || '',
                d.amount,
                d.unit_count,
                d.is_public ? '公開' : '非公開',
                d.certificate_number || '',
                (d.message || '').replace(/"/g, '""')
            ]);
            
            const csv = [
                headers.join(','),
                ...rows.map(row => row.map(cell => \`"\${cell}"\`).join(','))
            ].join('\\n');
            
            const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = \`donations_\${new Date().toISOString().split('T')[0]}.csv\`;
            link.click();
        }
        
        // グラフを描画
        async function renderChart() {
            // 月別集計
            const monthlyData = {};
            allDonations.forEach(d => {
                const month = d.created_at.substring(0, 7); // YYYY-MM
                if (!monthlyData[month]) {
                    monthlyData[month] = { amount: 0, count: 0 };
                }
                monthlyData[month].amount += d.amount;
                monthlyData[month].count += 1;
            });
            
            const months = Object.keys(monthlyData).sort();
            const amounts = months.map(m => monthlyData[m].amount);
            const counts = months.map(m => monthlyData[m].count);
            
            const ctx = document.getElementById('monthlyChart').getContext('2d');
            new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: months.map(m => m + '月'),
                    datasets: [{
                        label: '寄付金額（円）',
                        data: amounts,
                        backgroundColor: 'rgba(147, 51, 234, 0.5)',
                        borderColor: 'rgba(147, 51, 234, 1)',
                        borderWidth: 1,
                        yAxisID: 'y'
                    }, {
                        label: '寄付者数（人）',
                        data: counts,
                        backgroundColor: 'rgba(236, 72, 153, 0.5)',
                        borderColor: 'rgba(236, 72, 153, 1)',
                        borderWidth: 1,
                        yAxisID: 'y1',
                        type: 'line'
                    }]
                },
                options: {
                    responsive: true,
                    interaction: {
                        mode: 'index',
                        intersect: false,
                    },
                    scales: {
                        y: {
                            type: 'linear',
                            display: true,
                            position: 'left',
                            title: {
                                display: true,
                                text: '寄付金額（円）'
                            }
                        },
                        y1: {
                            type: 'linear',
                            display: true,
                            position: 'right',
                            title: {
                                display: true,
                                text: '寄付者数（人）'
                            },
                            grid: {
                                drawOnChartArea: false
                            }
                        }
                    }
                }
            });
        }
        
        // ページ読み込み時に実行
        async function init() {
            await loadStats();
            await loadDonations();
            renderChart();
        }
        
        init();
    </script>
</body>
</html>
`;

// ========================================
// 購読解除ページ HTML
// ========================================
const UNSUBSCRIBE_HTML = `
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>メールマガジン購読解除 - AICHEFS</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
</head>
<body class="bg-gradient-to-br from-purple-50 via-white to-pink-50 min-h-screen flex items-center justify-center p-4">
    <div class="max-w-md w-full">
        <div class="bg-white rounded-2xl shadow-xl p-8">
            <div class="text-center mb-6">
                <div class="inline-block bg-gradient-to-r from-purple-600 to-pink-600 rounded-full p-4 mb-4">
                    <i class="fas fa-envelope-open-text text-4xl text-white"></i>
                </div>
                <h1 class="text-2xl font-bold text-gray-800 mb-2">メールマガジン購読解除</h1>
                <p class="text-gray-600">AICHEFSメールマガジンの購読を解除します</p>
            </div>
            
            <div id="form-container">
                <form id="unsubscribe-form" class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">
                            メールアドレス
                        </label>
                        <input type="email" id="email" required
                               class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                               placeholder="your-email@example.com">
                    </div>
                    
                    <div class="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
                        <p class="text-sm text-gray-700">
                            <i class="fas fa-exclamation-triangle text-yellow-600"></i>
                            購読を解除すると、今後メールマガジンが届かなくなります。
                        </p>
                    </div>
                    
                    <div id="error-message" class="hidden bg-red-50 border-l-4 border-red-500 p-4 rounded">
                        <p class="text-sm text-red-700"></p>
                    </div>
                    
                    <button type="submit" 
                            class="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-3 rounded-lg hover:shadow-lg transition">
                        購読を解除する
                    </button>
                    
                    <a href="/" class="block text-center text-sm text-gray-600 hover:text-purple-600 transition">
                        <i class="fas fa-arrow-left mr-1"></i>トップページに戻る
                    </a>
                </form>
            </div>
            
            <div id="success-container" class="hidden text-center">
                <div class="inline-block bg-green-100 rounded-full p-4 mb-4">
                    <i class="fas fa-check-circle text-5xl text-green-600"></i>
                </div>
                <h2 class="text-xl font-bold text-gray-800 mb-2">購読解除が完了しました</h2>
                <p class="text-gray-600 mb-6">今後、メールマガジンは配信されません。<br>ご利用ありがとうございました。</p>
                
                <div class="bg-blue-50 border-l-4 border-blue-500 p-4 rounded mb-4">
                    <p class="text-sm text-gray-700">
                        <i class="fas fa-lightbulb text-blue-600"></i>
                        いつでも再度ご登録いただけます
                    </p>
                </div>
                
                <a href="/" class="inline-block bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold px-6 py-3 rounded-lg hover:shadow-lg transition">
                    <i class="fas fa-home mr-2"></i>トップページへ
                </a>
            </div>
        </div>
    </div>
    
    <script>
        // URLパラメータからtokenを取得
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');
        
        // tokenがある場合は自動購読解除
        if (token) {
            autoUnsubscribe(token);
        }
        
        async function autoUnsubscribe(token) {
            try {
                const response = await fetch('/api/newsletter/unsubscribe', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ token })
                });
                
                const data = await response.json();
                
                if (data.success) {
                    showSuccess();
                } else {
                    showError(data.message || '購読解除に失敗しました');
                }
            } catch (error) {
                console.error('Unsubscribe error:', error);
                showError('通信エラーが発生しました');
            }
        }
        
        document.getElementById('unsubscribe-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const errorEl = document.getElementById('error-message');
            const submitBtn = e.target.querySelector('button[type="submit"]');
            
            errorEl.classList.add('hidden');
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>処理中...';
            
            try {
                const response = await fetch('/api/newsletter/unsubscribe', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email })
                });
                
                const data = await response.json();
                
                if (data.success) {
                    showSuccess();
                } else {
                    showError(data.message || '購読解除に失敗しました');
                }
            } catch (error) {
                console.error('Unsubscribe error:', error);
                showError('通信エラーが発生しました');
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = '購読を解除する';
            }
        });
        
        function showSuccess() {
            document.getElementById('form-container').classList.add('hidden');
            document.getElementById('success-container').classList.remove('hidden');
        }
        
        function showError(message) {
            const errorEl = document.getElementById('error-message');
            errorEl.querySelector('p').textContent = message;
            errorEl.classList.remove('hidden');
        }
    </script>
</body>
</html>
`;

export default app
