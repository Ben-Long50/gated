import { useContext } from 'react';
import { AuthContext } from 'src/contexts/AuthContext';
import { useParams } from 'react-router-dom';
import useCampaignMapQuery from './useCampaignMapQuery/useCampaignMapQuery';
import useLocationQueries from './useCampaignMapQuery/useLocationQueries';

const useMap = () => {
  const { apiUrl } = useContext(AuthContext);
  const { campaignId, mapId } = useParams();

  const { data: map, isLoading: mapLoading } = useCampaignMapQuery(
    apiUrl,
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
