import { create, keyResolver, windowScheduler } from '@yornaath/batshit';
import handleResponse from '../handleResponse';
import { Map } from '@gated/shared';
import apiUrl from 'src/utils/configureUrl';

const getMap = create({
  fetcher: async (mapIds: number[]) => {
    const response = await fetch(
      `${apiUrl}/maps/batch?ids=${mapIds.join(',')}`,
      {
        method: 'GET',
        credentials: 'include',
      },
    );
    const data: Map[] = await handleResponse(response);

    return data;
  },
  resolver: keyResolver('id'),
  scheduler: windowScheduler(10),
});

export default getMap;
