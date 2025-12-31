import useCharacterStatMutation from './useResetCharacterStatMutation';
import useCharacter from 'src/hooks/useCharacter';

const useCharacterStatHandlers = (characterId: number) => {
  const { filteredCharacter: character } = useCharacter(characterId);

  const editCharacterStat = useCharacterStatMutation();

  const handleCurrentHealth = (value: number) => {
    if (!character) return;
    if (value + character.stats.currentHealth <= 0) {
      editCharacterStat.mutate({
        characterId: character.id,
        stat: 'currentHealth',
        value: character.stats.currentHealth * -1,
      });
    } else if (
      value + character?.stats.currentHealth >=
      character.stats.maxHealth
    ) {
      editCharacterStat.mutate({
        characterId: character.id,
        stat: 'currentHealth',
        value: character.stats.maxHealth - character.stats.currentHealth,
      });
    } else {
      editCharacterStat.mutate({
        characterId: character.id,
        stat: 'currentHealth',
        value,
      });
    }
  };

  const handleCurrentSanity = (value: number) => {
    if (!character) return;
    if (value + character.stats.currentSanity <= 0) {
      editCharacterStat.mutate({
        characterId: character.id,
        stat: 'currentSanity',
        value: character.stats.currentSanity * -1,
      });
    } else if (
      value + character.stats.currentSanity >=
      character.stats.maxSanity
    ) {
      editCharacterStat.mutate({
        characterId: character.id,
        stat: 'currentSanity',
        value: character.stats.maxSanity - character.stats.currentSanity,
      });
    } else {
      editCharacterStat.mutate({
        characterId: character.id,
        stat: 'currentSanity',
        value,
      });
    }
  };

  const handleCurrentActions = (value: number) => {
    if (!character) return;
    if (value + character.stats.currentActions < 0) {
      return;
    } else if (
      value + character.stats.currentActions >
      character.stats.actions
    ) {
      editCharacterStat.mutate({
        characterId: character.id,
        stat: 'currentActions',
        value: character.stats.actions - character.stats.currentActions,
      });
    } else {
      editCharacterStat.mutate({
        characterId: character.id,
        stat: 'currentActions',
        value,
      });
    }
  };

  const handleCurrentReactions = (value: number) => {
    if (!character) return;
    if (value + character.stats.currentReactions < 0) {
      return;
    } else if (
      value + character.stats.currentReactions >
      character.stats.reactions
    ) {
      editCharacterStat.mutate({
        characterId: character.id,
        stat: 'currentReactions',
        value: character.stats.reactions - character.stats.currentReactions,
      });
    } else {
      editCharacterStat.mutate({
        characterId: character.id,
        stat: 'currentReactions',
        value,
      });
    }
  };

  return {
    character,
    handleCurrentHealth,
    handleCurrentSanity,
    handleCurrentActions,
    handleCurrentReactions,
  };
};

export default useCharacterStatHandlers;
