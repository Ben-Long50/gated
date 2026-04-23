import { useForm } from '@tanstack/react-form';
import { UseMutationResult } from '@tanstack/react-query';
import { filterFormData } from './constructFormData';
import { Affiliation } from 'src/types/faction';
import { useParams } from 'react-router-dom';

const useAffiliationForm = (
  mutation: UseMutationResult<any, Error, any>,
  affiliation?: Affiliation,
) => {
  const { campaignId, factionId, gangId, characterId } = useParams();

  const affiliationForm = useForm({
    defaultValues: {
      id: affiliation?.id ?? null,
      campaignId: affiliation?.campaignId ?? Number(campaignId),
      factionIds:
        affiliation?.factions.map((faction) => faction.id) ??
        ([Number(factionId)] as number[]),
      gangIds:
        affiliation?.gangs.map((gang) => gang.id) ??
        ([Number(gangId)] as number[]),
      characterIds:
        affiliation?.characters.map((character) => character.id) ??
        ([Number(characterId)] as number[]),
      value: affiliation?.value ?? 0,
    },

    onSubmit: async ({ value }) => {
      const formData = filterFormData(value);

      await mutation.mutate(formData);
    },
  });

  return affiliationForm;
};

export default useAffiliationForm;
