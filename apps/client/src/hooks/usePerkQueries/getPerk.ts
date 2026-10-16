import { create, keyResolver, windowScheduler } from '@yornaath/batshit';
import handleResponse from '../handleResponse';
import { Perk } from '@gated/shared';
import apiUrl from 'src/utils/configureUrl';

const getPerk = create({
  fetcher: async (perkIds: number[]) => {
    const response = await fetch(
      `${apiUrl}/perks/batch?ids=${perkIds.join(',')}`,
      {
        method: 'GET',
        credentials: 'include',
      },
    );
    const data: Perk[] = await handleResponse(response);

    return data;
  },
  resolver: keyResolver('id'),
  scheduler: windowScheduler(10),
});

export default getPerk;
