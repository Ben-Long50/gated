import { useQuery } from '@tanstack/react-query';
import { Item } from '@gated/shared';
import getCodexPreviewItems from './getCodexPreviewItems';
import { Character } from '@gated/shared';

const useCodexPreviewItemsQuery = () => {
  return useQuery<{ items: Item[]; characters: Character[] }>({
    queryKey: ['codexItems'],
    queryFn: async () => await getCodexPreviewItems(),
  });
};

export default useCodexPreviewItemsQuery;
