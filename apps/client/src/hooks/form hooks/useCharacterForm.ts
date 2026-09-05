import { useForm } from '@tanstack/react-form';
import { UseMutationResult } from '@tanstack/react-query';
import { filterFormData, filterStats } from './filterFormData';
import useAttributeTree from '../useAttributeTree';

const useCharacterForm = (mutation: UseMutationResult<any, Error, any>) => {
  const { emptyAttributeTree } = useAttributeTree();

  const characterForm = useForm({
    defaultValues: {
      playerCharacter: null as boolean | null,
      npcTypes: null as null | string[],
      profits: null as number | null,
      campaignId: null as number | null,
      level: null as number | null,
      preferences: {
        name: true,
        title: true,
        age: true,
        height: true,
        weight: true,
        sex: true,
        picture: true,
        backstory: true,
        level: true,
        profits: true,
        stats: true,
        attributes: true,
        perks: true,
        equipment: true,
      },
      name: null as string | null,
      title: null as string | null,
      generatedPictureId: null as number | null,
      height: null as number | null,
      weight: null as number | null,
      age: null as number | null,
      sex: null as 'male' | 'female' | 'unknown' | null,
      description: null as string | null,
      stats: {
        permanentInjuries: 5,
        permanentInsanities: 5,
      },
      attributes: emptyAttributeTree,
      perkIds: [] as number[],
      actionIds: [] as number[],
    },
    onSubmit: async ({ value }) => {
      const filteredStats = filterStats(value.stats);

      const formData = filterFormData({ ...value, stats: filteredStats });

      await mutation.mutate(formData);
    },
  });

  return characterForm;
};

export default useCharacterForm;
