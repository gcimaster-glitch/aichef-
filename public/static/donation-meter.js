// 寄付メーターと寄付者ランキング表示
// 作成日: 2026-01-16

// 寄付メーターを取得して表示
async function loadDonationMeter() {
  try {
    const response = await fetch('/api/donations/meter');
    const data = await response.json();
    
    if (data.success) {
      const meter = data.meter;
      updateDonationMeter(meter);
    }
  } catch (error) {
    console.error('寄付メーター読み込みエラー:', error);
  }
}

// 寄付メーター表示更新
function updateDonationMeter(meter) {
  const childrenHelped = Math.floor(meter.children_helped || 0);
  const totalAmount = meter.total_amount || 0;
  
  // 子供アイコンを生成（500円ごとに1個）
  const meterContainer = document.getElementById('donation-meter-icons');
  if (!meterContainer) return;
  
  meterContainer.innerHTML = '';
  
  // 最大50個まで表示
  const iconsToShow = Math.min(childrenHelped, 50);
  
  for (let i = 0; i < iconsToShow; i++) {
    const icon = document.createElement('span');
    icon.className = 'inline-block text-2xl mx-1 animate-bounce';
    icon.style.animationDelay = `${i * 0.1}s`;
    icon.innerHTML = '👶';
    icon.title = `${(i + 1) * 500}円の寄付`;
    meterContainer.appendChild(icon);
  }
  
  // 合計金額表示
  const amountElement = document.getElementById('donation-total-amount');
  if (amountElement) {
    amountElement.textContent = totalAmount.toLocaleString();
  }
  
  // 子供の人数表示
  const childrenElement = document.getElementById('donation-children-count');
  if (childrenElement) {
    childrenElement.textContent = childrenHelped * 2; // 500円 = 2名の子供の1食
  }
}

// 寄付者ランキングを取得して表示
async function loadDonorRanking() {
  try {
    const response = await fetch('/api/donations/ranking');
    const data = await response.json();
    
    if (data.success) {
      updateDonorRanking(data.ranking);
    }
  } catch (error) {
    console.error('寄付者ランキング読み込みエラー:', error);
  }
}

// 寄付者ランキング表示更新
function updateDonorRanking(ranking) {
  const rankingContainer = document.getElementById('donor-ranking-list');
  if (!rankingContainer) return;
  
  rankingContainer.innerHTML = '';
  
  ranking.forEach((donor, index) => {
    const rankItem = document.createElement('div');
    rankItem.className = 'flex justify-between items-center p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow';
    
    // ランク表示（1〜3位は特別表示）
    let rankDisplay = `${index + 1}位`;
    let rankClass = 'text-gray-600';
    
    if (index === 0) {
      rankDisplay = '🥇';
      rankClass = 'text-yellow-500 text-2xl';
    } else if (index === 1) {
      rankDisplay = '🥈';
      rankClass = 'text-gray-400 text-2xl';
    } else if (index === 2) {
      rankDisplay = '🥉';
      rankClass = 'text-orange-500 text-2xl';
    }
    
    rankItem.innerHTML = `
      <div class="flex items-center space-x-4">
        <span class="${rankClass} font-bold w-12 text-center">${rankDisplay}</span>
        <div>
          <div class="font-semibold text-gray-800">${escapeHtml(donor.display_name)}</div>
          <div class="text-sm text-gray-500">${donor.donation_count}回寄付</div>
        </div>
      </div>
      <div class="text-right">
        <div class="font-bold text-green-600">¥${donor.total_donated.toLocaleString()}</div>
        <div class="text-xs text-gray-500">${new Date(donor.last_donation_at).toLocaleDateString('ja-JP')}</div>
      </div>
    `;
    
    rankingContainer.appendChild(rankItem);
  });
}

// XSS対策：HTMLエスケープ
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// ページ読み込み時に実行
document.addEventListener('DOMContentLoaded', function() {
  loadDonationMeter();
  loadDonorRanking();
  
  // 30秒ごとに更新
  setInterval(loadDonationMeter, 30000);
  setInterval(loadDonorRanking, 30000);
});
