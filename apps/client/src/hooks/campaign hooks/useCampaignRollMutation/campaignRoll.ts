import apiUrl from 'src/utils/configureUrl';
import handleResponse from '../../handleResponse';

const campaignRoll = async (
  campaignId: number,
  rollData: {
    characterId: number;
    actionId: number;
    modifiers: string[];
    extraDice: number | null;
  },
) => {
  try {
    const response = await fetch(`${apiUrl}/campaigns/${campaignId}/roll`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(rollData),
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

export default campaignRoll;
