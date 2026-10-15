import apiUrl from 'src/utils/configureUrl';
import handleResponse from '../handleResponse';
import { Perk } from 'src/types/perk';

const createPerk = async (formData: Perk) => {
  try {
    const response = await fetch(`${apiUrl}/perks`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
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

export default createPerk;
