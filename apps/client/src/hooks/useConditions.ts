import { useState } from 'react';
import useConditionsQuery from './useConditionsQuery/useConditionsQuery';
import { Condition } from '@gated/shared';

const useConditions = (conditionList?: Condition[]) => {
  const { data: conditions, isLoading, isPending } = useConditionsQuery();

  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');

  const list = conditionList || conditions;

  const filteredConditions =
    category.length > 0
      ? list?.filter(
          (condition: Condition) =>
            condition.conditionType === category &&
            condition.name.toLowerCase().includes(query.toLowerCase()),
        )
      : (list?.filter((condition: Condition) =>
          condition.name.toLowerCase().includes(query.toLowerCase()),
        ) ?? []);

  return {
    filteredConditions,
    query,
    category,
    setQuery,
    setCategory,
    isLoading,
    isPending,
  };
};

export default useConditions;
