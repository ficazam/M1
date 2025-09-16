import { expect, test } from "vitest";
import type { Payment } from "./du.type";
import { paymentProcessor } from "./du-payments";

test("process credit", () => {
  const p: Payment = { kind: "card", cardNumber: "123", amount: 100 };
  expect(paymentProcessor(p)).toContain("Charged card");
});
