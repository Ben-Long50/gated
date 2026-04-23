import { useForm } from '@tanstack/react-form';
import { UseMutationResult } from '@tanstack/react-query';
import { Character } from 'src/types/character';
import constructFormData from './constructFormData';

const useCharacterUpdateForm = (
  mutation: UseMutationResult<any, Error, FormData>,
  character?: Character,
) => {
  const characterUpdateForm = useForm({
    defaultValues: {
      id: character?.id ?? null,
      playerCharacter: character?.playerCharacter ?? null,
      campaignId: character?.campaignId ?? null,
      npcTypes: character?.npcTypes ?? (character?.playerCharacter ? null : []),
      preferences: {
        firstName: character?.preferences?.firstName ?? true,
        lastName: character?.preferences?.lastName ?? true,
        age: character?.preferences?.age ?? true,
        height: character?.preferences?.height ?? true,
        weight: character?.preferences?.weight ?? true,
        sex: character?.preferences?.sex ?? true,
        picture: character?.preferences?.picture ?? true,
        backstory: character?.preferences?.backstory ?? true,
        level: character?.preferences?.level ?? true,
        profits: character?.preferences?.profits ?? true,
        stats: character?.preferences?.stats ?? true,
        attributes: character?.preferences?.attributes ?? true,
        perks: character?.preferences?.perks ?? true,
        equipment: character?.preferences?.equipment ?? true,
      },
      firstName: character?.firstName ?? null,
      lastName: character?.lastName ?? null,
      stats: {
        currentHealth: character?.stats.currentHealth ?? null,
        currentSanity: character?.stats.currentSanity ?? null,
        injuries: character?.stats.injuries ?? null,
        insanities: character?.stats.insanities ?? null,
        permanentInjuries: character?.stats.permanentInjuries ?? 5,
        permanentInsanities: character?.stats.permanentInsanities ?? 5,
      },
      pictureFile: null as File | null,
      picture: {
        imageUrl: character?.picture.imageUrl ?? '',
        publicId: character?.picture.publicId ?? '',
        position: character?.picture.position ?? { x: 50, y: 50 },
      },
      height: character?.height ?? null,
      weight: character?.weight ?? null,
      age: character?.age ?? null,
      sex: character?.sex ?? null,
    },
    onSubmit: async ({ value }) => {
      value.npcTypes = value.npcTypes
        ? value.npcTypes.filter((type) => type)
        : null;

      const formData = constructFormData(value);

      mutation.mutate(formData);
    },
  });

  return characterUpdateForm;
};

export default useCharacterUpdateForm;
