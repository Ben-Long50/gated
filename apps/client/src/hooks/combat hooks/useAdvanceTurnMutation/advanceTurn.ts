import apiUrl from 'src/utils/configureUrl';
import handleResponse from '../../handleResponse';

const advanceTurn = async (encounterId: number, turn: number) => {
  try {
    const response = await fetch(
      `${apiUrl}/encounters/${encounterId}/advanceTurn`,
      {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ turn }),
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

export default advanceTurn;
