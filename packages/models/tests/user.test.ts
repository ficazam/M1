import { expect, test } from "vitest";
import { CreateUserSchema, ExternalUserSchema, toDomainUser, UserSchema } from "../user";

test("UserSchema parses a valid domain user", () => {
  const data = {
    id: crypto.randomUUID(),
    email: "felipe@example.com",
    name: "Felipe",
    createdAt: new Date(),
  };
  expect(UserSchema.parse(data)).toEqual(data);
});

test("CreateUserSchema rejects missing name", () => {
  expect(() => CreateUserSchema.parse({ email: "felipe@example.com" })).toThrow();
});

test("ExternalUser -> Domain mapping", () => {
  const ext = {
    id: crypto.randomUUID(),
    email: "felipe@example.com",
    name: "Felipe",
    created_at: new Date().toISOString(),
  };
  const parsed = ExternalUserSchema.parse(ext);
  const domain = toDomainUser(parsed);
  expect(domain.createdAt instanceof Date).toBe(true);
  expect(domain.email).toBe("felipe@example.com");
});
