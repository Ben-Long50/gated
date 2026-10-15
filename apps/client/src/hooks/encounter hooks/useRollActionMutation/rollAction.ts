import apiUrl from 'src/utils/configureUrl';
import handleResponse from '../../handleResponse';

const rollAction = async (
  campaignId: number,
  encounterId: number,
  actionData: {
    activeCharacterId: number;
    targetCharacterId?: number;
    actionId: number;
    itemId?: number;
    tile?: {
      start: { row: number; col: number };
      end: { row: number; col: number };
    };
    modifiers: string[];
    extraDice: number;
  },
) => {
  try {
    const response = await fetch(
      `${apiUrl}/campaigns/${campaignId}/encounters/${encounterId}/rollAction`,
      {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(actionData),
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

export default rollAction;
