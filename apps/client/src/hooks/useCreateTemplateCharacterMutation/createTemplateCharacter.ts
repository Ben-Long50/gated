import apiUrl from 'src/utils/configureUrl';
import handleResponse from '../handleResponse';

const createTemplateCharacter = async (characterId: number) => {
  try {
    const response = await fetch(
      `${apiUrl}/characters/${characterId}/createTemplate`,
      {
        method: 'POST',
        credentials: 'include',
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

export default createTemplateCharacter;
