import { create, keyResolver, windowScheduler } from '@yornaath/batshit';
import handleResponse from '../handleResponse';
import { Location } from 'src/types/map';

const getLocation = create({
  fetcher: async (locationIds: number[]) => {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/locations/batch?ids=${locationIds.join(',')}`,
      {
        method: 'GET',
        credentials: 'include',
      },
    );
    const data: Location[] = await handleResponse(response);

    return data;
  },
  resolver: keyResolver('id'),
  scheduler: windowScheduler(10),
});

export default getLocation;
