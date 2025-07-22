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
import useCurrentHealthMutation from 'src/hooks/character stat hooks/useCurrentHealthMutation/useCurrentHealthMutation';
import useCombatQueries from 'src/hooks/combat hooks/useCombatQueries/useCombatQueries';
import useCharacterStatMutation from 'src/hooks/character stat hooks/useCharacterStatMutation/useCharacterStatMutation';
import useCharacterStatHandlers from 'src/hooks/character stat hooks/useCharacterStatMutation/useCharacterStatHandlers';

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

  const { combats } = useCombatQueries(
    activeCampaigns?.flatMap((campaign) =>
      campaign?.encounters.map((encounter) => encounter.id),
    ),
  );

  const activeCampaignRef = useRef<number[]>([]);

  const timeoutRef = useRef<number | null>(null);

  const {
    diceArray,
    setDiceArray,
    rolling,
    calculateRoll,
    calculateSuccesses,
    successes,
  } = useRoll();

  const setActiveCharacter = useCombatStore(
    (state) => state.setActiveCharacter,
  );
  const setTarget = useCombatStore((state) => state.setTarget);
  const setDamage = useCombatStore((state) => state.setDamage);

  useEffect(() => {
    const onConnect = () => {
      console.log('Socket connected');

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

    socket.on('advanceTurn', (encounterId) => {
      queryClient.invalidateQueries({
        queryKey: ['encounter', encounterId],
      });
    });

    socket.on(
      'combatRoll',
      async ({ characterId, targetId, damage, rollResult }) => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          setDamage(null);
        }

        setActiveCharacter(characterId);

        await calculateSuccesses(rollResult, damage);

        setTarget(targetId);

        queryClient.invalidateQueries({ queryKey: ['character', targetId] });

        timeoutRef.current = setTimeout(() => {
          setDiceArray([]);
          setTarget(null);
          setDamage(null);
        }, 7000);
      },
    );

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
        diceArray,
        setDiceArray,
        rolling,
        calculateRoll,
        calculateSuccesses,
        successes,
      }}
    >
      {children}
    </CampaignContext.Provider>
  );
};
