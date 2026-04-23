import { useForm } from '@tanstack/react-form';
import { UseMutationResult, useQueryClient } from '@tanstack/react-query';
import { Character } from 'src/types/character';
import validateLevelUpBonus from 'src/utils/validateLevelUpBonus';
import { filterFormData } from './constructFormData';

const useLevelBonusForm = (
  mutation: UseMutationResult<any, Error, any>,
  level: number,
  character?: Character,
) => {
  const queryClient = useQueryClient();

  const levelBonusForm = useForm({
    defaultValues: {
      level: Number(level),
      attributes: character?.attributes,
      perkIds: character?.perks ? character?.perks.map((perk) => perk.id) : [],
    },
    onSubmit: ({ value }) => {
      const filteredData = filterFormData(value);

      mutation.mutate(filteredData);
    },
    validators: {
      onSubmit: ({ value }) => {
        const perks = value.perkIds
          ?.map((id) => queryClient.getQueryData(['perk', id]))
          .filter((perk) => perk);

        const validationData = validateLevelUpBonus({
          level: value.level,
          attributes: value.attributes,
          perks,
        });

        if (!validationData.validated) {
          return `Adjust your bonus selection by the following values: ${validationData.errors.join(', ')}`;
        }
      },
    },
  });

  return levelBonusForm;
};

export default useLevelBonusForm;
