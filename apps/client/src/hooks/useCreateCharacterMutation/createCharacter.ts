import handleResponse from '../handleResponse';

const createCharacter = async (formData, apiUrl, authToken) => {
  try {
    const response = await fetch(`${apiUrl}/characters`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
      body: formData,
    });
    const data = await handleResponse(response);
    return data;
  } catch (error) {
    console.error(error.message);
    throw error;
  }
};

export default createCharacter;
