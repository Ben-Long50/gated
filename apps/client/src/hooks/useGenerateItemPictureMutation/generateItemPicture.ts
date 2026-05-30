import apiUrl from 'src/utils/configureUrl';
import handleResponse from '../handleResponse';

const generateItemPicture = async (prompt: string) => {
  try {
    const response = await fetch(`${apiUrl}/users/generateItem`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt }),
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

export default generateItemPicture;
