/**
 * Stripe決済APIルート
 * - 寄付決済
 * - 月額サブスクリプション
 * - Webhook処理
 */

import { Hono } from 'hono';
import { 
  getStripeClient, 
  createDonationCheckout, 
  createSubscriptionCheckout,
  verifyWebhookSignature,
  recordPaymentTransaction,
  recordSubscription,
  recordEmailNotification
} from '../lib/stripe';

type Bindings = {
  DB: D1Database;
  STRIPE_SECRET_KEY: string;
  STRIPE_WEBHOOK_SECRET: string;
  STRIPE_MONTHLY_PRICE_ID: string;
  APP_URL: string;
}

const payment = new Hono<{ Bindings: Bindings }>();

/**
 * 寄付決済Checkout作成
 * POST /api/payment/donation
 */
payment.post('/donation', async (c) => {
  try {
    const { household_id, email, amount } = await c.req.json();
    
    if (!household_id || !email) {
      return c.json({ error: '必須項目が不足しています' }, 400);
    }

    const stripe = getStripeClient(c.env);
    const checkoutUrl = await createDonationCheckout(
      stripe,
      c.env,
      household_id,
      email,
      amount || 1000
    );

    return c.json({ url: checkoutUrl });
  } catch (error: any) {
    console.error('寄付決済エラー:', error);
    return c.json({ error: error.message }, 500);
  }
});

/**
 * 月額サブスクリプションCheckout作成
 * POST /api/payment/subscription
 */
payment.post('/subscription', async (c) => {
  try {
    const { household_id, email, price_id } = await c.req.json();
    
    if (!household_id || !email) {
      return c.json({ error: '必須項目が不足しています' }, 400);
    }

    const stripe = getStripeClient(c.env);
    const checkoutUrl = await createSubscriptionCheckout(
      stripe,
      c.env,
      household_id,
      email,
      price_id
    );

    return c.json({ url: checkoutUrl });
  } catch (error: any) {
    console.error('サブスクリプション作成エラー:', error);
    return c.json({ error: error.message }, 500);
  }
});

/**
 * Stripe Webhook処理
 * POST /api/payment/webhook
 */
payment.post('/webhook', async (c) => {
  try {
    const signature = c.req.header('stripe-signature');
    if (!signature) {
      return c.json({ error: 'Signature missing' }, 400);
    }

    const payload = await c.req.text();
    const stripe = getStripeClient(c.env);
    
    const event = verifyWebhookSignature(
      stripe,
      payload,
      signature,
      c.env.STRIPE_WEBHOOK_SECRET
    );

    // イベント処理
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as any;
        const householdId = session.metadata?.household_id;
        const paymentType = session.metadata?.payment_type;

        if (session.mode === 'payment') {
          // 寄付決済完了
          await recordPaymentTransaction(c.env.DB, {
            household_id: householdId,
            stripe_payment_intent_id: session.payment_intent,
            stripe_customer_id: session.customer,
            payment_type: 'donation',
            amount: session.amount_total,
            currency: session.currency,
            status: 'succeeded',
            receipt_email: session.customer_email,
            metadata_json: JSON.stringify(session.metadata)
          });

          // メール通知記録
          await recordEmailNotification(c.env.DB, {
            household_id: householdId,
            email_to: session.customer_email,
            email_type: 'payment_success',
            subject: 'AIシェフ - ご寄付ありがとうございます',
            content_text: `ご寄付いただき、ありがとうございます！\n\n金額: ¥${session.amount_total.toLocaleString()}\n\nAIシェフを無料でご利用いただけます。`,
            status: 'pending'
          });
        } else if (session.mode === 'subscription') {
          // サブスクリプション開始
          const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
          
          await recordSubscription(c.env.DB, {
            household_id: householdId,
            stripe_subscription_id: subscription.id,
            stripe_customer_id: subscription.customer as string,
            status: subscription.status,
            plan_type: 'monthly',
            amount: subscription.items.data[0].price.unit_amount || 0,
            current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
            current_period_end: new Date(subscription.current_period_end * 1000).toISOString()
          });

          // メール通知記録
          await recordEmailNotification(c.env.DB, {
            household_id: householdId,
            email_to: session.customer_email,
            email_type: 'subscription_start',
            subject: 'AIシェフ - サブスクリプション開始',
            content_text: `月額プランへのご登録ありがとうございます！\n\n30日間の無料トライアル期間をお楽しみください。`,
            status: 'pending'
          });
        }
        break;
      }

      case 'customer.subscription.updated':
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as any;
        const householdId = subscription.metadata?.household_id;

        if (householdId) {
          await recordSubscription(c.env.DB, {
            household_id: householdId,
            stripe_subscription_id: subscription.id,
            stripe_customer_id: subscription.customer,
            status: subscription.status,
            plan_type: 'monthly',
            amount: subscription.items.data[0].price.unit_amount || 0,
            current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
            current_period_end: new Date(subscription.current_period_end * 1000).toISOString()
          });
        }
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as any;
        const subscription = await stripe.subscriptions.retrieve(invoice.subscription);
        const householdId = subscription.metadata?.household_id;

        if (householdId) {
          await recordPaymentTransaction(c.env.DB, {
            household_id: householdId,
            stripe_payment_intent_id: invoice.payment_intent,
            stripe_customer_id: invoice.customer,
            payment_type: 'subscription',
            amount: invoice.amount_paid,
            currency: invoice.currency,
            status: 'succeeded',
            receipt_email: invoice.customer_email,
            receipt_url: invoice.hosted_invoice_url,
            metadata_json: JSON.stringify(subscription.metadata)
          });
        }
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as any;
        const subscription = await stripe.subscriptions.retrieve(invoice.subscription);
        const householdId = subscription.metadata?.household_id;

        if (householdId) {
          await recordPaymentTransaction(c.env.DB, {
            household_id: householdId,
            stripe_payment_intent_id: invoice.payment_intent,
            stripe_customer_id: invoice.customer,
            payment_type: 'subscription',
            amount: invoice.amount_due,
            currency: invoice.currency,
            status: 'failed',
            receipt_email: invoice.customer_email,
            metadata_json: JSON.stringify(subscription.metadata)
          });
        }
        break;
      }
    }

    return c.json({ received: true });
  } catch (error: any) {
    console.error('Webhook処理エラー:', error);
    return c.json({ error: error.message }, 500);
  }
});

/**
 * 決済ステータス確認
 * GET /api/payment/status/:household_id
 */
payment.get('/status/:household_id', async (c) => {
  try {
    const householdId = c.req.param('household_id');

    // サブスクリプション確認
    const subscription = await c.env.DB.prepare(`
      SELECT * FROM subscriptions
      WHERE household_id = ?
      AND status IN ('active', 'trialing')
      ORDER BY created_at DESC
      LIMIT 1
    `).bind(householdId).first();

    // 寄付確認
    const donation = await c.env.DB.prepare(`
      SELECT * FROM payment_transactions
      WHERE household_id = ?
      AND payment_type = 'donation'
      AND status = 'succeeded'
      ORDER BY created_at DESC
      LIMIT 1
    `).bind(householdId).first();

    const hasAccess = !!(subscription || donation);
    const accessType = subscription ? 'subscription' : (donation ? 'donation' : 'none');

    return c.json({
      has_access: hasAccess,
      access_type: accessType,
      subscription,
      donation
    });
  } catch (error: any) {
    console.error('ステータス確認エラー:', error);
    return c.json({ error: error.message }, 500);
  }
});

export default payment;
