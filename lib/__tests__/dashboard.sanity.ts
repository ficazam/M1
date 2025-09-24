import { DashboardPayloadSchema } from "../schemas/dashboard.type";

const ok = DashboardPayloadSchema.parse({
  user: {
    id: crypto.randomUUID(),
    name: "Felipe",
    email: "felipe@example.com",
    role: "manager",
    createdAt: new Date().toISOString(),
  },
  kpis: {
    totalRevenue: { currency: "USD", amount: 123_456 },
    openInvoices: 3,
    overdueInvoices: 1,
    arDays: 42,
  },
  invoices: [
    {
      id: crypto.randomUUID(),
      number: "INV-1001",
      issuedAt: new Date().toISOString(),
      dueAt: new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString(),
      total: { currency: "USD", amount: 49_900 },
      status: "open",
      customer: {
        id: crypto.randomUUID(),
        name: "Acme Co",
        email: "billing@acme.test",
      },
    },
  ],
  filters: {
    roles: ["admin", "manager", "customer", "guest"],
    statuses: ["draft", "open", "paid", "overdue", "void"],
  },
});
