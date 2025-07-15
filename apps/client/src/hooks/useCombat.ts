import { useContext } from 'react';
import { CampaignContext } from 'src/contexts/CampaignContext';
import useCombatStore from 'src/stores/combatStore';

const useCombat = () => {
  const { gameMaster } = useContext(CampaignContext);

  const activeCharacter = useCombatStore((state) => state.activeCharacter);
  const setActiveCharacter = useCombatStore(
    (state) => state.setActiveCharacter,
  );
  const turnOrder = useCombatStore((state) => state.turnOrder);
  const setTurnOrder = useCombatStore((state) => state.setTurnOrder);
  const setUserCharacter = useCombatStore((state) => state.setUserCharacter);

  const advanceTurn = () => {
    if (!activeCharacter) {
      setActiveCharacter(turnOrder[0]);
      if (gameMaster) {
        setUserCharacter(turnOrder[0]);
      }
      return;
    }
    const currentIndex = turnOrder.findIndex(
      (characterId) => characterId === activeCharacter,
    );
    setActiveCharacter(
      turnOrder[currentIndex + 1] ? turnOrder[currentIndex + 1] : turnOrder[0],
    );
    if (gameMaster) {
      setUserCharacter(
        turnOrder[currentIndex + 1]
          ? turnOrder[currentIndex + 1]
          : turnOrder[0],
      );
    }

    const newOrder = [...turnOrder];
    const currentActive = newOrder.shift();

    setTurnOrder([...newOrder, currentActive]);
  };

  return {
    advanceTurn,
  };
};

export default useCombat;
