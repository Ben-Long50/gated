import { create, keyResolver, windowScheduler } from '@yornaath/batshit';
import handleResponse from '../handleResponse';
import apiUrl from 'src/utils/configureUrl';
import { Action } from '@gated/shared';

const getAction = create({
  fetcher: async (actionIds: number[]) => {
    const response = await fetch(
      `${apiUrl}/actions/batch?ids=${actionIds.join(',')}`,
      {
        method: 'GET',
        credentials: 'include',
      },
    );
    const data: Action[] = await handleResponse(response);

    return data;
  },
  resolver: keyResolver('id'),
  scheduler: windowScheduler(10),
});

export default getAction;
