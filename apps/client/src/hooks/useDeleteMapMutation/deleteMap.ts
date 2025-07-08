import handleResponse from '../handleResponse';

const deleteMap = async (apiUrl: string, campaignId: number, mapId: number) => {
  try {
    const response = await fetch(
      `${apiUrl}/campaigns/${campaignId}/maps/${mapId}`,
      {
        method: 'DELETE',
        credentials: 'include',
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

export default deleteMap;
