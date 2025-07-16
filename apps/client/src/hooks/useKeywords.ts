import { useContext, useState } from 'react';
import useKeywordsQuery from './useKeywordsQuery/useKeywordsQuery';
import { AuthContext } from '../contexts/AuthContext';
import { Keyword } from '../types/keyword';

const useKeywords = (initialCategory?: string) => {
  const { data: keywords, isLoading, isPending } = useKeywordsQuery();

  const [query, setQuery] = useState('');
  const [category, setCategory] = useState(initialCategory || '');

  const filteredKeywords =
    category.length > 0
      ? keywords?.filter(
          (keyword: Keyword) =>
            keyword.keywordType === category &&
            keyword.name.toLowerCase().includes(query.toLowerCase()),
        )
      : (keywords?.filter((keyword: Keyword) =>
          keyword.name.toLowerCase().includes(query.toLowerCase()),
        ) ?? []);

  const filterByQuery = (query: string) => {
    setQuery(query);
  };

  const filterByCategory = (category: string) => {
    setCategory(category);
  };

  const resetList = () => {
    setQuery('');
  };

  return {
    keywords,
    filteredKeywords,
    filterByQuery,
    filterByCategory,
    resetList,
    isLoading,
    isPending,
  };
};

export default useKeywords;
