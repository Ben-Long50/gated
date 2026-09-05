import { useState } from 'react';
import useCharacterQueries from './useCharactersQuery/useCharacterQueries';

const useCampaignCharacters = (characterIds: number[]) => {
  const { characters, isLoading } = useCharacterQueries(characterIds || []);

  const [query, setQuery] = useState('');

  const filteredCharacters = characters.filter((character) =>
    character?.name?.toLowerCase().includes(query.toLowerCase()),
  );

  const playerCharacters =
    filteredCharacters?.filter(
      (character) => character?.playerCharacter === true,
    ) || [];

  const nonPlayerCharacters =
    filteredCharacters?.filter(
      (character) => character?.playerCharacter === false,
    ) || [];

  return {
    playerCharacters,
    nonPlayerCharacters,
    query,
    setQuery,
    isLoading,
  };
};

export default useCampaignCharacters;
