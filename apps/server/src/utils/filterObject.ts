export const filterObject = (data: object) =>
  Object.fromEntries(
    Object.entries(data)
      .map(([key, value]) => {
        if (value) {
          return [key, value];
        } else {
          return [];
        }
      })
      .filter((item) => item.length > 0),
  );
