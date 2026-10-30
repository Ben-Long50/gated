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
  const { campaignId, mapId, encounterId } = useParams();
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

  const handlePlayerJoin = ({ playerId, playerIdList }) => {
    setJoinedPlayers(playerIdList);
  };

  const handlePlayerLeave = ({ playerId, playerIdList }) => {
    setJoinedPlayers(playerIdList);
  };

  const handleResetBoard = () => {
    resetRolls();
    resetOptions();
    resetTargetMap();
    resetBlockDataMap();
  };

  const handleAdvancePhase = ({ encounter, initiative }) => {
    handleResetBoard();

    queryClient.setQueryData(['encounter', encounter.id], encounter);

    if (initiative) {
      navigate(
        `/glam/campaigns/${campaignId}/maps/${mapId}/encounters/${encounterId}`,
        { replace: true },
      );
    }

    toast(`Advanced to ${capitalCase(encounter.combatPhase)} phase`);
  };

  const handleActionRoll = async ({ encounterId, rollResultData }) => {
    if (rollResultData) {
      await syncRolls(rollResultData);
    }

    queryClient.invalidateQueries({
      queryKey: ['encounterHistory', encounterId],
    });
  };

  const handleBlock = ({ characterId, blockData }) => {
    setBlockData(`character ${characterId}`, blockData);
  };

  const updateEncounterHistory = (encounterId) => {
    queryClient.invalidateQueries({
      queryKey: ['encounterHistory', encounterId],
    });
  };

  const updateEncounter = ({ encounter }) => {
    queryClient.setQueryData(['encounter', encounter.id], encounter);

    setIsFetching(false);
  };

  const updateRollOptions = ({ rollOptionData }) => {
    if (rollOptionData) {
      setRollOptions(new Map(rollOptionData));
    }
  };

  const handleInitiativeRoll = async ({ encounter, rollResultData }) => {
    await syncRolls(rollResultData);
    queryClient.setQueryData(['encounter', encounter.id], encounter);
  };

  const handleChangeTarget = ({ key, targetData }) => {
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
  };

  const handleRemoveTarget = ({ key }) => {
    removeTarget(key);
  };

  useEffect(() => {
    if (combat?.combatPhase === 'initiative') {
      navigate(
        `/glam/campaigns/${campaignId}/maps/${mapId}/encounters/${encounterId}/modal/initiative`,
      );
    }
  }, [combat?.combatPhase]);

  useEffect(() => {
    setEncounterLayout(true);

    socket.emit('joinEncounter', {
      room: `encounter ${encounterId}`,
      playerId: user.id,
    });

    socket.on('playerJoined', handlePlayerJoin);
    socket.on('playerLeft', handlePlayerLeave);
    socket.on('advancePhase', handleAdvancePhase);
    socket.on('resetBoard', handleResetBoard);
    socket.on('actionRoll', handleActionRoll);
    socket.on('blockData', handleBlock);
    socket.on('encounterHistory', updateEncounterHistory);
    socket.on('updateEncounter', updateEncounter);
    socket.on('updateRollOptions', updateRollOptions);
    socket.on('rollInitiative', handleInitiativeRoll);
    socket.on('changeTarget', handleChangeTarget);
    socket.on('removeTarget', handleRemoveTarget);

    return () => {
      setEncounterLayout(false);

      socket.emit('leaveEncounter', {
        room: `encounter ${encounterId}`,
        playerId: user.id,
      });

      socket.off('playerJoined', handlePlayerJoin);
      socket.off('playerLeft', handlePlayerLeave);
      socket.off('advancePhase', handleAdvancePhase);
      socket.off('resetBoard', handleResetBoard);
      socket.off('actionRoll', handleActionRoll);
      socket.off('blockData', handleBlock);
      socket.off('encounterHistory', updateEncounterHistory);
      socket.off('updateEncounter', updateEncounter);
      socket.off('updateRollOptions', updateRollOptions);
      socket.off('rollInitiative', handleInitiativeRoll);
      socket.off('changeTarget', handleChangeTarget);
      socket.off('removeTarget', handleRemoveTarget);
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
