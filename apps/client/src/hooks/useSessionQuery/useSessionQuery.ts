import { useQuery } from '@tanstack/react-query';
import getSession from './getSession';
import { Session } from '@gated/shared';

const useSessionQuery = (campaignId: number, sessionId: number) => {
  return useQuery<Session>({
    queryKey: ['session', sessionId],
    queryFn: async () => await getSession(campaignId, sessionId),
    throwOnError: false,
  });
};

export default useSessionQuery;
