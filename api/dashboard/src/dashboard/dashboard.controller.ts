import { type DashboardPayload, DashboardPayloadSchema } from '@app/schemas';
import { Controller, Get } from '@nestjs/common';

@Controller('dashboard')
export class DashboardController {
  @Get()
  get(): DashboardPayload {
    const raw = {
      user: {
        id: crypto.randomUUID(),
        name: 'Felipe Icaza',
        email: 'felipe@example.com',
        role: 'manager',
        createdAt: new Date().toISOString(),
      },
      kpis: {
        totalRevenue: { currency: 'USD', amount: 234_500 },
        openInvoices: 7,
        overdueInvoices: 2,
        arDays: 38,
      },
      invoices: [
        {
          id: crypto.randomUUID(),
          number: 'INV-2025-0001',
          issuedAt: new Date(Date.now() - 6 * 864e5).toISOString(),
          dueAt: new Date(Date.now() + 8 * 864e5).toISOString(),
          total: { currency: 'USD', amount: 49_900 },
          status: 'open',
          customer: {
            id: crypto.randomUUID(),
            name: 'Acme Manufacturing',
            email: 'billing@acme.test',
          },
          notes: 'PO #8842',
        },
      ],
      filters: {
        roles: ['admin', 'manager', 'customer', 'guest'],
        statuses: ['draft', 'open', 'paid', 'overdue', 'void'],
      },
    };

    return DashboardPayloadSchema.parse(raw);
  }
}
