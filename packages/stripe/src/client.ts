import Stripe from "stripe";

declare global {
  var seedstackStripe: Stripe | undefined;
}

function secretKey() {
  return process.env.STRIPE_SECRET_KEY ?? "sk_test_seedstack_unconfigured";
}

export function stripeClient() {
  if (!globalThis.seedstackStripe) {
    globalThis.seedstackStripe = new Stripe(secretKey());
  }
  return globalThis.seedstackStripe;
}

export type { Stripe };

export function constructWebhookEvent(payload: string, signature: string) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET ?? "";
  return stripeClient().webhooks.constructEvent(payload, signature, webhookSecret);
}
