import http from "node:http";

export type Mode =
  | { kind: "ok"; delayMs?: number }
  | { kind: "fail"; delayMs?: number; status?: number };

export function startMockApi(port: number, initial: Mode) {
  let mode: Mode = initial;

  const server = http.createServer(async (req, res) => {
    if (req.url?.startsWith("/dashboard")) {
      const d = mode.delayMs ?? 0;
      if (d) await new Promise(r => setTimeout(r, d));

      if (mode.kind === "fail") {
        res.writeHead(mode.status ?? 500, { "content-type": "application/json" });
        res.end(JSON.stringify({ error: "boom" }));
        return;
      }

      const payload = {
        user: {
          id: "00000000-0000-0000-0000-000000000001",
          name: "Test Manager",
          email: "manager@example.com",
          role: "manager",
          createdAt: new Date().toISOString(),
        },
        kpis: {
          totalRevenue: { currency: "USD", amount: 123_400 },
          openInvoices: 2,
          overdueInvoices: 1,
          arDays: 30,
        },
        invoices: [
          {
            id: "inv-1",
            number: "INV-1",
            issuedAt: new Date().toISOString(),
            dueAt: new Date(Date.now() + 864e5).toISOString(),
            total: { currency: "USD", amount: 4900 },
            status: "open",
            customer: {
              id: "cust-1",
              name: "Acme",
              email: "ap@acme.test",
            },
            notes: "PO #8001",
          },
        ],
        filters: {
          roles: ["admin", "manager", "customer", "guest"],
          statuses: ["draft", "open", "paid", "overdue", "void"],
        },
      };

      res.writeHead(200, { "content-type": "application/json" });
      res.end(JSON.stringify(payload));
      return;
    }

    res.statusCode = 404;
    res.end();
  });

  return new Promise<{
    setMode: (m: Mode) => void;
    stop: () => Promise<void>;
  }>((resolve, reject) => {
    server.on("error", reject);
    server.listen(port, "127.0.0.1", () =>
      resolve({
        setMode: (m) => (mode = m),
        stop: () =>
          new Promise<void>((r) => server.close(() => r())),
      }),
    );
  });
}
