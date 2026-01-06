export const LANDING_HTML = `<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AICHEFS AIシェフ - 毎日の献立を考える負担から解放</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
    <style>
        /* Appleスタイルのカスタムスタイル */
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
            -webkit-font-smoothing: antialiased;
            overflow-x: hidden;
        }
        
        /* ヒーローセクション */
        .hero-section {
            height: 100vh;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            text-align: center;
            color: white;
            position: relative;
            overflow: hidden;
        }
        
        .hero-section::before {
            content: '';
            position: absolute;
            width: 200%;
            height: 200%;
            background: radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px);
            background-size: 50px 50px;
            animation: float 20s linear infinite;
        }
        
        @keyframes float {
            0% { transform: translate(0, 0); }
            100% { transform: translate(50px, 50px); }
        }
        
        .hero-content {
            position: relative;
            z-index: 10;
            max-width: 800px;
            padding: 0 20px;
        }
        
        .hero-title {
            font-size: clamp(2.5rem, 8vw, 5rem);
            font-weight: 700;
            margin-bottom: 1rem;
            line-height: 1.1;
            letter-spacing: -0.02em;
        }
        
        .hero-subtitle {
            font-size: clamp(1.2rem, 3vw, 1.8rem);
            font-weight: 300;
            margin-bottom: 2rem;
            opacity: 0.95;
        }
        
        .cta-button {
            display: inline-block;
            padding: 18px 48px;
            background: white;
            color: #667eea;
            font-size: 1.2rem;
            font-weight: 600;
            border-radius: 50px;
            text-decoration: none;
            transition: all 0.3s ease;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        }
        
        .cta-button:hover {
            transform: translateY(-3px);
            box-shadow: 0 15px 40px rgba(0,0,0,0.3);
        }
        
        /* セクション共通スタイル */
        section {
            padding: 100px 20px;
            max-width: 1200px;
            margin: 0 auto;
        }
        
        .section-title {
            font-size: clamp(2rem, 5vw, 3rem);
            font-weight: 700;
            text-align: center;
            margin-bottom: 3rem;
            color: #1a202c;
        }
        
        /* 問題提起セクション */
        .problem-card {
            background: #fef2f2;
            border-left: 4px solid #ef4444;
            padding: 2rem;
            margin-bottom: 1.5rem;
            border-radius: 8px;
            transition: transform 0.3s ease;
        }
        
        .problem-card:hover {
            transform: translateX(10px);
        }
        
        /* ソリューションカード */
        .solution-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 2rem;
            margin-top: 3rem;
        }
        
        .solution-card {
            background: white;
            padding: 2.5rem;
            border-radius: 16px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.08);
            transition: all 0.3s ease;
            text-align: center;
        }
        
        .solution-card:hover {
            transform: translateY(-10px);
            box-shadow: 0 10px 40px rgba(0,0,0,0.15);
        }
        
        .solution-icon {
            font-size: 3rem;
            margin-bottom: 1.5rem;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
        
        /* ステップカード */
        .steps-container {
            display: flex;
            justify-content: space-between;
            gap: 2rem;
            margin-top: 3rem;
            flex-wrap: wrap;
        }
        
        .step-card {
            flex: 1;
            min-width: 250px;
            text-align: center;
            position: relative;
        }
        
        .step-number {
            width: 60px;
            height: 60px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.5rem;
            font-weight: 700;
            margin: 0 auto 1.5rem;
        }
        
        /* 料金セクション */
        .pricing-badge {
            display: inline-block;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 40px 80px;
            border-radius: 20px;
            font-size: 3rem;
            font-weight: 700;
            box-shadow: 0 10px 40px rgba(102, 126, 234, 0.4);
        }
        
        /* スムーススクロール */
        html {
            scroll-behavior: smooth;
        }
        
        /* ナビゲーション */
        .nav {
            position: fixed;
            top: 0;
            width: 100%;
            background: rgba(255,255,255,0.95);
            backdrop-filter: blur(10px);
            z-index: 100;
            padding: 20px 40px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.05);
        }
        
        .nav-content {
            max-width: 1200px;
            margin: 0 auto;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .nav-logo {
            font-size: 1.5rem;
            font-weight: 700;
            color: #667eea;
            text-decoration: none;
        }
        
        .nav-button {
            padding: 10px 30px;
            background: #667eea;
            color: white;
            border-radius: 25px;
            text-decoration: none;
            font-weight: 600;
            transition: all 0.3s ease;
        }
        
        .nav-button:hover {
            background: #764ba2;
            transform: scale(1.05);
        }
    </style>
</head>
<body>
    <!-- ナビゲーション -->
    <nav class="nav">
        <div class="nav-content">
            <a href="/" class="nav-logo" style="display: flex; align-items: center; gap: 8px;">
                <i class="fas fa-utensils"></i>
                <span style="font-weight: 700; font-size: 1.2rem;">AICHEFS</span>
                <span style="font-weight: 400; font-size: 0.9rem; opacity: 0.8;">AIシェフ</span>
            </a>
            <a href="/app" class="nav-button">今すぐ始める</a>
        </div>
    </nav>

    <!-- ヒーローセクション -->
    <section class="hero-section">
        <div class="hero-content">
            <div style="display: flex; align-items: center; justify-content: center; gap: 1rem; margin-bottom: 2rem;">
                <i class="fas fa-utensils" style="font-size: 4rem; color: #fff;"></i>
                <div>
                    <h1 style="font-size: 4rem; font-weight: 900; color: #fff; line-height: 1; margin: 0;">AICHEFS</h1>
                    <p style="font-size: 1.5rem; font-weight: 600; color: #fff; margin: 0.5rem 0 0 0;">AIシェフ</p>
                </div>
            </div>
            <h2 class="hero-title" style="margin-top: 0;">考えなくていい。<br>悩まなくていい。</h2>
            <p class="hero-subtitle">
                今日から1ヶ月分の晩ごはんが決まります。<br>
                AIが作る、あなただけの献立。
            </p>
            <a href="/app" class="cta-button">
                無料で始める <i class="fas fa-arrow-right ml-2"></i>
            </a>
        </div>
    </section>

    <!-- 広告枠（ヘッダー下） -->
    <div id="ad-top-header" class="ad-container" style="display:flex;justify-content:center;padding:40px 0;background:#f9fafb;"></div>

    <!-- 問題提起セクション -->
    <section id="problem" style="background:#f9fafb;">
        <h2 class="section-title">毎日の献立、こんな悩みありませんか？</h2>
        
        <!-- 家族画像 -->
        <div style="max-width:800px;margin:3rem auto;border-radius:20px;overflow:hidden;box-shadow:0 10px 40px rgba(0,0,0,0.1);">
            <img src="/images/family-dinner.jpg" alt="家族で食卓を囲む" style="width:100%;height:auto;display:block;">
        </div>
        
        <div style="max-width:800px;margin:0 auto;">
            <div class="problem-card">
                <i class="fas fa-clock text-red-500 text-2xl mb-2"></i>
                <h3 class="text-xl font-bold mb-2">毎日考えるのが疲れる</h3>
                <p class="text-gray-600">「今日何作ろう？」と毎日悩む時間が、年間で数十時間にも...</p>
            </div>
            <div class="problem-card">
                <i class="fas fa-shopping-cart text-red-500 text-2xl mb-2"></i>
                <h3 class="text-xl font-bold mb-2">買い物で迷う</h3>
                <p class="text-gray-600">スーパーで「何を買えばいいんだっけ？」と立ち尽くすこと、ありますよね。</p>
            </div>
            <div class="problem-card">
                <i class="fas fa-wallet text-red-500 text-2xl mb-2"></i>
                <h3 class="text-xl font-bold mb-2">食費が膨らむ</h3>
                <p class="text-gray-600">計画なしの買い物で、使わない食材が冷蔵庫に...</p>
            </div>
            <div class="problem-card">
                <i class="fas fa-users text-red-500 text-2xl mb-2"></i>
                <h3 class="text-xl font-bold mb-2">家族の好みがバラバラ</h3>
                <p class="text-gray-600">「これ嫌い」「またこれ？」と言われると、もう何を作ればいいのか...</p>
            </div>
        </div>
    </section>

    <!-- ソリューションセクション -->
    <section id="solution">
        <h2 class="section-title">AICHEFS AIシェフが<br>すべて解決します</h2>
        
        <!-- 豊富なメニュー画像 -->
        <div style="max-width:900px;margin:3rem auto;border-radius:20px;overflow:hidden;box-shadow:0 10px 40px rgba(0,0,0,0.1);">
            <img src="/images/rich-menu.jpg" alt="豊富な献立メニュー" style="width:100%;height:auto;display:block;">
        </div>
        
        <div class="solution-grid">
            <div class="solution-card">
                <div class="solution-icon">
                    <i class="fas fa-robot"></i>
                </div>
                <h3 class="text-xl font-bold mb-3">AIチャットで簡単入力</h3>
                <p class="text-gray-600">
                    家族構成、予算、好みを答えるだけ。<br>
                    3分で入力完了。
                </p>
            </div>
            <div class="solution-card">
                <div class="solution-icon">
                    <i class="fas fa-calendar-alt"></i>
                </div>
                <h3 class="text-xl font-bold mb-3">1ヶ月分を自動生成</h3>
                <p class="text-gray-600">
                    主菜・副菜・汁物の3品セット。<br>
                    700種類以上のバリエーション。
                </p>
            </div>
            <div class="solution-card">
                <div class="solution-icon">
                    <i class="fas fa-print"></i>
                </div>
                <h3 class="text-xl font-bold mb-3">印刷して冷蔵庫に</h3>
                <p class="text-gray-600">
                    A4サイズで印刷可能。<br>
                    家族みんなで確認できる。
                </p>
            </div>
        </div>
    </section>

    <!-- 広告枠（中間） -->
    <div id="ad-middle" class="ad-container" style="display:flex;justify-content:center;padding:40px 0;background:#f9fafb;"></div>

    <!-- 使い方セクション -->
    <section id="howto" style="background:#f9fafb;">
        <h2 class="section-title">簡単3ステップで<br>1ヶ月分の献立が完成</h2>
        
        <!-- 料理風景画像 -->
        <div style="max-width:800px;margin:3rem auto;border-radius:20px;overflow:hidden;box-shadow:0 10px 40px rgba(0,0,0,0.1);">
            <img src="/images/family-cooking.jpg" alt="家族で料理を楽しむ" style="width:100%;height:auto;display:block;">
        </div>
        
        <div class="steps-container">
            <div class="step-card">
                <div class="step-number">1</div>
                <h3 class="text-xl font-bold mb-2">質問に答える</h3>
                <p class="text-gray-600">
                    家族構成、予算、好みなど<br>
                    AIチャットが優しく質問します
                </p>
            </div>
            <div class="step-card">
                <div class="step-number">2</div>
                <h3 class="text-xl font-bold mb-2">献立を確認</h3>
                <p class="text-gray-600">
                    30秒で1ヶ月分の献立が完成！<br>
                    カレンダー形式で見やすい
                </p>
            </div>
            <div class="step-card">
                <div class="step-number">3</div>
                <h3 class="text-xl font-bold mb-2">印刷して使う</h3>
                <p class="text-gray-600">
                    ボタン1つで印刷。<br>
                    冷蔵庫に貼って毎日確認
                </p>
            </div>
        </div>
    </section>

    <!-- 料金セクション -->
    <section id="pricing" style="text-align:center;">
        <h2 class="section-title">完全無料</h2>
        <div class="pricing-badge">
            ¥0
        </div>
        <p class="text-xl text-gray-600 mt-6">
            すべての機能が無料で使い放題。<br>
            登録も不要。今すぐ始められます。
        </p>
    </section>

    <!-- 広告枠（フッター上） -->
    <div id="ad-bottom" class="ad-container" style="display:flex;justify-content:center;padding:40px 0;background:#f9fafb;"></div>

    <!-- CTAセクション -->
    <section style="background:linear-gradient(135deg, #667eea 0%, #764ba2 100%);color:white;text-align:center;padding:80px 20px;">
        <h2 style="font-size:2.5rem;font-weight:700;margin-bottom:1rem;">
            今すぐ始めませんか？
        </h2>
        <p style="font-size:1.2rem;margin-bottom:2rem;opacity:0.95;">
            3分で入力、30秒で完成。<br>
            明日からの献立に、もう悩まない。
        </p>
        <a href="/app" class="cta-button">
            無料で献立を作る <i class="fas fa-arrow-right ml-2"></i>
        </a>
    </section>

    <!-- フッター -->
    <footer style="background:#1a202c;color:white;padding:60px 20px;">
        <div style="max-width:1200px;margin:0 auto;">
            <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(300px, 1fr));gap:3rem;">
                <!-- メルマガ登録 -->
                <div>
                    <h3 style="font-size:1.5rem;font-weight:700;margin-bottom:1rem;">
                        <i class="fas fa-envelope mr-2"></i>
                        メルマガ登録
                    </h3>
                    <p style="margin-bottom:1rem;opacity:0.8;">
                        週1回、おすすめレシピや献立のヒントをお届けします。
                    </p>
                    <div style="display:flex;gap:0.5rem;">
                        <input type="email" id="newsletter-email" placeholder="メールアドレス" 
                               style="flex:1;padding:12px;border-radius:8px;border:none;background:#2d3748;color:white;">
                        <button onclick="subscribeNewsletter()" 
                                style="padding:12px 24px;background:#667eea;color:white;border:none;border-radius:8px;font-weight:600;cursor:pointer;">
                            登録
                        </button>
                    </div>
                    <p id="newsletter-message" style="margin-top:0.5rem;font-size:0.875rem;"></p>
                </div>
                
                <!-- お問い合わせ -->
                <div>
                    <h3 style="font-size:1.5rem;font-weight:700;margin-bottom:1rem;">
                        <i class="fas fa-comment-dots mr-2"></i>
                        お問い合わせ
                    </h3>
                    <p style="margin-bottom:1rem;opacity:0.8;">
                        ご質問やご要望がございましたら、お気軽にお問い合わせください。
                    </p>
                    <button onclick="openContactForm()" 
                            style="width:100%;padding:12px;background:#667eea;color:white;border:none;border-radius:8px;font-weight:600;cursor:pointer;">
                        お問い合わせフォームを開く
                    </button>
                </div>
            </div>
            
            <!-- ログイン・会員登録 -->
            <div style="text-align:center;margin-top:3rem;padding-top:2rem;border-top:1px solid rgba(255,255,255,0.1);">
                <div style="display:flex;gap:1rem;justify-content:center;margin-bottom:1.5rem;flex-wrap:wrap;">
                    <a href="/register" style="padding:12px 24px;background:linear-gradient(135deg, #10b981, #3b82f6);color:white;text-decoration:none;border-radius:8px;font-weight:600;display:inline-flex;align-items:center;gap:0.5rem;transition:transform 0.2s;" onmouseover="this.style.transform='translateY(-2px)'" onmouseout="this.style.transform='translateY(0)'">
                        <i class="fas fa-user-plus"></i>
                        会員登録
                    </a>
                    <a href="/login" style="padding:12px 24px;background:linear-gradient(135deg, #667eea, #764ba2);color:white;text-decoration:none;border-radius:8px;font-weight:600;display:inline-flex;align-items:center;gap:0.5rem;transition:transform 0.2s;" onmouseover="this.style.transform='translateY(-2px)'" onmouseout="this.style.transform='translateY(0)'">
                        <i class="fas fa-sign-in-alt"></i>
                        ログイン
                    </a>
                    <a href="/admin/login" style="padding:12px 24px;background:linear-gradient(135deg, #1f2937, #374151);color:white;text-decoration:none;border-radius:8px;font-weight:600;display:inline-flex;align-items:center;gap:0.5rem;transition:transform 0.2s;" onmouseover="this.style.transform='translateY(-2px)'" onmouseout="this.style.transform='translateY(0)'">
                        <i class="fas fa-user-shield"></i>
                        管理者ログイン
                    </a>
                </div>
                <p style="opacity:0.6;">&copy; 2026 AICHEFS AIシェフ. All rights reserved.</p>
            </div>
        </div>
    </footer>

    <!-- お問い合わせモーダル -->
    <div id="contact-modal" style="display:none;position:fixed;inset:0;background:rgba(0,0,0,0.7);align-items:center;justify-content:center;z-index:1000;">
        <div style="background:white;border-radius:16px;padding:2rem;max-width:500px;width:90%;margin:0 20px;">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1.5rem;">
                <h3 style="font-size:1.5rem;font-weight:700;color:#1a202c;">お問い合わせ</h3>
                <button onclick="closeContactForm()" style="background:none;border:none;font-size:1.5rem;color:#718096;cursor:pointer;">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div style="display:flex;flex-direction:column;gap:1rem;">
                <input type="text" id="contact-name" placeholder="お名前" 
                       style="padding:12px;border:1px solid #e2e8f0;border-radius:8px;font-size:1rem;">
                <input type="email" id="contact-email" placeholder="メールアドレス" 
                       style="padding:12px;border:1px solid #e2e8f0;border-radius:8px;font-size:1rem;">
                <input type="text" id="contact-subject" placeholder="件名" 
                       style="padding:12px;border:1px solid #e2e8f0;border-radius:8px;font-size:1rem;">
                <textarea id="contact-message" placeholder="お問い合わせ内容" rows="5"
                          style="padding:12px;border:1px solid #e2e8f0;border-radius:8px;font-size:1rem;resize:vertical;"></textarea>
                <button onclick="submitContact()" 
                        style="padding:14px;background:#667eea;color:white;border:none;border-radius:8px;font-weight:600;font-size:1rem;cursor:pointer;">
                    送信
                </button>
                <p id="contact-message-result" style="text-align:center;font-size:0.875rem;"></p>
            </div>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js"></script>
    <script>
        // 広告読み込み
        async function loadAds() {
            try {
                const res = await axios.get('/api/ads/top_page');
                const ads = res.data.ads || [];
                
                ads.forEach(ad => {
                    const containerId = getAdContainerId(ad.slot_name);
                    const container = document.getElementById(containerId);
                    if (!container) return;
                    
                    if (ad.html_code) {
                        container.innerHTML = ad.html_code;
                    } else if (ad.image_url) {
                        container.innerHTML = '<a href="' + ad.link_url + '" target="_blank" onclick="trackAdClick(\'' + ad.ad_id + '\')"><img src="' + ad.image_url + '" alt="' + ad.title + '" style="max-width:' + ad.width + 'px;max-height:' + ad.height + 'px;"></a>';
                    }
                    
                    trackAdImpression(ad.ad_id, 'top_page');
                });
            } catch (error) {
                console.error('広告読み込みエラー:', error);
            }
        }
        
        function getAdContainerId(slot_name) {
            const map = {
                'TOPページヘッダーバナー': 'ad-top-header',
                'TOPページサイドバー': 'ad-middle',
                'TOPページフッターバナー': 'ad-bottom'
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
        
        // メルマガ登録
        async function subscribeNewsletter() {
            const emailInput = document.getElementById('newsletter-email');
            const messageEl = document.getElementById('newsletter-message');
            const email = emailInput.value.trim();
            
            if (!email) {
                messageEl.textContent = 'メールアドレスを入力してください';
                messageEl.style.color = '#ef4444';
                return;
            }
            
            try {
                const res = await axios.post('/api/newsletter/subscribe', { email });
                messageEl.textContent = res.data.message;
                messageEl.style.color = '#10b981';
                emailInput.value = '';
            } catch (error) {
                messageEl.textContent = 'エラーが発生しました';
                messageEl.style.color = '#ef4444';
            }
        }
        
        // お問い合わせ
        function openContactForm() {
            document.getElementById('contact-modal').style.display = 'flex';
        }
        
        function closeContactForm() {
            document.getElementById('contact-modal').style.display = 'none';
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
                resultEl.style.color = '#ef4444';
                return;
            }
            
            try {
                const res = await axios.post('/api/support/create', { name, email, subject, message });
                resultEl.textContent = res.data.message;
                resultEl.style.color = '#10b981';
                
                setTimeout(() => {
                    closeContactForm();
                }, 2000);
            } catch (error) {
                resultEl.textContent = 'エラーが発生しました';
                resultEl.style.color = '#ef4444';
            }
        }
        
        // ページ読み込み時に広告を読み込み
        window.addEventListener('DOMContentLoaded', () => {
            loadAds();
        });
    </script>
</body>
</html>
`;
