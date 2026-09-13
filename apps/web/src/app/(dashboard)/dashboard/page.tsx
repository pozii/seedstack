import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { requireSession } from "@/lib/session";
import { Container, SectionHeading } from "@seedstack/ui";
import { CreateOrganizationForm } from "@/components/create-organization-form";
import { SignOutButton } from "@/components/sign-out-button";

export default async function DashboardPage() {
  const session = await requireSession();
  const requestHeaders = await headers();
  const organizations = await auth.api.listOrganizations({
    headers: requestHeaders,
  });
  const memberships = await Promise.all(
    organizations.map((organization) =>
      auth.api.getFullOrganization({
        query: { organizationId: organization.id },
        headers: requestHeaders,
      }),
    ),
  );

  return (
    <main className="py-16">
      <Container>
        <div className="flex items-center justify-between">
          <SectionHeading
            title={`Welcome, ${session.user.name}`}
            description={session.user.email}
          />
          <SignOutButton />
        </div>
        <div className="mt-10">
          <h2 className="text-lg font-semibold">Organizations</h2>
          {memberships.length === 0 ? (
            <p className="mt-2 text-sm text-muted-foreground">
              No organizations yet. Create the first one below.
            </p>
          ) : (
            <ul className="mt-4 space-y-2">
              {memberships.map((membership) =>
                membership ? (
                  <li
                    key={membership.id}
                    className="flex items-center justify-between rounded-md border px-4 py-2"
                  >
                    <span className="font-medium">{membership.name}</span>
                    <span className="text-sm text-muted-foreground">
                      {
                        membership.members.find(
                          (member) => member.userId === session.user.id,
                        )?.role
                      }
                    </span>
                  </li>
                ) : null,
              )}
            </ul>
          )}
          <CreateOrganizationForm />
        </div>
      </Container>
    </main>
  );
}
