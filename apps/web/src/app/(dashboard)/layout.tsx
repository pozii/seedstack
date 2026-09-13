import type { ReactNode } from "react";
import { requireSession } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  await requireSession();
  return <div className="min-h-screen">{children}</div>;
}
