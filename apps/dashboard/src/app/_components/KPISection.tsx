import { DashboardPayload } from "@app/schemas";
import { moneyFormatter } from "../lib/utils";
import { KpiCard } from "./KpiCard";

export const KPISection = ({ data }: { data: DashboardPayload }) => {
  const { kpis } = data;

  return (
    <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <KpiCard
        label="Total revenue"
        value={moneyFormatter(kpis.totalRevenue)}
      />
      <KpiCard label="Overdue" value={String(kpis.overdueInvoices)} />
      <KpiCard label="AR Days" value={String(kpis.arDays)} />
    </section>
  );
};
