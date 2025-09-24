import type { Invoice } from "@app/schemas";

export type Status = Invoice["status"];
export type Filter = "all" | Status;

export type ViewState =
  | { tag: "idle"; filter: Filter }
  | { tag: "filtering"; filter: Exclude<Filter, "all"> }
  | { tag: "viewing_invoice"; filter: Filter; invoiceId: string };

export type Event =
  | { type: "FILTER"; value: Filter }
  | { type: "OPEN_INVOICE"; id: string }
  | { type: "CLOSE" }
  | { type: "RESET" };

export const initState: ViewState = { tag: "idle", filter: "all" };

type StateBy<T extends ViewState["tag"]> = Extract<ViewState, { tag: T }>;
type EventBy<T extends Event["type"]> = Extract<Event, { type: T }>;

type Table = {
  [S in ViewState["tag"]]: {
    [K in Event["type"]]: (s: StateBy<S>, e: EventBy<K>) => ViewState;
  };
};

const keep = <S extends ViewState>(s: S) => s as ViewState;

export const table: Table = {
  idle: {
    FILTER: (s, e) =>
      e.value === "all"
        ? s
        : { tag: "filtering", filter: e.value as Exclude<Filter, "all"> },
    OPEN_INVOICE: (s, e) => ({
      tag: "viewing_invoice",
      filter: s.filter,
      invoiceId: e.id,
    }),
    CLOSE: () => initState,
    RESET: () => initState,
  },
  filtering: {
    FILTER: (s, e) =>
      e.value === "all"
        ? { tag: "idle", filter: "all" }
        : { tag: "filtering", filter: e.value as Exclude<Filter, "all"> },
    OPEN_INVOICE: (s, e) => ({
      tag: "viewing_invoice",
      filter: s.filter,
      invoiceId: e.id,
    }),
    CLOSE: (s) => keep(s),
    RESET: () => initState,
  },
  viewing_invoice: {
    FILTER: (_s, e) =>
      e.value === "all"
        ? { tag: "idle", filter: "all" }
        : { tag: "filtering", filter: e.value as Exclude<Filter, "all"> },
    OPEN_INVOICE: (s, e) => ({ ...s, invoiceId: e.id }),
    CLOSE: (s) =>
      s.filter === "all"
        ? { tag: "idle", filter: "all" }
        : { tag: "filtering", filter: s.filter },
    RESET: () => initState,
  },
} satisfies Table;

export const transition = <S extends ViewState, E extends Event>(
  s: S,
  e: E
): ViewState => {
  return table[s.tag][e.type](s as any, e as any) as ViewState;
};
