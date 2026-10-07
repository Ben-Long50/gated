import apiUrl from 'src/utils/configureUrl';
import handleResponse from '../handleResponse';

const joinCampaign = async (campaignId: number, characterId: number) => {
  try {
    const response = await fetch(`${apiUrl}/campaigns/${campaignId}/players`, {
      method: 'PATCH',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ characterId }),
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

export default joinCampaign;
