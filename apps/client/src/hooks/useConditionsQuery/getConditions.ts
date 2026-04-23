import apiUrl from 'src/utils/configureUrl';
import handleResponse from '../handleResponse';

const getConditions = async () => {
  try {
    const response = await fetch(`${apiUrl}/conditions`, {
      method: 'GET',
      credentials: 'include',
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

export default getConditions;
