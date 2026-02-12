import apiUrl from 'src/utils/configureUrl';
import handleResponse from '../../handleResponse';

const updateCharacterLevel = async (
  characterId: number,
  levelChange: number,
) => {
  try {
    const response = await fetch(`${apiUrl}/characters/${characterId}/level`, {
      method: 'PATCH',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ levelChange }),
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

export default updateCharacterLevel;
