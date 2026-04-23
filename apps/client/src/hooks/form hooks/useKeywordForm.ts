import { useForm } from '@tanstack/react-form';
import { UseMutationResult } from '@tanstack/react-query';
import { Keyword } from 'src/types/keyword';

const useKeywordForm = (
  mutation: UseMutationResult<any, Error, any>,
  keyword?: Keyword,
) => {
  const keywordForm = useForm({
    defaultValues: {
      id: keyword?.id ?? null,
      name: keyword?.name ?? '',
      description: keyword?.description ?? '',
      keywordType: keyword?.keywordType ?? '',
      gpCost: keyword?.gpCost ?? null,
    },
    onSubmit: async ({ value }) => {
      await mutation.mutate(value);
    },
  });

  return keywordForm;
};

export default useKeywordForm;
