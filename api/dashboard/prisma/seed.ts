import { PrismaClient } from "@prisma/client";
const db = new PrismaClient();

async function main() {
  await db.invoice.deleteMany();
  await db.user.deleteMany();

  const manager = await db.user.create({
    data: { name: "Test Manager", email: "manager@example.com", role: "manager" }
  });

  const acme = await db.user.create({
    data: { name: "Acme", email: "ap@acme.test", role: "customer" }
  });

  const now = new Date();
  const tomorrow = new Date(Date.now() + 24*3600*1000);

  await db.invoice.create({
    data: {
      number: "INV-1",
      issuedAt: now,
      dueAt: tomorrow,
      currency: "USD",
      totalCents: 4900,
      status: "open",
      customerId: acme.id,
      notes: "PO #8001"
    }
  });

  await db.invoice.create({
    data: {
      number: "INV-2",
      issuedAt: now,
      dueAt: tomorrow,
      currency: "USD",
      totalCents: 74200,
      status: "paid",
      customerId: acme.id
    }
  });

  console.log("Seeded ✔");
}

main().finally(() => db.$disconnect());
