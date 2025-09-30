import { env } from "@/env";
import { DashboardPayload, DashboardPayloadSchema } from "@app/schemas";
import { unknown } from "zod";

const fetchJSON = async (
  url: string,
  opts?: RequestInit,
  to?: NodeJS.Timeout
) => {
  try {
    const res = await fetch(url, opts);

    if (!res.ok) throw new Error(`API ${res.status} ${res.statusText}`);

    return await res.json();
  } finally {
    clearTimeout(to);
  }
};

export const fetchDashboard = async (opts?: { e2eDelayMs?: number; e2eFail?: boolean }): Promise<DashboardPayload> => {
  const ac = new AbortController();
  const to = setTimeout(() => ac.abort(), 8000);

  if (opts?.e2eDelayMs) await new Promise(r => setTimeout(r, opts.e2eDelayMs));
  if (opts?.e2eFail) throw new Error("E2E forced failure");

  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const json = await fetchJSON(
        `${env.API_URL}/dashboard`,
        {
          cache: "no-store",
          signal: ac.signal,
        },
        to
      );
      return DashboardPayloadSchema.parse(json);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      const retry = /^(429|5\d\d)/.test(err?.message ?? "");

      if (!retry || attempt === 1) throw err;

      await new Promise((r) => setTimeout(r, 400 * (attempt + 1)));
    }
  }

  throw new Error("unreachable");
};
