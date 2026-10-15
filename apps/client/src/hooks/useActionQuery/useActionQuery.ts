import { useQuery } from '@tanstack/react-query';
import getAction from './getAction';

const useActionQuery = (actionId: number) => {
  return useQuery({
    queryKey: ['action', actionId],
    queryFn: () => getAction.fetch(actionId),
  });
};

export default useActionQuery;
