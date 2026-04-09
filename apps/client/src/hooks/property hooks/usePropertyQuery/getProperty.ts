import { create, keyResolver, windowScheduler } from '@yornaath/batshit';
import handleResponse from '../../handleResponse';
import apiUrl from 'src/utils/configureUrl';
import { Property } from 'src/types/property';

const getProperty = create({
  fetcher: async (propertyIds: number[]) => {
    const response = await fetch(
      `${apiUrl}/properties/batch?ids=${propertyIds.join(',')}`,
      {
        method: 'GET',
        credentials: 'include',
      },
    );
    const data: Property[] = await handleResponse(response);

    return data;
  },
  resolver: keyResolver('id'),
  scheduler: windowScheduler(10),
});

export default getProperty;
