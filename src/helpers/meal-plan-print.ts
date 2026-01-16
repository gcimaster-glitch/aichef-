// 献立印刷・送信ヘルパー
// src/helpers/meal-plan-print.ts

/**
 * 献立をHTML形式で印刷用に整形
 */
export function formatMealPlanForPrint(mealPlan: any, days: any[]): string {
  const date = new Date().toLocaleDateString('ja-JP');
  
  let html = `
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>献立表 - AICHEFS</title>
  <style>
    body { font-family: 'Helvetica Neue', Arial, 'Hiragino Kaku Gothic ProN', 'Hiragino Sans', Meiryo, sans-serif; max-width: 900px; margin: 20px auto; padding: 20px; }
    h1 { color: #2563eb; border-bottom: 3px solid #2563eb; padding-bottom: 10px; }
    .meta { color: #666; font-size: 14px; margin-bottom: 20px; }
    .week { margin-bottom: 40px; page-break-inside: avoid; }
    .week-title { background: #dbeafe; padding: 10px; font-weight: bold; font-size: 18px; border-left: 4px solid #2563eb; margin-bottom: 15px; }
    .day { margin-bottom: 20px; padding: 15px; border: 1px solid #e5e7eb; border-radius: 8px; page-break-inside: avoid; }
    .day-header { display: flex; justify-content: space-between; margin-bottom: 10px; padding-bottom: 10px; border-bottom: 2px solid #f3f4f6; }
    .day-number { font-size: 20px; font-weight: bold; color: #2563eb; }
    .day-date { color: #6b7280; font-size: 14px; }
    .meals { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
    .meal { padding: 10px; background: #f9fafb; border-radius: 6px; }
    .meal-type { font-size: 12px; color: #6b7280; margin-bottom: 5px; }
    .meal-title { font-weight: 600; color: #1f2937; }
    .meal-time { font-size: 11px; color: #9ca3af; margin-top: 5px; }
    @media print { body { margin: 0; } .no-print { display: none; } }
  </style>
</head>
<body>
  <h1>📅 献立表</h1>
  <div class="meta">
    <p>献立名: ${mealPlan.plan_name}</p>
    <p>作成日: ${date}</p>
    <p>期間: ${mealPlan.start_date} 〜 ${days.length}日間</p>
  </div>
  <button class="no-print" onclick="window.print()" style="background: #2563eb; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer; margin-bottom: 20px;">印刷する</button>
`;

  // 週ごとにグループ化
  let currentWeek = 1;
  let weekDays: any[] = [];

  days.forEach((day, index) => {
    weekDays.push(day);

    // 7日ごと、または最後の日
    if ((index + 1) % 7 === 0 || index === days.length - 1) {
      html += `
  <div class="week">
    <div class="week-title">第${currentWeek}週</div>
`;
      weekDays.forEach((d) => {
        const dayOfWeek = new Date(d.plan_date).toLocaleDateString('ja-JP', { weekday: 'short' });
        
        html += `
    <div class="day">
      <div class="day-header">
        <span class="day-number">Day ${d.day_number}</span>
        <span class="day-date">${d.plan_date} (${dayOfWeek})</span>
      </div>
      <div class="meals">
`;
        if (d.main) {
          html += `
        <div class="meal">
          <div class="meal-type">🍽️ 主菜</div>
          <div class="meal-title">${d.main.title}</div>
          <div class="meal-time">⏱️ ${d.main.time_min}分</div>
        </div>
`;
        }

        if (d.side) {
          html += `
        <div class="meal">
          <div class="meal-type">🥗 副菜</div>
          <div class="meal-title">${d.side.title}</div>
          <div class="meal-time">⏱️ ${d.side.time_min}分</div>
        </div>
`;
        }

        if (d.soup) {
          html += `
        <div class="meal">
          <div class="meal-type">🍲 汁物</div>
          <div class="meal-title">${d.soup.title}</div>
          <div class="meal-time">⏱️ ${d.soup.time_min}分</div>
        </div>
`;
        }

        html += `
      </div>
    </div>
`;
      });

      html += `
  </div>
`;
      weekDays = [];
      currentWeek++;
    }
  });

  html += `
</body>
</html>
`;

  return html;
}

/**
 * 献立をメール本文用にテキスト整形
 */
export function formatMealPlanForEmail(mealPlan: any, days: any[]): string {
  let text = '■ 献立表\n\n';
  text += `献立名: ${mealPlan.plan_name}\n`;
  text += `期間: ${mealPlan.start_date} 〜 ${days.length}日間\n\n`;

  days.forEach((day) => {
    const dayOfWeek = new Date(day.plan_date).toLocaleDateString('ja-JP', { weekday: 'short' });
    text += `━━━━━━━━━━━━━━━━\n`;
    text += `Day ${day.day_number} - ${day.plan_date} (${dayOfWeek})\n`;
    text += `━━━━━━━━━━━━━━━━\n`;

    if (day.main) {
      text += `🍽️  主菜: ${day.main.title} (${day.main.time_min}分)\n`;
    }

    if (day.side) {
      text += `🥗 副菜: ${day.side.title} (${day.side.time_min}分)\n`;
    }

    if (day.soup) {
      text += `🍲 汁物: ${day.soup.title} (${day.soup.time_min}分)\n`;
    }

    text += '\n';
  });

  text += '---\nAICHEFS - 毎日の献立を考える負担から解放\nhttps://aichefs.net/';

  return text;
}
