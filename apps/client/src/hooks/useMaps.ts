import { useSearchParams } from 'react-router-dom';
import useMapQueries from './useMapQueries/useMapQueries';

const useMaps = (mapIds: number[]) => {
  const [searchParams] = useSearchParams();

  const mapType = searchParams.get('mapType') || '';
  const draft = searchParams.get('draft');

  const { maps, isLoading } = useMapQueries(mapIds);

  const filteredMaps = maps?.filter((map) => {
    const draftBool = draft === 'true' ? true : false;
    return map.draft === draftBool && map.type === mapType;
  });

  return {
    maps: maps ? filteredMaps : [],
    isLoading,
  };
};

export default useMaps;
