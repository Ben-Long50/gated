import { useForm } from '@tanstack/react-form';
import { UseMutationResult } from '@tanstack/react-query';
import { Character } from 'src/types/character';
import constructFormData from './constructFormData';
import useAttributeTree from '../useAttributeTree';
import { Perk } from 'src/types/perk';

const useCharacterForm = (
  mutation: UseMutationResult<any, Error, FormData>,
  character?: Character,
) => {
  const { emptyAttributeTree } = useAttributeTree();

  const characterForm = useForm({
    defaultValues: {
      playerCharacter: true as string | boolean,
      npcTypes: null as null | string[],
      campaignId: null as number | null,
      preferences: {
        firstName: true,
        lastName: true,
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
      firstName: '',
      lastName: '',
      picture: '',
      position: { x: 50, y: 50 },
      height: '',
      weight: '',
      age: '',
      sex: '',
      stats: {
        currentHealth: 0,
        currentSanity: 0,
        permanentInjuries: 5,
        permanentInsanities: 5,
      },
      attributes: emptyAttributeTree,
      perks: [] as Perk[] | number[],
    },
    onSubmit: ({ value }) => {
      value.npcTypes = value.npcTypes
        ? value.npcTypes.filter((type) => type)
        : null;

      value.stats = {
        currentHealth:
          10 + value.attributes.violence.skills.threshold.points * 2,
        currentSanity: 5 + value.attributes.esoterica.skills.mysticism.points,
        permanentInjuries: value.stats.permanentInjuries,
        permanentInsanities: value.stats.permanentInsanities,
      };

      value.perks = value.perks.map((perk) => perk.id);

      const formData = constructFormData(value);

      mutation.mutate(formData);
    },
  });

  return characterForm;
};

export default useCharacterForm;
