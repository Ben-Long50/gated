import { useContext } from 'react';
import { AuthContext } from 'src/contexts/AuthContext';
import { useParams } from 'react-router-dom';
import useCampaignMapQuery from './useCampaignMapQuery/useCampaignMapQuery';

const useMap = () => {
  const { apiUrl } = useContext(AuthContext);
  const { campaignId, mapId } = useParams();

  const { data: map, isLoading } = useCampaignMapQuery(
    apiUrl,
    Number(campaignId),
    Number(mapId),
  );

  return {
    map,
    isLoading,
  };
};

export default useMap;
