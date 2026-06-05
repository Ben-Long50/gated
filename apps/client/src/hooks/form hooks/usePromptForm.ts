import { useForm } from '@tanstack/react-form';
import { UseMutationResult } from '@tanstack/react-query';

const usePromptForm = (mutation: UseMutationResult<any, Error, any>) => {
  const promptForm = useForm({
    defaultValues: {
      setting: '',
      time: 'daytime',
      description: '',
      pictureCount: 1,
    },
    onSubmit: async ({ value }) => {
      await mutation.mutate(value);
    },
  });

  return promptForm;
};

export default usePromptForm;
