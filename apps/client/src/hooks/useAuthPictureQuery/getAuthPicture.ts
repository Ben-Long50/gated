import handleResponse from '../handleResponse';
import apiUrl from 'src/utils/configureUrl';

const getAuthPicture = async () => {
  const response = await fetch(`${apiUrl}/auth/picture`, {
    method: 'GET',
    credentials: 'include',
  });
  const data = await handleResponse(response);

  return data;
};

export default getAuthPicture;
