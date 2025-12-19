import { useForm } from '@tanstack/react-form';
import { useContext, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { CampaignContext } from 'src/contexts/CampaignContext';
import { Action } from 'src/types/action';
import { Item } from 'src/types/item';
import useCombatQuery from './encounter hooks/useCombatQueries/useCombatQuery';
import { AuthContext } from 'src/contexts/AuthContext';
import useCharacter from './useCharacter';
import useResetCharacterStatMutation from './character stat hooks/useResetCharacterStatMutation/useCharacterStatMutation';
import { useQueryClient } from '@tanstack/react-query';
import { Character } from 'src/types/character';
import useCharacterStatHandlers from './character stat hooks/useCharacterStatMutation/useCharacterStatHandlers';
import useUpdateCharacterLocationMutation from './useUpdateCharacterLocationMutation/useUpdateCharacterLocationMutation';
import useCombatStore from 'src/stores/combatStore';
import calculateCosts from 'src/utils/calculateCosts';
import useAdvanceTurnMutation from './encounter hooks/useAdvanceTurnMutation/useAdvanceTurnMutation';
import useRollActionMutation from './encounter hooks/useRollActionMutation/useRollActionMutation';
import useRollReactionMutation from './encounter hooks/useRollReactionMutation/useRollReactionMutation';
import useRoll from './useRoll';
import calculateDiceCount from 'src/utils/calculateDiceCount';

const useCombat = () => {
  const { user } = useContext(AuthContext);
  const { gameMaster } = useContext(CampaignContext);
  const { campaignId, mapId, encounterId } = useParams();
  const queryClient = useQueryClient();

  const [isFetching, setIsFetching] = useState(false);

  const {
    rolls,
    setRolls,
    rolling,
    animateRoll,
    resetRolls,
    rollComplete,
    rollCounter,
  } = useRoll();

  const {
    data: combat,
    isLoading,
    isPending,
    isFetching: encounterFetching,
  } = useCombatQuery(Number(encounterId));

  useEffect(() => {
    if (isFetching && !encounterFetching) {
      console.log(isFetching);

      setIsFetching(false);
    }
  }, [encounterFetching]);

  const advanceTurn = useAdvanceTurnMutation(
    Number(campaignId),
    Number(encounterId),
  );
  const rollAction = useRollActionMutation(
    Number(campaignId),
    Number(encounterId),
  );
  const rollReaction = useRollReactionMutation(
    Number(campaignId),
    Number(encounterId),
  );

  const { filteredCharacter: activeCharacter } = useCharacter(
    combat?.turnOrder[combat?.turnPosition],
  );

  const [controlledCharacterId, setControlledCharacterId] = useState<
    number | undefined
  >(undefined);

  useEffect(() => {
    if (combat?.characters) {
      setControlledCharacterId(
        gameMaster
          ? activeCharacter?.id
          : combat?.characters.find(
              (character: Character) =>
                character.userId === user.id && character.playerCharacter,
            )?.id,
      );
    }
  }, [combat?.characters]);

  const { filteredCharacter: controlledCharacter } = useCharacter(
    controlledCharacterId,
  );

  useEffect(() => {
    if (gameMaster) {
      setControlledCharacterId(combat?.turnOrder[combat?.turnPosition]);
    }
  }, [combat?.turnPosition]);

  const setItem = useCombatStore((state) => state.setItem);

  const resetCharacterStat = useResetCharacterStatMutation();

  const encounterPermissions = useMemo(
    () => gameMaster || activeCharacter?.userId === user.id,
    [activeCharacter],
  );

  const characterStatHandlers = useCharacterStatHandlers(controlledCharacterId);

  const updateCharacterLocation = useUpdateCharacterLocationMutation(
    Number(mapId),
  );

  const handleAdvanceTurn = () => {
    if (!encounterPermissions) return;

    const newRound = combat.turnPosition + 1 >= combat.turnOrder.length;

    const nextCharacterId = newRound
      ? combat.turnOrder[0]
      : combat.turnOrder[combat.turnPosition + 1];

    const nextCharacter: Character | undefined = queryClient.getQueryData([
      'character',
      nextCharacterId,
    ]);

    if (
      nextCharacter?.stats.actions !== nextCharacter?.stats.currentActions ||
      nextCharacter?.stats.reactions !==
        nextCharacter?.stats.currentReactions ||
      nextCharacter?.stats.hands !== nextCharacter?.stats.currentHands
    ) {
      resetCharacterStat.mutate({
        characterId: nextCharacterId,
        value: {
          currentActions: nextCharacter?.stats.actions || 0,
          currentReactions: nextCharacter?.stats.reactions || 0,
          currentHands: nextCharacter?.stats.hands || 0,
        },
      });
    }

    advanceTurn.mutate();
  };

  const actionForm = useForm({
    defaultValues: {
      actionType: null as string | null,
      action: null as Action | null,
      locationId: null as number | null,
      row: null as number | null,
      col: null as number | null,
      item: null as Item | null,
      target: null as Character | null,
      modifiers: [] as string[],
      extraDice: null as number | null,
    },
    onSubmit: async ({ value }) => {
      setIsFetching(true);

      const data = {
        activeCharacterId: activeCharacter.id,
        actionId: value.action.id,
      };

      if (value.target) {
        data.targetCharacterId = value.target.id;
      }

      if (value.item) {
        data.itemId = value.item.id;
      }

      if (value.action?.roll) {
        data.modifiers = value.modifiers;
      }

      if (value.extraDice) {
        data.extraDice = value.extraDice;
      }

      if (
        value.action?.actionSubtypes.includes('movement') &&
        activeCharacter &&
        value.locationId &&
        value.row &&
        value.col
      ) {
        updateCharacterLocation.mutate({
          characterId: activeCharacter?.id,
          locationId: Number(value.locationId),
          row: value.row,
          col: value.col,
        });
      }

      rollAction.mutate(data);

      if (value.action) {
        const { diceCount } = calculateDiceCount(
          activeCharacter?.attributes,
          value.action,
          value.modifiers,
          value.extraDice,
        );

        const loadingRollMap = new Map();

        loadingRollMap.set(activeCharacter?.id, {
          diceArray: Array.from({ length: diceCount as number }).map((_) => 1),
          modifiers: ['loading'],
        });

        setRolls(loadingRollMap);
      }

      actionForm.reset();
      setItem(null);
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
      row: null as number | null,
      col: null as number | null,
      item: null as Item | null,
      target: null as Character | null,
      modifiers: [] as string[],
      extraDice: null as number | null,
    },

    onSubmit: async ({ value }) => {
      setIsFetching(true);

      if (controlledCharacter?.stats.currentReactions === 0) {
        alert('You do not have any more reactions this turn');
        return;
      }

      const data = {
        reactiveCharacterId: controlledCharacter.id,
        reactionId: value.reaction.id,
      };

      if (value.target) {
        data.targetCharacterId = value.target.id;
      }

      if (value.item) {
        data.itemId = value.item.id;
      }

      if (value.reaction?.roll) {
        data.modifiers = value.modifiers;
      }

      if (value.extraDice) {
        data.extraDice = value.extraDice;
      }

      rollReaction.mutate(data);

      if (value.reaction) {
        const { diceCount } = calculateDiceCount(
          activeCharacter?.attributes,
          value.reaction,
          value.modifiers,
          value.extraDice,
        );

        const loadingRollMap = new Map();

        loadingRollMap.set(activeCharacter?.id, {
          diceArray: Array.from({ length: diceCount as number }).map((_) => 1),
          modifiers: ['loading'],
        });

        setRolls(loadingRollMap);
      }

      reactionForm.reset();
      setItem(null);

      if (value.reaction?.costs.currentReactions) {
        characterStatHandlers.handleCurrentReactions(
          value.reaction?.costs.currentReactions * -1,
        );
      }
    },
    validators: {
      onSubmit: ({ value }) => {
        const { errors } = calculateCosts(
          controlledCharacter,
          value.reaction,
          value.item,
        );

        return errors.length > 0 ? errors.join(', ') : undefined;
      },
    },
  });

  const resetForms = () => {
    actionForm.reset();
    reactionForm.reset();
  };

  return {
    combat,
    encounterPermissions,
    controlledCharacterId,
    setControlledCharacterId,
    activeCharacter,
    handleAdvanceTurn,
    actionForm,
    reactionForm,
    resetForms,
    isLoading,
    isPending,
    isFetching,
    setIsFetching,
    rollHookValues: {
      rolls,
      rolling,
      animateRoll,
      resetRolls,
      rollComplete,
      rollCounter,
    },
  };
};

export default useCombat;
