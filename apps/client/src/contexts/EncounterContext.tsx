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
import useRoll from 'src/hooks/useRoll';
import useCombatStore from 'src/stores/combatStore';
import useCombat from 'src/hooks/useCombat';

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
    encounterPermissions,
    controlledCharacterId,
    setControlledCharacterId,
    activeCharacter,
    handleAdvanceTurn,
    actionForm,
    reactionForm,
    isLoading: combatLoading,
  } = useCombat();

  const { rolls, rolling, animateRoll, resetRolls, rollComplete, rollCounter } =
    useRoll();

  const setTarget = useCombatStore((state) => state.setTarget);

  useEffect(() => {
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

    socket.on('actionRoll', ({ encounterId, rollsArray, targetId }) => {
      setTarget(targetId);

      const rolls = new Map(rollsArray) as Map<number, any>;

      animateRoll(rolls);

      setTimeout(() => {
        queryClient.invalidateQueries({
          queryKey: ['encounter', encounterId],
        });
        queryClient.invalidateQueries({
          queryKey: ['encounterHistory', encounterId],
        });
      }, 3000);
    });

    socket.on('reactionRoll', async ({ encounterId, rollsArray, targetId }) => {
      if (targetId) {
        // setTarget(targetId);
      }

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

    socket.on('navigateToEncounter', ({ encounterId, mapId, campaignId }) => {
      navigate(
        `glam/campaigns/${campaignId}/maps/${mapId}/encounters/${encounterId}`,
      );
    });

    return () => {
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
        joinedPlayers,
        encounterPermissions,
        controlledCharacterId,
        setControlledCharacterId,
        activeCharacter,
        handleAdvanceTurn,
        actionForm,
        reactionForm,
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
