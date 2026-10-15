import apiUrl from 'src/utils/configureUrl';
import handleResponse from '../handleResponse';

const createSession = async (formData: object, campaignId: number) => {
  try {
    const response = await fetch(`${apiUrl}/campaigns/${campaignId}/sessions`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
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

export default createSession;
