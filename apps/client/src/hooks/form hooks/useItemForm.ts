import { useForm } from '@tanstack/react-form';
import { UseMutationResult } from '@tanstack/react-query';
import { Item } from 'src/types/item';
import constructFormData from './constructFormData';

const useItemForm = (
  mutation: UseMutationResult<any, Error, FormData>,
  item?: Item,
) => {
  const itemForm = useForm({
    defaultValues: {
      id: item?.id ?? null,
      name: item?.name ?? '',
      itemTypes: item?.itemTypes ?? ([''] as string[]),
      rarity: item?.rarity ?? '',
      grade: item?.grade ?? 1,
      pictureFile: null as File | null,
      picture: {
        imageUrl: item?.picture.imageUrl ?? '',
        publicId: item?.picture.publicId ?? '',
        position: item?.picture.position ?? { x: 50, y: 50 },
      },
      description: item?.description ?? '',
      price: item?.price ?? '',
      stats: {
        damage: item?.stats?.damage ?? '',
        sanityDamage: item?.stats?.sanityDamage ?? '',
        salvo: item?.stats?.salvo ?? '',
        flurry: item?.stats?.flurry ?? '',
        range: item?.stats?.range ?? '',
        magCapacity: item?.stats?.magCapacity ?? '',
        currentAmmoCount: item?.stats?.currentAmmoCount ?? '',
        magCount: item?.stats?.magCount ?? '',
        currentMagCount: item?.stats?.currentMagCount ?? '',
        weight: item?.stats?.weight ?? '',
        ward: item?.stats?.ward ?? '',
        block: item?.stats?.block ?? '',
        currentBlock: item?.stats?.currentBlock ?? '',
        power: item?.stats?.power ?? '',
        currentPower: item?.stats?.currentPower ?? '',
        cyber: item?.stats?.cyber ?? '',
        size: item?.stats?.size ?? '',
        speed: item?.stats?.speed ?? '',
        agility: item?.stats?.agility ?? '',
        hull: item?.stats?.hull ?? '',
        currentHull: item?.stats?.currentHull ?? '',
        armor: item?.stats?.armor ?? '',
        cargo: item?.stats?.cargo ?? '',
        currentCargo: item?.stats?.currentCargo ?? '',
        pass: item?.stats?.pass ?? '',
        currentPass: item?.stats?.currentPass ?? '',
        turret: item?.stats?.turret ?? '',
        weapon: item?.stats?.weapon ?? '',
        wyrmMoldSlots: item?.stats?.wyrmMoldSlots ?? '',
        wyrmMoldPoints: item?.stats?.wyrmMoldPoints ?? '',
        esotericCharges: item?.stats?.esotericCharges ?? '',
      } as Record<string, number>,
      itemIds:
        item?.itemLinkReference?.items.map((item: Item) => item.id) ??
        ([] as number[]),
      actionIds:
        item?.itemLinkReference?.actions.map((action) => action.id) ??
        ([] as number[]),
      keywords:
        item?.keywords.map((keyword) => ({
          keywordId: keyword.keyword.id,
          value: keyword.value,
        })) ?? ([] as { keywordId: number; value: number | null }[]),
    },
    onSubmit: async ({ value }) => {
      value.stats.currentAmmoCount = value.stats.magCapacity;
      value.stats.currentMagCount = value.stats.magCount
        ? value.stats.magCount - 1
        : 0;

      value.stats.currentPower = value.stats.power ? value.stats.power : 0;
      value.stats.currentHull = value.stats.hull ? value.stats.hull : 0;

      const filteredStats = Object.fromEntries(
        Object.entries(value.stats).filter(([_, val]) => val),
      );

      if (filteredStats.cargo) {
        filteredStats.currentCargo = 0;
      }

      if (filteredStats.pass) {
        filteredStats.currentPass = 0;
      }

      value.stats = { ...filteredStats };

      const formData = constructFormData(value);

      await mutation.mutate(formData);
    },
  });

  return itemForm;
};

export default useItemForm;
