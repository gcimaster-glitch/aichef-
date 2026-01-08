# 🎯 Stripe決済 クイックスタートガイド

## てつじ様へ

Stripe決済機能の実装が完了しました！  
**5つのステップ**で本番環境に導入できます。

---

## 📋 必要なもの

1. **Stripeアカウント**（まだの場合は [stripe.com](https://stripe.com) で作成）
2. **本番用APIキー**（テストモードから本番モードへ切り替え）
3. **15分程度の作業時間**

---

## 🚀 セットアップ手順（5ステップ）

### Step 1: Stripe月額プラン作成（5分）

1. [Stripe Dashboard](https://dashboard.stripe.com/) にログイン
2. **本番モード**に切り替え（右上のトグル）
3. **Products** → **Add product** をクリック
4. 以下を入力：
   - **Name**: `AIシェフ月額プラン`
   - **Description**: `月額500円で全機能利用可能`
   - **Price**: `500 JPY`
   - **Billing period**: `Monthly`
5. **Save product** をクリック
6. **Price ID** (`price_xxx`) をメモ 📝

---

### Step 2: Webhook設定（3分）

1. Stripe Dashboard → **Developers** → **Webhooks**
2. **Add endpoint** をクリック
3. **Endpoint URL**: `https://aichefs.net/api/payment/webhook`
4. **Select events** で以下を選択：
   - ✅ `checkout.session.completed`
   - ✅ `customer.subscription.updated`
   - ✅ `customer.subscription.deleted`
   - ✅ `invoice.payment_succeeded`
   - ✅ `invoice.payment_failed`
5. **Add endpoint** をクリック
6. **Signing secret** (`whsec_xxx`) をメモ 📝

---

### Step 3: APIキー取得（1分）

1. Stripe Dashboard → **Developers** → **API keys**
2. **本番モード**であることを確認
3. 以下をメモ 📝：
   - **Publishable key**: `pk_live_xxx`
   - **Secret key**: `sk_live_xxx` (Revealをクリック)

---

### Step 4: 環境変数設定（5分）

私（AIアシスタント）に以下の**4つの値**を教えてください：

```
1. STRIPE_SECRET_KEY=sk_live_xxx（Step 3で取得）
2. STRIPE_WEBHOOK_SECRET=whsec_xxx（Step 2で取得）
3. STRIPE_MONTHLY_PRICE_ID=price_xxx（Step 1で取得）
4. APP_URL=https://aichefs.net（固定値）
```

私が以下のコマンドを実行します：

```bash
npx wrangler pages secret put STRIPE_SECRET_KEY --project-name aichef
npx wrangler pages secret put STRIPE_WEBHOOK_SECRET --project-name aichef
npx wrangler pages secret put STRIPE_MONTHLY_PRICE_ID --project-name aichef
npx wrangler pages secret put APP_URL --project-name aichef
```

---

### Step 5: 本番デプロイ（2分）

私が以下を実行します：

```bash
# 1. データベースマイグレーション
npx wrangler d1 execute aichef-production --remote --file=migrations/0024_stripe_payments.sql

# 2. 本番デプロイ
npm run build
npx wrangler pages deploy dist --project-name aichef
```

---

## ✅ 完了後の確認

1. `https://aichefs.net/pricing.html` にアクセス
2. **月額プラン** の「30日間無料で始める」をクリック
3. Stripeの決済ページが表示されることを確認
4. テストカードで決済テスト：
   - カード番号: `4242 4242 4242 4242`
   - 有効期限: `12/25`
   - CVC: `123`

---

## 🎉 利用開始

### ユーザー向けの案内

決済機能が利用可能になったら、以下のページをご案内ください：

- **プラン選択**: `https://aichefs.net/pricing.html`
- **特定商取引法**: `https://aichefs.net/legal.html`

### 2つのプラン

**💝 寄付プラン**:
- 一度の寄付で無料利用
- 金額: 1,000円〜10,000円から選択可能

**🎫 月額プラン**:
- 月額500円（税込）
- 初回30日間無料トライアル
- いつでもキャンセル可能

---

## 📊 運用・管理

### 売上確認

[Stripe Dashboard](https://dashboard.stripe.com/) で確認できます：

- **Payments**: 決済一覧
- **Subscriptions**: サブスクリプション管理
- **Customers**: 顧客管理

### データベース確認

```bash
# アクティブなサブスクリプション数
npx wrangler d1 execute aichef-production --remote --command="SELECT COUNT(*) FROM subscriptions WHERE status='active';"

# 寄付総額
npx wrangler d1 execute aichef-production --remote --command="SELECT SUM(amount) FROM payment_transactions WHERE payment_type='donation' AND status='succeeded';"
```

---

## 🆘 サポート

### トラブル時の連絡先

**Stripeサポート**:
- Dashboard → **Help** → **Contact support**
- 日本語サポート対応

**私（AIアシスタント）へ**:
- エラーメッセージをお知らせください
- 一緒に解決します

---

## 📝 次のステップ

Step 4の**4つの値**を教えていただければ、すぐに設定を完了します！

以下の形式でコピペしてください：

```
STRIPE_SECRET_KEY=sk_live_XXXXX
STRIPE_WEBHOOK_SECRET=whsec_XXXXX
STRIPE_MONTHLY_PRICE_ID=price_XXXXX
APP_URL=https://aichefs.net
```

準備ができたら、お知らせください！🚀

---

**作成日**: 2026-01-08  
**対象**: てつじ様  
**目的**: Stripe決済機能の本番導入
