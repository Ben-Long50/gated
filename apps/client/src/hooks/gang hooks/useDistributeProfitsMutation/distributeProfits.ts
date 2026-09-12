import apiUrl from 'src/utils/configureUrl';
import handleResponse from '../../handleResponse';

const distributeProfits = async (
  campaignId: number,
  gangId: number,
  distributions: [number, number][],
) => {
  try {
    const response = await fetch(
      `${apiUrl}/campaigns/${campaignId}/gangs/${gangId}/profits`,
      {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(distributions),
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

export default distributeProfits;
