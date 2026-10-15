import useLocationQueries from './useCampaignMapQuery/useLocationQueries';
import useMapQuery from './useMapQueries/useMapQuery';

const useMap = (mapId: number) => {
  const { data: map, isLoading: mapLoading } = useMapQuery(mapId);

  const {
    locations,
    isLoading: locationsLoading,
    isPending: locationsPending,
  } = useLocationQueries(map?.locations.map((location) => location.id) || []);

  return {
    map,
    locations: locations.filter((location) => location),
    mapLoading,
    locationsLoading: locationsLoading || locationsPending,
  };
};

export default useMap;
