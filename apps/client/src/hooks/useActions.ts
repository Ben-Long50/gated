import { useState } from 'react';
import useActionsQuery from './useActionsQuery/useActionsQuery';
import { Action } from '../types/action';

const useActions = (characterActions?: Action[]) => {
  const { data: actions, isLoading } = useActionsQuery();

  const generalActions =
    actions?.filter((action) => !action.parentItemId && !action.baseActionId) ||
    [];

  let filteredActions = characterActions
    ? [...characterActions, ...generalActions]
    : generalActions;

  const [query, setQuery] = useState('');
  const [types, setTypes] = useState([]);
  const [subTypes, setSubtypes] = useState([]);

  filteredActions = filteredActions?.filter((action) => {
    const matchesType =
      types.length === 0 || types.some((t) => t === action.actionType);
    const matchesSubtype =
      subTypes.length === 0 ||
      subTypes.some((t) => action.actionSubtypes.includes(t));
    const matchesQuery = action.name.includes(query);

    return matchesType && matchesSubtype && matchesQuery;
  });

  return {
    actions: filteredActions,
    query,
    types,
    setTypes,
    setQuery,
    subTypes,
    setSubtypes,
    isLoading,
  };
};

export default useActions;
