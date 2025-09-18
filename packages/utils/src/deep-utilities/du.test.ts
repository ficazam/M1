import { expect, expectTypeOf, test } from "vitest";
import { pickDeep, type DeepMerge } from "./du";

test("DeepMerge merges nested objects", () => {
  type A = { theme: { color: string; font: string }; debug: false };
  type B = { theme: { color: "dark" }; verbose: true };
  type Merged = DeepMerge<A, B>;

  expectTypeOf<Merged>().toEqualTypeOf<{
    theme: { color: "dark"; font: string };
    debug: false;
    verbose: true;
  }>();
});

test("pickDeep with optional second key", () => {
  const config = {
    theme: { color: "red", font: "serif" },
    debug: false,
  } as const;

  const theme = pickDeep(config, "theme");
  expect(theme.color).toBe("red");

  const color = pickDeep(config, "theme", "color");
  expect(color).toBe("red");

  // @ts-expect-error invalid second key
  pickDeep(config, "theme", "nonexistend");
});
