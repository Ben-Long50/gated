import { useState } from 'react';
import useCharacterQueries from './useCharactersQuery/useCharacterQueries';

const useCampaignCharacters = (characterIds: number[]) => {
  const { characters, isLoading } = useCharacterQueries(characterIds || []);

  const [query, setQuery] = useState('');

  const filteredCharacters = characters.filter(
    (character) =>
      character?.firstName?.toLowerCase().includes(query.toLowerCase()) ||
      character?.lastName?.toLowerCase().includes(query.toLowerCase()),
  );

  const playerCharacters =
    filteredCharacters?.filter(
      (character) => character?.playerCharacter === true,
    ) || [];

  const nonPlayerCharacters =
    filteredCharacters?.filter(
      (character) => character?.playerCharacter === false,
    ) || [];

  const filterByQuery = (query: string) => {
    setQuery(query);
  };

  const resetList = () => {
    setQuery('');
  };

  return {
    playerCharacters,
    nonPlayerCharacters,
    filterByQuery,
    resetList,
    isLoading,
  };
};

export default useCampaignCharacters;
