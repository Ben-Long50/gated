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
import calculateCosts from 'src/utils/calculateCosts';
import useAdvanceTurnMutation from './encounter hooks/useAdvanceTurnMutation/useAdvanceTurnMutation';
import useRollActionMutation from './encounter hooks/useRollActionMutation/useRollActionMutation';
import useRollReactionMutation from './encounter hooks/useRollReactionMutation/useRollReactionMutation';
import useRoll from './useRoll';
import calculateDiceCount from 'src/utils/calculateDiceCount';
import { socket } from 'src/socket';
import parsePhaseAction from 'src/utils/parsePhaseAction';
import actionFuncs from 'src/utils/actionFuncs';
import { camelCase } from 'change-case';
import { distance } from 'motion';
import statColorMap from 'src/utils/statColorMap';

const useCombat = () => {
  const { user } = useContext(AuthContext);
  const { gameMaster } = useContext(CampaignContext);
  const { campaignId, encounterId } = useParams();
  const queryClient = useQueryClient();

  const [targetMap, setTargetMap] = useState<
    Map<
      string,
      {
        start: { row: number; col: number; characterId?: number };
        end: { row: number; col: number; targetId?: number };
        distance: number;
        color: string;
        occupied: boolean | null;
        inRange: boolean | null;
      }
    >
  >(() => new Map());

  const resetTargetMap = () => {
    setTargetMap(new Map());
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

  const setTarget = (
    key: string,
    value: {
      start: { row: number; col: number; characterId?: number };
      end: { row: number; col: number; targetId?: number };
      distance: number;
      color: string;
      occupied: boolean | null;
      inRange: boolean | null;
    },
  ) => {
    setTargetMap((prev) => {
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

  const characterStatHandlers = useCharacterStatHandlers(controlledCharacterId);

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
        data.targetCharacterId = value.item.id;
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

  const blockPermissions = combat?.phaseHistory[0]
    ? gameMaster ||
      controlledCharacterId ===
        combat?.phaseHistory[0].action?.targetSnapshot?.id
    : gameMaster;

  const actionQueueResults = parsePhaseAction(combat?.phaseHistory[0]);

  const blockForm = useForm({
    defaultValues: {
      blockData:
        (actionQueueResults.damage || actionQueueResults.sanityDamage) &&
        actionQueueResults.resultingInstances
          ? Array.from(
              { length: actionQueueResults.resultingInstances },
              () => ({
                blockedDamage: 0,
                blockedSanityDamage: 0,
                armorIds: [] as number[],
              }),
            )
          : [],
    },
    onSubmit: ({ value }) => {
      socket.emit('blockData', {
        encounterId: Number(encounterId),
        blockData: value.blockData,
      });
    },
  });

  const resetForms = () => {
    actionForm.reset();
    reactionForm.reset();
    blockForm.reset();
  };

  return {
    combat,
    targetMap,
    resetTargetMap,
    removeTarget,
    setTarget,
    getTarget,
    encounterPermissions,
    actionPermissions,
    reactionPermissions,
    blockPermissions,
    controlledCharacter,
    controlledCharacterId,
    setControlledCharacterId,
    activeCharacter,
    handleAdvanceTurn,
    actionForm,
    reactionForm,
    blockForm,
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
