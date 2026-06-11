import { useForm } from '@tanstack/react-form';
import { UseMutationResult } from '@tanstack/react-query';
import { Item } from 'src/types/item';
import constructFormData from './constructFormData';
import upgradePointMap from '../upgradePointMap';

const useItemUpgradeForm = (
  mutation: UseMutationResult<any, Error, FormData>,
  item?: Item,
) => {
  const emptyStats = item?.stats
    ? Object.fromEntries(
        Object.keys(item.stats)
          .map((stat) => [stat, 0])
          .filter(([stat, _]) => upgradePointMap[stat]),
      )
    : {};

  const itemUpgradeForm = useForm({
    defaultValues: {
      id: item?.id ?? null,
      name: item?.name ?? '',
      grade: item?.grade ?? 1,
      description: item?.description ?? '',
      pictureFile: null as File | null,
      picture: {
        imageUrl: item?.picture.imageUrl ?? '',
        publicId: item?.picture.publicId ?? '',
        position: item?.picture.position ?? { x: 50, y: 50 },
      },
      modifiedStats: { ...emptyStats, ...item?.modifiedStats },
      keywords:
        item?.modifiedKeywords.map((keyword) => ({
          keywordId: keyword.keyword.id,
          value: keyword.value,
        })) ?? ([] as { keywordId: number; value: number | null }[]),
      upgradePrice: 0,
      characterId: item?.characterInventory?.characterId ?? null,
    },
    onSubmit: async ({ value }) => {
      const filteredStats = Object.fromEntries(
        Object.entries(value.modifiedStats).filter(([_, val]) => val),
      );

      const formData = constructFormData({
        ...value,
        modifiedStats: filteredStats,
      });

      await mutation.mutate(formData);
    },
  });

  return itemUpgradeForm;
};

export default useItemUpgradeForm;
