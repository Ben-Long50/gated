import { useSearchParams } from 'react-router-dom';
import useMapQueries from './useMapQueries/useMapQueries';
import { useState } from 'react';

const useMaps = (mapIds: number[]) => {
  const [searchParams] = useSearchParams();

  const mapType = searchParams.get('mapType');
  const draft = searchParams.get('draft');

  const { maps, isLoading } = useMapQueries(mapIds);

  const [query, setQuery] = useState('');
  const [sizeQuery, setSizeQuery] = useState<{
    width: number | undefined;
    height: number | undefined;
  }>({ width: undefined, height: undefined });

  const filteredMaps = maps?.filter((map) => {
    const queryMatch =
      !query || map?.name.toLowerCase().includes(query.toLowerCase());
    const widthMatch = !sizeQuery.width || map?.width <= sizeQuery.width;
    const heightMatch = !sizeQuery.height || map?.height <= sizeQuery.height;

    const match = queryMatch && widthMatch && heightMatch;

    if (draft == null && mapType == null && match) {
      return true;
    }

    const draftBool = draft === 'true' ? true : false;

    return map?.draft === draftBool && map?.type === mapType && match;
  });

  return {
    maps: maps ? filteredMaps : [],
    query,
    setQuery,
    sizeQuery,
    setSizeQuery,
    isLoading,
  };
};

export default useMaps;
