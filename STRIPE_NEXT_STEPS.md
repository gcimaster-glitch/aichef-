# 🚀 Stripe決済 - 次のステップ

**作成日**: 2026-01-09  
**現在のステータス**: ✅ コード実装完了、⏳ Stripe設定待ち

---

## 📊 現状まとめ

### ✅ 完了済み

1. **コード実装**
   - 寄付決済API: `/api/payment/donation`
   - サブスクAPI: `/api/payment/subscription`
   - Webhook処理: `/api/payment/webhook`
   - 決済ページUI: `/pricing.html`
   - 成功/キャンセルページ
   - 特定商取引法ページ: `/legal.html`

2. **ランディングページ**
   - 寄付CTAセクション追加 ✅
   - 金額選択ボタン（¥1,000-¥10,000）
   - 特典説明カード3つ
   - インタラクティブ効果

3. **UX改善**
   - ログイン状態管理修正 ✅
   - マイページボタン追加 ✅
   - ダッシュボード初期化修正 ✅

### ⏳ 保留中（材料データ問題）

- 主要レシピの材料データ修正
  - 66件のレシピで材料0個
  - 198件のレシピで材料1個のみ
  - Foreign Key制約エラーで投入失敗
  - **推奨**: Stripe決済優先、材料データは後日対応

---

## 🎯 次にやること（優先順位順）

### Step 1: Stripe Dashboard設定（てつじ様の作業）

**所要時間**: 約15-20分

#### A. 月額サブスクリプション価格の作成
1. https://dashboard.stripe.com/products へアクセス
2. 「+ Create product」をクリック
3. 以下を入力：
   ```
   Product name: AIシェフ月額プラン
   Description: 献立自動生成サービスの月額プラン。初回30日間無料、以降月額500円。
   Price: ¥500
   Billing period: Monthly
   Currency: JPY
   ```
4. （オプション）「Add a free trial」→ `30 days`
5. 保存後、**Price ID**をコピー（例: `price_1OXabc...`）

#### B. 寄付用価格の作成（4つ）
以下の4つを作成：

| 金額 | Product Name | Pricing Model | Currency |
|------|-------------|---------------|----------|
| ¥1,000 | AICHEFS 応援寄付 ¥1,000 | One-time | JPY |
| ¥3,000 | AICHEFS 応援寄付 ¥3,000 | One-time | JPY |
| ¥5,000 | AICHEFS 応援寄付 ¥5,000 | One-time | JPY |
| ¥10,000 | AICHEFS 応援寄付 ¥10,000 | One-time | JPY |

各Price IDをコピー

#### C. Webhook Endpointの作成
1. https://dashboard.stripe.com/webhooks へアクセス
2. 「+ Add endpoint」をクリック
3. 以下を入力：
   ```
   Endpoint URL: https://aichefs.net/api/payment/webhook
   Description: AICHEFS Payment Webhook
   ```
4. イベント選択：
   - ✅ `checkout.session.completed`
   - ✅ `customer.subscription.created`
   - ✅ `customer.subscription.updated`
   - ✅ `customer.subscription.deleted`
   - ✅ `invoice.payment_succeeded`
   - ✅ `invoice.payment_failed`
5. 保存後、**Signing secret**をコピー（例: `whsec_abc...`）

---

### Step 2: 環境変数の設定

取得した情報を以下のフォーマットでお知らせください：

```
月額プラン Price ID: price_xxxxxxxxxxxxx
寄付 ¥1,000 Price ID: price_xxxxxxxxxxxxx
寄付 ¥3,000 Price ID: price_xxxxxxxxxxxxx
寄付 ¥5,000 Price ID: price_xxxxxxxxxxxxx
寄付 ¥10,000 Price ID: price_xxxxxxxxxxxxx
Webhook Secret: whsec_xxxxxxxxxxxxx
```

---

### Step 3: 本番デプロイ準備（私が実施）

上記の情報を受け取り次第、以下を実施：

1. **.dev.vars更新**
2. **コードのPrice ID設定更新**
3. **ローカル環境でテスト**
4. **Cloudflare Pages Secrets設定**
5. **本番デプロイ**
6. **実際の決済テスト**

---

## 📝 Price ID設定チェックリスト

てつじ様、以下の情報を取得したらお知らせください：

- [ ] 月額プラン Price ID
- [ ] 寄付 ¥1,000 Price ID
- [ ] 寄付 ¥3,000 Price ID
- [ ] 寄付 ¥5,000 Price ID
- [ ] 寄付 ¥10,000 Price ID
- [ ] Webhook Signing Secret

---

## 🧪 テスト計画

### ローカル環境テスト
1. 寄付決済テスト（各金額）
2. 月額サブスク登録テスト
3. Webhook受信テスト
4. メール送信テスト（要SMTP設定）

### 本番環境テスト
1. 少額寄付テスト（¥1,000）
2. 月額サブスクテスト（初回無料確認）
3. Stripe Dashboardで確認
4. 決済完了フローの確認

---

## 🔒 セキュリティチェック

- [x] `.dev.vars`は`.gitignore`に含まれている
- [x] Webhook署名検証が実装されている
- [ ] Cloudflare Pages Secretsに本番キーを設定
- [ ] 本番環境でHTTPSのみアクセス可能

---

## 📞 サポート情報

**Stripe Dashboard**
- 本番環境: https://dashboard.stripe.com/
- Webhooks: https://dashboard.stripe.com/webhooks
- Payments: https://dashboard.stripe.com/payments
- Logs: https://dashboard.stripe.com/logs

**ドキュメント**
- Stripe Checkout: https://stripe.com/docs/payments/checkout
- Webhooks: https://stripe.com/docs/webhooks
- Testing: https://stripe.com/docs/testing

---

## 🎉 完了後に可能になること

- ✅ TOPページから寄付CTAで直接決済
- ✅ 寄付完了で全機能を永久無料で利用
- ✅ 月額プラン（¥500/月、初回30日無料）
- ✅ 決済完了メールの自動送信
- ✅ Stripe Dashboardで売上管理
- ✅ サブスクリプション自動更新

---

**次のアクション**: てつじ様がStripe Dashboardで設定を完了したら、Price IDをお知らせください！
