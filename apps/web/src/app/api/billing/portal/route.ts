import { NextResponse } from "next/server";
import { isBillingConfigured, stripeClient } from "@seedstack/stripe";
import { subscriptionForOrganization } from "@seedstack/db";
import {
  canManageBilling,
  organizationMembership,
} from "@/lib/billing";
import { requireSession } from "@/lib/session";
import { siteUrl } from "@/lib/site";

export async function POST(request: Request) {
  const session = await requireSession();
  const body = (await request.json()) as { organizationId?: string };
  if (!body.organizationId) {
    return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
  }
  if (!isBillingConfigured()) {
    return NextResponse.json({ error: "Billing is not configured" }, { status: 503 });
  }
  const { role } = await organizationMembership(body.organizationId, session.user.id);
  if (!canManageBilling(role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const current = await subscriptionForOrganization(body.organizationId);
  if (!current) {
    return NextResponse.json({ error: "No subscription yet" }, { status: 404 });
  }
  const portal = await stripeClient().billingPortal.sessions.create({
    customer: current.stripeCustomerId,
    return_url: `${siteUrl()}/dashboard/billing`,
  });
  return NextResponse.json({ url: portal.url });
}
