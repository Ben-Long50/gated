import handleResponse from '../handleResponse';

const updateCharacterLocation = async (
  apiUrl: string,
  mapId: number,
  formData: { characterId: number; index: number },
) => {
  try {
    const response = await fetch(
      `${apiUrl}/characters/${formData.characterId}/location`,
      {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ mapId, index: formData.index }),
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

export default updateCharacterLocation;
