import apiUrl from 'src/utils/configureUrl';
import handleResponse from '../handleResponse';

const deleteUnusedPictures = async () => {
  try {
    const response = await fetch(`${apiUrl}/users/unusedPictures`, {
      method: 'DELETE',
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

export default deleteUnusedPictures;
