-- 広告枠の初期データ投入

-- TOPページの広告枠
INSERT INTO ad_slots (slot_id, slot_name, page_location, position, width, height, description, is_active) VALUES
('slot_top_header', 'TOPページヘッダーバナー', 'top_page', 'header', 728, 90, 'TOPページの上部に表示される横長バナー（728x90）', 1),
('slot_top_sidebar', 'TOPページサイドバー', 'top_page', 'sidebar', 300, 250, 'TOPページの右サイドバー（300x250）', 1),
('slot_top_footer', 'TOPページフッターバナー', 'top_page', 'footer', 728, 90, 'TOPページの下部に表示されるバナー（728x90）', 1);

-- カレンダーページの広告枠
INSERT INTO ad_slots (slot_id, slot_name, page_location, position, width, height, description, is_active) VALUES
('slot_calendar_top', 'カレンダーページ上部バナー', 'calendar_page', 'header', 728, 90, 'カレンダー表示前の上部バナー（728x90）', 1),
('slot_calendar_inline', 'カレンダー中間バナー', 'calendar_page', 'inline', 728, 90, 'カレンダーの途中（15日目付近）に表示（728x90）', 1),
('slot_calendar_bottom', 'カレンダーページ下部バナー', 'calendar_page', 'footer', 728, 90, 'カレンダー表示後の下部バナー（728x90）', 1);

-- サンプル広告コンテンツ（デモ用）
INSERT INTO ad_contents (ad_id, slot_id, ad_type, title, link_url, html_code, priority, is_active) VALUES
('ad_sample_top', 'slot_top_header', 'affiliate_link', 'サンプル広告（ヘッダー）', 'https://example.com', 
'<div style="width:728px;height:90px;background:#f0f0f0;display:flex;align-items:center;justify-content:center;border:2px dashed #ccc;">
<p style="color:#666;font-size:14px;">広告枠（728x90）<br>ここにバナー画像またはアフィリエイトコードを設置</p>
</div>', 1, 1);

INSERT INTO ad_contents (ad_id, slot_id, ad_type, title, link_url, html_code, priority, is_active) VALUES
('ad_sample_sidebar', 'slot_top_sidebar', 'banner', 'サンプル広告（サイドバー）', 'https://example.com',
'<div style="width:300px;height:250px;background:#f8f8f8;display:flex;align-items:center;justify-content:center;border:2px dashed #ccc;">
<p style="color:#666;font-size:14px;">広告枠（300x250）<br>ここにバナー画像を設置</p>
</div>', 1, 1);
