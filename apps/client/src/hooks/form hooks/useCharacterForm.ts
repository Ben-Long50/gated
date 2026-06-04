import { useForm } from '@tanstack/react-form';
import { UseMutationResult } from '@tanstack/react-query';
import { Character } from 'src/types/character';
import constructFormData from './constructFormData';
import useAttributeTree from '../useAttributeTree';

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
      firstName: null as string | null,
      lastName: null as string | null,
      pictureFile: null as File | null,
      picture: {
        imageUrl: '',
        publicId: '',
        position: { x: 50, y: 50 },
      },
      height: null as number | null,
      weight: null as number | null,
      age: null as number | null,
      sex: null as 'male' | 'female' | null,
      stats: {
        permanentInjuries: 5,
        permanentInsanities: 5,
      },
      attributes: emptyAttributeTree,
      perkIds: [] as number[],
    },
    onSubmit: ({ value }) => {
      const formData = constructFormData(value);

      mutation.mutate(formData);
    },
  });

  return characterForm;
};

export default useCharacterForm;
