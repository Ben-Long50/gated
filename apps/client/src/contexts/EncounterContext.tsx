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
    blockDataMap,
    resetTargetMap,
    resetBlockDataMap,
    removeTarget,
    setTarget,
    setBlockData,
    getTarget,
    getBlockData,
    encounterPermissions,
    actionPermissions,
    reactionPermissions,
    controlledCharacter,
    controlledCharacterId,
    setControlledCharacterId,
    activeCharacter,
    handleAdvanceTurn,
    actionForm,
    reactionForm,
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
      resetBlockDataMap();
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

    socket.on('blockData', ({ characterId, blockData }) => {
      setBlockData(`character ${characterId}`, blockData);
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
        `/glam/campaigns/${campaignId}/maps/${mapId}/encounters/${encounterId}`,
      );
    });

    socket.on('changeTarget', ({ key, targetData }) => {
      console.log('socket');

      const data = {
        start: {
          row: targetData.row,
          col: targetData.col,
          characterId: targetData.characterId,
        },
        end: {
          row: targetData.targetRow,
          col: targetData.targetCol,
          targetId: targetData.targetId,
        },
        action: targetData.action,
        distance: Math.round(
          Math.sqrt(
            (targetData.targetCol - targetData.col) ** 2 +
              (targetData.targetRow - targetData.row) ** 2,
          ),
        ),
        color: targetData.color,
        occupied: false,
        inRange: targetData.inRange,
      };

      setTarget(key, data);
    });

    socket.on('removeTarget', ({ key }) => {
      removeTarget(key);
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
        blockDataMap,
        resetTargetMap,
        resetBlockDataMap,
        removeTarget,
        setTarget,
        setBlockData,
        getTarget,
        getBlockData,
        combatLoading,
        combatPending,
        isFetching,
        setIsFetching,
        joinedPlayers,
        encounterPermissions,
        actionPermissions,
        reactionPermissions,
        controlledCharacter,
        controlledCharacterId,
        setControlledCharacterId,
        activeCharacter,
        handleAdvanceTurn,
        actionForm,
        reactionForm,
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
