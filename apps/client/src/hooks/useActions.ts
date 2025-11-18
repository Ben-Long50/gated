import { useState } from 'react';
import useActionsQuery from './useActionsQuery/useActionsQuery';
import { Action } from '../types/action';

const useActions = (characterActions?: Action[], initialCategory?: string) => {
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
  const [subCategory, setSubCategory] = useState('');

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

  const actionLists = {
    actions: list?.filter((action) => action.actionType === 'action'),
    reactions: list?.filter((action) => action.actionType === 'reaction'),
    passives: list?.filter((action) => action.actionType === 'passive'),
    extendedActions: list?.filter(
      (action) => action.actionType === 'extendedAction',
    ),
    attacks: list?.filter((action) => action.actionSubtypes.includes('attack')),
    movements: list?.filter((action) =>
      action.actionSubtypes.includes('movement'),
    ),
    uniques: list?.filter((action) => action.actionSubtypes.includes('unique')),
  };

  const filterByQuery = (query: string) => {
    setQuery(query);
  };

  const filterByCategory = (category: string) => {
    setCategory(category);
  };

  const filterBySubCategory = (subCategory: string) => {
    setSubCategory(subCategory);
  };

  const resetList = () => {
    setQuery('');
  };

  return {
    filteredActions,
    category,
    filterByQuery,
    filterByCategory,
    filterBySubCategory,
    resetList,
    isLoading,
    isPending,
  };
};

export default useActions;
