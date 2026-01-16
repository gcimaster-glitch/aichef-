// 簡易会員登録フロントエンド追加コード
// public/static/simple-registration.js

document.addEventListener('DOMContentLoaded', function() {
  // 既存の登録フォームに説明を追加
  const registerForm = document.querySelector('#register-form, [data-register-form]');
  
  if (registerForm) {
    // 説明文を追加
    const infoBox = document.createElement('div');
    infoBox.className = 'bg-blue-50 border-l-4 border-blue-500 p-4 mb-4';
    infoBox.innerHTML = `
      <div class="flex">
        <div class="flex-shrink-0">
          <svg class="h-5 w-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/>
          </svg>
        </div>
        <div class="ml-3">
          <h3 class="text-sm font-medium text-blue-800">
            簡易会員登録について
          </h3>
          <div class="mt-2 text-sm text-blue-700">
            <ul class="list-disc list-inside space-y-1">
              <li><strong>無料で1回のみ</strong>献立生成をご利用いただけます</li>
              <li>2回目以降のご利用には<strong>年間500円からの寄付</strong>が必要です</li>
              <li>寄付いただくと<strong>月5回まで</strong>献立生成が可能になります</li>
              <li>500円の寄付で<strong>2名の子供の1食</strong>を支援できます</li>
            </ul>
          </div>
          <div class="mt-3">
            <a href="/donate" class="text-sm font-medium text-blue-800 hover:text-blue-600 underline">
              寄付について詳しく見る →
            </a>
          </div>
        </div>
      </div>
    `;
    
    // フォームの先頭に挿入
    registerForm.insertBefore(infoBox, registerForm.firstChild);
    
    // 登録ボタンのテキストを変更
    const submitButton = registerForm.querySelector('button[type="submit"]');
    if (submitButton) {
      submitButton.textContent = '無料で始める（1回お試し）';
      submitButton.classList.add('bg-green-600', 'hover:bg-green-700');
    }
  }

  // 登録完了後のモーダル表示
  function showRegistrationCompleteModal() {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    modal.innerHTML = `
      <div class="bg-white rounded-lg p-6 max-w-md mx-4 shadow-xl">
        <div class="text-center">
          <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
            <svg class="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <h3 class="text-lg font-medium text-gray-900 mb-2">
            会員登録が完了しました！
          </h3>
          <p class="text-sm text-gray-600 mb-4">
            無料で<strong>1回のみ</strong>献立生成をお試しいただけます。
          </p>
          <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
            <p class="text-sm text-yellow-800">
              <strong>2回目以降のご利用には寄付が必要です</strong><br>
              年間500円からの寄付で月5回まで利用可能になり、子供食堂の支援にもつながります。
            </p>
          </div>
          <div class="flex space-x-3">
            <button onclick="window.location.href='/dashboard'" class="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition">
              献立を作成する
            </button>
            <button onclick="window.location.href='/donate'" class="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition">
              寄付する
            </button>
          </div>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    // モーダル外をクリックで閉じる
    modal.addEventListener('click', function(e) {
      if (e.target === modal) {
        modal.remove();
      }
    });
  }

  // グローバルに公開
  window.showRegistrationCompleteModal = showRegistrationCompleteModal;
});

// 利用回数表示ウィジェット
function showUsageLimitWidget(memberId) {
  fetch(`/api/usage/check/${memberId}`)
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        const widget = document.getElementById('usage-limit-widget');
        if (!widget) return;

        const { current_count = 0, max_count = 1, member_type = 'free' } = data;
        const remaining = max_count - current_count;

        let statusHtml = '';
        if (member_type === 'free') {
          statusHtml = `
            <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <div class="flex items-center">
                <svg class="h-5 w-5 text-yellow-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
                </svg>
                <span class="text-sm font-medium text-yellow-800">
                  無料お試し: ${remaining}回残り
                </span>
              </div>
              ${remaining === 0 ? `
                <p class="text-xs text-yellow-700 mt-2">
                  利用回数が上限に達しました。
                  <a href="/donate" class="underline font-medium">寄付して続ける →</a>
                </p>
              ` : ''}
            </div>
          `;
        } else if (member_type === 'paid') {
          statusHtml = `
            <div class="bg-green-50 border border-green-200 rounded-lg p-3">
              <div class="flex items-center">
                <svg class="h-5 w-5 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                </svg>
                <span class="text-sm font-medium text-green-800">
                  有料会員: 今月${remaining}回残り
                </span>
              </div>
            </div>
          `;
        }

        widget.innerHTML = statusHtml;
      }
    })
    .catch(error => {
      console.error('利用回数取得エラー:', error);
    });
}

// グローバルに公開
window.showUsageLimitWidget = showUsageLimitWidget;
