import apiUrl from 'src/utils/configureUrl';
import handleResponse from '../handleResponse';

const updateCharacterLocation = async (
  mapId: number,
  formData: { characterId: number; locationId: number; index: number },
) => {
  try {
    const response = await fetch(
      `${apiUrl}/characters/${formData.characterId}/locations/${formData.locationId}`,
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
