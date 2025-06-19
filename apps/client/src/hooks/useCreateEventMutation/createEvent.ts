import handleResponse from '../handleResponse';

const createEvent = async (
  apiUrl: string,
  campaignId: number,
  formData: {
    id?: number;
    characterId: number;
    name: string;
    description: string;
    month: string;
    day: number;
  },
) => {
  try {
    const response = await fetch(`${apiUrl}/campaigns/${campaignId}/events`, {
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

export default createEvent;
