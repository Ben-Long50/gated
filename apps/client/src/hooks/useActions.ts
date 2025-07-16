import { useContext, useState } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import useActionsQuery from './useActionsQuery/useActionsQuery';
import { Action } from '../types/action';

const useActions = (uniqueActions?: Action[]) => {
  const { data: actions, isLoading, isPending } = useActionsQuery();

  const list = uniqueActions ? [...uniqueActions, ...actions] : actions;

  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
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

  const generalActions =
    category.length > 0
      ? subCategory.length > 0
        ? list?.filter(
            (action: Action) =>
              action.actionType === category &&
              !action.actionSubtypes.includes('unique') &&
              action.actionSubtypes.includes(subCategory) &&
              action.name.toLowerCase().includes(query.toLowerCase()),
          )
        : list?.filter(
            (action: Action) =>
              action.actionType === category &&
              !action.actionSubtypes.includes('unique') &&
              action.name.toLowerCase().includes(query.toLowerCase()),
          )
      : subCategory.length > 0
        ? list?.filter(
            (action: Action) =>
              !action.actionSubtypes.includes('unique') &&
              action.actionSubtypes.includes(subCategory) &&
              action.name.toLowerCase().includes(query.toLowerCase()),
          )
        : (list?.filter(
            (action: Action) =>
              !action.actionSubtypes.includes('unique') &&
              action.name.toLowerCase().includes(query.toLowerCase()),
          ) ?? []);

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
    generalActions,
    filterByQuery,
    filterByCategory,
    filterBySubCategory,
    resetList,
    isLoading,
    isPending,
  };
};

export default useActions;
