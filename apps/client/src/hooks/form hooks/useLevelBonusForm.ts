import { useForm } from '@tanstack/react-form';
import { UseMutationResult } from '@tanstack/react-query';
import { filterFormData } from './constructFormData';
import emptyAttributeTree from 'src/utils/constants/emptyAttributeTree';

const useLevelBonusForm = (
  mutation: UseMutationResult<any, Error, any>,
  level: number,
) => {
  const levelBonusForm = useForm({
    defaultValues: {
      level: Number(level),
      attributes: emptyAttributeTree,
      perkIds: [],
    },
    onSubmit: ({ value }) => {
      const filteredData = filterFormData(value);

      mutation.mutate(filteredData);
    },
  });

  return levelBonusForm;
};

export default useLevelBonusForm;
