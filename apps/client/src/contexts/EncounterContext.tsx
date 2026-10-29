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
import { toast } from 'react-toastify';
import { capitalCase } from 'change-case';

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
    resetForms,
    isLoading: combatLoading,
    isPending: combatPending,
    isFetching,
    setIsFetching,
    rollHookValues,
  } = useCombat();

  const {
    rolls,
    rollOptions,
    rolling,
    setRoll,
    setOption,
    syncRolls,
    resetRolls,
    resetOptions,
    setRolls,
    setRollOptions,
    rollComplete,
    rollCounter,
  } = rollHookValues;

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

    socket.on('advancePhase', ({ encounter, initiative }) => {
      resetRolls();
      resetOptions();
      resetTargetMap();
      resetBlockDataMap();

      queryClient.setQueryData(['encounter', encounter.id], encounter);

      if (initiative) {
        navigate('..', { replace: true });
      }

      toast(
        initiative
          ? 'Started Encounter'
          : `Advanced to ${capitalCase(encounter.combatPhase)} phase`,
      );
    });

    socket.on('resetBoard', () => {
      resetRolls();
      resetOptions();
      resetTargetMap();
      resetBlockDataMap();
    });

    socket.on('actionRoll', async ({ encounterId, rollResultData }) => {
      if (rollResultData) {
        await syncRolls(rollResultData);
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

    socket.on('updateEncounter', ({ encounter }) => {
      queryClient.setQueryData(['encounter', encounter.id], encounter);

      setIsFetching(false);
    });

    socket.on('updateRollOptions', ({ rollOptionData }) => {
      if (rollOptionData) {
        setRollOptions(new Map(rollOptionData));
      }
    });

    socket.on('rollInitiative', async ({ encounter, rollResultData }) => {
      await syncRolls(rollResultData);
      queryClient.setQueryData(['encounter', encounter.id], encounter);
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
        resetForms,
        rolls,
        rollOptions,
        rolling,
        rollComplete,
        resetRolls,
        resetOptions,
        setRoll,
        setOption,
        syncRolls,
        rollCounter,
        setRolls,
        setRollOptions,
      }}
    >
      {children}
    </EncounterContext.Provider>
  );
};
