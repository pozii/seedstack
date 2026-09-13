import { eq } from "drizzle-orm";
import { db } from "./client";
import { subscription } from "./schema";

export type SubscriptionRecord = {
  organizationId: string;
  stripeCustomerId: string;
  stripeSubscriptionId: string;
  status: string;
  priceId: string | null;
  currentPeriodEnd: Date | null;
  cancelAtPeriodEnd: boolean;
};

export async function subscriptionForOrganization(organizationId: string) {
  const rows = await db
    .select()
    .from(subscription)
    .where(eq(subscription.organizationId, organizationId));
  return rows[0];
}

export async function subscriptionForStripeId(stripeSubscriptionId: string) {
  const rows = await db
    .select()
    .from(subscription)
    .where(eq(subscription.stripeSubscriptionId, stripeSubscriptionId));
  return rows[0];
}

export async function recordSubscription(record: SubscriptionRecord) {
  await db
    .insert(subscription)
    .values({
      id: record.stripeSubscriptionId,
      organizationId: record.organizationId,
      stripeCustomerId: record.stripeCustomerId,
      stripeSubscriptionId: record.stripeSubscriptionId,
      status: record.status,
      priceId: record.priceId,
      currentPeriodEnd: record.currentPeriodEnd,
      cancelAtPeriodEnd: record.cancelAtPeriodEnd,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    .onConflictDoUpdate({
      target: subscription.stripeSubscriptionId,
      set: {
        status: record.status,
        priceId: record.priceId,
        currentPeriodEnd: record.currentPeriodEnd,
        cancelAtPeriodEnd: record.cancelAtPeriodEnd,
        updatedAt: new Date(),
      },
    });
}
