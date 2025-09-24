export const dateFormatter = (v: unknown) => {
  const d = v instanceof Date ? v : new Date(String(v));
  return isNaN(d.getTime()) ? "-" : d.toLocaleDateString();
}
