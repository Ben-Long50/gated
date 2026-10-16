import { createContext, ReactNode, useContext, useEffect, useRef } from 'react';
import { socket } from '../socket';
import { useQueryClient } from '@tanstack/react-query';
import { AuthContext } from './AuthContext';
import useCampaignQueries from 'src/hooks/useCampaignsQuery/useCampaignQueries';
import Loading from 'src/components/Loading';
import { useNavigate, useParams } from 'react-router-dom';
import useCombatQueries from 'src/hooks/encounter hooks/useCombatQueries/useCombatQueries';
import { Location } from '@gated/shared';
import { Character } from '@gated/shared';
import useRoll from 'src/hooks/useRoll';

export const CampaignContext = createContext({
  socket,
  campaigns: [],
  activeCampaigns: [],
});

export const CampaignProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useContext(AuthContext);
  const { campaignId } = useParams();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const {
    rolls,
    setRolls,
    rolling,
    animateRoll,
    resetRolls,
    rollComplete,
    rollCounter,
  } = useRoll();

  const gameMaster = user?.ownerCampaigns
    .map((campaign) => campaign.id)
    .some((id) => id === Number(campaignId));

  const userCampaignIds = [
    ...user?.ownerCampaigns,
    ...user?.playerCampaigns,
    ...user?.pendingCampaigns,
  ].map((campaign) => campaign.id);

  const { campaigns, isLoading } = useCampaignQueries(userCampaignIds);

  const pendingCampaignIds = campaigns
    .filter(
      (campaign) =>
        campaign.characters.every(
          (character) => character.userId !== user.id,
        ) && campaign?.ownerId !== user.id,
    )
    .map((campaign) => campaign.id);

  const activeCampaigns =
    campaigns?.filter((campaign) => campaign?.active) || [];

  const activeCharacters = activeCampaigns
    .find((campaign) => campaign.id === Number(campaignId))
    ?.characters.filter(
      (character) => character.playerCharacter && character.userId === user.id,
    );

  const encounterIds = activeCampaigns
    ?.filter((campaign) => campaign != null)
    .flatMap((campaign) => campaign.encounters.map((encounter) => encounter.id))
    .filter((encounterId) => encounterId != null);

  const { activeEncounters, inactiveEncounters } =
    useCombatQueries(encounterIds);

  const activeCampaignRef = useRef<number[]>([]);

  useEffect(() => {
    const onConnect = () => {
      console.log('Socket connected');

      socket.emit('registerData', {
        playerId: user.id,
        username: user.username,
      });

      socket.on('updateCampaign', (campaign) => {
        queryClient.setQueryData(['campaign', campaign.id], campaign);
      });

      socket.on('globalCampaign', ({ campaignId, playerIds }) => {
        if (
          playerIds.some((id: number) => id === user.id) ||
          userCampaignIds.some((id) => id === campaignId)
        ) {
          queryClient.invalidateQueries({
            queryKey: ['user', user.id],
          });
          queryClient.invalidateQueries({
            queryKey: ['campaign', campaignId],
          });
        }
      });
    };

    if (!socket.connected) {
      socket.connect();
    }

    socket.on('connect', onConnect);

    return () => {
      socket.off('campaign');
      socket.disconnect();
      socket.off();
    };
  }, []);

  useEffect(() => {
    const activeIds = activeCampaigns.map((campaign) => campaign.id) || [];

    activeCampaignRef.current.forEach((campaignId) => {
      if (!activeIds.includes(campaignId)) {
        socket.emit('endCampaign', campaignId);
        console.log(`Ended campaign ${campaignId}`);
      }
    });

    activeIds?.forEach((campaignId) => {
      const campaign = campaigns.find(
        (campaign) => campaign?.id === campaignId,
      );

      const gameMaster = campaign?.ownerId === user.id;

      if (!activeCampaignRef.current.includes(campaignId)) {
        if (gameMaster) {
          socket.emit('startCampaign', campaignId);
          console.log(`Started campaign ${campaign?.name}`);
        } else {
          socket.emit('joinCampaign', campaignId);
          console.log(`Joined campaign ${campaignId}`);
        }
      }
    });

    activeCampaignRef.current = activeIds;

    if (activeCampaignRef.current.length === 0) return;

    socket.on('endCampaign', (campaignId) => {
      queryClient.invalidateQueries({
        queryKey: ['campaign', campaignId],
      });
      navigate('/glam/campaigns');
    });

    socket.on('campaignRoll', async ({ rollsArray, character, action }) => {
      if (rollsArray) {
        const rolls = new Map(rollsArray) as Map<number, any>;
        await animateRoll(rolls);
      }
    });

    socket.on('updateCharacter', (data) => {
      queryClient.setQueryData(
        ['character', data.character.id],
        data.character,
      );
    });

    socket.on('updateGang', (data) => {
      queryClient.setQueryData(['gang', data.gang.id], data.gang);
    });

    socket.on('updateLocation', (location) => {
      queryClient.setQueryData(['location', location.id], location);
    });

    socket.on('location', ({ characterId, locationId, mapId, row, col }) => {
      queryClient.setQueryData(['location', locationId], (prev: Location) => {
        if (!prev) return prev;

        return {
          ...prev,
          mapId,
          row,
          col,
        };
      });

      queryClient.setQueryData(
        ['character', characterId],
        (prev: Character) => {
          if (!prev) return prev;

          return {
            ...prev,
            location: {
              ...prev.location,
              mapId,
              row,
              col,
            },
          };
        },
      );
    });

    socket.on('updateItem', (item) => {
      queryClient.setQueryData(['item', item.id], item);
    });

    socket.on('updateAffiliation', (affiliation) => {
      queryClient.setQueryData(['affiliation', affiliation.id], affiliation);
    });

    socket.on('updateEncounter', (encounter) => {
      queryClient.setQueryData(['encounter', encounter.id], encounter);
    });

    socket.on('disconnect', (reason) => {
      console.log('Disconnected:', reason);
    });

    return () => {
      socket.off('character');
      socket.off('item');
      socket.off('affiliation');
    };
  }, [activeCampaigns, activeEncounters]);

  if (isLoading) return <Loading />;

  return (
    <CampaignContext.Provider
      value={{
        socket,
        gameMaster,
        pendingCampaignIds,
        campaigns,
        activeCampaigns,
        activeCharacters,
        activeEncounters,
        rolls,
        setRolls,
        rolling,
        animateRoll,
        resetRolls,
        rollComplete,
        rollCounter,
      }}
    >
      {children}
    </CampaignContext.Provider>
  );
};
