import { useMutation, useQueryClient } from '@tanstack/react-query';
import selectLevelUpBonus from './selectLevelUpBonus';
import { AttributeTree } from 'src/types/attributeTree';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const useSelectLevelUpBonusMutation = (characterId: number) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (bonus: {
      level: number | null;
      attributes?: AttributeTree;
      perkId?: number;
    }) => selectLevelUpBonus(characterId, bonus),

    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.setQueryData(['character', characterId], data.character);

      navigate(-1);
    },
    onError: (data) => {
      toast.error(data.message);
    },
    throwOnError: false,
  });
};

export default useSelectLevelUpBonusMutation;
