import { useForm } from '@tanstack/react-form';
import { UseMutationResult } from '@tanstack/react-query';
import { Character } from 'src/types/character';
import constructFormData, { filterStats } from './constructFormData';

const useCharacterUpdateForm = (
  mutation: UseMutationResult<any, Error, FormData>,
  character?: Character,
) => {
  const characterUpdateForm = useForm({
    defaultValues: {
      id: character?.id ?? null,
      playerCharacter: character?.playerCharacter ?? null,
      profits: character?.profits ?? null,
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
      description: character?.description ?? null,
      stats: {
        maxHealth: character?.stats.maxHealth ?? 0,
        maxSanity: character?.stats.maxSanity ?? 0,
        maxCyber: character?.stats.maxCyber ?? 0,
        maxEquip: character?.stats.maxEquip ?? 0,
        speed: character?.stats.speed ?? 0,
        evasion: character?.stats.evasion ?? 0,
        permanentInjuries: character?.stats.permanentInjuries ?? 0,
        permanentInsanities: character?.stats.permanentInsanities ?? 0,
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
      perkIds: character?.perks.map((perk) => perk.id) ?? ([] as number[]),
      actionIds:
        character?.characterInventory.actions.map((action) => action.id) ??
        ([] as number[]),
    },
    onSubmit: async ({ value }) => {
      const filteredStats = filterStats(value.stats);

      const formData = constructFormData({ ...value, stats: filteredStats });

      mutation.mutate(formData);
    },
  });

  return characterUpdateForm;
};

export default useCharacterUpdateForm;
