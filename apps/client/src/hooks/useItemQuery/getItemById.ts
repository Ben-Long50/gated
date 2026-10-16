import { create, keyResolver, windowScheduler } from '@yornaath/batshit';
import handleResponse from '../handleResponse';
import { Item } from '@gated/shared';
import apiUrl from 'src/utils/configureUrl';

const getItemById = create({
  fetcher: async (itemIds: number[]) => {
    const response = await fetch(`${apiUrl}/items?ids=${itemIds.join(',')}`, {
      method: 'GET',
      credentials: 'include',
    });
    const data: Item[] = await handleResponse(response);
    return data;
  },
  resolver: keyResolver('id'),
  scheduler: windowScheduler(10),
});

export default getItemById;
