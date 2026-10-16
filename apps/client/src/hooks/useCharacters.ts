import { useState } from 'react';
import { Character } from '@gated/shared';
import { useSearchParams } from 'react-router-dom';
import { checkArrayMatch } from '@gated/shared';
import useCharacterQueries from './character hooks/useUpdateCharacterLevelMutation/useCharactersQuery/useCharacterQueries';

const useCharacters = (characterIds: number[]) => {
  const [filters, setFilters] = useState<{
    playerCharacter: boolean | null;
    npcTypes: string[] | null;
    query: string;
    campaignId: number | null;
  }>({
    playerCharacter: null,
    npcTypes: null,
    query: '',
    campaignId: null,
  });
  const [searchParams] = useSearchParams();

  const characterType = searchParams.get('characterType');

  const playerCharacter =
    filters.playerCharacter ??
    (characterType == null
      ? null
      : characterType === 'playerCharacter'
        ? true
        : false);

  const npcTypes = filters.npcTypes ?? searchParams.getAll('npcType');

  const { characters, isLoading: charactersLoading } =
    useCharacterQueries(characterIds);

  const sortedCharacters = characters
    ?.filter((character) => {
      if (!character) return false;

      const matchesType =
        playerCharacter != null
          ? character.playerCharacter === playerCharacter
          : true;

      const matchesNpcType =
        playerCharacter == null
          ? true
          : checkArrayMatch(npcTypes, character.npcTypes) ||
            character.npcTypes?.some((type) => npcTypes.includes(type));

      return playerCharacter ? matchesType : matchesType && matchesNpcType;
    })
    .sort((a, b) => a.name.localeCompare(b.name));

  const filteredCharacters = filters.campaignId
    ? sortedCharacters?.filter((character) => {
        return (
          character?.campaignId === filters.campaignId &&
          character?.name.toLowerCase().includes(filters.query.toLowerCase())
        );
      })
    : (sortedCharacters?.filter((character) => {
        return character?.name
          .toLowerCase()
          .includes(filters.query.toLowerCase());
      }) ?? []);

  return {
    characters: filteredCharacters,
    filters,
    setFilters,
    isLoading: charactersLoading,
  };
};

export default useCharacters;
