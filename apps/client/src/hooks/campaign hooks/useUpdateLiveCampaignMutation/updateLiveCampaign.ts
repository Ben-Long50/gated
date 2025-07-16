import apiUrl from 'src/utils/configureUrl';
import handleResponse from '../../handleResponse';

const updateLiveCampaign = async (userId: number, campaignId: number) => {
  try {
    const response = await fetch(
      `${apiUrl}/users/${userId}/liveCampaign/${campaignId}`,
      {
        method: 'PATCH',
        credentials: 'include',
      },
    );
    const data = await handleResponse(response);
    return data;
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
    }
    throw error;
  }
};

export default updateLiveCampaign;
