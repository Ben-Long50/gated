import { create, keyResolver, windowScheduler } from '@yornaath/batshit';
import handleResponse from '../handleResponse';
import { Character } from '@gated/shared';
import apiUrl from 'src/utils/configureUrl';

const getCharacter = create({
  fetcher: async (characterIds: number[]) => {
    const response = await fetch(
      `${apiUrl}/characters/batch?ids=${characterIds.join(',')}`,
      {
        method: 'GET',
        credentials: 'include',
      },
    );
    const data: Character[] = await handleResponse(response);

    return data;
  },
  resolver: keyResolver('id'),
  scheduler: windowScheduler(10),
});

export default getCharacter;
