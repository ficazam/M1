import { DashboardPayload, Invoice } from "@app/schemas";
import { dateFormatter, moneyFormatter, upperCaser } from "../lib/utils";
import { ViewState } from "../_state/machine";

interface iInvoiceDrawerProps {
  data: DashboardPayload;
  state: ViewState;
  onClose: () => void;
}

export const InvoiceDrawer = ({
  data,
  state,
  onClose,
}: iInvoiceDrawerProps) => {
  const { invoices } = data;

  const invoice: Invoice | null =
    state.tag === "viewing_invoice"
      ? invoices.find((i) => i.id === state.invoiceId) ?? null
      : null;

  return (
    <div
      aria-hidden={!invoice}
      className={[
        "fixed inset-0 z-50 transition",
        invoice ? "pointer-events-auto" : "pointer-events-none",
      ].join(" ")}
    >
      {/* Backdrop */}
      <div
        className={[
          "absolute inset-0 bg-black/20 transition-opacity",
          invoice ? "opacity-100" : "opacity-0",
        ].join(" ")}
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className={[
          "absolute right-0 top-0 h-full w-full max-w-md transform rounded-l-2xl bg-white shadow-xl transition-transform",
          invoice ? "translate-x-0" : "translate-x-full",
        ].join(" ")}
      >
        <div className="flex items-center justify-between border-b p-4">
          <h3 className="text-lg font-semibold">Invoice</h3>
          <button onClick={onClose} className="rounded-lg border px-3 py-1.5">
            Close
          </button>
        </div>

        {invoice ? (
          <div className="space-y-4 p-4 text-sm">
            <div>
              <p className="text-gray-500">Number</p>
              <p className="font-medium">{invoice.number}</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-gray-500">Issued</p>
                <p className="font-medium">{dateFormatter(invoice.issuedAt)}</p>
              </div>

              <div>
                <p className="text-gray-500">Due</p>
                <p className="font-medium">{dateFormatter(invoice.dueAt)}</p>
              </div>
            </div>

            <div>
              <p className="text-gray-500">Customer</p>
              <p className="font-medium">{invoice.customer.name}</p>
              <p className="text-gray-500">{invoice.customer.email}</p>
            </div>

            <div>
              <p className="text-gray-500">Amount</p>
              <p className="font-medium">{moneyFormatter(invoice.total)}</p>
            </div>

            <div>
              <p className="text-gray-500">Status</p>
              <p className="font-medium">{upperCaser(invoice.status)}</p>
            </div>

            {invoice.notes && (
              <div>
                <p className="text-gray-500">Notes</p>
                <p className="font-medium">{invoice.notes}</p>
              </div>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
};
