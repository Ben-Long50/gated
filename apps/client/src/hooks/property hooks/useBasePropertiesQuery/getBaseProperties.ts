import handleResponse from '../../handleResponse';
import apiUrl from 'src/utils/configureUrl';

const getBaseProperties = async () => {
  try {
    const response = await fetch(`${apiUrl}/properties/base`, {
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

export default getBaseProperties;
