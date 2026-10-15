import apiUrl from 'src/utils/configureUrl';
import handleResponse from '../../handleResponse';

const allocateReputation = async (
  campaignId: number,
  gangId: number,
  reputationData: {
    sessionId: number;
    bonus: { value: number; description: string }[];
  },
) => {
  try {
    const response = await fetch(
      `${apiUrl}/campaigns/${campaignId}/gangs/${gangId}/reputation`,
      {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reputationData),
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

export default allocateReputation;
