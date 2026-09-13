"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { authClient } from "@/lib/auth-client";
import { Container, SectionHeading } from "@seedstack/ui";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [failure, setFailure] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setPending(true);
    setFailure(null);
    const result = await authClient.signIn.email({ email, password });
    setPending(false);
    if (result.error) {
      setFailure(result.error.message ?? "Sign in failed");
      return;
    }
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <main className="py-16">
      <Container>
        <SectionHeading
          title="Log in"
          description="Access your Seedstack dashboard."
        />
        <form onSubmit={handleSubmit} className="mt-8 max-w-sm space-y-4">
          <input
            type="email"
            required
            autoComplete="email"
            placeholder="Email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full rounded-md border px-3 py-2"
          />
          <input
            type="password"
            required
            autoComplete="current-password"
            placeholder="Password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full rounded-md border px-3 py-2"
          />
          {failure ? <p className="text-sm text-red-600">{failure}</p> : null}
          <button
            type="submit"
            disabled={pending}
            className="w-full rounded-md bg-foreground px-3 py-2 text-background disabled:opacity-50"
          >
            {pending ? "Signing in" : "Sign in"}
          </button>
        </form>
      </Container>
    </main>
  );
}
