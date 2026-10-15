import apiUrl from 'src/utils/configureUrl';
import handleResponse from '../../handleResponse';

const confirmActionQueue = async (
  campaignId: number,
  encounterId: number,
  blockData: [
    key: string,
    { damage: number; blockedDamage: number; armorIds: number[] }[],
  ][],
) => {
  try {
    const response = await fetch(
      `${apiUrl}/campaigns/${campaignId}/encounters/${encounterId}/confirmActionQueue`,
      {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(blockData),
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

export default confirmActionQueue;
