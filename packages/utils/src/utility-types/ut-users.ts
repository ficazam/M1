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

const newPublicUser: Without<User, "password"> = newUser;
const newValueUser: PickByValue<User, string> = newUser;
type newExactUser = Exact<
  { id: string; email: string; password: string },
  User
>;
type jsonUser = Jsonify<User>;
