import { useContext } from 'react';
import useCampaignMapsQuery from './useCampaignMapsQuery/useCampaignMapsQuery';
import { AuthContext } from 'src/contexts/AuthContext';
import { useParams } from 'react-router-dom';

const useMaps = () => {
  const { apiUrl } = useContext(AuthContext);
  const { campaignId } = useParams();

  const { data: maps, isLoading } = useCampaignMapsQuery(
    apiUrl,
    Number(campaignId),
  );

  return {
    locations: maps?.filter((map) => map.type === 'location') || [],
    components: maps?.filter((map) => map.type === 'component') || [],
    drafts: maps?.filter((map) => map.draft) || [],
    isLoading,
  };
};

export default useMaps;
