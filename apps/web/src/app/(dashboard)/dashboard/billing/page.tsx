import { headers } from "next/headers";
import { subscriptionForOrganization } from "@seedstack/db";
import { billingPlans, isBillingConfigured } from "@seedstack/stripe";
import { Container, SectionHeading } from "@seedstack/ui";
import { BillingPanel, type OrganizationBilling } from "@/components/billing-panel";
import { auth } from "@/lib/auth";
import { canManageBilling } from "@/lib/billing";
import { requireSession } from "@/lib/session";

export default async function BillingPage() {
  const session = await requireSession();
  const requestHeaders = await headers();
  const organizations = await auth.api.listOrganizations({
    headers: requestHeaders,
  });
  const plans = billingPlans();
  const configured = isBillingConfigured();
  const items: OrganizationBilling[] = await Promise.all(
    organizations.map(async (organization) => {
      const full = await auth.api.getFullOrganization({
        query: { organizationId: organization.id },
        headers: requestHeaders,
      });
      const role =
        full?.members.find((member) => member.userId === session.user.id)?.role ??
        "member";
      const current = await subscriptionForOrganization(organization.id);
      return {
        organizationId: organization.id,
        organizationName: organization.name,
        role,
        canManage: canManageBilling(role),
        subscription: current
          ? {
              status: current.status,
              priceId: current.priceId,
              renewsAt: current.currentPeriodEnd?.toISOString() ?? null,
              cancelAtPeriodEnd: current.cancelAtPeriodEnd,
            }
          : null,
        plans: plans.map((plan) => ({
          id: plan.id,
          name: plan.name,
          interval: plan.interval,
          priceId: plan.priceId,
        })),
      };
    }),
  );

  return (
    <main className="py-16">
      <Container>
        <SectionHeading
          title="Billing"
          description="Subscriptions per organization."
        />
        {!configured ? (
          <p className="mt-8 rounded-md border px-4 py-3 text-sm text-muted-foreground">
            Billing is not configured yet. Set the Stripe keys to enable checkout.
          </p>
        ) : null}
        <BillingPanel items={items} />
      </Container>
    </main>
  );
}
