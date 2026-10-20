import useLocationQueries from './useCampaignMapQuery/useLocationQueries';
import useMapQuery from './useMapQueries/useMapQuery';

const useMap = (mapId: number) => {
  const { data: map, isLoading: mapLoading } = useMapQuery(mapId);

  const { locations, isLoading: locationsLoading } = useLocationQueries(
    map?.locations.map((location) => location.id) || [],
  );

  return {
    map,
    locations: locations.filter(Boolean),
    mapLoading,
    locationsLoading,
  };
};

export default useMap;
