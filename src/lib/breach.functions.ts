import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export const checkEmailBreach = createServerFn({ method: "POST" })
  .validator((d: unknown) => z.object({ email: z.string().trim().email().max(255) }).parse(d))
  .handler(({ data }) => lookupEmailBreach(data.email.toLowerCase()));

export async function lookupEmailBreach(email: string) {
    let res: Response;
    try {
      res = await fetch(
        `https://api.xposedornot.com/v1/check-email/${encodeURIComponent(email)}`,
        { headers: { "User-Agent": "CyberHelp-Website", Accept: "application/json" }, signal: AbortSignal.timeout(15000) },
      );
    } catch {
      return { ok: false as const, breaches: [] as string[] };
    }
    if (res.status === 404) return { ok: true as const, breaches: [] as string[] };
    if (!res.ok) return { ok: false as const, breaches: [] as string[] };
    const json = (await res.json()) as { breaches?: string[][]; Error?: string };
    if (json.Error) return { ok: true as const, breaches: [] as string[] };
    return { ok: true as const, breaches: json.breaches?.[0] ?? [] };
  }
