import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { subscriptionForOrganization } from "@seedstack/db";
import { auth } from "./auth";

const MANAGING_ROLES = ["owner", "admin"];

export async function organizationMembership(
  organizationId: string,
  userId: string,
) {
  const requestHeaders = await headers();
  const organization = await auth.api.getFullOrganization({
    query: { organizationId },
    headers: requestHeaders,
  });
  if (!organization) {
    redirect("/dashboard");
  }
  const membership = organization.members.find(
    (member) => member.userId === userId,
  );
  if (!membership) {
    redirect("/dashboard");
  }
  return { organization, role: membership.role };
}

export function canManageBilling(role: string) {
  return MANAGING_ROLES.includes(role);
}

export async function organizationSubscription(organizationId: string) {
  return subscriptionForOrganization(organizationId);
}
