# 🚀 デプロイ準備状況レポート

**更新日**: 2026-01-09 17:40 JST  
**ステータス**: ⚠️ Webhook Secret待ち → 本番デプロイ可能

---

## ✅ **完了した作業**

### **1. Price ID 統合完了**
```
✅ AIシェフ月額プラン: price_1SnjOB9DjiF5e5nJQasgAO5E (¥500/月)
✅ ¥1,000寄付: price_1SnjR59DjiF5e5nJfnMb0lYZ
✅ ¥3,000寄付: price_1SnjSp9DjiF5e5nJ55OSY7BA
⚠️ ¥5,000寄付: price_1SnjTO9DjiF5e5nJvUFbx471 (一時停止 - 設定要修正)
✅ ¥10,000寄付: price_1SnjU59DjiF5e5nJyZmc5sjG
```

### **2. コード修正完了**
- [x] `.dev.vars` に Price ID 設定
- [x] `src/lib/stripe.ts` でPrice ID使用方式に変更
- [x] Stripe API エラーハンドリング追加
- [x] `pricing.html` で ¥5,000 一時停止の警告表示
- [x] JavaScript で ¥5,000 選択時のバリデーション
- [x] ¥2,000 選択肢を削除（未設定のため）

### **3. ビルド・動作確認**
- [x] ビルド成功: `dist/_worker.js` 533.50 kB
- [x] ローカルサーバー起動: `http://localhost:3000`
- [x] 決済フロー実装確認

### **4. Gitコミット**
```bash
bc95cea - feat: Integrate Stripe Price IDs and update payment flow
ff2f934 - docs: Add comprehensive navigation map documentation
b61c22e - feat: Add navigation links to About and Donation pages
```

---

## ⏳ **残りの作業**

### **1. Webhook Secret 取得（必須）**
**所要時間**: 約3分

#### **手順**
1. Stripe Dashboard にアクセス
   - https://dashboard.stripe.com/webhooks

2. Webhook Endpoint を作成または確認
   - Endpoint URL: `https://aichefs.net/api/payment/webhook`
   - Events: 
     - `checkout.session.completed`
     - `customer.subscription.created`
     - `customer.subscription.updated`
     - `customer.subscription.deleted`
     - `invoice.payment_succeeded`
     - `invoice.payment_failed`

3. **Signing Secret をコピー**
   - 形式: `whsec_xxxxxxxxxxxxx`

#### **報告フォーマット**
```
Webhook Secret: whsec_xxxxxxxxxxxxx
```

---

### **2. ¥5,000寄付の修正（推奨）**
**所要時間**: 約5分

#### **問題点**
現在、¥5,000寄付が **月額課金** (`interval: month`) に設定されています。

#### **修正手順**
1. Stripe Dashboard で該当 Price を削除
2. 新しい **1回払い** Price を作成
   - Product: prod_TlFzRZyez4C2Sc (5000円寄付)
   - Amount: ¥5,000
   - Billing: One-time
3. 新しい Price ID を報告

---

### **3. 月額プランのトライアル設定（確認）**
**現状**: コードで30日間トライアルを設定済み

Stripe Dashboard で Price に Trial が設定されているか確認してください。

---

## 🚀 **本番デプロイ手順**

### **Option A: 今すぐデプロイ（推奨）**
**条件**: Webhook Secret のみ必要

```bash
# 1. Webhook Secret を Cloudflare Secrets に設定
npx wrangler pages secret put STRIPE_WEBHOOK_SECRET --project-name aichefs

# 2. Price IDs を設定
npx wrangler pages secret put STRIPE_PRICE_ID_MONTHLY --project-name aichefs
npx wrangler pages secret put STRIPE_PRICE_ID_1000 --project-name aichefs
npx wrangler pages secret put STRIPE_PRICE_ID_3000 --project-name aichefs
npx wrangler pages secret put STRIPE_PRICE_ID_5000 --project-name aichefs
npx wrangler pages secret put STRIPE_PRICE_ID_10000 --project-name aichefs

# 3. Stripe API Keys を設定
npx wrangler pages secret put STRIPE_SECRET_KEY --project-name aichefs
npx wrangler pages secret put STRIPE_PUBLISHABLE_KEY --project-name aichefs

# 4. 本番デプロイ
npm run build
npx wrangler pages deploy dist --project-name aichefs
```

**メリット**:
- ✅ ¥1,000、¥3,000、¥10,000 の寄付が即座に利用可能
- ✅ 月額プラン（¥500/月）が利用可能
- ⚠️ ¥5,000 は一時的に利用不可（警告表示済み）

---

### **Option B: 完全修正後にデプロイ**
**条件**: Webhook Secret + ¥5,000 Price 修正

```bash
# ¥5,000 の新しい Price ID を取得後
# .dev.vars と src/lib/stripe.ts を更新
# pricing.html から警告メッセージを削除
# ビルド → デプロイ
```

**メリット**:
- ✅ すべての寄付金額が利用可能
- ✅ 完璧な状態で本番稼働

**デメリット**:
- ⏱️ 追加で5-10分必要

---

## 📊 **現在利用可能な機能**

| 機能 | 状態 | 備考 |
|------|:----:|------|
| ¥1,000寄付 | ✅ | 即座に利用可能 |
| ¥3,000寄付 | ✅ | 即座に利用可能 |
| ¥5,000寄付 | ⚠️ | 設定修正待ち（一時停止） |
| ¥10,000寄付 | ✅ | 即座に利用可能 |
| 月額プラン（¥500/月） | ✅ | 30日間無料トライアル |
| Webhook処理 | ⏳ | Webhook Secret待ち |

---

## 🎯 **推奨アクション**

### **即座に実施（5分）**
1. ✅ Webhook Secret を取得して報告
2. 🚀 Option A でデプロイ実行
3. ✅ 決済テスト（¥1,000、¥3,000、¥10,000）

### **後日実施（任意）**
1. ¥5,000寄付の Price 修正
2. 新しい Price ID で再デプロイ

---

## 🔐 **セキュリティ確認**

- [x] Stripe Secret Key は環境変数で管理
- [x] `.dev.vars` は `.gitignore` に含まれている
- [x] 本番環境では Cloudflare Secrets を使用
- [x] Webhook 署名検証を実装済み
- [x] エラーハンドリング実装済み

---

## 📞 **次のステップ**

**てつじ様へ**: 以下を報告してください

```
✅ Webhook Secret取得完了

Webhook Secret: whsec_xxxxxxxxxxxxx
```

報告いただき次第、**即座に本番デプロイ**を実行します！🚀

---

**作成者**: AI Assistant  
**バージョン**: 1.0  
**Gitコミット**: bc95cea
