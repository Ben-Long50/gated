import { create, keyResolver, windowScheduler } from '@yornaath/batshit';
import handleResponse from '../handleResponse';
import { Campaign } from 'src/types/campaign';
import apiUrl from 'src/utils/configureUrl';

const getCampaign = create({
  fetcher: async (campaignIds: number[]) => {
    const response = await fetch(
      `${apiUrl}/campaigns/batch?ids=${campaignIds.join(',')}`,
      {
        method: 'GET',
        credentials: 'include',
      },
    );
    const data: Campaign[] = await handleResponse(response);

    return data;
  },
  resolver: keyResolver('id'),
  scheduler: windowScheduler(10),
});

export default getCampaign;
