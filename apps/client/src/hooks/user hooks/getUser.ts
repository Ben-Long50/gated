import apiUrl from 'src/utils/configureUrl';
import handleResponse from '../handleResponse';
import { User } from 'src/types/user';
import { create, keyResolver, windowScheduler } from '@yornaath/batshit';

const getUser = create({
  fetcher: async (userIds: number[]) => {
    const response = await fetch(
      `${apiUrl}/users/batch?ids=${userIds.join(',')}`,
      {
        method: 'GET',
        credentials: 'include',
      },
    );
    const data: User[] = await handleResponse(response);

    return data;
  },
  resolver: keyResolver('id'),
  scheduler: windowScheduler(10),
});

export default getUser;
