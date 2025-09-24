import { z } from "zod";

export const RoleEnum = z.enum(["admin", "manager", "customer", "guest"]);

export const UserSchema = z.object({
  id: z.uuid(),
  name: z.string().min(1),
  email: z.email(),
  role: RoleEnum,
  createdAt: z.coerce.date(),
});

export const InvoiceCustomerSchema = UserSchema.pick({
  id: true,
  name: true,
  email: true,
}).extend({});

export const MoneySchema = z.object({
  currency: z.string().length(3).toUpperCase(),
  amount: z.number().int().nonnegative(),
});

export const InvoiceSchema = z.object({
  id: z.uuid(),
  number: z.string().min(1),
  issuedAt: z.coerce.date(),
  dueAt: z.coerce.date(),
  total: MoneySchema,
  status: z.enum(["draft", "open", "paid", "overdue", "void"]),
  customer: InvoiceCustomerSchema,
  notes: z.string().max(2000).optional(),
});

export const KpiSchema = z.object({
  totalRevenue: MoneySchema, // sum of paid invoices YTD (example)
  openInvoices: z.number().int().min(0),
  overdueInvoices: z.number().int().min(0),
  arDays: z.number().min(0), // Days Sales Outstanding (approx)
});

export const DashboardPayloadSchema = z.object({
  user: UserSchema,
  kpis: KpiSchema,
  invoices: z.array(InvoiceSchema).readonly(),
  filters: z
    .object({
      roles: z.array(RoleEnum).nonempty(),
      statuses: z.array(InvoiceSchema.shape.status).nonempty(),
    })
    .optional(),
});

export type Role = z.infer<typeof RoleEnum>;
export type User = z.infer<typeof UserSchema>;
export type Invoice = z.infer<typeof InvoiceSchema>;
export type KPI = z.infer<typeof KpiSchema>;
export type DashboardPayload = z.infer<typeof DashboardPayloadSchema>;
