/**
 * 献立印刷・送信フロントエンド
 * 
 * 機能：
 * - 献立表の生成と表示
 * - 印刷機能（週間/月間）
 * - メール送信機能
 * - カレンダー形式表示
 */

// エスケープ関数
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// 日付フォーマット
function formatDateJP(dateStr) {
  const date = new Date(dateStr);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const weekdays = ['日', '月', '火', '水', '木', '金', '土'];
  const weekday = weekdays[date.getDay()];
  return { month, day, weekday, weekdayIndex: date.getDay() };
}

// 献立表示
async function displayMealPlan(mealPlanId, viewType = 'weekly') {
  const container = document.getElementById('meal-plan-display');
  if (!container) {
    console.error('Meal plan container not found');
    return;
  }
  
  // ローディング
  container.innerHTML = `
    <div class="text-center py-8">
      <div class="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-purple-600 mb-3"></div>
      <p class="text-gray-600">献立を読み込み中...</p>
    </div>
  `;
  
  try {
    const response = await fetch(`/api/meal-plans/${mealPlanId}`);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || '献立の取得に失敗しました');
    }
    
    if (viewType === 'weekly') {
      renderWeeklyView(data);
    } else {
      renderMonthlyView(data);
    }
    
  } catch (error) {
    console.error('Meal plan display error:', error);
    container.innerHTML = `
      <div class="bg-red-50 border-l-4 border-red-500 p-4">
        <p class="text-red-700">${escapeHtml(error.message)}</p>
      </div>
    `;
  }
}

// 週間表示
function renderWeeklyView(data) {
  const container = document.getElementById('meal-plan-display');
  if (!container) return;
  
  let html = `
    <div class="bg-white rounded-lg shadow-lg p-6">
      <!-- ヘッダー -->
      <div class="flex justify-between items-center mb-6 border-b pb-4">
        <div>
          <h2 class="text-2xl font-bold text-gray-800 flex items-center">
            <i class="fas fa-calendar-week text-purple-600 mr-3"></i>
            週間献立表
          </h2>
          <p class="text-sm text-gray-600 mt-1">
            ${data.start_date} 〜 ${data.end_date}
          </p>
        </div>
        <div class="flex space-x-2">
          <button onclick="switchView('monthly')" 
                  class="px-3 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition text-sm">
            <i class="fas fa-calendar-alt mr-1"></i>月間表示
          </button>
          <button onclick="printMealPlanTable()" 
                  class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
            <i class="fas fa-print mr-2"></i>印刷
          </button>
          <button onclick="emailMealPlanTable('${data.meal_plan_id}')" 
                  class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition">
            <i class="fas fa-envelope mr-2"></i>メール送信
          </button>
        </div>
      </div>
      
      <!-- 週間カレンダー -->
      <div class="overflow-x-auto">
        <table class="w-full border-collapse">
          <thead>
            <tr class="bg-purple-50">
              <th class="border p-3 text-left font-semibold text-gray-700 w-24">日付</th>
              <th class="border p-3 text-left font-semibold text-gray-700">主菜</th>
              <th class="border p-3 text-left font-semibold text-gray-700">副菜</th>
              <th class="border p-3 text-left font-semibold text-gray-700">汁物</th>
              <th class="border p-3 text-center font-semibold text-gray-700 w-20">合計時間</th>
            </tr>
          </thead>
          <tbody>
  `;
  
  // 7日分を表示
  const daysToShow = data.days.slice(0, 7);
  daysToShow.forEach(day => {
    const dateInfo = formatDateJP(day.date);
    const isWeekend = dateInfo.weekdayIndex === 0 || dateInfo.weekdayIndex === 6;
    const bgColor = isWeekend ? 'bg-red-50' : 'bg-white';
    
    const totalTime = (day.main.time_minutes || 0) + 
                     (day.side.time_minutes || 0) + 
                     (day.soup.time_minutes || 0);
    
    html += `
      <tr class="${bgColor} hover:bg-gray-50">
        <td class="border p-3">
          <div class="font-semibold text-gray-800">${dateInfo.month}/${dateInfo.day}</div>
          <div class="text-xs ${isWeekend ? 'text-red-600' : 'text-gray-600'}">(${dateInfo.weekday})</div>
        </td>
        <td class="border p-3">
          <div class="font-medium text-gray-800">${escapeHtml(day.main.title)}</div>
          <div class="text-xs text-gray-500 mt-1">${day.main.time_minutes || 0}分 | ${day.main.difficulty || 'normal'}</div>
        </td>
        <td class="border p-3">
          <div class="font-medium text-gray-800">${escapeHtml(day.side.title)}</div>
          <div class="text-xs text-gray-500 mt-1">${day.side.time_minutes || 0}分</div>
        </td>
        <td class="border p-3">
          <div class="font-medium text-gray-800">${escapeHtml(day.soup.title)}</div>
          <div class="text-xs text-gray-500 mt-1">${day.soup.time_minutes || 0}分</div>
        </td>
        <td class="border p-3 text-center">
          <div class="font-semibold text-purple-600">${totalTime}分</div>
        </td>
      </tr>
    `;
  });
  
  html += `
          </tbody>
        </table>
      </div>
      
      <!-- 統計 -->
      <div class="mt-4 p-4 bg-gray-50 rounded">
        <div class="grid grid-cols-3 gap-4 text-center">
          <div>
            <div class="text-lg font-bold text-purple-600">${daysToShow.length}日分</div>
            <div class="text-xs text-gray-600">献立数</div>
          </div>
          <div>
            <div class="text-lg font-bold text-blue-600">${Math.round(daysToShow.reduce((sum, d) => sum + ((d.main.time_minutes || 0) + (d.side.time_minutes || 0) + (d.soup.time_minutes || 0)), 0) / daysToShow.length)}分</div>
            <div class="text-xs text-gray-600">平均調理時間</div>
          </div>
          <div>
            <div class="text-lg font-bold text-green-600">${daysToShow.length * 3}品</div>
            <div class="text-xs text-gray-600">合計レシピ数</div>
          </div>
        </div>
      </div>
    </div>
  `;
  
  container.innerHTML = html;
}

// 月間表示（簡易版）
function renderMonthlyView(data) {
  const container = document.getElementById('meal-plan-display');
  if (!container) return;
  
  let html = `
    <div class="bg-white rounded-lg shadow-lg p-6">
      <div class="flex justify-between items-center mb-6 border-b pb-4">
        <div>
          <h2 class="text-2xl font-bold text-gray-800 flex items-center">
            <i class="fas fa-calendar-alt text-purple-600 mr-3"></i>
            月間献立表
          </h2>
          <p class="text-sm text-gray-600 mt-1">${data.days.length}日分の献立</p>
        </div>
        <div class="flex space-x-2">
          <button onclick="switchView('weekly')" 
                  class="px-3 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition text-sm">
            <i class="fas fa-calendar-week mr-1"></i>週間表示
          </button>
          <button onclick="printMealPlanTable()" 
                  class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
            <i class="fas fa-print mr-2"></i>印刷
          </button>
        </div>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  `;
  
  data.days.forEach(day => {
    const dateInfo = formatDateJP(day.date);
    html += `
      <div class="border rounded-lg p-4 hover:shadow-md transition">
        <div class="font-bold text-gray-800 mb-2">
          ${dateInfo.month}/${dateInfo.day}(${dateInfo.weekday})
        </div>
        <div class="space-y-1 text-sm">
          <div><span class="text-red-600">●</span> ${escapeHtml(day.main.title)}</div>
          <div><span class="text-green-600">●</span> ${escapeHtml(day.side.title)}</div>
          <div><span class="text-yellow-600">●</span> ${escapeHtml(day.soup.title)}</div>
        </div>
      </div>
    `;
  });
  
  html += `
      </div>
    </div>
  `;
  
  container.innerHTML = html;
}

// 表示切り替え
let currentMealPlanId = null;
function switchView(viewType) {
  if (currentMealPlanId) {
    displayMealPlan(currentMealPlanId, viewType);
  }
}

// 印刷
function printMealPlanTable() {
  window.print();
}

// メール送信
async function emailMealPlanTable(mealPlanId) {
  const email = prompt('送信先メールアドレスを入力してください:');
  if (!email) return;
  
  try {
    const response = await fetch('/api/meal-plans/email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ meal_plan_id: mealPlanId, email })
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'メール送信に失敗しました');
    }
    
    alert(`献立表を ${email} に送信しました！`);
    
  } catch (error) {
    console.error('Email error:', error);
    alert(error.message);
  }
}

// 初期化
document.addEventListener('DOMContentLoaded', function() {
  const urlParams = new URLSearchParams(window.location.search);
  const mealPlanId = urlParams.get('meal_plan_id');
  const viewType = urlParams.get('view') || 'weekly';
  
  if (mealPlanId) {
    currentMealPlanId = mealPlanId;
    displayMealPlan(mealPlanId, viewType);
  }
});
