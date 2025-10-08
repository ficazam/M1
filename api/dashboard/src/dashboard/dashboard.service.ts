import { Injectable } from "@nestjs/common";
import { DashboardPayloadSchema } from "@app/schemas";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class DashboardService {
  constructor(private readonly db: PrismaService) {}

  async getPayload() {
    const user = await this.db.user.findFirstOrThrow({ where: { role: "manager" } });

    const invoices = await this.db.invoice.findMany({
      orderBy: { issuedAt: "desc" },
      include: { customer: true },
      take: 50,
    });

    const open = invoices.filter(i => i.status === "open");
    const overdue = invoices.filter(i => i.status === "overdue");
    const paid = invoices.filter(i => i.status === "paid");
    const totalRevenueCents = paid.reduce((sum, i) => sum + i.totalCents, 0);

    const raw = {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      },
      kpis: {
        totalRevenue: { currency: "USD", amount: totalRevenueCents },
        openInvoices: open.length,
        overdueInvoices: overdue.length,
        arDays: 30,
      },
      invoices: invoices.map(i => ({
        id: i.id,
        number: i.number,
        issuedAt: i.issuedAt,
        dueAt: i.dueAt,
        total: { currency: i.currency, amount: i.totalCents },
        status: i.status,
        customer: {
          id: i.customer.id,
          name: i.customer.name,
          email: i.customer.email,
        },
        notes: i.notes ?? undefined,
      })),
      filters: {
        roles: ["admin", "manager", "customer", "guest"],
        statuses: ["draft", "open", "paid", "overdue", "void"],
      },
    };

    return DashboardPayloadSchema.parse(raw);
  }
}
