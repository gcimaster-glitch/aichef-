/**
 * メールリマインダー設定UI
 * 
 * 機能：
 * - 週1回/月1回/毎日の選択
 * - 送信時刻設定
 * - 有効/無効切り替え
 * - 設定保存
 */

// エスケープ関数
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// 設定読み込み
async function loadReminderSettings() {
  try {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const memberId = user.member_id || user.id;
    
    if (!memberId) {
      showMessage('error', 'ログインが必要です');
      return;
    }
    
    const response = await fetch(`/api/reminders/settings/${memberId}`);
    const data = await response.json();
    
    if (response.ok && data.settings) {
      populateForm(data.settings);
    } else {
      // デフォルト設定
      populateForm({
        frequency: 'weekly',
        day_of_week: 1,
        send_time: '09:00',
        is_active: false
      });
    }
    
  } catch (error) {
    console.error('Load settings error:', error);
    showMessage('error', '設定の読み込みに失敗しました');
  }
}

// フォーム入力
function populateForm(settings) {
  document.getElementById('reminder-frequency').value = settings.frequency || 'weekly';
  document.getElementById('day-of-week').value = settings.day_of_week || 1;
  document.getElementById('send-time').value = settings.send_time || '09:00';
  document.getElementById('reminder-active').checked = settings.is_active || false;
  
  updateFrequencyDisplay(settings.frequency);
}

// 頻度に応じた表示切り替え
function updateFrequencyDisplay(frequency) {
  const dayOfWeekContainer = document.getElementById('day-of-week-container');
  
  if (frequency === 'daily') {
    dayOfWeekContainer.classList.add('hidden');
  } else if (frequency === 'weekly') {
    dayOfWeekContainer.classList.remove('hidden');
    document.querySelector('#day-of-week-container label').textContent = '送信曜日:';
  } else if (frequency === 'monthly') {
    dayOfWeekContainer.classList.remove('hidden');
    document.querySelector('#day-of-week-container label').textContent = '送信日:';
  }
}

// 設定保存
async function saveReminderSettings(event) {
  event.preventDefault();
  
  const saveBtn = event.target.querySelector('button[type="submit"]');
  const originalText = saveBtn.innerHTML;
  saveBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>保存中...';
  saveBtn.disabled = true;
  
  try {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const memberId = user.member_id || user.id;
    
    if (!memberId) {
      throw new Error('ログインが必要です');
    }
    
    const frequency = document.getElementById('reminder-frequency').value;
    const dayOfWeek = document.getElementById('day-of-week').value;
    const sendTime = document.getElementById('send-time').value;
    const isActive = document.getElementById('reminder-active').checked;
    
    const response = await fetch('/api/reminders/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        member_id: memberId,
        frequency,
        day_of_week: parseInt(dayOfWeek),
        send_time: sendTime,
        is_active: isActive
      })
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || '保存に失敗しました');
    }
    
    showMessage('success', '設定を保存しました！');
    
  } catch (error) {
    console.error('Save settings error:', error);
    showMessage('error', error.message);
  } finally {
    saveBtn.innerHTML = originalText;
    saveBtn.disabled = false;
  }
}

// テストメール送信
async function sendTestReminder() {
  const testBtn = document.getElementById('test-reminder-btn');
  const originalText = testBtn.innerHTML;
  testBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>送信中...';
  testBtn.disabled = true;
  
  try {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const memberId = user.member_id || user.id;
    
    if (!memberId) {
      throw new Error('ログインが必要です');
    }
    
    const response = await fetch('/api/reminders/test', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ member_id: memberId })
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'テストメール送信に失敗しました');
    }
    
    showMessage('success', 'テストメールを送信しました！メールボックスを確認してください。');
    
  } catch (error) {
    console.error('Test reminder error:', error);
    showMessage('error', error.message);
  } finally {
    testBtn.innerHTML = originalText;
    testBtn.disabled = false;
  }
}

// メッセージ表示
function showMessage(type, message) {
  const messageContainer = document.getElementById('reminder-message');
  if (!messageContainer) return;
  
  const colors = {
    'success': 'bg-green-50 border-green-500 text-green-700',
    'error': 'bg-red-50 border-red-500 text-red-700',
    'info': 'bg-blue-50 border-blue-500 text-blue-700'
  };
  
  const icons = {
    'success': 'fa-check-circle',
    'error': 'fa-exclamation-circle',
    'info': 'fa-info-circle'
  };
  
  messageContainer.className = `border-l-4 p-4 mb-4 ${colors[type] || colors.info}`;
  messageContainer.innerHTML = `
    <div class="flex">
      <div class="flex-shrink-0">
        <i class="fas ${icons[type] || icons.info}"></i>
      </div>
      <div class="ml-3">
        <p class="text-sm">${escapeHtml(message)}</p>
      </div>
    </div>
  `;
  
  messageContainer.classList.remove('hidden');
  
  // 3秒後に自動で非表示
  setTimeout(() => {
    messageContainer.classList.add('hidden');
  }, 3000);
}

// 初期化
document.addEventListener('DOMContentLoaded', function() {
  // 設定読み込み
  loadReminderSettings();
  
  // 頻度変更イベント
  const frequencySelect = document.getElementById('reminder-frequency');
  if (frequencySelect) {
    frequencySelect.addEventListener('change', function(e) {
      updateFrequencyDisplay(e.target.value);
    });
  }
  
  // フォーム送信イベント
  const settingsForm = document.getElementById('reminder-settings-form');
  if (settingsForm) {
    settingsForm.addEventListener('submit', saveReminderSettings);
  }
  
  // テストボタンイベント
  const testBtn = document.getElementById('test-reminder-btn');
  if (testBtn) {
    testBtn.addEventListener('click', sendTestReminder);
  }
});
