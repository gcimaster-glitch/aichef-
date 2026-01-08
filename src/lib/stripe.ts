/**
 * Stripe決済ユーティリティ
 * 寄付決済・月額サブスクリプションの処理を管理
 */

import Stripe from 'stripe';

/**
 * Stripeクライアントを初期化
 */
export function getStripeClient(env: any): Stripe {
  if (!env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY is not configured');
  }
  
  return new Stripe(env.STRIPE_SECRET_KEY, {
    apiVersion: '2024-12-18.acacia',
    typescript: true,
  });
}

/**
 * 寄付用Checkout Sessionを作成
 */
export async function createDonationCheckout(
  stripe: Stripe,
  env: any,
  householdId: string,
  email: string,
  amount: number = 1000 // デフォルト1,000円
): Promise<string> {
  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    line_items: [
      {
        price_data: {
          currency: 'jpy',
          product_data: {
            name: 'AIシェフ応援寄付',
            description: '寄付いただくことで、AIシェフを無料でご利用いただけます。',
          },
          unit_amount: amount,
        },
        quantity: 1,
      },
    ],
    customer_email: email,
    success_url: `${env.APP_URL || 'https://aichefs.net'}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${env.APP_URL || 'https://aichefs.net'}/payment/cancel`,
    metadata: {
      household_id: householdId,
      payment_type: 'donation',
    },
  });

  return session.url || '';
}

/**
 * 月額サブスクリプション用Checkout Sessionを作成
 */
export async function createSubscriptionCheckout(
  stripe: Stripe,
  env: any,
  householdId: string,
  email: string,
  priceId?: string
): Promise<string> {
  // デフォルトで500円/月のプランを作成
  const defaultPriceId = priceId || env.STRIPE_MONTHLY_PRICE_ID;
  
  if (!defaultPriceId) {
    throw new Error('STRIPE_MONTHLY_PRICE_ID is not configured');
  }

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    line_items: [
      {
        price: defaultPriceId,
        quantity: 1,
      },
    ],
    customer_email: email,
    subscription_data: {
      trial_period_days: 30, // モニター期間30日無料
      metadata: {
        household_id: householdId,
      },
    },
    success_url: `${env.APP_URL || 'https://aichefs.net'}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${env.APP_URL || 'https://aichefs.net'}/payment/cancel`,
    metadata: {
      household_id: householdId,
      payment_type: 'subscription',
    },
  });

  return session.url || '';
}

/**
 * Webhookイベントを検証
 */
export function verifyWebhookSignature(
  stripe: Stripe,
  payload: string,
  signature: string,
  secret: string
): Stripe.Event {
  return stripe.webhooks.constructEvent(payload, signature, secret);
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
