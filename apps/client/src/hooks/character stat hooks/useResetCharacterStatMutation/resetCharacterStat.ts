import apiUrl from 'src/utils/configureUrl';
import handleResponse from '../../handleResponse';

const resetCharacterStat = async (
  characterId: number,
  stat: string,
  value: number,
) => {
  try {
    const response = await fetch(
      `${apiUrl}/characters/${characterId}/stats/reset`,
      {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          stat,
          value,
        }),
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

export default resetCharacterStat;
