import { afterEach, describe, expect, it, vi } from "vitest";
import { billingPlans, isBillingConfigured } from "./plans";

const PRICE_ENV = {
  STRIPE_SECRET_KEY: "sk_test_unit",
  STRIPE_PRO_MONTHLY_PRICE_ID: "price_monthly_unit",
  STRIPE_PRO_YEARLY_PRICE_ID: "price_yearly_unit",
};

function stubBillingEnv(values: Record<string, string>) {
  for (const [key, value] of Object.entries(values)) {
    vi.stubEnv(key, value);
  }
}

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("billingPlans", () => {
  it("returns monthly and yearly plans when price ids are set", () => {
    stubBillingEnv(PRICE_ENV);
    expect(billingPlans()).toEqual([
      {
        id: "pro-monthly",
        name: "Pro Monthly",
        priceId: "price_monthly_unit",
        interval: "month",
      },
      {
        id: "pro-yearly",
        name: "Pro Yearly",
        priceId: "price_yearly_unit",
        interval: "year",
      },
    ]);
  });

  it("omits plans without price ids", () => {
    stubBillingEnv({
      STRIPE_SECRET_KEY: "sk_test_unit",
      STRIPE_PRO_MONTHLY_PRICE_ID: "",
      STRIPE_PRO_YEARLY_PRICE_ID: "",
    });
    expect(billingPlans()).toEqual([]);
  });

  it("keeps plans that have price ids while omitting the rest", () => {
    stubBillingEnv({
      ...PRICE_ENV,
      STRIPE_PRO_YEARLY_PRICE_ID: "",
    });
    expect(billingPlans()).toEqual([
      {
        id: "pro-monthly",
        name: "Pro Monthly",
        priceId: "price_monthly_unit",
        interval: "month",
      },
    ]);
  });
});

describe("isBillingConfigured", () => {
  it("is true with a secret key and at least one plan", () => {
    stubBillingEnv(PRICE_ENV);
    expect(isBillingConfigured()).toBe(true);
  });

  it("is false without a secret key", () => {
    stubBillingEnv({
      ...PRICE_ENV,
      STRIPE_SECRET_KEY: "",
    });
    expect(isBillingConfigured()).toBe(false);
  });

  it("is false without any plans", () => {
    stubBillingEnv({
      STRIPE_SECRET_KEY: "sk_test_unit",
      STRIPE_PRO_MONTHLY_PRICE_ID: "",
      STRIPE_PRO_YEARLY_PRICE_ID: "",
    });
    expect(isBillingConfigured()).toBe(false);
  });
});
