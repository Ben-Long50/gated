import { useState } from 'react';
import useActionsQuery from './useActionsQuery/useActionsQuery';
import { Action } from '../types/action';

const useActions = (
  characterActions?: Action[],
  initialCategory?: string,
  initialSubcategory?: string,
) => {
  const { data: actions, isLoading, isPending } = useActionsQuery();

  const generalActions =
    actions?.filter(
      (action) => !action.itemLinkId && !action.characterInventoryId,
    ) || [];

  const list = characterActions
    ? [...characterActions, ...generalActions]
    : actions;

  const [query, setQuery] = useState('');
  const [category, setCategory] = useState(initialCategory || '');
  const [subCategory, setSubCategory] = useState(initialSubcategory || '');

  const filteredActions =
    category.length > 0
      ? subCategory.length > 0
        ? list?.filter(
            (action: Action) =>
              action.actionType === category &&
              action.actionSubtypes.includes(subCategory) &&
              action.name.toLowerCase().includes(query.toLowerCase()),
          )
        : list?.filter(
            (action: Action) =>
              action.actionType === category &&
              action.name.toLowerCase().includes(query.toLowerCase()),
          )
      : subCategory.length > 0
        ? list?.filter(
            (action: Action) =>
              action.actionSubtypes.includes(subCategory) &&
              action.name.toLowerCase().includes(query.toLowerCase()),
          )
        : (list?.filter((action: Action) =>
            action.name.toLowerCase().includes(query.toLowerCase()),
          ) ?? []);

  return {
    actions: filteredActions,
    query,
    category,
    subCategory,
    setQuery,
    setCategory,
    setSubCategory,
    isLoading,
    isPending,
  };
};

export default useActions;
