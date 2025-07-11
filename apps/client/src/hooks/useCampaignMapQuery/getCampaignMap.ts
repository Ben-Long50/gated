import handleResponse from '../handleResponse';

const getCampaignMap = async (
  apiUrl: string,
  campaignId: number,
  mapId: number,
) => {
  try {
    const response = await fetch(
      `${apiUrl}/campaigns/${campaignId}/maps/${mapId}`,
      {
        method: 'GET',
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

export default getCampaignMap;
