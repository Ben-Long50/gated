import apiUrl from 'src/utils/configureUrl';
import handleResponse from '../handleResponse';

const generatePicture = async (
  type: 'character' | 'item' | 'scene',
  prompt: {
    setting: string;
    time: string;
    description: string;
    pictureCount: number;
  },
) => {
  try {
    const response = await fetch(`${apiUrl}/generations?generationType=user`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt: { ...prompt, type } }),
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

export default generatePicture;
