import apiUrl from 'src/utils/configureUrl';
import handleResponse from '../handleResponse';

const addCharacter = async (
  characterId: number,
  campaignId?: number,
  gangId?: number,
) => {
  try {
    const response = await fetch(`${apiUrl}/characters/add`, {
      method: 'PATCH',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ characterId, campaignId, gangId }),
    });
    const data = await handleResponse(response);
    return data;
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
    }
    throw error;
  }
};

export default addCharacter;
