import { expect, expectTypeOf, test } from "vitest";

// ---- paste your types here or import them ----

type User = { id: string; email: string; password: string };

export type Without<T, K extends keyof T> = {
  [P in keyof T as P extends K ? never : P]: T[P];
};

export type PickByValue<T, V> = {
  [P in keyof T as T[P] extends V ? P : never]: T[P];
};

export type Exact<T, U> = T extends U
  ? Exclude<keyof T, keyof U> extends never
    ? T
    : never
  : never;

export type DeepReadOnlyExcept<T, K extends keyof T> = {
  readonly [P in keyof T as P extends K ? never : P]: T[P] extends object
    ? DeepReadOnlyExcept<T[P], never>
    : T[P];
} & { [P in K]: T[P] };

export type Jsonify<T> = T extends Date
  ? string
  : T extends { toJSON(): infer U }
  ? U
  : T extends object
  ? { [K in keyof T]: Jsonify<T[K]> }
  : T;

const newUser: User = {
  id: "123",
  email: "felipe@felipe.felipe",
  password: "123!",
};

test("Without<User, 'password'> removes password key", () => {
  type PublicUser = Without<User, "password">;
  const publicUser: PublicUser = { id: "123", email: "felipe@felipe.felipe" };
  expect(publicUser).toHaveProperty("id");
  expect(publicUser).toHaveProperty("email");
  // @ts-expect-error password should not exist
  publicUser.password;
});

test("PickByValue<User, string> keeps only string-valued props", () => {
  type OnlyStrings = PickByValue<User, string>;
  const s: OnlyStrings = { id: "x", email: "y", password: "z" };
  expectTypeOf(s.id).toEqualTypeOf<string>();
  expectTypeOf(s.email).toEqualTypeOf<string>();
  expectTypeOf(s.password).toEqualTypeOf<string>();
});

test("Pick<User, 'password'> keeps exactly the password key", () => {
  type OnlyPassword = Pick<User, "password">;
  const op: OnlyPassword = { password: "secret" };
  expectTypeOf(op).toEqualTypeOf<{ password: string }>();
});

test("Exact disallows extra keys", () => {
  type UserShape = { id: string; email: string; password: string };

  type Good = Exact<UserShape, User>;
  const g: Good = { id: "a", email: "b", password: "c" };
  expect(g.password).toBe("c");

  type Bad = Exact<
    { id: string; email: string; password: string; age: number },
    User
  >;
  // @ts-expect-error Bad is never, so you can't create a value of type Bad
  const b: Bad = { id: "a", email: "b", password: "c", age: 99 };
});

test("DeepReadOnlyExcept makes everything readonly except chosen keys", () => {
  type Config = {
    name: string;
    meta: { updatedAt: Date; tags: string[] };
  };
  type PartiallyMutable = DeepReadOnlyExcept<Config, "meta">;

  const cfg: PartiallyMutable = {
    name: "app",
    meta: { updatedAt: new Date(), tags: ["ts", "rsc"] },
  };

  // @ts-expect-error name is readonly
  cfg.name = "app2";

  cfg.meta = { updatedAt: new Date(), tags: [] };

  cfg.meta.updatedAt = new Date();
  cfg.meta.tags.push("new");
});

test("Jsonify transforms non-JSON-safe types", () => {
  type Model = { created: Date; nested: { count: number } };
  type AsJson = Jsonify<Model>;

  type _Created = AsJson["created"];
  expectTypeOf<_Created>().toEqualTypeOf<string>();

  type _Nested = AsJson["nested"];
  expectTypeOf<_Nested>().toEqualTypeOf<{ count: number }>();
});

test("runtime example: log shapes", () => {
  const publicUser: Without<User, "password"> = {
    id: newUser.id,
    email: newUser.email,
  };
  expect(JSON.stringify(publicUser)).toContain("id");
});
