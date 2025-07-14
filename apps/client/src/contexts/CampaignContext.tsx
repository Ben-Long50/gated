import { createContext, useContext, useEffect } from 'react';
import { Outlet, useParams } from 'react-router-dom';
import { socket } from '../socket';
import { useQueryClient } from '@tanstack/react-query';
import useCampaignQuery from 'src/hooks/useCampaignQuery/useCampaignQuery';
import { AuthContext } from './AuthContext';

export const CampaignContext = createContext({ socket, gameMaster: undefined });

export const CampaignProvider = () => {
  const { apiUrl, user } = useContext(AuthContext);
  const { campaignId } = useParams();
  const queryClient = useQueryClient();

  const { data: campaign } = useCampaignQuery(apiUrl, Number(campaignId));

  const gameMaster = user?.id === campaign?.ownerId;

  useEffect(() => {
    socket.connect();

    socket.on('connect', () => {
      console.log(`Connected to campaign`);
    });

    socket.on('campaign', (campaignId) => {
      queryClient.invalidateQueries({
        queryKey: ['campaign', campaignId],
      });
    });

    socket.on('character', (characterId) => {
      queryClient.invalidateQueries({
        queryKey: ['character', characterId],
      });
    });

    socket.on('item', (itemId) => {
      queryClient.invalidateQueries({
        queryKey: ['item', itemId],
      });
    });

    socket.on('affiliation', (affiliationId) => {
      queryClient.invalidateQueries({
        queryKey: ['affiliation', affiliationId],
      });
    });

    socket.on('disconnect', (reason) => {
      console.log('Disconnected:', reason);
    });

    return () => {
      socket.disconnect();
      socket.off();
    };
  }, []);

  return (
    <CampaignContext.Provider value={{ socket, gameMaster }}>
      <Outlet context={{ socket }} />
    </CampaignContext.Provider>
  );
};
