import { NullifiedContextProvider } from '@dnd-kit/core/dist/components/DragOverlay/components';

export const filterFormData = (data: object) => {
  const filteredData = Object.fromEntries(
    Object.entries(data).filter(([, value]) => value != null && value !== ''),
  );

  return filteredData;
};

export const filterStats = (stats: object) => {
  if (!stats) {
    return NullifiedContextProvider;
  }
  const filteredStats = Object.fromEntries(
    Object.entries(stats).filter(([, value]) => value),
  );

  return filteredStats;
};
