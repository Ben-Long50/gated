export const checkArrayMatch = (a: string[], b: string[]) =>
  a.length === b.length &&
  new Set(a).size === new Set(b).size &&
  a.every((value) => b.includes(value));
