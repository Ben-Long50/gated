import { create, keyResolver, windowScheduler } from '@yornaath/batshit';
import handleResponse from '../../handleResponse';
import apiUrl from 'src/utils/configureUrl';
import { Gang } from 'src/types/gang';

const getGang = create({
  fetcher: async (gangIds: number[]) => {
    const response = await fetch(
      `${apiUrl}/gangs/batch?ids=${gangIds.join(',')}`,
      {
        method: 'GET',
        credentials: 'include',
      },
    );
    const data: Gang[] = await handleResponse(response);

    return data;
  },
  resolver: keyResolver('id'),
  scheduler: windowScheduler(10),
});

export default getGang;
