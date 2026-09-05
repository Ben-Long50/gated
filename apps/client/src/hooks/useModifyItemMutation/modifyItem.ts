import apiUrl from 'src/utils/configureUrl';
import handleResponse from '../handleResponse';

const modifyItem = async (
  formData: object,
  characterId: number,
  itemId: number,
) => {
  try {
    const response = await fetch(
      `${apiUrl}/characters/${characterId}/items/${itemId}/modify`,
      {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
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

export default modifyItem;
