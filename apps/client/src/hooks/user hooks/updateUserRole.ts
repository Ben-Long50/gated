import handleResponse from '../handleResponse';
import apiUrl from 'src/utils/configureUrl';

const updateUserRole = async (formData: { id: number; role: string }) => {
  try {
    const response = await fetch(`${apiUrl}/users/role`, {
      method: 'PATCH',
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

export default updateUserRole;
