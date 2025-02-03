import handleResponse from '../handleResponse';

const editCart = async (
  apiUrl: string,
  formData: {
    characterId: number;
    cartId: number;
    category: string;
    itemId: number;
  },
) => {
  try {
    const response = await fetch(
      `${apiUrl}/characters/${formData.characterId}/cart/${formData.cartId}`,
      {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          category: formData.category,
          itemId: formData.itemId,
        }),
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

export default editCart;
