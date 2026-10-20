import apiUrl from 'src/utils/configureUrl';
import handleResponse from '../handleResponse';

const addMap = async (mapId: number, campaignId?: number) => {
  try {
    const response = await fetch(`${apiUrl}/maps/add`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ mapId, campaignId }),
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

export default addMap;
