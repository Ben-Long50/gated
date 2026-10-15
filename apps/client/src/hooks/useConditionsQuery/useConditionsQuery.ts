import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Condition } from 'src/types/condition';
import { useEffect } from 'react';
import getConditions from './getConditions';

const useConditionsQuery = () => {
  const queryClient = useQueryClient();

  const conditions = useQuery<Condition[]>({
    queryKey: ['conditions'],
    queryFn: async () => await getConditions(),
  });

  useEffect(() => {
    if (conditions.data) {
      conditions.data.map((condition) =>
        queryClient.setQueryData(['condition', condition.id], condition),
      );
    }
  }, [conditions, queryClient]);

  return conditions;
};

export default useConditionsQuery;
