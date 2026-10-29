import apiUrl from 'src/utils/configureUrl';
import handleResponse from '../../handleResponse';

const createCombat = async (
  campaignId: number,
  formData: { mapId: number },
) => {
  try {
    const response = await fetch(
      `${apiUrl}/campaigns/${campaignId}/maps/${formData.mapId}/encounters/create`,
      {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
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

export default createCombat;
