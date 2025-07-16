import apiUrl from 'src/utils/configureUrl';
import handleResponse from '../handleResponse';

const setCampaignTime = async (
  campaignId: number,
  formData: { hour: number; minute: number; second: number },
) => {
  try {
    const response = await fetch(`${apiUrl}/campaigns/${campaignId}/time`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(formData),
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

export default setCampaignTime;
