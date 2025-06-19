import { Month } from 'src/types/campaign';
import handleResponse from '../handleResponse';

const setCampaignDate = async (
  apiUrl: string,
  campaignId: number,
  formData: { month: Month; day: number },
) => {
  try {
    const response = await fetch(`${apiUrl}/campaigns/${campaignId}/date`, {
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

export default setCampaignDate;
