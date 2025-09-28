import { useMemo } from "react";
import { Event, Filter, ViewState } from "../_state/machine";
import { dateFormatter, moneyFormatter, upperCaser } from "../lib/utils";
import { DashboardPayload } from "@app/schemas";

interface iInvoiceTableProps {
  data: DashboardPayload;
  state: ViewState;
  send: (e: Event) => void;
}

export const InvoiceTable = ({ data, state, send }: iInvoiceTableProps) => {
  const { filters, invoices } = data;
  const currentFilter: Filter = state.filter;

  const allowedStatuses = filters?.statuses ?? [
    "draft",
    "open",
    "paid",
    "overdue",
    "void",
  ];

  const visible = useMemo(() => {
    if (currentFilter === "all") return invoices;
    return invoices.filter((inv) => inv.status === currentFilter);
  }, [invoices, currentFilter]);

  return (
    <section className="rounded-2xl border p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 className="text-lg font-medium">Invoices</h2>
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600">Status</label>
          <select
            className="rounded-lg border px-2 py-1 text-sm"
            value={currentFilter}
            onChange={(e) =>
              send({ type: "FILTER", value: e.target.value as Filter })
            }
          >
            <option value="all">All</option>
            {allowedStatuses.map((s) => (
              <option key={s} value={s}>
                {upperCaser(s)}
              </option>
            ))}
          </select>
          {currentFilter !== "all" && (
            <button
              onClick={() => send({ type: "RESET" })}
              className="rounded-lg border px-2 py-1 text-sm"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-left text-gray-600">
            <tr>
              <th className="py-2 pr-4">Number</th>
              <th className="py-2 pr-4">Customer</th>
              <th className="py-2 pr-4">Issued</th>
              <th className="py-2 pr-4">Due</th>
              <th className="py-2 pr-4">Total</th>
              <th className="py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {visible.map((inv) => (
              <tr
                key={inv.id}
                className="cursor-pointer border-t hover:bg-gray-50"
                onClick={() => send({ type: "OPEN_INVOICE", id: inv.id })}
              >
                <td className="py-2 pr-4">{inv.number}</td>
                <td className="py-2 pr-4">{inv.customer.name}</td>
                <td className="py-2 pr-4">{dateFormatter(inv.issuedAt)}</td>
                <td className="py-2 pr-4">{dateFormatter(inv.dueAt)}</td>
                <td className="py-2 pr-4">{moneyFormatter(inv.total)}</td>
                <td className="py-2">{upperCaser(inv.status)}</td>
              </tr>
            ))}
            {visible.length === 0 && (
              <tr>
                <td className="py-8 text-center text-gray-500" colSpan={6}>
                  No invoices
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};
