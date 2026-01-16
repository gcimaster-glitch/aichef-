/**
 * ワンクリック一ヶ月献立生成フロントエンド
 * 
 * 機能：
 * - アンケート回答済みユーザー向けワンクリック生成
 * - 30日分の献立を自動生成
 * - 会員限定機能（月5回まで）
 */

// エスケープ関数
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// 日付フォーマット
function formatDate(dateStr) {
  const date = new Date(dateStr);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const weekdays = ['日', '月', '火', '水', '木', '金', '土'];
  const weekday = weekdays[date.getDay()];
  return `${month}/${day}(${weekday})`;
}

// ローディング表示
function showLoading(message = '生成中...') {
  const container = document.getElementById('monthly-plan-container');
  if (!container) return;
  
  container.innerHTML = `
    <div class="text-center py-12">
      <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mb-4"></div>
      <p class="text-gray-600 text-lg">${escapeHtml(message)}</p>
      <p class="text-gray-500 text-sm mt-2">30日分の献立を生成しています...</p>
    </div>
  `;
}

// エラー表示
function showError(message) {
  const container = document.getElementById('monthly-plan-container');
  if (!container) return;
  
  container.innerHTML = `
    <div class="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
      <div class="flex">
        <div class="flex-shrink-0">
          <i class="fas fa-exclamation-circle text-red-500"></i>
        </div>
        <div class="ml-3">
          <p class="text-sm text-red-700">${escapeHtml(message)}</p>
          <button onclick="location.reload()" class="mt-2 text-sm text-red-600 hover:text-red-800 underline">
            再試行
          </button>
        </div>
      </div>
    </div>
  `;
}

// 成功表示
function showSuccess(data) {
  const container = document.getElementById('monthly-plan-container');
  if (!container) return;
  
  let html = `
    <div class="bg-green-50 border-l-4 border-green-500 p-4 mb-6">
      <div class="flex">
        <div class="flex-shrink-0">
          <i class="fas fa-check-circle text-green-500"></i>
        </div>
        <div class="ml-3">
          <p class="text-sm text-green-700">
            <strong>献立生成完了！</strong> 30日分の献立を作成しました。
          </p>
          <p class="text-xs text-green-600 mt-1">
            今月の残り生成回数: ${data.remaining_count || 0}回
          </p>
        </div>
      </div>
    </div>
    
    <div class="mb-4 flex justify-between items-center">
      <h3 class="text-lg font-semibold text-gray-800">
        <i class="fas fa-calendar-alt mr-2"></i>
        ${formatDate(data.start_date)} 〜 ${formatDate(data.end_date)}
      </h3>
      <div class="space-x-2">
        <button onclick="printMealPlan('${data.meal_plan_id}')" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          <i class="fas fa-print mr-1"></i> 印刷
        </button>
        <button onclick="exportShoppingList('${data.meal_plan_id}')" class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
          <i class="fas fa-shopping-cart mr-1"></i> 買い物リスト
        </button>
      </div>
    </div>
    
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  `;
  
  // 30日分の献立を表示
  data.days.forEach((day, index) => {
    html += `
      <div class="bg-white border rounded-lg p-4 shadow-sm hover:shadow-md transition">
        <div class="flex justify-between items-center mb-3">
          <h4 class="font-semibold text-gray-800">${formatDate(day.date)}</h4>
          <span class="text-xs text-gray-500">Day ${index + 1}</span>
        </div>
        
        <div class="space-y-2 text-sm">
          <div class="flex items-start">
            <i class="fas fa-drumstick-bite text-red-500 mt-1 mr-2"></i>
            <div>
              <div class="font-medium text-gray-700">${escapeHtml(day.main.title)}</div>
              <div class="text-xs text-gray-500">${day.main.time_minutes || 0}分</div>
            </div>
          </div>
          
          <div class="flex items-start">
            <i class="fas fa-leaf text-green-500 mt-1 mr-2"></i>
            <div>
              <div class="font-medium text-gray-700">${escapeHtml(day.side.title)}</div>
              <div class="text-xs text-gray-500">${day.side.time_minutes || 0}分</div>
            </div>
          </div>
          
          <div class="flex items-start">
            <i class="fas fa-soup text-yellow-500 mt-1 mr-2"></i>
            <div>
              <div class="font-medium text-gray-700">${escapeHtml(day.soup.title)}</div>
              <div class="text-xs text-gray-500">${day.soup.time_minutes || 0}分</div>
            </div>
          </div>
        </div>
      </div>
    `;
  });
  
  html += `</div>`;
  
  container.innerHTML = html;
}

// ワンクリック生成実行
async function generateMonthlyMealPlan() {
  showLoading();
  
  try {
    // 会員IDを取得（localStorage or sessionから）
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const memberId = user.member_id || user.id;
    
    if (!memberId) {
      showError('ログインが必要です。会員登録またはログインしてください。');
      return;
    }
    
    // API呼び出し
    const response = await fetch('/api/meal-plans/generate-monthly', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        member_id: memberId,
        start_date: new Date().toISOString().split('T')[0], // 今日から
        days: 30
      })
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'エラーが発生しました');
    }
    
    showSuccess(data);
    
  } catch (error) {
    console.error('Monthly meal plan generation error:', error);
    showError(error.message || '献立生成に失敗しました。');
  }
}

// 印刷機能（後で実装）
function printMealPlan(mealPlanId) {
  alert('印刷機能は実装中です: ' + mealPlanId);
}

// 買い物リスト出力（後で実装）
function exportShoppingList(mealPlanId) {
  alert('買い物リスト機能は実装中です: ' + mealPlanId);
}

// ページ読み込み時の初期化
document.addEventListener('DOMContentLoaded', function() {
  const generateBtn = document.getElementById('generate-monthly-btn');
  if (generateBtn) {
    generateBtn.addEventListener('click', generateMonthlyMealPlan);
  }
});
