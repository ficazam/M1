import { describe, it, expect } from "vitest";
import { DashboardPayloadSchema } from "../dashboard";

describe("DashboardPayloadSchema", () => {
  it("parses a valid payload", () => {
    const raw = {
      user: { id: crypto.randomUUID(), name: "Felipe", email: "felipe@example.com", role: "manager", createdAt: new Date() },
      kpis: { totalRevenue: { currency:"USD", amount:123_400 }, openInvoices:2, overdueInvoices:1, arDays:30 },
      invoices: [{
        id: crypto.randomUUID(),
        number: "INV-1",
        issuedAt: new Date(),
        dueAt: new Date(),
        total: { currency:"USD", amount:4900 },
        status: "open",
        customer: { id: crypto.randomUUID(), name: "Acme", email: "ap@acme.test" }
      }],
      filters: { roles:["admin","manager","customer","guest"], statuses:["draft","open","paid","overdue","void"] }
    };
    expect(() => DashboardPayloadSchema.parse(raw)).not.toThrow();
  });

  it("rejects bad currency", () => {
    const bad = { .../* minimal valid */{
      user:{ id:crypto.randomUUID(), name:"F", email:"f@x.t", role:"manager", createdAt:new Date() },
      kpis:{ totalRevenue:{ currency:"US", amount:1 }, openInvoices:0, overdueInvoices:0, arDays:0 },
      invoices:[], filters:{ roles:["manager"], statuses:["open"] }
    }};
    expect(() => DashboardPayloadSchema.parse(bad)).toThrow();
  });
});
