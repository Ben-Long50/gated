import { useMutation, useQueryClient } from '@tanstack/react-query';
import createCharacterCondition from './createCharacterCondition';
import { Character } from 'src/types/character';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import useModalStore from 'src/stores/modalStore';

const useCreateCharacterConditionMutation = (characterId: number) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const backgroundPath = useModalStore((state) => state.backgroundPath);

  return useMutation({
    mutationFn: (
      formData: { conditionId: number; stacks: number | null }[],
    ) => {
      console.log(formData);

      return createCharacterCondition(characterId, formData);
    },

    onMutate: (formData) => {
      queryClient.cancelQueries({ queryKey: ['character', characterId] });

      const prevCharacterData: Character | undefined = queryClient.getQueryData(
        ['character', characterId],
      );

      const conditionData = formData
        .map((condition) => ({
          condition: queryClient.getQueryData([
            'condition',
            condition.conditionId,
          ]),
          stacks: condition.stacks,
          characterId,
        }))
        .sort((a, b) => a.condition.name.localeCompare(b.condition.name));

      queryClient.setQueryData(
        ['character', characterId],
        (prev: Character) => ({
          ...prev,
          conditions: conditionData,
        }),
      );

      return { prevCharacterData };
    },

    onSuccess: (data) => {
      toast.success(data.message);

      queryClient.setQueryData(
        ['character', data.character.id],
        data.character,
      );

      if (backgroundPath) {
        navigate(backgroundPath, { replace: true });
      }
    },
    onError: (data) => {
      toast.error(data.message);
    },

    throwOnError: false,
  });
};

export default useCreateCharacterConditionMutation;
