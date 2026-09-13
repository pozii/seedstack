export type BillingInterval = "month" | "year";

export type BillingPlan = {
  id: string;
  name: string;
  priceId: string;
  interval: BillingInterval;
};

function planEntries(): Array<[string, string, BillingInterval]> {
  return [
    ["pro-monthly", process.env.STRIPE_PRO_MONTHLY_PRICE_ID ?? "", "month"],
    ["pro-yearly", process.env.STRIPE_PRO_YEARLY_PRICE_ID ?? "", "year"],
  ];
}

function planName(id: string) {
  return id === "pro-yearly" ? "Pro Yearly" : "Pro Monthly";
}

export function billingPlans(): BillingPlan[] {
  return planEntries()
    .filter(([, priceId]) => priceId.length > 0)
    .map(([id, priceId, interval]) => ({ id, name: planName(id), priceId, interval }));
}

export function isBillingConfigured() {
  return (
    (process.env.STRIPE_SECRET_KEY ?? "").length > 0 &&
    billingPlans().length > 0
  );
}
