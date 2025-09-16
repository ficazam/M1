import type { Payment } from "./du.type";

export const assertNever = (x: never): never => {
  throw new Error(`Unhandled case - ${JSON.stringify(x)}`);
};

export type Handlers = {
  [K in Payment["kind"]]: (p: Extract<Payment, { kind: K }>) => string;
};

export type KindOf<T> = T extends { kind: infer K } ? K : never;
export type VariantOf<T, K extends KindOf<T>> = Extract<T, { kind: K }>;

export type HandlerMap<T extends { kind: PropertyKey }, R> = {
  [K in KindOf<T>]: (v: VariantOf<T, K>) => R;
};

export const createProcessor =
  <T extends { kind: PropertyKey }, R>(handlers: HandlerMap<T, R>) =>
  (value: T): R => {
    const table = handlers as Record<KindOf<T>, (v: unknown) => R>;
    const fn = table[value.kind as KindOf<T>];

    return fn(value as unknown as never);
  };
