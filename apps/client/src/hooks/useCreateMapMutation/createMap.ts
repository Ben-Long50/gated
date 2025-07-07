import handleResponse from '../handleResponse';

const createMap = async (
  campaignId: number,
  formData: object,
  apiUrl: string,
) => {
  try {
    const response = await fetch(`${apiUrl}/campaigns/${campaignId}/maps`, {
      method: 'POST',
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

export default createMap;
