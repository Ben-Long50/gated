import { create, keyResolver, windowScheduler } from '@yornaath/batshit';
import handleResponse from '../../handleResponse';
import apiUrl from 'src/utils/configureUrl';

const getCombat = create({
  fetcher: async (combatIds: number[]) => {
    const response = await fetch(
      `${apiUrl}/encounters/batch?ids=${combatIds.join(',')}`,
      {
        method: 'GET',
        credentials: 'include',
      },
    );
    const data: Combat[] = await handleResponse(response);

    return data;
  },
  resolver: keyResolver('id'),
  scheduler: windowScheduler(10),
});

export default getCombat;
