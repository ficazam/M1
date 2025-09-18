export type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K];
};

export type DeepMutable<T> = {
  -readonly [K in keyof T]: T[K] extends object ? DeepMutable<T[K]> : T[K];
};

export type DeepMerge<A, B> = {
  [K in keyof A | keyof B]: K extends keyof B
    ? K extends keyof A
      ? A[K] extends object
        ? B[K] extends object
          ? DeepMerge<A[K], B[K]>
          : B[K]
        : B[K]
      : B[K]
    : K extends keyof A
    ? A[K]
    : never;
};

type Default = {
  theme: {
    color: string;
    font: string;
  };
  debug: false;
};

type Override = {
  theme: {
    color: "dark";
  };
  verbose: true;
};

type Merged = DeepMerge<Default, Override>;

const papitas: Merged = {
  theme: { color: "dark", font: "123" },
  debug: false,
  verbose: true,
};

export const pickDeep = <
  T extends object,
  K1 extends keyof T,
  K2 extends keyof T[K1] = never
>(
  obj: T,
  key1: K1,
  key2?: K2
) => (key2 ? obj[key1][key2] : obj[key1]);
