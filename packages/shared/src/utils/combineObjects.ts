export const combineObjects = (
  a: Record<string, number>,
  b: Record<string, number>,
): Record<string, number> => {
  const result: Record<string, number> = { ...a };

  for (const [key, value] of Object.entries(b)) {
    const combinedValue = (result[key] ?? 0) + value;
    result[key] = combinedValue ?? 0;
  }

  return result;
};

