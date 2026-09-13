"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { authClient } from "@/lib/auth-client";

export function CreateOrganizationForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [failure, setFailure] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setPending(true);
    setFailure(null);
    const result = await authClient.organization.create({ name, slug });
    setPending(false);
    if (result.error) {
      setFailure(result.error.message ?? "Could not create organization");
      return;
    }
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 max-w-sm space-y-4">
      <input
        type="text"
        required
        placeholder="Organization name"
        value={name}
        onChange={(event) => setName(event.target.value)}
        className="w-full rounded-md border px-3 py-2"
      />
      <input
        type="text"
        required
        placeholder="organization-slug"
        value={slug}
        onChange={(event) => setSlug(event.target.value)}
        className="w-full rounded-md border px-3 py-2"
      />
      {failure ? <p className="text-sm text-red-600">{failure}</p> : null}
      <button
        type="submit"
        disabled={pending}
        className="rounded-md bg-foreground px-3 py-2 text-sm text-background disabled:opacity-50"
      >
        {pending ? "Creating" : "Create organization"}
      </button>
    </form>
  );
}
