import { useQuery } from '@tanstack/react-query';
import { Item } from 'src/types/item';
import getCodexPreviewItems from './getCodexPreviewItems';
import { Character } from 'src/types/character';

const useCodexPreviewItemsQuery = () => {
  return useQuery<{ items: Item[]; characters: Character[] }>({
    queryKey: ['codexItems'],
    queryFn: async () => await getCodexPreviewItems(),
  });
};

export default useCodexPreviewItemsQuery;
