import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useRef,
} from 'react';
import { socket } from '../socket';
import { useQueryClient } from '@tanstack/react-query';
import { AuthContext } from './AuthContext';
import useCampaignQueries from 'src/hooks/useCampaignsQuery/useCampaignQueries';
import Loading from 'src/components/Loading';
import { useNavigate, useParams } from 'react-router-dom';
import useRoll from 'src/hooks/useRoll';
import useCombatStore from 'src/stores/combatStore';
import useCombatQueries from 'src/hooks/combat hooks/useCombatQueries/useCombatQueries';

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

  const gameMaster = user.ownerCampaigns
    .map((campaign) => campaign.id)
    .some((id) => id === Number(campaignId));

  const userCampaignIds = [
    ...user?.ownerCampaigns,
    ...user?.playerCampaigns,
    ...user?.pendingCampaigns,
  ].map((campaign) => campaign.id);

  const { campaigns, isLoading } = useCampaignQueries(userCampaignIds);

  const activeCampaigns = useMemo(
    () => campaigns?.filter((campaign) => campaign?.active),
    [campaigns],
  );

  const { activeEncounters, inactiveEncounters } = useCombatQueries(
    activeCampaigns?.flatMap((campaign) =>
      campaign?.encounters.map((encounter) => encounter.id),
    ),
  );

  const activeCampaignRef = useRef<number[]>([]);

  const { rolls, rolling, animateRoll, rollComplete, rollCounter } = useRoll();

  const setTarget = useCombatStore((state) => state.setTarget);
  const setDamage = useCombatStore((state) => state.setDamage);

  useEffect(() => {
    const onConnect = () => {
      console.log('Socket connected');

      socket.emit('registerData', {
        playerId: user.id,
        username: user.username,
      });

      socket.on('campaign', (campaignId) => {
        queryClient.invalidateQueries({
          queryKey: ['campaign', campaignId],
        });
      });

      socket.on('globalCampaign', ({ campaignId, playerIds }) => {
        if (
          playerIds.some((id: number) => id === user.id) ||
          userCampaignIds.some((id) => id === campaignId)
        ) {
          console.log(
            `Refetching campaign ${campaignId} for player ${user.id}`,
          );

          queryClient.invalidateQueries({
            queryKey: ['user', user.id],
          });
          queryClient.invalidateQueries({
            queryKey: ['campaign', campaignId],
          });
        } else {
          console.log('No refetch necessary');
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

    socket.on('character', (characterId) => {
      queryClient.invalidateQueries({
        queryKey: ['character', characterId],
      });
    });

    socket.on('location', (locationId) => {
      queryClient.invalidateQueries({
        queryKey: ['location', locationId],
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

    socket.on('encounter', (encounterId) => {
      queryClient.invalidateQueries({
        queryKey: ['encounter', encounterId],
      });
    });

    socket.on('advanceTurn', (encounterId) => {
      resetRolls();
      setDamage(null);
      setTarget(null);
      queryClient.invalidateQueries({
        queryKey: ['encounter', encounterId],
      });
    });

    socket.on('actionRoll', async ({ encounterId, rollArray }) => {
      setTarget(targetCharacter.id);

      const roll = new Map(rollArray) as Map<number, any>;

      await animateRoll(roll);

      console.log(roll);

      // setDamage(damage);

      setTimeout(() => {
        queryClient.invalidateQueries({
          queryKey: ['encounter', encounterId],
        });
        queryClient.invalidateQueries({
          queryKey: ['encounterHistory', encounterId],
        });
      }, 3000);
      // queryClient.invalidateQueries({ queryKey: ['character', targetCharacter.id] });
    });

    socket.on(
      'reactionRoll',
      async ({
        encounterId,
        reactiveCharacter,
        targetCharacter,
        reaction,
        item,
        rollResult,
      }) => {
        if (targetCharacter) {
          setTarget(targetCharacter.id);
        }

        await animateRoll(reactiveCharacter.id, rollResult);

        setTimeout(() => {
          queryClient.invalidateQueries({
            queryKey: ['encounter', encounterId],
          });
          queryClient.invalidateQueries({
            queryKey: ['encounterHistory', encounterId],
          });
        }, 3000);
        // queryClient.invalidateQueries({ queryKey: ['character', targetCharacter.id] });
      },
    );

    socket.on('resetRolls', () => {
      resetRolls();
      setDamage(null);
      setTarget(null);
    });

    socket.on('disconnect', (reason) => {
      console.log('Disconnected:', reason);
    });

    return () => {
      socket.off('character');
      socket.off('item');
      socket.off('affiliation');
    };
  }, [activeCampaigns]);

  if (isLoading) return <Loading />;

  return (
    <CampaignContext.Provider
      value={{
        socket,
        gameMaster,
        campaigns,
        activeCampaigns,
        activeEncounters,
        rolls,
        rolling,
        animateRoll,
        rollComplete,
        rollCounter,
      }}
    >
      {children}
    </CampaignContext.Provider>
  );
};
