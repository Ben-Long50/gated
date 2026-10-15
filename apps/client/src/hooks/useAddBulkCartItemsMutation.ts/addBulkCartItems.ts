import apiUrl from 'src/utils/configureUrl';
import handleResponse from '../handleResponse';

const addBulkCartItems = async (
  characterId: number,
  formData: { quantity: number; rarities: string[]; itemTypes: string[] },
) => {
  try {
    const response = await fetch(
      `${apiUrl}/characters/${characterId}/cart/bulk`,
      {
        method: 'PATCH',
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

export default addBulkCartItems;
