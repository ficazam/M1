import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { Test } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import request from "supertest";
import { AppModule } from "../app.module";
import { DashboardPayloadSchema } from "@app/schemas";

let app: INestApplication;

beforeAll(async () => {
  const modRef = await Test.createTestingModule({ imports: [AppModule] }).compile();
  app = modRef.createNestApplication();
  await app.init();
});

afterAll(async () => {
  await app.close();
});

describe("GET /dashboard", () => {
  it("returns a payload that matches the schema", async () => {
    const res = await request(app.getHttpServer()).get("/dashboard").expect(200);
    const parsed = DashboardPayloadSchema.parse(res.body);
    expect(Array.isArray(parsed.invoices)).toBe(true);
  });
});
