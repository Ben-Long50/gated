import { useMutation, useQueryClient } from '@tanstack/react-query';
import { socket } from 'src/socket';
import { Character } from 'src/types/character';
import selectLevelUpBonus from './selectLevelUpBonus';
import { AttributeTree } from 'src/types/attributeTree';
import { Perk } from 'src/types/perk';
import { useNavigate } from 'react-router-dom';

const useSelectLevelUpBonusMutation = (characterId: number) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (bonus: {
      level: number;
      attributes?: AttributeTree;
      perks?: Perk[];
    }) => selectLevelUpBonus(characterId, bonus),

    onSuccess: () => {
      const character = queryClient.getQueryData([
        'character',
        characterId,
      ]) as Character;

      navigate('..');

      if (character) {
        socket.emit('character', {
          characterId,
          campaignId: character.campaignId,
        });
        return queryClient.invalidateQueries({
          queryKey: ['character', characterId],
        });
      } else {
        return;
      }
    },
    throwOnError: false,
  });
};

export default useSelectLevelUpBonusMutation;
