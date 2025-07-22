import { useForm } from '@tanstack/react-form';
import { camelCase } from 'change-case';
import { useContext, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { CampaignContext } from 'src/contexts/CampaignContext';
import useCombatStore from 'src/stores/combatStore';
import { Action } from 'src/types/action';
import { Item } from 'src/types/item';
import useCreateCombatMutation from './combat hooks/useCreateCombatMutation/useCreateCombatMutation';
import useCombatQuery from './combat hooks/useCombatQueries/useCombatQuery';
import useMap from './useMap';
import useCharacterQuery from './useCharacterQuery/useCharacterQuery';
import useAdvanceTurnMutation from './combat hooks/useAdvanceTurnMutation/useAdvanceTurnMutation';
import { AuthContext } from 'src/contexts/AuthContext';
import useCharacter from './useCharacter';
import useResetCharacterStatMutation from './character stat hooks/useResetCharacterStatMutation/useCharacterStatMutation';
import { useQueryClient } from '@tanstack/react-query';
import { Character } from 'src/types/character';

const useCombat = () => {
  const { user } = useContext(AuthContext);
  const { gameMaster } = useContext(CampaignContext);
  const { campaignId, mapId, encounterId } = useParams();
  const queryClient = useQueryClient();

  const { locations } = useMap();

  const { data: combat, isLoading } = useCombatQuery(Number(encounterId));

  const { filteredCharacter: activeCharacter } = useCharacter(
    combat?.turnOrder[combat?.turnPosition],
  );

  const { data: ownedCharacter } = useCharacterQuery(
    combat?.characters.find((character) => character.userId === user.id).id,
  );

  const resetCharacterStat = useResetCharacterStatMutation();

  const encounterPermissions = useMemo(
    () => gameMaster || activeCharacter?.userId === user.id,
    [activeCharacter],
  );

  const createCombat = useCreateCombatMutation(
    Number(campaignId),
    Number(mapId),
  );

  const advanceTurn = useAdvanceTurnMutation(
    Number(campaignId),
    Number(encounterId),
  );

  const combatForm = useForm({
    defaultValues: {
      turnOrder:
        combat?.turnOrder || locations?.map((location) => location.characterId),
      turnPosition: 0,
    },
    onSubmit: ({ value }) => {
      console.log(value);
      createCombat.mutate(value);
    },
  });

  const handleAdvanceTurn = () => {
    if (!encounterPermissions) return;
    const currentIndex = combat.turnOrder.findIndex(
      (characterId) => characterId === activeCharacter?.id,
    );

    if (currentIndex === combat.turnOrder.length - 1) {
      const nextCharacter = queryClient.getQueryData([
        'character',
        combat.turnOrder[0],
      ]) as Character;

      resetCharacterStat.mutate({
        characterId: combat.turnOrder[0],
        value: {
          currentActions: nextCharacter?.stats.actions || 0,
          currentReactions: nextCharacter?.stats.reactions || 0,
        },
      }),
        advanceTurn.mutate(0);
    } else {
      const nextCharacter = queryClient.getQueryData([
        'character',
        combat.turnOrder[currentIndex + 1],
      ]) as Character;

      resetCharacterStat.mutate({
        characterId: combat.turnOrder[currentIndex + 1],
        value: {
          currentActions: nextCharacter?.stats.actions || 0,
          currentReactions: nextCharacter?.stats.reactions || 0,
        },
      }),
        advanceTurn.mutate(0);
      advanceTurn.mutate(currentIndex + 1);
    }
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
    combat,
    encounterPermissions,
    ownedCharacter,
    activeCharacter,
    handleAdvanceTurn,
    calculateDamage,
    combatForm,
    isLoading,
  };
};

export default useCombat;
