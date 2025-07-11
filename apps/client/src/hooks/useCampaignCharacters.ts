import { useMemo, useState } from 'react';
import useCharacterQueries from './useCharactersQuery/useCharacterQueries';

const useCampaignCharacters = (characterIds: number[]) => {
  const { characters, isLoading } = useCharacterQueries(characterIds || []);

  const [query, setQuery] = useState('');

  const playerCharacters =
    useMemo(
      () =>
        characters?.filter((character) => character?.playerCharacter === true),
      [characters],
    ) || [];

  const nonPlayerCharacters =
    useMemo(
      () =>
        characters?.filter((character) => character?.playerCharacter === false),
      [characters],
    ) || [];

  const filterByQuery = (query: string) => {
    setQuery(query);
  };

  const resetList = () => {
    setQuery('');
  };
  console.log(playerCharacters);

  return {
    playerCharacters,
    nonPlayerCharacters,
    filterByQuery,
    resetList,
    isLoading,
  };
};

export default useCampaignCharacters;
