import useCampaignMapQuery from './useCampaignMapQuery/useCampaignMapQuery';
import useLocationQueries from './useCampaignMapQuery/useLocationQueries';

const useMap = (mapId: number) => {
  const { data: map, isLoading: mapLoading } = useCampaignMapQuery(mapId);

  const { locations, isLoading: locationsLoading } = useLocationQueries(
    map?.locations.map((location) => location.id) || [],
  );

  return { map, locations, isLoading: mapLoading || locationsLoading };
};

export default useMap;
