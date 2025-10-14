import { useForm } from '@tanstack/react-form';
import { camelCase } from 'change-case';
import { useContext, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { CampaignContext } from 'src/contexts/CampaignContext';
import { Action } from 'src/types/action';
import { Item } from 'src/types/item';
import useCombatQuery from './combat hooks/useCombatQueries/useCombatQuery';
import useCharacterQuery from './useCharacterQuery/useCharacterQuery';
import useAdvanceTurnMutation from './combat hooks/useAdvanceTurnMutation/useAdvanceTurnMutation';
import { AuthContext } from 'src/contexts/AuthContext';
import useCharacter from './useCharacter';
import useResetCharacterStatMutation from './character stat hooks/useResetCharacterStatMutation/useCharacterStatMutation';
import { useQueryClient } from '@tanstack/react-query';
import { Character } from 'src/types/character';
import { socket } from 'src/socket';
import useCharacterStatHandlers from './character stat hooks/useCharacterStatMutation/useCharacterStatHandlers';
import useUpdateCharacterLocationMutation from './useUpdateCharacterLocationMutation/useUpdateCharacterLocationMutation';
import useCombatStore from 'src/stores/combatStore';
import calculateCosts from 'src/utils/calculateCosts';

const useCombat = () => {
  const { user } = useContext(AuthContext);
  const { gameMaster, calculateRoll } = useContext(CampaignContext);
  const { campaignId, mapId, encounterId } = useParams();
  const queryClient = useQueryClient();

  const { data: combat, isLoading } = useCombatQuery(Number(encounterId));

  const setItem = useCombatStore((state) => state.setItem);

  const { filteredCharacter: activeCharacter } = useCharacter(
    combat?.turnOrder[combat?.turnPosition],
  );

  const { data: ownedCharacter } = useCharacterQuery(
    combat?.characters.find((character) => character.userId === user.id)?.id,
  );

  const resetCharacterStat = useResetCharacterStatMutation();

  const encounterPermissions = useMemo(
    () => gameMaster || activeCharacter?.userId === user.id,
    [activeCharacter],
  );

  const advanceTurn = useAdvanceTurnMutation(
    Number(campaignId),
    Number(encounterId),
  );

  const characterStatHandlers = useCharacterStatHandlers(
    gameMaster ? activeCharacter?.id : ownedCharacter?.id,
  );

  const updateCharacterLocation = useUpdateCharacterLocationMutation(
    Number(mapId),
  );

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

      (resetCharacterStat.mutate({
        characterId: combat.turnOrder[0],
        value: {
          currentActions: nextCharacter?.stats.actions || 0,
          currentReactions: nextCharacter?.stats.reactions || 0,
          currentHands: nextCharacter?.stats.hands || 0,
        },
      }),
        advanceTurn.mutate(0));
    } else {
      const nextCharacter = queryClient.getQueryData([
        'character',
        combat.turnOrder[currentIndex + 1],
      ]) as Character;

      (resetCharacterStat.mutate({
        characterId: combat.turnOrder[currentIndex + 1],
        value: {
          currentActions: nextCharacter?.stats.actions || 0,
          currentReactions: nextCharacter?.stats.reactions || 0,
          currentHands: nextCharacter?.stats.hands || 0,
        },
      }),
        advanceTurn.mutate(currentIndex + 1));
    }
  };

  const actionForm = useForm({
    defaultValues: {
      actionType: null as string | null,
      action: null as Action | null,
      locationId: null as number | null,
      index: null as number | null,
      item: null as Item | null,
      target: null as Character | null,
      modifiers: [] as string[],
    },
    onSubmit: async ({ value }) => {
      if (
        value.action?.actionSubtypes.includes('movement') &&
        activeCharacter &&
        value.locationId &&
        value.index
      ) {
        updateCharacterLocation.mutate({
          characterId: activeCharacter?.id,
          locationId: Number(value.locationId),
          index: value.index,
        });

        if (value.action?.costs.currentActions) {
          characterStatHandlers.handleCurrentActions(
            value.action?.costs.currentActions * -1,
          );
        }
      } else {
        socket.emit('actionRoll', {
          campaignId: Number(campaignId),
          encounterId: Number(encounterId),
          activeCharacter: activeCharacter,
          targetCharacter: value.target,
          action: value.action,
          modifiers: value.modifiers,
          item: value.item,
        });

        actionForm.reset();
        setItem(null);
      }
    },
    validators: {
      onSubmit: ({ value }) => {
        const { errors } = calculateCosts(
          activeCharacter,
          value.action,
          value.item,
        );

        return errors.length > 0 ? errors.join(', ') : undefined;
      },
    },
  });

  const reactionForm = useForm({
    defaultValues: {
      reactionType: null as string | null,
      reaction: null as Action | null,
      locationId: null as number | null,
      index: null as number | null,
      item: null as Item | null,
      target: null as Character | null,
      modifiers: [] as string[],
    },

    onSubmit: async ({ value }) => {
      if (ownedCharacter?.stats.currentReactions === 0) {
        alert('You do not have any more reactions this turn');
        return;
      }

      if (
        value.reaction?.actionSubtypes.includes('movement') &&
        value.locationId
      ) {
        updateCharacterLocation.mutate({
          characterId: ownedCharacter?.id,
          locationId: Number(value.locationId),
          index: value.index,
        });
      } else {
        const rollResult = calculateRoll(
          ownedCharacter?.attributes,
          value.reaction,
          value.modifiers,
        );

        socket.emit('reactionRoll', {
          campaignId: Number(campaignId),
          encounterId: Number(encounterId),
          reactiveCharacter: ownedCharacter,
          targetCharacter: value.target,
          reaction: value.reaction,
          item: value.item,
          rollResult: { ...rollResult, modifiers: value.modifiers },
        });

        reactionForm.reset();
        setItem(null);
      }
      if (value.reaction?.costs.currentReactions) {
        characterStatHandlers.handleCurrentReactions(
          value.reaction?.costs.currentReactions * -1,
        );
      }
    },
    validators: {
      onSubmit: ({ value }) => {
        const { errors } = calculateCosts(
          ownedCharacter,
          value.reaction,
          value.item,
        );

        return errors.length > 0 ? errors.join(', ') : undefined;
      },
    },
  });

  return {
    combat,
    encounterPermissions,
    ownedCharacter,
    activeCharacter,
    handleAdvanceTurn,
    actionForm,
    reactionForm,
    isLoading,
  };
};

export default useCombat;
