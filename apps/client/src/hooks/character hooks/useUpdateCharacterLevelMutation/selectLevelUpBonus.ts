import apiUrl from 'src/utils/configureUrl';
import handleResponse from '../../handleResponse';
import { AttributeTree } from 'src/types/attributeTree';

const selectLevelUpBonus = async (
  characterId: number,
  bonus: { level: number; attributes?: AttributeTree; perkId?: number },
) => {
  try {
    const response = await fetch(
      `${apiUrl}/characters/${characterId}/levelBonus`,
      {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bonus),
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

export default selectLevelUpBonus;
