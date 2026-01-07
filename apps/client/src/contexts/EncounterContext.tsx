import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import { socket } from '../socket';
import { useQueryClient } from '@tanstack/react-query';
import { AuthContext } from './AuthContext';
import Loading from 'src/components/Loading';
import { useNavigate, useParams } from 'react-router-dom';
import useCombat from 'src/hooks/useCombat';
import useNavigationStore from 'src/stores/navbarStore';

export const EncounterContext = createContext({
  socket,
});

export const EncounterProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useContext(AuthContext);
  const { encounterId } = useParams();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [joinedPlayers, setJoinedPlayers] = useState<string[]>([]);

  const {
    combat,
    targetMap,
    resetTargetMap,
    removeTarget,
    setTarget,
    getTarget,
    encounterPermissions,
    actionPermissions,
    reactionPermissions,
    blockPermissions,
    controlledCharacter,
    controlledCharacterId,
    setControlledCharacterId,
    activeCharacter,
    handleAdvanceTurn,
    actionForm,
    reactionForm,
    blockForm,
    resetForms,
    isLoading: combatLoading,
    isPending: combatPending,
    isFetching,
    setIsFetching,
    rollHookValues,
  } = useCombat();

  const { rolls, rolling, animateRoll, resetRolls, rollComplete, rollCounter } =
    rollHookValues;

  const setEncounterLayout = useNavigationStore(
    (state) => state.setEncounterLayout,
  );

  useEffect(() => {
    setEncounterLayout(true);

    socket.emit('joinEncounter', {
      room: `encounter ${encounterId}`,
      playerId: user.id,
    });

    socket.on('playerJoined', ({ playerId, playerIdList }) => {
      console.log(`player ${playerId} joined encounter ${encounterId}`);
      setJoinedPlayers(playerIdList);
    });

    socket.on('playerLeft', ({ playerId, playerIdList }) => {
      console.log(`player ${playerId} left encounter ${encounterId}`);
      setJoinedPlayers(playerIdList);
    });

    socket.on('initiativeRoll', (rollsArray) => {
      const rolls = new Map(rollsArray) as Map<number, any>;

      animateRoll(rolls);
    });

    socket.on('resetBoard', () => {
      resetRolls();
      resetTargetMap();
    });

    socket.on('actionRoll', async ({ encounterId, rollsArray }) => {
      if (rollsArray) {
        const rolls = new Map(rollsArray) as Map<number, any>;
        await animateRoll(rolls);
      }

      queryClient.invalidateQueries({
        queryKey: ['encounterHistory', encounterId],
      });
    });

    socket.on('reactionRoll', async ({ encounterId, rollsArray }) => {
      const rolls = new Map(rollsArray) as Map<number, any>;

      await animateRoll(rolls);

      setTimeout(() => {
        queryClient.invalidateQueries({
          queryKey: ['encounter', encounterId],
        });
        queryClient.invalidateQueries({
          queryKey: ['encounterHistory', encounterId],
        });
      }, 3000);
    });

    socket.on('blockData', (blockData) => {
      blockForm.setFieldValue('blockData', blockData);
    });

    socket.on('encounterHistory', (encounterId) => {
      queryClient.invalidateQueries({
        queryKey: ['encounterHistory', encounterId],
      });
    });

    socket.on('updateEncounter', (updatedEncounter) => {
      queryClient.setQueryData(
        ['encounter', updatedEncounter.id],
        updatedEncounter,
      );

      setIsFetching(false);
    });

    socket.on('navigateToEncounter', ({ encounterId, mapId, campaignId }) => {
      navigate(
        `glam/campaigns/${campaignId}/maps/${mapId}/encounters/${encounterId}`,
      );
    });

    socket.on('changeTarget', ({ key, targetData }) => {
      setTarget(key, targetData);
    });

    socket.on('removeTarget', ({ activeId }) => {
      removeTarget(activeId);
    });

    return () => {
      setEncounterLayout(false);

      socket.emit('leaveEncounter', {
        room: `encounter ${encounterId}`,
        playerId: user.id,
      });
    };
  }, [encounterId]);

  if (combatLoading) return <Loading />;

  return (
    <EncounterContext.Provider
      value={{
        combat,
        targetMap,
        resetTargetMap,
        removeTarget,
        setTarget,
        getTarget,
        combatLoading,
        combatPending,
        isFetching,
        setIsFetching,
        joinedPlayers,
        encounterPermissions,
        actionPermissions,
        reactionPermissions,
        blockPermissions,
        controlledCharacter,
        controlledCharacterId,
        setControlledCharacterId,
        activeCharacter,
        handleAdvanceTurn,
        actionForm,
        reactionForm,
        blockForm,
        resetForms,
        rolls,
        rolling,
        rollComplete,
        resetRolls,
        animateRoll,
        rollCounter,
      }}
    >
      {children}
    </EncounterContext.Provider>
  );
};
