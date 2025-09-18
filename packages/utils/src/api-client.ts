import type {
  UnwrapPromise,
  RouteParams,
  RouteBuilder,
} from "./more-utilities/mu";
import type { Jsonify } from "./utility-types/ut-users";

export interface Endpoint<Req, Res> {
  method: "GET" | "POST" | "PUT" | "DELETE";
  path: string;
  request: Req;
  response: Res;
}

export type User = {
  id: string;
  email: string;
  password: string;
  createdAt: Date;
};

export const enpoints = {
  getUser: {
    method: "GET",
    path: "users/:id",
    request: { id: "" },
    response: {
      id: "",
      email: "",
      password: "",
      createdAt: new Date(),
    } as User,
  },
  createUser: {
    method: "POST",
    path: "/users",
    request: { email: "", password: "" },
    response: {} as User,
  },
};

export const callEndpoint = async <
  E extends Endpoint<any, any>,
  Params extends RouteParams<E["path"]>,
  Body = E["method"] extends "GET" ? never : E["request"]
>(
  endpoint: E,
  params: Params,
  body?: Body
): Promise<UnwrapPromise<E["response"]>> => {
  let url = endpoint.path;
  for (const key of Object.keys(params) as Array<keyof Params>) {
    url = url.replace(`:${String(key)}`, encodeURIComponent(params[key]));
  }

  const opts: RequestInit =
    endpoint.method === "GET"
      ? { method: endpoint.method }
      : { method: endpoint.method, body: JSON.stringify(body) };

  const res = await fetch(url, opts);
  const json = await res.json();

  return json as UnwrapPromise<E["response"]>;
};
