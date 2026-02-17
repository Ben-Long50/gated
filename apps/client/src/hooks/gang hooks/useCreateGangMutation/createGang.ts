import apiUrl from 'src/utils/configureUrl';
import handleResponse from '../../handleResponse';

const createGang = async (campaignId: number, formData: FormData) => {
  try {
    const response = await fetch(`${apiUrl}/campaigns/${campaignId}/gangs`, {
      method: 'POST',
      credentials: 'include',
      body: formData,
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

export default createGang;
