import apiUrl from 'src/utils/configureUrl';
import handleResponse from '../../handleResponse';

const activateEncounter = async (campaignId: number, encounterId: number) => {
  try {
    const response = await fetch(
      `${apiUrl}/campaigns/${campaignId}/encounters/${encounterId}/activate`,
      {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
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

export default activateEncounter;
