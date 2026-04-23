import { useMutation, useQueryClient } from '@tanstack/react-query';
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
      perkIds?: number[];
    }) => selectLevelUpBonus(characterId, bonus),

    onSuccess: (data) => {
      queryClient.setQueryData(['character', characterId], data.character);

      navigate('..');
    },
    throwOnError: false,
  });
};

export default useSelectLevelUpBonusMutation;
