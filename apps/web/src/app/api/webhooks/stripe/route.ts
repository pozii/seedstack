import { NextResponse } from "next/server";
import { constructWebhookEvent, stripeClient } from "@seedstack/stripe";
import type { Stripe } from "@seedstack/stripe";
import { recordSubscription, subscriptionForStripeId } from "@seedstack/db";

function asSubscription(value: unknown): Stripe.Subscription | null {
  if (typeof value !== "object" || value === null) {
    return null;
  }
  if ((value as { object?: unknown }).object !== "subscription") {
    return null;
  }
  return value as Stripe.Subscription;
}

function asCheckoutSession(value: unknown): Stripe.Checkout.Session | null {
  if (typeof value !== "object" || value === null) {
    return null;
  }
  if ((value as { object?: unknown }).object !== "checkout.session") {
    return null;
  }
  return value as Stripe.Checkout.Session;
}

function priceIdOf(source: Stripe.Subscription) {
  const price = source.items.data[0]?.price;
  if (!price) {
    return null;
  }
  return typeof price === "string" ? price : price.id;
}

async function organizationIdFor(
  source: Stripe.Subscription,
  customerId: string,
) {
  if (source.metadata.organizationId) {
    return source.metadata.organizationId;
  }
  const existing = await subscriptionForStripeId(source.id);
  if (existing && existing.stripeCustomerId === customerId) {
    return existing.organizationId;
  }
  return undefined;
}

function customerIdOf(source: Stripe.Subscription) {
  const customer = source.customer;
  return typeof customer === "string" ? customer : customer.id;
}

function periodEndOf(source: Stripe.Subscription) {
  const ending = source.items.data[0]?.current_period_end;
  return typeof ending === "number" ? new Date(ending * 1000) : null;
}

async function syncSubscription(source: Stripe.Subscription) {
  const customerId = customerIdOf(source);
  const organizationId = await organizationIdFor(source, customerId);
  if (!organizationId) {
    return false;
  }
  await recordSubscription({
    organizationId,
    stripeCustomerId: customerId,
    stripeSubscriptionId: source.id,
    status: source.status,
    priceId: priceIdOf(source),
    currentPeriodEnd: periodEndOf(source),
    cancelAtPeriodEnd: source.cancel_at_period_end,
  });
  return true;
}

export async function POST(request: Request) {
  if ((process.env.STRIPE_WEBHOOK_SECRET ?? "").length === 0) {
    return NextResponse.json({ error: "Billing is not configured" }, { status: 503 });
  }
  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }
  let event: Stripe.Event;
  try {
    event = constructWebhookEvent(await request.text(), signature);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }
  if (event.type === "checkout.session.completed") {
    const checkout = asCheckoutSession(event.data.object);
    const subscriptionId =
      typeof checkout?.subscription === "string" ? checkout.subscription : undefined;
    if (checkout && subscriptionId) {
      const full = await stripeClient().subscriptions.retrieve(subscriptionId);
      await syncSubscription(full);
    }
    return NextResponse.json({ received: true });
  }
  if (
    event.type === "customer.subscription.created" ||
    event.type === "customer.subscription.updated" ||
    event.type === "customer.subscription.deleted"
  ) {
    const current = asSubscription(event.data.object);
    if (current) {
      await syncSubscription(current);
    }
    return NextResponse.json({ received: true });
  }
  return NextResponse.json({ received: true });
}
