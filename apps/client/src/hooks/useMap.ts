import { useParams } from 'react-router-dom';
import useCampaignMapQuery from './useCampaignMapQuery/useCampaignMapQuery';
import useLocationQueries from './useCampaignMapQuery/useLocationQueries';
import useCombatStore from 'src/stores/combatStore';

const useMap = () => {
  const { campaignId, mapId } = useParams();

  const { data: map, isLoading: mapLoading } = useCampaignMapQuery(
    Number(campaignId),
    Number(mapId),
  );

  const { locations, isLoading: locationsLoading } = useLocationQueries(
    map?.locations.map((location) => location.id) || [],
  );

  return {
    map,
    locations,
    isLoading: mapLoading || locationsLoading,
  };
};

export default useMap;
