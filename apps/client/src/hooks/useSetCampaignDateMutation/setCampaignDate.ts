import { Month } from '@gated/shared';
import handleResponse from '../handleResponse';
import apiUrl from 'src/utils/configureUrl';

const setCampaignDate = async (
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
