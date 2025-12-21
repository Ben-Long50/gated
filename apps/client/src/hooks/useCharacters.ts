import { useState } from 'react';
import { Character } from 'src/types/character';
import useCharacterQueries from './useCharactersQuery/useCharacterQueries';

const useCharacters = (
  characterIds: number[],
  playerCharacter?: boolean,
  includedNpcTypes?: string[],
  excludedNpcTypes?: string[],
) => {
  const { characters, isLoading: charactersLoading } = useCharacterQueries(
    characterIds?.map((character) => character.id) || [],
  );

  const [query, setQuery] = useState('');
  const [campaignId, setCampaignId] = useState<number | null>(null);

  const sortedCharacters = characters?.filter((character) => {
    if (!character) return false;

    const matchesType =
      playerCharacter === null || character.playerCharacter === playerCharacter;

    const matchesInclude =
      includedNpcTypes &&
      (includedNpcTypes.length === 0 ||
        includedNpcTypes.some((type) => character.npcTypes.includes(type)));

    const matchesExclude =
      excludedNpcTypes &&
      (excludedNpcTypes.length === 0 ||
        excludedNpcTypes.some((type) => !character.npcTypes.includes(type)));

    return matchesType && matchesInclude && matchesExclude;
  });

  const filteredCharacters = campaignId
    ? sortedCharacters?.filter((character: Character) => {
        const characterName = character?.firstName + ' ' + character?.lastName;
        return (
          character?.campaignId === campaignId &&
          characterName?.toLowerCase().includes(query.toLowerCase())
        );
      })
    : (sortedCharacters?.filter((character: Character) => {
        const characterName = character?.firstName + ' ' + character?.lastName;
        return characterName?.toLowerCase().includes(query.toLowerCase());
      }) ?? []);

  const activeCharacter = filteredCharacters?.find(
    (character) => character?.active === true,
  );

  const inactiveCharacters = filteredCharacters?.filter(
    (character) => character?.active === false,
  );

  const filterByQuery = (query: string) => {
    setQuery(query);
  };

  const filterByCampaign = (campaignId: number | null) => {
    setCampaignId(campaignId);
  };

  const resetList = () => {
    setQuery('');
  };

  return {
    characters: inactiveCharacters,
    activeCharacter,
    filterByQuery,
    filterByCampaign,
    resetList,
    isLoading: charactersLoading,
  };
};

export default useCharacters;
