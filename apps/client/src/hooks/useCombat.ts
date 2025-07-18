import { camelCase } from 'change-case';
import { useContext } from 'react';
import { CampaignContext } from 'src/contexts/CampaignContext';
import useCombatStore from 'src/stores/combatStore';
import { Action } from 'src/types/action';
import { Item } from 'src/types/item';

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

  const calculateDamage = (item: Item, action: Action, successes: number) => {
    if (
      (camelCase(action.name) === 'salvoFire' ||
        camelCase(action.name) === 'flurry') &&
      successes > 0
    ) {
      const maxSuccesses = item.stats.salvo || item.stats.flurry || 0;
      if (successes < maxSuccesses) {
        return successes * item.stats.damage;
      } else {
        return maxSuccesses * item.stats.damage;
      }
    } else if (
      action &&
      camelCase(action.name) === 'haymaker' &&
      successes > 0
    ) {
      return item.keywords.some((keyword) => keyword.keyword.name === '2H')
        ? item.stats.damage + 3
        : item.stats.damage + 2;
    } else if (successes > 0) {
      return item.stats.damage;
    } else {
      return 0;
    }
  };

  return {
    advanceTurn,
    calculateDamage,
  };
};

export default useCombat;
