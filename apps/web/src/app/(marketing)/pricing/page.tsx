import Link from "next/link";
import { billingPlans, isBillingConfigured } from "@seedstack/stripe";
import { Container, SectionHeading } from "@seedstack/ui";

export const dynamic = "force-dynamic";

export default function PricingPage() {
  const plans = billingPlans();
  const configured = isBillingConfigured();

  return (
    <main className="py-16">
      <Container>
        <SectionHeading
          title="Pricing"
          description="One plan that scales with your team."
        />
        {!configured ? (
          <p className="mt-8 rounded-md border px-4 py-3 text-sm text-muted-foreground">
            Billing is not configured yet. Set the Stripe keys to enable checkout.
          </p>
        ) : null}
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {plans.map((plan) => (
            <div key={plan.id} className="rounded-lg border p-6">
              <h2 className="text-lg font-semibold">{plan.name}</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Billed per {plan.interval}
              </p>
              <Link
                href="/dashboard/billing"
                className="mt-6 inline-block rounded-md bg-foreground px-4 py-2 text-sm text-background"
              >
                Choose {plan.name}
              </Link>
            </div>
          ))}
        </div>
      </Container>
    </main>
  );
}
