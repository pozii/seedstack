import { NextResponse } from "next/server";
import { billingPlans, isBillingConfigured, stripeClient } from "@seedstack/stripe";
import { subscriptionForOrganization } from "@seedstack/db";
import {
  canManageBilling,
  organizationMembership,
} from "@/lib/billing";
import { requireSession } from "@/lib/session";
import { siteUrl } from "@/lib/site";

export async function POST(request: Request) {
  const session = await requireSession();
  const body = (await request.json()) as {
    organizationId?: string;
    priceId?: string;
  };
  if (!body.organizationId || !body.priceId) {
    return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
  }
  const plan = billingPlans().find((candidate) => candidate.priceId === body.priceId);
  if (!plan || !isBillingConfigured()) {
    return NextResponse.json({ error: "Billing is not configured" }, { status: 503 });
  }
  const { role } = await organizationMembership(body.organizationId, session.user.id);
  if (!canManageBilling(role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const stripe = stripeClient();
  const existing = await subscriptionForOrganization(body.organizationId);
  const customerId =
    existing?.stripeCustomerId ??
    (
      await stripe.customers.create({
        email: session.user.email,
        metadata: { organizationId: body.organizationId },
      })
    ).id;
  const appUrl = siteUrl();
  const checkout = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: customerId,
    line_items: [{ price: plan.priceId, quantity: 1 }],
    metadata: { organizationId: body.organizationId },
    subscription_data: { metadata: { organizationId: body.organizationId } },
    success_url: `${appUrl}/dashboard/billing?checkout=success`,
    cancel_url: `${appUrl}/dashboard/billing?checkout=canceled`,
  });
  return NextResponse.json({ url: checkout.url });
}
