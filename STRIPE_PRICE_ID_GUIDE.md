# 🎯 Stripe Price ID 取得ガイド

**重要**: 決済システムには Price ID (`price_xxx`) が必要です。Product ID (`prod_xxx`) ではありません。

---

## 📍 Price ID の取得手順

### **方法1: Stripe Dashboard から取得（推奨）**

1. **Stripe Dashboard にログイン**
   - https://dashboard.stripe.com/products

2. **各プロダクトをクリック**
   - AIシェフ月額プラン (`prod_TlFtjXUyViW2oq`)
   - ¥1,000寄付 (`prod_TlFwvbM1cI0bz3`)
   - ¥3,000寄付 (`prod_TlFyVoZdQ74XKq`)
   - ¥5,000寄付 (`prod_TlFzRZyez4C2Sc`)
   - ¥10,000寄付 (`prod_TlG0oWMuvcd2Yb`)

3. **Pricing セクションを確認**
   - 各プロダクトページの "Pricing" セクションに Price ID が表示されています
   - 形式: `price_xxxxxxxxxxxxx`

4. **Price ID をコピー**
   - 各価格の横にある「Copy Price ID」ボタンをクリック

---

## 📊 必要な Price ID 一覧

### **月額プラン**
```
Product: prod_TlFtjXUyViW2oq
Price: ¥500/月 (30日間無料トライアル)
Price ID: price_[ここをコピー]
```

### **寄付プラン**
```
¥1,000寄付
Product: prod_TlFwvbM1cI0bz3
Price ID: price_[ここをコピー]

¥3,000寄付
Product: prod_TlFyVoZdQ74XKq
Price ID: price_[ここをコピー]

¥5,000寄付
Product: prod_TlFzRZyez4C2Sc
Price ID: price_[ここをコピー]

¥10,000寄付
Product: prod_TlG0oWMuvcd2Yb
Price ID: price_[ここをコピー]
```

---

## 🖼️ スクリーンショット例

```
Stripe Dashboard > Products > [Product Name]

┌─────────────────────────────────────────┐
│ AIシェフ月額プラン                        │
│ prod_TlFtjXUyViW2oq                      │
├─────────────────────────────────────────┤
│ Pricing                                  │
│ ¥500 / month                             │
│ Price ID: price_xxxxxxxxxxxxx   [Copy]  │ ← ここをコピー
│ Trial period: 30 days                    │
└─────────────────────────────────────────┘
```

---

## 🚨 よくある間違い

### ❌ **間違い**: Product ID を使用
```
prod_TlFtjXUyViW2oq  # これは Product ID（使用不可）
```

### ✅ **正解**: Price ID を使用
```
price_xxxxxxxxxxxxx  # これが Price ID（必要）
```

---

## 📝 報告フォーマット

以下の形式でご報告ください：

```
AIシェフ月額プラン → Price ID: price_xxxxxxxxxxxxx
¥1,000寄付 → Price ID: price_xxxxxxxxxxxxx
¥3,000寄付 → Price ID: price_xxxxxxxxxxxxx
¥5,000寄付 → Price ID: price_xxxxxxxxxxxxx
¥10,000寄付 → Price ID: price_xxxxxxxxxxxxx
Webhook Secret: whsec_xxxxxxxxxxxxx
```

---

## 🔐 Webhook Secret も必要です

Webhook Endpoint の設定も完了していますか？

### **Webhook 設定手順**
1. https://dashboard.stripe.com/webhooks
2. "Add endpoint" をクリック
3. Endpoint URL: `https://aichefs.net/api/payment/webhook`
4. Select events:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
5. "Signing secret" をコピー（形式: `whsec_xxxxxxxxxxxxx`）

---

## ⏱️ 所要時間

- Price ID 取得: 約5分
- Webhook 設定: 約5分
- **合計: 約10分**

---

## 📞 次のステップ

Price ID と Webhook Secret を取得後、以下の形式で報告してください：

```
✅ Price ID 取得完了

AIシェフ月額プラン → Price ID: price_xxxxxxxxxxxxx
¥1,000寄付 → Price ID: price_xxxxxxxxxxxxx
¥3,000寄付 → Price ID: price_xxxxxxxxxxxxx
¥5,000寄付 → Price ID: price_xxxxxxxxxxxxx
¥10,000寄付 → Price ID: price_xxxxxxxxxxxxx
Webhook Secret: whsec_xxxxxxxxxxxxx
```

報告いただき次第、即座に本番デプロイを実施します！🚀

---

**作成日**: 2026-01-09  
**バージョン**: 1.0
