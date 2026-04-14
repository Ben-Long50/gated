import { useForm } from '@tanstack/react-form';
import { UseMutationResult } from '@tanstack/react-query';
import { Item } from 'src/types/item';
import { KeywordReference } from 'src/types/keyword';
import {
  extractItemListIds,
  extractKeywordListIds,
} from 'src/utils/extractIds';
import constructFormData from './constructFormData';

const useItemUpgradeForm = (
  mutation: UseMutationResult<any, Error, FormData>,
  item?: Item,
) => {
  const emptyStats =
    Object.fromEntries(Object.keys(item?.stats).map((stat) => [stat, 0])) || {};

  const itemUpgradeForm = useForm({
    defaultValues: {
      id: item?.id ?? null,
      name: item?.name ?? '',
      grade: item?.grade ?? 0,
      description: item?.description ?? '',
      pictureFile: null as File | null,
      picture: item?.picture || {
        imageUrl: '',
        publicId: '',
        position: { x: 50, y: 50 },
      },
      modifiedStats: { ...emptyStats, ...item?.modifiedStats },
      keywords: item?.modifiedKeywords || ([] as KeywordReference[]),
      upgradePrice: 0,
    },
    onSubmit: async ({ value }) => {
      const filteredStats = Object.fromEntries(
        Object.entries(value.modifiedStats).filter(([_, val]) => val),
      );

      const { keywords, ...rest } = value;

      const data = {
        ...rest,
        modifiedStats: filteredStats,
        itemIds: item?.itemLinkReference
          ? extractItemListIds(item?.itemLinkReference?.items)
          : [],
        actionIds: item?.itemLinkReference
          ? extractItemListIds(item?.itemLinkReference?.actions)
          : [],
        keywordIds: item?.keywords ? extractKeywordListIds(item?.keywords) : [],
        modifiedKeywordIds: value.keywords
          ? extractKeywordListIds(value.keywords)
          : [],
      };

      const formData = constructFormData(data);

      mutation.mutate(formData);
    },
  });

  return itemUpgradeForm;
};

export default useItemUpgradeForm;
