import apiUrl from 'src/utils/configureUrl';
import handleResponse from '../handleResponse';

const createCodexCharacter = async (formData: FormData) => {
  try {
    const response = await fetch(`${apiUrl}/characters/base`, {
      method: 'POST',
      credentials: 'include',
      body: formData,
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

export default createCodexCharacter;
