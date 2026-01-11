import apiUrl from 'src/utils/configureUrl';
import handleResponse from '../../handleResponse';
import { Character } from 'src/types/character';
import { Action } from '@cloudinary/url-gen/internal/Action';

const campaignRoll = async (
  campaignId: number,
  rollData: {
    character: Character;
    action: Action;
    modifiers: string[];
    extraDice: number;
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
