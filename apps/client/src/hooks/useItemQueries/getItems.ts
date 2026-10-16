import { create, windowScheduler } from '@yornaath/batshit';
import apiUrl from 'src/utils/configureUrl';
import handleResponse from '../handleResponse';
import { Item, ItemType } from '@gated/shared';

const getItems = create({
  fetcher: async (types: ItemType[]) => {
    const response = await fetch(
      `${apiUrl}/items/base?types=${types.join(',')}`,
      {
        method: 'GET',
        credentials: 'include',
      },
    );

    const data: Item[] = await handleResponse(response);

    return data;
  },
  resolver: (items, type) =>
    items.filter((item) => item.itemTypes.includes(type)),
  scheduler: windowScheduler(10),
});

export default getItems;
