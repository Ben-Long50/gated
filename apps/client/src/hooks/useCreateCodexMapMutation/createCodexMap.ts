import apiUrl from 'src/utils/configureUrl';
import handleResponse from '../handleResponse';
import { MapInput } from 'src/types/map';

const createCodexMap = async (formData: MapInput) => {
  try {
    const response = await fetch(`${apiUrl}/maps/codex`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
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

export default createCodexMap;
