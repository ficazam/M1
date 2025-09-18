export type UnwrapPromise<T> = T extends Promise<infer U> ? U : T;
export type UnwrapArray<T> = T extends (infer U)[] ? U : T;
export type FnReturn<T> = T extends (...args: any[]) => infer R ? R : never;

export type KeysMapping<T, V> = {
  [K in keyof T]-?: T[K] extends V ? K : never;
}[keyof T];

export type PickByValue<T, V> = {
  [K in keyof T as T[K] extends V ? K : never]: T[K];
};

export type Without<T, K extends keyof T> = {
  [P in keyof T as P extends K ? never : P]: T[P];
};

//extract path param keys in "/users/:id/comments/:commentId"
export type RouteParamKeys<S extends string> =
  S extends `${string}:${infer P}/${infer Rest}`
    ? P | RouteParamKeys<`/${Rest}`>
    : S extends `${string}:${infer P}`
    ? P
    : never;

export type RouteParams<S extends string> = Record<RouteParamKeys<S>, string>;

export type RouteBuilder<
  S extends string,
  P extends Record<string, string>
> = S extends `${infer A}:${infer K}${infer Rest}`
  ? K extends keyof P
    ? `${A}${P[K]}/${RouteBuilder<`/${Rest}`, P>}`
    : never
  : S extends `${infer A}:${infer K}`
  ? K extends keyof P
    ? `${A}${P[K]}`
    : never
  : S;

/*
-----------------------------------------------
-------------------EXAMPLES--------------------
-----------------------------------------------
*/

//unwrapPromise
const fetchUser = async (id: string) => {
  return { id, email: `${id}@mail.com` };
};

type FetchedUser = UnwrapPromise<ReturnType<typeof fetchUser>>;

const demo = async () => {
  const user = await fetchUser("123");
};

//unwrapArray
const users = [
  { id: "1", email: "a@a.com" },
  { id: "2", email: "b@b.com" },
];

type User = UnwrapArray<typeof users>;

const emailsOnly = (list: User[]) => list.map((u) => u.email);
const emails = emailsOnly(users);

//fnReturn
const makeSession = (userId: string) => ({
  token: `${userId}-token`,
  expiresAt: new Date(),
});

type Session = FnReturn<typeof makeSession>;

//KeysMatching / PickByValue
type User2 = {
  id: string;
  email: string;
  password: string;
  age: number;
  createdAt: Date;
};

export type StringKeys = KeysMapping<User2, string>;
export type UserStringShape = PickByValue<User2, string>;

export type FormFields<T> = {
  [K in KeysMapping<T, string>]: { label: string; required?: Boolean };
};

const userForm: FormFields<User2> = {
  id: { label: "User Id", required: true },
  email: { label: "Email", required: true },
  password: { label: "Password" },
};

//Without
type User3 = {
  id: string;
  email: string;
  password: string;
  role: "user" | "admin";
};

type PublicUser = Without<User3, "password">;
const toPublicUser = (u: User3) => {
  const { password, ...rest } = u;
  return rest;
};

//RouteParamKeys<S>, RouteParams<S>, BuildRoute<S, P> – safe URLs
type URLPattern = "/orgs/:orgId/users/:userId";
type Params = RouteParams<URLPattern>;

export const buildRoute = <S extends string>(
  pattern: S,
  params: RouteParams<S>
): RouteBuilder<S, RouteParams<S>> => {
  let out = pattern as string;

  for (const k of Object.keys(params) as Array<keyof typeof params>) {
    const v = params[k];
    out = out.replace(`:${String(k)}`, encodeURIComponent(v));
  }

  return out as RouteBuilder<S, RouteParams<S>>;
};

const path = buildRoute("/orgs/:orgId/users/:id", { orgId: "acme", id: "42" });
