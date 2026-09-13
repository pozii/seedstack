"use client";

import { useState } from "react";

export type PlanOption = {
  id: string;
  name: string;
  interval: string;
  priceId: string;
};

export type OrganizationBilling = {
  organizationId: string;
  organizationName: string;
  role: string;
  canManage: boolean;
  subscription: {
    status: string;
    priceId: string | null;
    renewsAt: string | null;
    cancelAtPeriodEnd: boolean;
  } | null;
  plans: PlanOption[];
};

async function requestCheckout(organizationId: string, priceId: string) {
  const response = await fetch("/api/billing/checkout", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ organizationId, priceId }),
  });
  const body = (await response.json()) as { url?: string; error?: string };
  if (!response.ok || !body.url) {
    throw new Error(body.error ?? "Checkout failed");
  }
  window.location.assign(body.url);
}

async function requestPortal(organizationId: string) {
  const response = await fetch("/api/billing/portal", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ organizationId }),
  });
  const body = (await response.json()) as { url?: string; error?: string };
  if (!response.ok || !body.url) {
    throw new Error(body.error ?? "Portal failed");
  }
  window.location.assign(body.url);
}

export function BillingPanel({ items }: { items: OrganizationBilling[] }) {
  const [pending, setPending] = useState<string | null>(null);
  const [failure, setFailure] = useState<string | null>(null);

  async function run(key: string, action: () => Promise<void>) {
    setPending(key);
    setFailure(null);
    try {
      await action();
    } catch (error) {
      setFailure(error instanceof Error ? error.message : "Request failed");
      setPending(null);
    }
  }

  if (items.length === 0) {
    return (
      <p className="mt-4 text-sm text-muted-foreground">
        Create an organization from the dashboard before subscribing.
      </p>
    );
  }

  return (
    <div className="mt-6 space-y-4">
      {failure ? <p className="text-sm text-red-600">{failure}</p> : null}
      {items.map((item) => (
        <div key={item.organizationId} className="rounded-lg border p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">{item.organizationName}</h2>
            <span className="text-sm text-muted-foreground">
              {item.subscription
                ? `${item.subscription.status}`
                : "No subscription"}
            </span>
          </div>
          {item.subscription?.renewsAt ? (
            <p className="mt-1 text-sm text-muted-foreground">
              Renews {new Date(item.subscription.renewsAt).toLocaleDateString()}
              {item.subscription.cancelAtPeriodEnd
                ? " (cancels at period end)"
                : ""}
            </p>
          ) : null}
          {!item.canManage ? (
            <p className="mt-4 text-sm text-muted-foreground">
              Your role ({item.role}) cannot manage billing.
            </p>
          ) : item.subscription ? (
            <button
              type="button"
              disabled={pending !== null}
              onClick={() =>
                run(`portal-${item.organizationId}`, () =>
                  requestPortal(item.organizationId),
                )
              }
              className="mt-4 rounded-md border px-4 py-2 text-sm disabled:opacity-50"
            >
              {pending === `portal-${item.organizationId}`
                ? "Opening"
                : "Manage billing"}
            </button>
          ) : (
            <div className="mt-4 flex flex-wrap gap-2">
              {item.plans.map((plan) => (
                <button
                  key={plan.id}
                  type="button"
                  disabled={pending !== null}
                  onClick={() =>
                    run(`plan-${plan.id}`, () =>
                      requestCheckout(item.organizationId, plan.priceId),
                    )
                  }
                  className="rounded-md bg-foreground px-4 py-2 text-sm text-background disabled:opacity-50"
                >
                  {pending === `plan-${plan.id}`
                    ? "Redirecting"
                    : `Subscribe ${plan.name}`}
                </button>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
