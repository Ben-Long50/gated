import { useState } from 'react';
import { Character } from 'src/types/character';
import { useSearchParams } from 'react-router-dom';
import { checkArrayMatch } from 'src/utils/checkArrayMatch';
import useCharacterQueries from './character hooks/useUpdateCharacterLevelMutation/useCharactersQuery/useCharacterQueries';

const useCharacters = (characterIds: number[]) => {
  const [filters, setFilters] = useState<{
    playerCharacter: boolean | null;
    npcTypes: string[] | null;
  }>({
    playerCharacter: null,
    npcTypes: null,
  });
  const [searchParams] = useSearchParams();

  const characterType = searchParams.get('characterType');

  const playerCharacter =
    filters.playerCharacter ??
    (characterType === 'playerCharacter' ? true : false);
  const npcTypes = filters.npcTypes ?? searchParams.getAll('npcType');

  const { characters, isLoading: charactersLoading } =
    useCharacterQueries(characterIds);

  const [query, setQuery] = useState('');
  const [campaignId, setCampaignId] = useState<number | null>(null);

  const sortedCharacters = characters
    ?.filter((character) => {
      if (!character) return false;

      const matchesType =
        playerCharacter != null
          ? character.playerCharacter === playerCharacter
          : true;

      const matchesNpcType = checkArrayMatch(npcTypes, character.npcTypes);

      return playerCharacter ? matchesType : matchesType && matchesNpcType;
    })
    .sort((a, b) => a.name.localeCompare(b.name));

  const filteredCharacters = campaignId
    ? sortedCharacters?.filter((character: Character) => {
        return (
          character?.campaignId === campaignId &&
          character?.name.toLowerCase().includes(query.toLowerCase())
        );
      })
    : (sortedCharacters?.filter((character: Character) => {
        return character?.name.toLowerCase().includes(query.toLowerCase());
      }) ?? []);

  return {
    characters: filteredCharacters,
    filters,
    setFilters,
    query,
    campaignId,
    setQuery,
    setCampaignId,
    isLoading: charactersLoading,
  };
};

export default useCharacters;
