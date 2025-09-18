import { expect, expectTypeOf, test } from "vitest";
import { callEndpoint, type Endpoint } from "./api-client";
import type { RouteParams } from "./more-utilities/mu"; // where RouteParams is

type User = { id: string; email: string };

const getUser: Endpoint<{ id: string }, Promise<User>> = {
  method: "GET",
  path: "/users/:id",
  request: { id: "" },
  response: Promise.resolve({ id: "", email: "" }),
};

test("callEndpoint infers params and return type", async () => {
  type P = RouteParams<typeof getUser.path>;
  expectTypeOf<P>().toEqualTypeOf<{ id: string }>();

  await callEndpoint(getUser, {});

  const u = await callEndpoint(getUser, { id: "123" });
  expectTypeOf<typeof u>().toEqualTypeOf<User>();
  expect(u.id).toBeDefined();
});
