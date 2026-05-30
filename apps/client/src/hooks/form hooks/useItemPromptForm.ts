import { useForm } from '@tanstack/react-form';
import { UseMutationResult } from '@tanstack/react-query';

const useItemPromptForm = (mutation: UseMutationResult<any, Error, any>) => {
  const promptForm = useForm({
    defaultValues: {
      setting: '',
      time: 'daytime',
      itemDescription: '',
      itemArrangement: '',
      pictureCount: 1,
    },
    onSubmit: async ({ value }) => {
      await mutation.mutate(value);
    },
  });

  return promptForm;
};

export default useItemPromptForm;
