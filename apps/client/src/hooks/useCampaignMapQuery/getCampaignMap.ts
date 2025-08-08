import apiUrl from 'src/utils/configureUrl';
import handleResponse from '../handleResponse';

const getCampaignMap = async (mapId: number) => {
  try {
    const response = await fetch(`${apiUrl}/maps/${mapId}`, {
      method: 'GET',
      credentials: 'include',
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

export default getCampaignMap;
