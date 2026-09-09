import { useState } from 'react';
import { Character } from 'src/types/character';
import useCharacterQueries from './useCharactersQuery/useCharacterQueries';
import { useSearchParams } from 'react-router-dom';
import { checkArrayMatch } from 'src/utils/checkArrayMatch';

const useCharacters = (characterIds: number[]) => {
  const [searchParams] = useSearchParams();

  const characterType = searchParams.get('characterType');
  const npcTypes = searchParams.getAll('npcType');

  let playerCharacter = null;

  if (characterType && characterType === 'playerCharacter') {
    playerCharacter = true;
  } else if (characterType && characterType === 'nonPlayerCharacter') {
    playerCharacter = false;
  }

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

      const matchesNpcType =
        npcTypes.length > 0
          ? character.npcTypes?.every((type) => npcTypes.includes(type))
          : true;

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
    params: characterType + ' ' + npcTypes.join(' '),
    query,
    campaignId,
    setQuery,
    setCampaignId,
    isLoading: charactersLoading,
  };
};

export default useCharacters;
