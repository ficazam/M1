import { env } from "@/env";
import { DashboardPayload, DashboardPayloadSchema } from "@app/schemas";

const fetchJSON = async (url: string, opts?: RequestInit) => {
  const ac = new AbortController();
  const to = setTimeout(() => ac.abort(), 8000);

  try {
    const res = await fetch(url, opts);

    if (!res.ok) throw new Error(`API ${res.status} ${res.statusText}`);

    return await res.json();
  } finally {
    clearTimeout(to);
  }
};

export const fetchDashboard = async (): Promise<DashboardPayload> => {
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const json = await fetchJSON(`${env.API_URL}/dashboard`, {
      cache: "no-store",
      signal: ac.signal,
    });
      return DashboardPayloadSchema.parse(json);
    } catch (err: unknown) {
      const retry = /^(429|5\d\d)/.test(err?.message ?? "");

      if (!retry || attempt === 1) throw err;

      await new Promise((r) => setTimeout(r, 400 * (attempt + 1)));
    }
  }

  throw new Error("unreachable");
};
