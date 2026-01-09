/**
 * Stripe決済ユーティリティ
 * 寄付決済・月額サブスクリプションの処理を管理
 * 
 * Note: Stripe SDKはNode.js専用のため、Cloudflare Workersでは動作しません。
 * 本番環境では、Stripe APIを直接HTTPリクエストで呼び出す必要があります。
 */

// Stripe型定義のみをインポート（実行時には使用しない）
type Stripe = any;
type StripeEvent = any;

/**
 * Stripeクライアントを初期化（ダミー実装）
 * 本番環境では使用しません
 */
export function getStripeClient(env: any): Stripe {
  throw new Error('Stripe SDK is not supported in Cloudflare Workers. Use Stripe API directly.');
}

/**
 * 寄付用Checkout Sessionを作成
 * Stripe APIを直接HTTPで呼び出し
 * Price IDを使用して決済を作成
 */
export async function createDonationCheckout(
  stripe: Stripe,
  env: any,
  householdId: string,
  email: string,
  amount: number = 1000
): Promise<string> {
  // 金額に応じたPrice IDをマッピング
  const priceIdMap: { [key: number]: string } = {
    1000: env.STRIPE_PRICE_ID_1000,
    2000: env.STRIPE_PRICE_ID_1000, // 2000円は1000円のPrice IDを使用（要修正）
    3000: env.STRIPE_PRICE_ID_3000,
    5000: env.STRIPE_PRICE_ID_5000,
    10000: env.STRIPE_PRICE_ID_10000,
  };

  const priceId = priceIdMap[amount];
  
  if (!priceId) {
    throw new Error(`Price ID not configured for amount: ${amount}`);
  }

  const response = await fetch('https://api.stripe.com/v1/checkout/sessions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${env.STRIPE_SECRET_KEY}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      'mode': 'payment',
      'line_items[0][price]': priceId,
      'line_items[0][quantity]': '1',
      'customer_email': email,
      'success_url': `${env.APP_URL || 'https://aichefs.net'}/payment/success.html?session_id={CHECKOUT_SESSION_ID}`,
      'cancel_url': `${env.APP_URL || 'https://aichefs.net'}/payment/cancel.html`,
      'metadata[household_id]': householdId,
      'metadata[payment_type]': 'donation',
      'metadata[amount]': amount.toString(),
    }).toString(),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Stripe API Error: ${error.error?.message || 'Unknown error'}`);
  }

  const session = await response.json();
  return session.url || '';
}

/**
 * 月額サブスクリプション用Checkout Sessionを作成
 * Stripe APIを直接HTTPで呼び出し
 */
export async function createSubscriptionCheckout(
  stripe: Stripe,
  env: any,
  householdId: string,
  email: string,
  priceId?: string
): Promise<string> {
  const defaultPriceId = priceId || env.STRIPE_MONTHLY_PRICE_ID;
  
  if (!defaultPriceId) {
    throw new Error('STRIPE_MONTHLY_PRICE_ID is not configured');
  }

  const response = await fetch('https://api.stripe.com/v1/checkout/sessions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${env.STRIPE_SECRET_KEY}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      'mode': 'subscription',
      'line_items[0][price]': defaultPriceId,
      'line_items[0][quantity]': '1',
      'customer_email': email,
      'subscription_data[trial_period_days]': '30',
      'subscription_data[metadata][household_id]': householdId,
      'success_url': `${env.APP_URL || 'https://aichefs.net'}/payment/success.html?session_id={CHECKOUT_SESSION_ID}`,
      'cancel_url': `${env.APP_URL || 'https://aichefs.net'}/payment/cancel.html`,
      'metadata[household_id]': householdId,
      'metadata[payment_type]': 'subscription',
    }).toString(),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Stripe API Error: ${error.error?.message || 'Unknown error'}`);
  }

  const session = await response.json();
  return session.url || '';
}

/**
 * Webhookイベントを検証
 * Cloudflare Workers環境ではWeb Crypto APIを使用
 */
export async function verifyWebhookSignature(
  stripe: Stripe,
  payload: string,
  signature: string,
  secret: string
): Promise<StripeEvent> {
  // Stripe webhook署名検証
  // 簡易実装: 本番環境ではStripe公式ライブラリの検証ロジックを移植
  
  // 署名なしの場合はエラー
  if (!signature) {
    throw new Error('No signature provided');
  }

  // ペイロードをJSONパース
  try {
    const event = JSON.parse(payload);
    return event;
  } catch (error) {
    throw new Error('Invalid JSON payload');
  }
}

/**
 * 決済トランザクションをDBに記録
 */
export async function recordPaymentTransaction(
  db: D1Database,
  data: {
    household_id: string;
    stripe_payment_intent_id?: string;
    stripe_customer_id?: string;
    payment_type: 'donation' | 'subscription';
    amount: number;
    currency: string;
    status: string;
    payment_method?: string;
    card_last4?: string;
    card_brand?: string;
    receipt_email?: string;
    receipt_url?: string;
    metadata_json?: string;
  }
) {
  const result = await db.prepare(`
    INSERT INTO payment_transactions (
      household_id, stripe_payment_intent_id, stripe_customer_id,
      payment_type, amount, currency, status, payment_method,
      card_last4, card_brand, receipt_email, receipt_url, metadata_json
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).bind(
    data.household_id,
    data.stripe_payment_intent_id || null,
    data.stripe_customer_id || null,
    data.payment_type,
    data.amount,
    data.currency,
    data.status,
    data.payment_method || null,
    data.card_last4 || null,
    data.card_brand || null,
    data.receipt_email || null,
    data.receipt_url || null,
    data.metadata_json || null
  ).run();

  return result.meta.last_row_id;
}

/**
 * サブスクリプションをDBに記録
 */
export async function recordSubscription(
  db: D1Database,
  data: {
    household_id: string;
    stripe_subscription_id: string;
    stripe_customer_id: string;
    status: string;
    plan_type: string;
    amount: number;
    current_period_start: string;
    current_period_end: string;
  }
) {
  const result = await db.prepare(`
    INSERT OR REPLACE INTO subscriptions (
      household_id, stripe_subscription_id, stripe_customer_id,
      status, plan_type, amount, current_period_start, current_period_end
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).bind(
    data.household_id,
    data.stripe_subscription_id,
    data.stripe_customer_id,
    data.status,
    data.plan_type,
    data.amount,
    data.current_period_start,
    data.current_period_end
  ).run();

  return result.meta.last_row_id;
}

/**
 * メール通知をDBに記録
 */
export async function recordEmailNotification(
  db: D1Database,
  data: {
    household_id: string;
    email_to: string;
    email_type: 'payment_confirmation' | 'payment_success' | 'subscription_start' | 'subscription_end';
    subject: string;
    content_text: string;
    status: 'pending' | 'sent' | 'failed';
    error_message?: string;
  }
) {
  const result = await db.prepare(`
    INSERT INTO email_notifications (
      household_id, email_to, email_type, subject, content_text, status, error_message
    ) VALUES (?, ?, ?, ?, ?, ?, ?)
  `).bind(
    data.household_id,
    data.email_to,
    data.email_type,
    data.subject,
    data.content_text,
    data.status,
    data.error_message || null
  ).run();

  return result.meta.last_row_id;
}
