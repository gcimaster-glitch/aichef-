# Stripe決済機能 実装ガイド

## 📋 概要

AICHEFS に Stripe 決済機能を実装しました。以下の2つの決済方法をサポートしています：

1. **寄付プラン**: 一度の寄付で無料利用（単発決済）
2. **月額プラン**: 月額500円のサブスクリプション（30日間無料トライアル）

## 🎯 実装内容

### 1. データベース構造

#### テーブル構成

**`subscriptions` テーブル**:
- サブスクリプション情報を管理
- Stripe のサブスクリプションIDと紐付け
- ステータス管理（active, trialing, canceled など）

**`payment_transactions` テーブル**:
- 決済トランザクション履歴を記録
- 寄付・サブスクリプションの両方に対応
- カード情報（下4桁、ブランド）を記録

**`email_notifications` テーブル**:
- 決済完了メール通知の管理
- 送信ステータスとエラー記録

### 2. API エンドポイント

#### `POST /api/payment/donation`
寄付決済のCheckout Sessionを作成

**リクエスト:**
```json
{
  "household_id": "xxx-xxx-xxx",
  "email": "user@example.com",
  "amount": 3000
}
```

**レスポンス:**
```json
{
  "url": "https://checkout.stripe.com/..."
}
```

#### `POST /api/payment/subscription`
月額サブスクリプションのCheckout Sessionを作成

**リクエスト:**
```json
{
  "household_id": "xxx-xxx-xxx",
  "email": "user@example.com"
}
```

**レスポンス:**
```json
{
  "url": "https://checkout.stripe.com/..."
}
```

#### `POST /api/payment/webhook`
Stripe Webhookイベントを処理

**サポートしているイベント:**
- `checkout.session.completed`: 決済完了
- `customer.subscription.updated`: サブスクリプション更新
- `customer.subscription.deleted`: サブスクリプション削除
- `invoice.payment_succeeded`: 月額課金成功
- `invoice.payment_failed`: 月額課金失敗

#### `GET /api/payment/status/:household_id`
決済ステータスを確認

**レスポンス:**
```json
{
  "has_access": true,
  "access_type": "subscription",
  "subscription": { ... },
  "donation": null
}
```

### 3. ユーザーインターフェース

#### プラン選択ページ
- URL: `/pricing.html`
- 寄付プランと月額プランの選択UI
- 寄付金額の選択（1,000円〜10,000円）

#### 決済完了ページ
- URL: `/payment/success.html`
- 決済成功時のサンクスページ
- ダッシュボードへのリンク

#### 決済キャンセルページ
- URL: `/payment/cancel.html`
- 決済キャンセル時の案内ページ
- 再試行へのリンク

#### 特定商取引法ページ
- URL: `/legal.html`
- 会社情報・法的表示
- 料金・返金ポリシー

### 4. Stripe ユーティリティライブラリ

**ファイル:** `src/lib/stripe.ts`

**主要関数:**
- `getStripeClient()`: Stripeクライアントの初期化
- `createDonationCheckout()`: 寄付決済セッション作成
- `createSubscriptionCheckout()`: サブスクリプションセッション作成
- `verifyWebhookSignature()`: Webhook署名検証
- `recordPaymentTransaction()`: 決済トランザクション記録
- `recordSubscription()`: サブスクリプション記録
- `recordEmailNotification()`: メール通知記録

## 🔧 セットアップ手順

### 1. Stripe アカウントの準備

1. [Stripe Dashboard](https://dashboard.stripe.com/) にログイン
2. **テストモード**に切り替え
3. APIキーを取得：
   - **Publishable key**: `pk_test_...`
   - **Secret key**: `sk_test_...`

### 2. 月額プランの作成

1. Stripe Dashboard → **Products** → **Add product**
2. 商品情報を入力：
   - **Name**: AIシェフ月額プラン
   - **Description**: 月額500円で全機能利用可能
3. 価格設定：
   - **Pricing model**: Standard pricing
   - **Price**: ¥500 JPY
   - **Billing period**: Monthly
4. 作成後、**Price ID** (`price_xxx`) をコピー

### 3. Webhook の設定

1. Stripe Dashboard → **Developers** → **Webhooks** → **Add endpoint**
2. エンドポイントURL: `https://aichefs.net/api/payment/webhook`
3. イベント選択：
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
4. **Signing secret** (`whsec_...`) をコピー

### 4. 環境変数の設定

#### ローカル開発環境 (`.dev.vars`)

```bash
# Stripe API Keys (Test Mode)
STRIPE_SECRET_KEY=sk_test_YOUR_SECRET_KEY
STRIPE_WEBHOOK_SECRET=whsec_YOUR_WEBHOOK_SECRET
STRIPE_MONTHLY_PRICE_ID=price_YOUR_MONTHLY_PRICE_ID

# App URL
APP_URL=http://localhost:3000
```

#### 本番環境 (Cloudflare Pages)

```bash
# Stripe API Keys (Production Mode)
npx wrangler pages secret put STRIPE_SECRET_KEY --project-name aichef
# 入力: sk_live_YOUR_PRODUCTION_SECRET_KEY

npx wrangler pages secret put STRIPE_WEBHOOK_SECRET --project-name aichef
# 入力: whsec_YOUR_PRODUCTION_WEBHOOK_SECRET

npx wrangler pages secret put STRIPE_MONTHLY_PRICE_ID --project-name aichef
# 入力: price_YOUR_PRODUCTION_MONTHLY_PRICE_ID

npx wrangler pages secret put APP_URL --project-name aichef
# 入力: https://aichefs.net
```

### 5. データベースマイグレーション

```bash
# ローカル環境
npx wrangler d1 execute aichef-production --local --file=migrations/0024_stripe_payments.sql

# 本番環境
npx wrangler d1 execute aichef-production --remote --file=migrations/0024_stripe_payments.sql
```

### 6. テスト

#### ローカルテスト

```bash
# サーバー起動
npm run build
pm2 start ecosystem.config.cjs

# 寄付決済テスト
curl -X POST http://localhost:3000/api/payment/donation \
  -H "Content-Type: application/json" \
  -d '{"household_id":"test-123","email":"test@example.com","amount":3000}'

# サブスクリプションテスト
curl -X POST http://localhost:3000/api/payment/subscription \
  -H "Content-Type: application/json" \
  -d '{"household_id":"test-123","email":"test@example.com"}'
```

#### Stripe テストカード

**成功するカード:**
- カード番号: `4242 4242 4242 4242`
- 有効期限: 任意の未来の日付 (例: `12/25`)
- CVC: 任意の3桁 (例: `123`)
- 郵便番号: 任意

**エラーテスト:**
- 拒否: `4000 0000 0000 0002`
- 残高不足: `4000 0000 0000 9995`

## 📝 利用フロー

### 寄付プラン

1. ユーザーが `/pricing.html` にアクセス
2. 寄付金額を選択（1,000円〜10,000円）
3. 「寄付して始める」ボタンをクリック
4. Stripe Checkout ページへリダイレクト
5. カード情報を入力して決済
6. `/payment/success.html` へリダイレクト
7. Webhookで `payment_transactions` テーブルに記録
8. メール通知を記録（`email_notifications` テーブル）

### 月額プラン

1. ユーザーが `/pricing.html` にアクセス
2. 「30日間無料で始める」ボタンをクリック
3. Stripe Checkout ページへリダイレクト
4. カード情報を入力（30日後から課金）
5. `/payment/success.html` へリダイレクト
6. Webhookで `subscriptions` テーブルに記録
7. 30日後、自動的に月額課金が開始
8. 毎月の課金時に `invoice.payment_succeeded` イベント

## 🔐 セキュリティ

### 1. Webhook署名検証

すべてのWebhookリクエストでStripe署名を検証：

```typescript
const event = verifyWebhookSignature(
  stripe,
  payload,
  signature,
  env.STRIPE_WEBHOOK_SECRET
);
```

### 2. 環境変数の保護

- APIキーは`.dev.vars`（ローカル）とCloudflare Secrets（本番）で管理
- `.gitignore`に`.dev.vars`を追加済み
- 決してコードにハードコードしない

### 3. HTTPS必須

- 本番環境では必ずHTTPSを使用
- Cloudflare Pagesは自動的にHTTPS

## 📧 メール通知（今後の実装）

現在、メール通知は `email_notifications` テーブルに記録されるのみです。

### 今後の実装案:

1. **Resend API** を使用してメール送信
2. **SendGrid** または **Mailgun** の統合
3. バックグラウンドワーカーでメール送信処理

## 🐛 トラブルシューティング

### Webhook が動作しない

1. Webhook URLが正しいか確認: `https://aichefs.net/api/payment/webhook`
2. Stripe Dashboard → Webhooks → イベントログを確認
3. `STRIPE_WEBHOOK_SECRET`が正しく設定されているか確認

### 決済が完了しない

1. Stripeのテストモード/本番モードが一致しているか確認
2. APIキーが正しく設定されているか確認
3. ブラウザのコンソールでエラーを確認

### データベースエラー

1. マイグレーションが適用されているか確認:
```bash
npx wrangler d1 execute aichef-production --local --command="SELECT name FROM sqlite_master WHERE type='table' AND name='subscriptions';"
```

2. テーブルが存在しない場合は再度マイグレーション実行

## 📊 監視・分析

### Stripe Dashboard

- 決済状況: **Payments** → **All payments**
- サブスクリプション: **Subscriptions** → **Overview**
- 顧客管理: **Customers** → **All customers**

### データベース確認

```bash
# サブスクリプション数
npx wrangler d1 execute aichef-production --local --command="SELECT COUNT(*) FROM subscriptions WHERE status='active';"

# 寄付総額
npx wrangler d1 execute aichef-production --local --command="SELECT SUM(amount) FROM payment_transactions WHERE payment_type='donation' AND status='succeeded';"
```

## 🚀 本番デプロイ

```bash
# 1. ビルド
npm run build

# 2. 本番環境へデプロイ
npx wrangler pages deploy dist --project-name aichef

# 3. 環境変数設定（初回のみ）
# 上記「環境変数の設定」セクション参照

# 4. マイグレーション実行（初回のみ）
npx wrangler d1 execute aichef-production --remote --file=migrations/0024_stripe_payments.sql
```

## 📚 参考資料

- [Stripe API Documentation](https://stripe.com/docs/api)
- [Stripe Checkout](https://stripe.com/docs/payments/checkout)
- [Stripe Webhooks](https://stripe.com/docs/webhooks)
- [Cloudflare Pages Secrets](https://developers.cloudflare.com/pages/platform/functions/bindings/#secrets)

## ✅ チェックリスト

- [x] Stripe APIキーの取得
- [x] 月額プランの作成（Price ID取得）
- [x] Webhookエンドポイントの設定
- [x] 環境変数の設定（ローカル）
- [ ] 環境変数の設定（本番）
- [x] データベースマイグレーション（ローカル）
- [ ] データベースマイグレーション（本番）
- [x] ローカルテスト
- [ ] 本番デプロイ
- [ ] メール送信機能の実装

---

**作成日**: 2026-01-08  
**バージョン**: 1.0.0  
**担当**: AI Assistant
