import { create, keyResolver, windowScheduler } from '@yornaath/batshit';
import handleResponse from '../handleResponse';
import apiUrl from 'src/utils/configureUrl';

const getAffiliation = create({
  fetcher: async (affiliationIds: number[]) => {
    const response = await fetch(
      `${apiUrl}/affiliations/batch?ids=${affiliationIds.join(',')}`,
      {
        method: 'GET',
        credentials: 'include',
      },
    );
    const data = await handleResponse(response);

    return data;
  },
  resolver: keyResolver('id'),
  scheduler: windowScheduler(10),
});

export default getAffiliation;
