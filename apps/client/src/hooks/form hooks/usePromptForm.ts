import { useForm } from '@tanstack/react-form';
import { UseMutationResult } from '@tanstack/react-query';
import { filterFormData } from './constructFormData';

const usePromptForm = (mutation: UseMutationResult<any, Error, any>) => {
  const promptForm = useForm({
    defaultValues: {
      setting: '',
      time: 'daytime',
      description: '',
      pictureCount: 1,
    },
    onSubmit: async ({ value }) => {
      const filteredData = filterFormData(value);

      await mutation.mutate(filteredData);
    },
  });

  return promptForm;
};

export default usePromptForm;
