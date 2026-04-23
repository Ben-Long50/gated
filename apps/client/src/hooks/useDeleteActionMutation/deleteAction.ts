import apiUrl from 'src/utils/configureUrl';
import handleResponse from '../handleResponse';

const deleteAction = async (actionId: number) => {
  try {
    const response = await fetch(`${apiUrl}/actions/${actionId}`, {
      method: 'DELETE',
      credentials: 'include',
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

export default deleteAction;
