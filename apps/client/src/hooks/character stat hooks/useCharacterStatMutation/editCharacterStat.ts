import apiUrl from 'src/utils/configureUrl';
import handleResponse from '../../handleResponse';

const editCharacterStat = async (
  characterId: number,
  stats: Record<string, number>,
) => {
  try {
    const response = await fetch(`${apiUrl}/characters/${characterId}/stats`, {
      method: 'PATCH',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(stats),
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

export default editCharacterStat;
