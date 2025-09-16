interface CardPayment {
  kind: "card";
  cardNumber: string;
  amount: number;
}

interface PayPalPayment {
  kind: "paypal";
  email: string;
  amount: number;
}

interface CryptoPayment {
  kind: "crypto";
  wallet: string;
  amount: number;
}

interface WireTransfer {
  kind: "wire";
  bank: string;
  amount: number;
}

export type Payment =
  | CardPayment
  | PayPalPayment
  | CryptoPayment
  | WireTransfer;
