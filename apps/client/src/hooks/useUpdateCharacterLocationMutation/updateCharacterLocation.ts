import apiUrl from 'src/utils/configureUrl';
import handleResponse from '../handleResponse';

const updateCharacterLocation = async (
  mapId: number,
  formData: {
    characterId: number;
    locationId: number;
    row: number;
    col: number;
  },
) => {
  try {
    const response = await fetch(
      `${apiUrl}/characters/${formData.characterId}/location`,
      {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mapId, row: formData.row, col: formData.col }),
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
