import { useContext, useEffect } from 'react';
import { AuthContext } from 'src/contexts/AuthContext';
import { useParams } from 'react-router-dom';
import useCampaignMapQuery from './useCampaignMapQuery/useCampaignMapQuery';
import useLocationQueries from './useCampaignMapQuery/useLocationQueries';
import useCombatStore from 'src/stores/combatStore';

const useMap = () => {
  const { campaignId, mapId } = useParams();

  const setTurnOrder = useCombatStore((state) => state.setTurnOrder);

  const { data: map, isLoading: mapLoading } = useCampaignMapQuery(
    Number(campaignId),
    Number(mapId),
  );

  const { locations, isLoading: locationsLoading } = useLocationQueries(
    map?.locations.map((location) => location.id) || [],
  );

  useEffect(() => {
    if (locations) {
      setTurnOrder(locations.map((location) => location.characterId));
    }
  }, [map]);

  return {
    map,
    locations,
    isLoading: mapLoading || locationsLoading,
  };
};

export default useMap;
