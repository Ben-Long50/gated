import { useForm } from '@tanstack/react-form';
import { useContext, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { CampaignContext } from 'src/contexts/CampaignContext';
import { Action } from 'src/types/action';
import { Item } from 'src/types/item';
import useCombatQuery from './encounter hooks/useCombatQueries/useCombatQuery';
import { AuthContext } from 'src/contexts/AuthContext';
import useCharacter from './useCharacter';
import useResetCharacterStatMutation from './character stat hooks/useResetCharacterStatMutation/useResetCharacterStatMutation';
import { useQueryClient } from '@tanstack/react-query';
import { Character } from 'src/types/character';
import useCharacterStatHandlers from './character stat hooks/useCharacterStatMutation/useCharacterStatHandlers';
import useCombatStore from 'src/stores/combatStore';
import useAdvanceTurnMutation from './encounter hooks/useAdvanceTurnMutation/useAdvanceTurnMutation';
import useRollActionMutation from './encounter hooks/useRollActionMutation/useRollActionMutation';
import useRollReactionMutation from './encounter hooks/useRollReactionMutation/useRollReactionMutation';
import useRoll from './useRoll';
import calculateDiceCount from 'src/utils/calculateDiceCount';
import actionFuncs from 'src/utils/actionFuncs';
import { camelCase } from 'change-case';
import statColorMap from 'src/utils/statColorMap';
import { Target } from 'src/types/target';
import reactionFuncs from 'src/utils/reactionFuncs';
import { BlockData } from 'src/types/blockData';

const useCombat = () => {
  const { user } = useContext(AuthContext);
  const { gameMaster } = useContext(CampaignContext);
  const { campaignId, encounterId } = useParams();
  const queryClient = useQueryClient();

  const [targetMap, setTargetMap] = useState<Map<string, Target>>(
    () => new Map(),
  );

  const [blockDataMap, setBlockDataMap] = useState<Map<string, BlockData>>(
    () => new Map(),
  );

  const resetTargetMap = () => {
    setTargetMap(new Map());
  };

  const resetBlockDataMap = () => {
    setBlockDataMap(new Map());
  };

  const removeTarget = (key: string) => {
    setTargetMap((prev) => {
      const next = new Map(prev);
      next.delete(key);
      return next;
    });
  };

  const getTarget = (key: string) => {
    return targetMap.get(key);
  };

  const getBlockData = (key: string) => {
    return blockDataMap.get(key);
  };

  const setTarget = (key: string, value: Target) => {
    setTargetMap((prev) => {
      const next = new Map(prev);
      next.set(key, value);
      return next;
    });
  };

  const setBlockData = (key: string, value: BlockData) => {
    setBlockDataMap((prev) => {
      const next = new Map(prev);
      next.set(key, value);
      return next;
    });
  };

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
    if (combat?.phaseHistory[0] == null) {
      return;
    }

    const phaseAction = combat?.phaseHistory[0].action;
    const phaseReactions = combat?.phaseHistory[0].reactions || [];

    if (phaseAction && phaseAction.tile) {
      const target = {
        start: {
          ...phaseAction.tile.start,
          characterId: phaseAction.characterId,
        },
        end: { ...phaseAction.tile.end, targetId: phaseAction.targetId },
        distance: Math.round(
          Math.sqrt(
            (phaseAction.tile.end.col - phaseAction.tile.start.col) ** 2 +
              (phaseAction.tile.end.row - phaseAction.tile.start.row) ** 2,
          ),
        ),
        action: phaseAction.actionSnapshot.name,
        color: phaseAction.targetId ? statColorMap.DMG : statColorMap.SPD,
        occupied: null,
        inRange: null,
      };
      setTarget(`character ${phaseAction.characterId}`, target);
    }

    if (phaseReactions.length > 0) {
      for (const reaction of phaseReactions) {
        if (reaction.tile) {
          const target = {
            start: {
              ...reaction.tile.start,
              characterId: reaction.characterId,
            },
            end: { ...reaction.tile.end, targetId: phaseAction.targetId },
            distance: Math.round(
              Math.sqrt(
                (reaction.tile.end.col - reaction.tile.start.col) ** 2 +
                  (reaction.tile.end.row - reaction.tile.start.row) ** 2,
              ),
            ),
            action: reaction.actionSnapshot.name,
            color: statColorMap.MAG,
            occupied: null,
            inRange: null,
          };
          setTarget(`character ${reaction.characterId}`, target);
        }
      }
    }
  }, [combat?.phaseHistory]);

  useEffect(() => {
    if (isFetching && !encounterFetching) {
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
    number | null
  >(null);

  const { filteredCharacter: controlledCharacter } = useCharacter(
    controlledCharacterId,
  );

  useEffect(() => {
    if (!combat?.characters) return;

    let nextControlledCharacter: Character | undefined;

    if (gameMaster) {
      nextControlledCharacter = activeCharacter;
    } else {
      nextControlledCharacter = combat.characters.find(
        (character: Character) =>
          character.userId === user.id && character.playerCharacter,
      );
    }

    if (nextControlledCharacter?.id != null) {
      setControlledCharacterId(nextControlledCharacter.id);
    }
  }, [combat?.turnPosition, activeCharacter, gameMaster, user.id]);

  const setItem = useCombatStore((state) => state.setItem);

  const resetCharacterStat = useResetCharacterStatMutation();

  const encounterPermissions = useMemo(
    () => gameMaster || activeCharacter?.userId === user.id,
    [activeCharacter],
  );

  const actionPermissions =
    controlledCharacterId === activeCharacter?.id &&
    combat?.combatPhase === 'action';

  const reactionPermissions =
    controlledCharacterId &&
    combat?.reactions.includes(controlledCharacterId) &&
    combat.combatPhase === 'reaction';

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

    for (const characterId of combat?.turnOrder) {
      const character: Character | undefined = queryClient.getQueryData([
        'character',
        characterId,
      ]);

      if (!character) {
        continue;
      }

      if (
        characterId !== nextCharacterId &&
        character.stats.hands !== character.stats.currentHands
      ) {
        resetCharacterStat.mutate({
          characterId: character.id,
          stat: 'currentHands',
          value: character.stats.hands,
        });
        resetCharacterStat.mutate({
          characterId: character.id,
          stat: 'currentFeet',
          value: character.stats.feet,
        });
      }
    }

    if (
      nextCharacter &&
      (nextCharacter?.stats.actions !== nextCharacter?.stats.currentActions ||
        nextCharacter?.stats.reactions !==
          nextCharacter?.stats.currentReactions ||
        nextCharacter?.stats.hands !== nextCharacter?.stats.currentHands ||
        nextCharacter?.stats.feet !== nextCharacter?.stats.currentFeet)
    ) {
      resetCharacterStat.mutate({
        characterId: nextCharacter.id,
        stat: 'currentActions',
        value: nextCharacter.stats.actions,
      });
      resetCharacterStat.mutate({
        characterId: nextCharacter.id,
        stat: 'currentReactions',
        value: nextCharacter.stats.reactions,
      });
      resetCharacterStat.mutate({
        characterId: nextCharacter.id,
        stat: 'currentHands',
        value: nextCharacter.stats.hands,
      });
      resetCharacterStat.mutate({
        characterId: nextCharacter.id,
        stat: 'currentFeet',
        value: nextCharacter.stats.feet,
      });
    }

    advanceTurn.mutate();
  };

  const actionForm = useForm({
    defaultValues: {
      actionType: null as string | null,
      action: null as Action | null,
      item: null as Item | null,
      target: null as Character | null,
      modifiers: [] as string[],
      extraDice: null as number | null,
    },
    onSubmit: async ({ value }) => {
      const actionData = actionFuncs[`${camelCase(value.action.name)}`](
        value.action?.costs,
        activeCharacter,
        value.item,
      );
      const targetData = getTarget(`character ${activeCharacter?.id}`);

      const data = {
        activeCharacterId: activeCharacter?.id,
        actionId: value.action.id,
      };

      if (actionData.requirements.includes('tile')) {
        data.tile = {
          start: { row: targetData?.start.row, col: targetData?.start.col },
          end: { row: targetData?.end.row, col: targetData?.end.col },
        };
      }

      if (actionData.requirements.includes('target')) {
        data.targetCharacterId = value.target.id;
      }

      if (actionData.requirements.includes('item')) {
        data.itemId = value.item.id;
      }

      if (actionData.requirements.includes('roll')) {
        data.modifiers = value.modifiers;
        data.extraDice = value.extraDice || 0;
      }

      setIsFetching(true);

      rollAction.mutate(data);

      if (actionData.requirements.includes('roll')) {
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
    },
    validators: {
      onSubmit: ({ value }) => {
        const { requirements } = actionFuncs[`${camelCase(value.action.name)}`](
          value.action?.costs,
          activeCharacter,
          value.item,
        );

        const errors = [];

        if (!value.action) {
          errors.push('Select an Action');
        }
        if (requirements.includes('target') && !value.target) {
          errors.push('Select a Target');
        }
        if (requirements.includes('item') && !value.item) {
          errors.push('Select an Item');
        }
        if (
          requirements.includes('roll') &&
          (!value.action.roll || value.action?.roll.length === 0)
        ) {
          errors.push(
            'This action requires a roll but is not associated with one. An Admin must address this issue',
          );
        }
        if (requirements.includes('tile')) {
          const targetData = getTarget(`character ${activeCharacter?.id}`);
          const tile = targetData
            ? {
                start: {
                  row: targetData.start.row,
                  col: targetData.start.col,
                },
                end: { row: targetData.end.row, col: targetData.end.col },
              }
            : null;

          if (
            !tile ||
            !tile.start.row ||
            !tile.start.col ||
            !tile.end.row ||
            !tile.end.col
          ) {
            errors.push('Select a Tile');
          }
        }

        return errors.length > 0 ? errors.join(', ') : undefined;
      },
    },
  });

  const reactionForm = useForm({
    defaultValues: {
      reaction: null as Action | null,
      item: null as Item | null,
      target: null as Character | null,
      modifiers: [] as string[],
      extraDice: null as number | null,
    },

    onSubmit: async ({ value }) => {
      const reactionData = reactionFuncs[`${camelCase(value.reaction.name)}`](
        value.reaction?.costs,
        controlledCharacter,
        value.item,
      );
      const targetData = getTarget(`character ${controlledCharacter?.id}`);

      setIsFetching(true);

      const data = {
        activeCharacterId: controlledCharacter?.id,
        actionId: value.reaction.id,
      };

      if (reactionData.requirements.includes('tile')) {
        data.tile = {
          start: { row: targetData?.start.row, col: targetData?.start.col },
          end: { row: targetData?.end.row, col: targetData?.end.col },
        };
      }

      if (reactionData.requirements.includes('target')) {
        data.targetCharacterId = value.target.id;
      }

      if (reactionData.requirements.includes('item')) {
        data.itemId = value.item.id;
      }

      if (reactionData.requirements.includes('roll')) {
        data.modifiers = value.modifiers;
        data.extraDice = value.extraDice || 0;
      }

      setIsFetching(true);

      rollReaction.mutate(data);

      if (reactionData.requirements.includes('roll')) {
        const { diceCount } = calculateDiceCount(
          controlledCharacter?.attributes,
          value.reaction,
          value.modifiers,
          value.extraDice,
        );

        const loadingRollMap = new Map();

        loadingRollMap.set(controlledCharacter?.id, {
          diceArray: Array.from({ length: diceCount as number }).map((_) => 1),
          modifiers: ['loading'],
        });

        setRolls(loadingRollMap);
      }

      reactionForm.reset();
    },
    validators: {
      onSubmit: ({ value }) => {
        const { requirements } = reactionFuncs[
          `${camelCase(value.reaction.name)}`
        ](value.reaction?.costs, activeCharacter, value.item);

        const errors = [];

        if (!value.reaction) {
          errors.push('Select an Reaction');
        }
        if (requirements.includes('target') && !value.target) {
          errors.push('Select a Target');
        }
        if (requirements.includes('item') && !value.item) {
          errors.push('Select an Item');
        }
        if (
          requirements.includes('roll') &&
          (!value.reaction.roll || value.reaction?.roll.length === 0)
        ) {
          errors.push(
            'This action requires a roll but is not associated with one. An Admin must address this issue',
          );
        }
        if (requirements.includes('tile')) {
          const targetData = getTarget(`character ${activeCharacter?.id}`);
          const tile = targetData
            ? {
                start: {
                  row: targetData.start.row,
                  col: targetData.start.col,
                },
                end: { row: targetData.end.row, col: targetData.end.col },
              }
            : null;

          if (
            !tile ||
            !tile.start.row ||
            !tile.start.col ||
            !tile.end.row ||
            !tile.end.col
          ) {
            errors.push('Select a Tile');
          }
        }

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
