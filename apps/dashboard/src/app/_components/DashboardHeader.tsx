import { DashboardPayload } from "@app/schemas";

export const DashboardHeader = ({ data }: { data: DashboardPayload }) => (
  <header className="flex items-end justify-between">
    <div>
      <h1 className="text-2xl font-semibold">Welcome, {data.user.name}</h1>
      <p className="text-sm text-gray-500">Role: {data.user.role}</p>
    </div>
    <div className="text-right">
      <p className="text-sm text-gray-500">Open invoices</p>
      <p className="text-xl font-semibold">{data.kpis.openInvoices}</p>
    </div>
  </header>
);
