import { useForm } from '@tanstack/react-form';
import { UseMutationResult } from '@tanstack/react-query';
import { Item } from 'src/types/item';
import upgradePointMap from '../upgradePointMap';
import { filterFormData, filterStats } from './filterFormData';

const useItemUpgradeForm = (
  mutation: UseMutationResult<any, Error, any>,
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
      generatedPictureId: item?.generatedPictureId ?? null,
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
      const filteredStats = filterStats(value.modifiedStats);

      const formData = filterFormData({
        ...value,
        modifiedStats: filteredStats,
      });

      await mutation.mutate(formData);
    },
  });

  return itemUpgradeForm;
};

export default useItemUpgradeForm;
