import * as z from "zod";

export const validate = async <T extends z.ZodType>(
  schema: T,
  input: unknown
): Promise<z.infer<T>> => {
  const res = await schema.safeParseAsync(input);
  if (!res.success) {
    const tree = z.treeifyError(res.error);
    console.error(tree);

    const msg = res.error.issues
      .map((i) => `${i.path.join(".") || "(root)"}: ${i.message}`)
      .join("; ");

    throw new Error(msg);
  }

  return res.data;
};
