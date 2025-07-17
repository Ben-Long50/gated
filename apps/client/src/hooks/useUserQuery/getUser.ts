import apiUrl from 'src/utils/configureUrl';
import handleResponse from '../handleResponse';

const getUser = async (userId?: number) => {
  try {
    const response = await fetch(`${apiUrl}/users/${userId}`, {
      method: 'GET',
      credentials: 'include',
    });
    const data = await handleResponse(response);

    return data;
  } catch (error) {
    if (error instanceof Error) {
      if (error instanceof Error) {
        console.error(error.message);
      }
    }
    throw error;
  }
};

export default getUser;
