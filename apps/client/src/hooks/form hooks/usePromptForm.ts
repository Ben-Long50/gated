import { useForm } from '@tanstack/react-form';
import { UseMutationResult } from '@tanstack/react-query';
import { Character } from 'src/types/character';

const usePromptForm = (
  mutation: UseMutationResult<any, Error, any>,
  character: Partial<Character>,
) => {
  const promptForm = useForm({
    defaultValues: {
      setting: '',
      time: 'daytime',
      height: character.height ?? (null as number | null),
      weight: character.weight ?? (null as number | null),
      age: character.age ?? (null as number | null),
      sex: character.sex ?? '',
      hair: '',
      build: '',
      outfit: '',
      cybernetics: '',
      weapons: '',
      pose: '',
      pictureCount: 1,
    },
    onSubmit: async ({ value }) => {
      await mutation.mutate(value);
    },
  });

  return promptForm;
};

export default usePromptForm;
