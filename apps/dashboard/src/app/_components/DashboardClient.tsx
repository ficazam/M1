"use client";

import { useState } from "react";
import type { DashboardPayload } from "@app/schemas";
import {
  initState,
  transition,
  type Event,
  type ViewState,
} from "../_state/machine";
import { InvoiceDrawer } from "./InvoiceDrawer";
import { InvoiceTable } from "./InvoiceTable";
import { KPISection } from "./KPISection";
import { DashboardHeader } from "./DashboardHeader";

export const DashboardClient = ({ data }: { data: DashboardPayload }) => {
  const [state, setState] = useState<ViewState>(initState);
  const send = (e: Event) => setState((s) => transition(s, e));

  return (
    <div className="space-y-6">
      <DashboardHeader data={data} />

      {/* KPIs */}
      <KPISection data={data} />
      <InvoiceTable data={data} send={send} state={state} />

      {/* Slide-over invoice viewer */}
      <InvoiceDrawer
        data={data}
        state={state}
        onClose={() => send({ type: "CLOSE" })}
      />
    </div>
  );
};
