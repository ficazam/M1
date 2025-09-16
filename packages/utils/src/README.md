# Discriminated Unions + Exhaustive Switch Checks (TypeScript)

> Make illegal states unrepresentable and future-proof your business logic.

## TL;DR
- **Discriminated union** = a union where each variant has a literal tag (e.g. `kind: "paypal"`).
- Use a `switch` on the tag + an `assertNever` fallback.
- When a new variant is added, the compiler **forces** you to handle it.

---

## Why this matters in real apps
- **Product keeps changing.** New cases arrive (new payment types, new statuses). You want the compiler to tell you **where** to update logic.
- **Safer refactors.** “Add a variant” becomes a compile-breaking change until you cover all code paths.
- **Less QA drift.** Entire bug classes disappear (forgotten `else if` branches).

---

## Core pattern

```ts
// 1) The discriminated union
export type Payment =
  | { kind: "credit"; cardNumber: string; amount: number }
  | { kind: "paypal"; email: string; amount: number }
  | { kind: "crypto"; wallet: string; amount: number };

// 2) The compile-time enforcer
export function assertNever(x: never): never {
  throw new Error(`Unhandled case: ${JSON.stringify(x)}`);
}

// 3) Exhaustive switch
export function processPayment(p: Payment): string {
  switch (p.kind) {
    case "credit": return `Charged card ${p.cardNumber}`;
    case "paypal": return `Paid via PayPal ${p.email}`;
    case "crypto": return `Received crypto from ${p.wallet}`;
    default: return assertNever(p); // <- compile error if a new kind appears
  }
}
