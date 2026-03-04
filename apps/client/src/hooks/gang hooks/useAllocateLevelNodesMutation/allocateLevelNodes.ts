import apiUrl from 'src/utils/configureUrl';
import handleResponse from '../../handleResponse';

const allocateLevelNodes = async (
  campaignId: number,
  gangId: number,
  levelNodeData: {
    sessionId: number;
    bonus: { value: number; description: string }[];
  },
) => {
  try {
    const response = await fetch(
      `${apiUrl}/campaigns/${campaignId}/gangs/${gangId}/levelNodes`,
      {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(levelNodeData),
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

export default allocateLevelNodes;
