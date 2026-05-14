import { useState } from 'react';
import { Character } from 'src/types/character';
import useCharacterQueries from './useCharactersQuery/useCharacterQueries';

const useCharacters = (
  characterIds: number[],
  playerCharacter?: boolean | null,
  npcTypes?: string[],
) => {
  const { characters, isLoading: charactersLoading } =
    useCharacterQueries(characterIds);

  const [query, setQuery] = useState('');
  const [campaignId, setCampaignId] = useState<number | null>(null);

  const sortedCharacters = characters?.filter((character) => {
    if (!character) return false;

    const matchesType =
      playerCharacter != null
        ? character.playerCharacter === playerCharacter
        : true;

    const matchesNpcType =
      npcTypes && npcTypes.length > 0
        ? character.npcTypes?.some((type) => npcTypes.includes(type))
        : true;

    return playerCharacter ? matchesType : matchesType && matchesNpcType;
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
    characters: filteredCharacters,
    filterByQuery,
    filterByCampaign,
    resetList,
    isLoading: charactersLoading,
  };
};

export default useCharacters;
