import apiUrl from 'src/utils/configureUrl';
import handleResponse from '../../handleResponse';

const updateGangCharacters = async (
  campaignId: number,
  gangId: number,
  value: { leaderIds: number[]; characterIds: number[] },
) => {
  try {
    const response = await fetch(
      `${apiUrl}/campaigns/${campaignId}/gangs/${gangId}/characters`,
      {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(value),
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

export default updateGangCharacters;
