export const filterFormData = (data: object) => {
  const filteredData = Object.fromEntries(
    Object.entries(data).filter(([, value]) => value != null && value !== ''),
  );

  return filteredData;
};

export const filterStats = (stats: object) => {
  if (!stats) {
    return null;
  }
  const filteredStats = Object.fromEntries(
    Object.entries(stats).filter(([, value]) => value),
  );

  return filteredStats;
};
