import { useQuery } from '@tanstack/react-query';
import getActions from './getActions';
import { Action } from 'src/types/action';

const useActionsQuery = () => {
  return useQuery<Action[]>({
    queryKey: ['actions'],
    queryFn: async () => await getActions(),
  });
};

export default useActionsQuery;
