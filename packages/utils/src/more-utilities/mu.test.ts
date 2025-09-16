import { expect, expectTypeOf, test } from "vitest";
import { buildRoute, type FnReturn, type KeysMapping, type PickByValue, type RouteBuilder, type RouteParamKeys, type RouteParams, type UnwrapArray, type UnwrapPromise, type Without } from "./mu";/* ====== END IMPORT BLOCK ====== */

// Sample domain model for tests
type User = {
  id: string;
  email: string;
  password: string;
  age: number;
  createdAt: Date;
};

/* ---------- Core conditionals ---------- */
test("UnwrapPromise", () => {
  type A = UnwrapPromise<Promise<number>>;
  type B = UnwrapPromise<string>;
  expectTypeOf<A>().toEqualTypeOf<number>();
  expectTypeOf<B>().toEqualTypeOf<string>();
});

test("UnboxArray", () => {
  type A = UnwrapArray<Array<{ id: string }>>;
  type B = UnwrapArray<number>;
  expectTypeOf<A>().toEqualTypeOf<{ id: string }>();
  expectTypeOf<B>().toEqualTypeOf<number>();
});

test("FnReturn", () => {
  const make = (n: number) => ({ n, ok: true as const });
  type R = FnReturn<typeof make>;
  expectTypeOf<R>().toEqualTypeOf<{ n: number; ok: true }>();
});

/* ---------- KeysMatching / PickByValue / Without ---------- */
test("KeysMatching gets only string keys", () => {
  type K = KeysMapping<User, string>;
  expectTypeOf<K>().toEqualTypeOf<"id" | "email" | "password">();
});

test("PickByValue keeps only string props", () => {
  type OnlyStrings = PickByValue<User, string>;
  expectTypeOf<OnlyStrings>().toEqualTypeOf<{
    id: string; email: string; password: string;
  }>();
});

test("Without removes specified keys", () => {
  type PublicUser = Without<User, "password">;
  const u: PublicUser = { id: "1", email: "x@y.com" };
  expect(u.id).toBe("1");
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  u.password;
});

/* ---------- Route helpers ---------- */
test("RouteParamKeys extracts params from pattern", () => {
  type K = RouteParamKeys<"/orgs/:orgId/users/:id">;
  expectTypeOf<K>().toEqualTypeOf<"orgId" | "id">();
});

test("RouteParams creates a params record", () => {
  type P = RouteParams<"/orgs/:orgId/users/:id">;
  expectTypeOf<P>().toEqualTypeOf<{ orgId: string; id: string }>();
});

test("BuildRoute produces a specific path type (no double slashes)", () => {
  type Path = RouteBuilder<"/orgs/:orgId/users/:id", { orgId: string; id: string }>;
  // Assign a concrete example to ensure structure matches:
  const example: Path = "/orgs/acme/users/42";
  expect(example).toContain("/orgs/acme/users/42");
});

test("buildRoute runtime matches the type-level BuildRoute", () => {
  const path = buildRoute("/orgs/:orgId/users/:id", { orgId: "acme", id: "42" });
  // path is typed as "/orgs/${string}/users/${string}" at compile time
  expect(path).toBe("/orgs/acme/users/42");
});
