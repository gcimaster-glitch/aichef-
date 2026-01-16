// 寄付メーター・ランキングAPI追加
// src/index.tsxの末尾に追加するコード

// 寄付メーターAPI
app.get('/api/donations/meter', async (c) => {
  try {
    const { env } = c;
    
    // donation_meterビューから取得
    const result = await env.DB.prepare(`
      SELECT 
        total_donations,
        total_amount,
        children_helped,
        unique_donors
      FROM donation_meter
    `).first();
    
    return c.json({
      success: true,
      meter: result || {
        total_donations: 0,
        total_amount: 0,
        children_helped: 0,
        unique_donors: 0
      }
    });
  } catch (error: any) {
    console.error('寄付メーター取得エラー:', error);
    return c.json({
      success: false,
      error: error.message
    }, 500);
  }
});

// 寄付者ランキングAPI（上位20名）
app.get('/api/donations/ranking', async (c) => {
  try {
    const { env } = c;
    
    // donor_rankingビューから取得
    const result = await env.DB.prepare(`
      SELECT 
        display_name,
        total_donated,
        donation_count,
        last_donation_at
      FROM donor_ranking
      LIMIT 20
    `).all();
    
    return c.json({
      success: true,
      ranking: result.results || []
    });
  } catch (error: any) {
    console.error('寄付者ランキング取得エラー:', error);
    return c.json({
      success: false,
      error: error.message
    }, 500);
  }
});
