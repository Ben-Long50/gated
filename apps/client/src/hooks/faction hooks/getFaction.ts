import { create, keyResolver, windowScheduler } from '@yornaath/batshit';
import handleResponse from '../handleResponse';
import apiUrl from 'src/utils/configureUrl';
import { Faction } from 'src/types/faction';

const getFaction = create({
  fetcher: async (gangIds: number[]) => {
    const response = await fetch(
      `${apiUrl}/factions/batch?ids=${gangIds.join(',')}`,
      {
        method: 'GET',
        credentials: 'include',
      },
    );
    const data: Faction[] = await handleResponse(response);

    return data;
  },
  resolver: keyResolver('id'),
  scheduler: windowScheduler(10),
});

export default getFaction;
