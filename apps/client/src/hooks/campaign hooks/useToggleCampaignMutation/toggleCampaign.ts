import apiUrl from 'src/utils/configureUrl';
import handleResponse from '../../handleResponse';

const toggleCampaign = async (campaignId: number) => {
  try {
    const response = await fetch(`${apiUrl}/campaigns/${campaignId}/active`, {
      method: 'PATCH',
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

export default toggleCampaign;
