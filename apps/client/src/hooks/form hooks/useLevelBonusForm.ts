import { useForm } from '@tanstack/react-form';
import { UseMutationResult } from '@tanstack/react-query';
import { filterFormData } from './constructFormData';
import emptyAttributeTree from 'src/utils/constants/emptyAttributeTree';
import { Character } from 'src/types/character';

const useLevelBonusForm = (
  mutation: UseMutationResult<any, Error, any>,
  level: number,
  character: Character,
) => {
  const levelBonusForm = useForm({
    defaultValues: {
      level,
      attributes: character.playerCharacter
        ? emptyAttributeTree
        : character.attributes,
      perkIds: character.playerCharacter
        ? []
        : character.perks.map((perk) => perk.basePerkId),
    },
    onSubmit: ({ value }) => {
      const filteredData = filterFormData(value);

      mutation.mutate(filteredData);
    },
  });

  return levelBonusForm;
};

export default useLevelBonusForm;
