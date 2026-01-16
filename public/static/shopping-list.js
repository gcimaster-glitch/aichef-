/**
 * 買い物リスト印刷・送信フロントエンド
 * 
 * 機能：
 * - 買い物リストの生成と表示
 * - 印刷機能
 * - メール送信機能
 * - カテゴリ別表示
 */

// エスケープ関数
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// 買い物リスト生成
async function generateShoppingList(mealPlanId, days = 7) {
  const container = document.getElementById('shopping-list-container');
  if (!container) {
    console.error('Shopping list container not found');
    return;
  }
  
  // ローディング表示
  container.innerHTML = `
    <div class="text-center py-8">
      <div class="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-green-600 mb-3"></div>
      <p class="text-gray-600">買い物リストを生成中...</p>
    </div>
  `;
  
  try {
    const response = await fetch(`/api/shopping-list/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ meal_plan_id: mealPlanId, days })
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || '買い物リスト生成に失敗しました');
    }
    
    displayShoppingList(data);
    
  } catch (error) {
    console.error('Shopping list error:', error);
    container.innerHTML = `
      <div class="bg-red-50 border-l-4 border-red-500 p-4">
        <p class="text-red-700">${escapeHtml(error.message)}</p>
      </div>
    `;
  }
}

// 買い物リスト表示
function displayShoppingList(data) {
  const container = document.getElementById('shopping-list-container');
  if (!container) return;
  
  const categoryNames = {
    'vegetables': '野菜',
    'meat_fish': '肉・魚',
    'seasonings': '調味料',
    'grains': '穀物・麺',
    'dairy': '乳製品',
    'other': 'その他'
  };
  
  const categoryIcons = {
    'vegetables': 'fa-leaf',
    'meat_fish': 'fa-fish',
    'seasonings': 'fa-flask',
    'grains': 'fa-bread-slice',
    'dairy': 'fa-cheese',
    'other': 'fa-box'
  };
  
  let html = `
    <div class="bg-white rounded-lg shadow-lg p-6">
      <!-- ヘッダー -->
      <div class="flex justify-between items-center mb-6 border-b pb-4">
        <div>
          <h2 class="text-2xl font-bold text-gray-800 flex items-center">
            <i class="fas fa-shopping-cart text-green-600 mr-3"></i>
            買い物リスト
          </h2>
          <p class="text-sm text-gray-600 mt-1">
            ${data.days || 7}日分 | 合計 ${data.total_items || 0}品目
          </p>
        </div>
        <div class="flex space-x-2">
          <button onclick="printShoppingList('${data.meal_plan_id}')" 
                  class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
            <i class="fas fa-print mr-2"></i>印刷
          </button>
          <button onclick="emailShoppingList('${data.meal_plan_id}')" 
                  class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition">
            <i class="fas fa-envelope mr-2"></i>メール送信
          </button>
        </div>
      </div>
      
      <!-- カテゴリ別リスト -->
      <div class="space-y-6">
  `;
  
  // カテゴリごとに表示
  Object.entries(data.by_category || {}).forEach(([category, items]) => {
    if (items.length === 0) return;
    
    const categoryName = categoryNames[category] || category;
    const iconClass = categoryIcons[category] || 'fa-box';
    
    html += `
      <div class="border-l-4 border-green-500 pl-4">
        <h3 class="text-lg font-semibold text-gray-800 mb-3 flex items-center">
          <i class="fas ${iconClass} text-green-600 mr-2"></i>
          ${categoryName} (${items.length}品目)
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
    `;
    
    items.forEach(item => {
      html += `
        <div class="flex items-center p-2 bg-gray-50 rounded hover:bg-gray-100 transition">
          <input type="checkbox" class="mr-3 w-5 h-5 text-green-600 rounded" 
                 onchange="toggleItem(this)">
          <div class="flex-1">
            <span class="font-medium text-gray-800">${escapeHtml(item.name)}</span>
            <span class="text-gray-600 ml-2">${item.total_quantity} ${escapeHtml(item.unit)}</span>
          </div>
        </div>
      `;
    });
    
    html += `
        </div>
      </div>
    `;
  });
  
  html += `
      </div>
      
      <!-- 統計情報 -->
      <div class="mt-6 pt-4 border-t">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div class="text-2xl font-bold text-green-600">${data.total_items || 0}</div>
            <div class="text-xs text-gray-600">合計品目</div>
          </div>
          <div>
            <div class="text-2xl font-bold text-blue-600">${data.days || 7}</div>
            <div class="text-xs text-gray-600">日数</div>
          </div>
          <div>
            <div class="text-2xl font-bold text-purple-600">¥${data.estimated_cost || 0}</div>
            <div class="text-xs text-gray-600">概算費用</div>
          </div>
          <div>
            <div class="text-2xl font-bold text-orange-600">${Object.keys(data.by_category || {}).length}</div>
            <div class="text-xs text-gray-600">カテゴリ数</div>
          </div>
        </div>
      </div>
    </div>
  `;
  
  container.innerHTML = html;
}

// アイテムチェック切り替え
function toggleItem(checkbox) {
  const parent = checkbox.closest('.flex');
  if (checkbox.checked) {
    parent.classList.add('opacity-50', 'line-through');
  } else {
    parent.classList.remove('opacity-50', 'line-through');
  }
}

// 印刷機能
function printShoppingList(mealPlanId) {
  const printWindow = window.open('', '_blank');
  const content = document.getElementById('shopping-list-container').innerHTML;
  
  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>買い物リスト - AICHEFS</title>
      <style>
        body { font-family: sans-serif; padding: 20px; }
        h2 { color: #059669; border-bottom: 2px solid #059669; padding-bottom: 10px; }
        h3 { color: #333; margin-top: 20px; }
        .item { padding: 5px 0; border-bottom: 1px solid #eee; }
        .item input { display: none; }
        @media print { button { display: none; } }
      </style>
    </head>
    <body>
      ${content}
      <script>window.print(); window.close();</script>
    </body>
    </html>
  `);
  
  printWindow.document.close();
}

// メール送信
async function emailShoppingList(mealPlanId) {
  const email = prompt('送信先メールアドレスを入力してください:');
  if (!email) return;
  
  try {
    const response = await fetch('/api/shopping-list/email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ meal_plan_id: mealPlanId, email })
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'メール送信に失敗しました');
    }
    
    alert(`買い物リストを ${email} に送信しました！`);
    
  } catch (error) {
    console.error('Email error:', error);
    alert(error.message);
  }
}

// 初期化
document.addEventListener('DOMContentLoaded', function() {
  // URL パラメータから meal_plan_id を取得
  const urlParams = new URLSearchParams(window.location.search);
  const mealPlanId = urlParams.get('meal_plan_id');
  const days = urlParams.get('days') || 7;
  
  if (mealPlanId) {
    generateShoppingList(mealPlanId, parseInt(days));
  }
});
