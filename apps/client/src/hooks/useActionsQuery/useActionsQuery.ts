import { useQuery } from '@tanstack/react-query';
import getActions from './getActions';
import { Action } from '@gated/shared';

const useActionsQuery = () => {
  return useQuery<Action[]>({
    queryKey: ['actions'],
    queryFn: async () => await getActions(),
  });
};

export default useActionsQuery;
