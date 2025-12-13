import { useContext } from 'react';
import useCampaignMapsQuery from './useCampaignMapsQuery/useCampaignMapsQuery';
import { useParams } from 'react-router-dom';
import { AuthContext } from 'src/contexts/AuthContext';

const useMaps = (draft: boolean, mapType: string | null) => {
  const { user } = useContext(AuthContext);
  const { campaignId } = useParams();

  const { data: maps, isLoading } = useCampaignMapsQuery(Number(campaignId));

  const filteredMaps = maps
    ?.filter((map) => {
      if (mapType) {
        return map.type === mapType;
      } else {
        return true;
      }
    })
    .filter((map) => {
      if (draft) {
        return map.draft && map.userId === user.id;
      } else {
        return !map.draft;
      }
    });

  return {
    maps: maps ? filteredMaps : [],
    isLoading,
  };
};

export default useMaps;
