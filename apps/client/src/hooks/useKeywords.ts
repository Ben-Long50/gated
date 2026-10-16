import { useState } from 'react';
import useKeywordsQuery from './useKeywordsQuery/useKeywordsQuery';
import { Keyword } from '@gated/shared';

const useKeywords = (initialCategory?: string) => {
  const { data: keywords, isLoading } = useKeywordsQuery();

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

  return {
    keywords: filteredKeywords,
    query,
    category,
    setQuery,
    setCategory,
    isLoading,
  };
};

export default useKeywords;
