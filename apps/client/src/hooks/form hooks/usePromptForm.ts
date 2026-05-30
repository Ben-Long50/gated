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
      height: '',
      age: '',
      sex: character.sex ?? '',
      hair: '',
      build: '',
      outfit: '',
      augmentation: '',
      weapon: '',
      pose: '',
      pictureCount: 1,
    },
    onSubmit: async ({ value }) => {
      value = { ...value, sex: character.sex };

      await mutation.mutate(value);
    },
  });

  return promptForm;
};

export default usePromptForm;
