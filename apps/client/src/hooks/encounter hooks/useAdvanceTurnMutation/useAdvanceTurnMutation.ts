import { useMutation, useQueryClient } from '@tanstack/react-query';
import advanceTurn from './advanceTurn';
import { Encounter } from 'src/types/encounter';
import { Character } from 'src/types/character';
import { Item } from 'src/types/item';

const useAdvanceTurnMutation = (campaignId: number, encounterId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => {
      return advanceTurn(campaignId, encounterId);
    },
    onMutate: () => {
      const prevEncounter: Encounter | undefined = queryClient.getQueryData([
        'encounter',
        encounterId,
      ]);

      if (!prevEncounter) {
        return;
      }

      const newRound =
        prevEncounter.turnPosition + 1 >= prevEncounter.turnOrder.length;

      const nextCharacterId = newRound
        ? prevEncounter.turnOrder[0]
        : prevEncounter.turnOrder[prevEncounter.turnPosition + 1];

      const prevCharacter: Character | undefined = queryClient.getQueryData([
        'character',
        nextCharacterId,
      ]);

      Object.values(prevCharacter.equipment).forEach((items: Item[]) => {
        items.forEach((item) => {
          queryClient.setQueryData(['item', item.id], {
            ...item,
            available: true,
          });
        });
      });

      queryClient.setQueryData(
        ['character', nextCharacterId],
        (prev: Character) => ({
          ...prev,
          stats: {
            ...prev.stats,
            currentHands: prev.stats.hands,
            currentActions: prev.stats.actions,
            currentReactions: prev.stats.reactions,
          },
        }),
      );

      const data = {
        turn: prevEncounter.turn + 1,
        turnPosition: newRound ? 0 : prevEncounter.turnPosition + 1,
        combatPhase: 'action',
        reactions: [],
        passes: [],
      } as any;

      queryClient.setQueryData(
        ['encounter', encounterId],
        (prev: Encounter) => ({
          ...prev,
          ...data,
        }),
      );

      return prevEncounter;
    },
    throwOnError: false,
  });
};

export default useAdvanceTurnMutation;
