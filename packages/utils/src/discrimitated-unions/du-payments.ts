//this is where i would actually process payments - IF I HAD ANY!!

import { createProcessor, type Handlers } from "./du-utils";
import type { Payment } from "./du.type";

export const paymentsHandler = {
  card: (p) => `Charged card ${p.cardNumber} for ${p.amount}`,
  paypal: (p) => `Charged account ${p.email} for ${p.amount}`,
  crypto: (p) => `Charged wallet ${p.wallet} for ${p.amount}`,
  wire: (p) => `Received ${p.amount} from ${p.bank}`,
} satisfies Handlers;

export const paymentProcessor = createProcessor<Payment, string>(
  paymentsHandler
);
