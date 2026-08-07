import { useContext } from 'react';
import { AuthContext } from 'src/contexts/AuthContext';
import { Character } from 'src/types/character';
import useCharacterQuery from './useCharacterQuery/useCharacterQuery';
import { CampaignContext } from 'src/contexts/CampaignContext';
import calculateCharacterStats from 'src/utils/characterStatUtils';
import useItems from './useItems';
import { combineAttributeTrees } from 'src/utils/combineAttributeTrees';
import emptyAttributeTree from 'src/utils/constants/emptyAttributeTree';

const useCharacter = (characterId: number) => {
  const { user } = useContext(AuthContext);
  const { gameMaster } = useContext(CampaignContext);

  const {
    data: character,
    isLoading: characterLoading,
    isPending: characterPending,
  } = useCharacterQuery(characterId);

  const itemIds = character
    ? character.characterInventory.items.filter(Boolean).map((item) => item.id)
    : [];

  const {
    items,
    isLoading: itemsLoading,
    isPending: itemsPending,
  } = useItems(itemIds);

  const levelBonusAttributeTrees = character
    ? character?.characterLevelBonuses
        .filter((bonus) => Boolean(bonus.attributes))
        .map((bonus) => bonus.attributes)
    : [];

  const attributes = combineAttributeTrees(levelBonusAttributeTrees);

  const perks = character
    ? character?.characterLevelBonuses
        .filter((bonus) => Boolean(bonus.perks))
        .flatMap((bonus) => bonus.perks)
    : [];

  const equipment = items
    ? {
        all: items?.filter((item) => item?.equipped === true),
        weapons: items?.filter(
          (item) =>
            item?.itemTypes.includes('weapon') && item?.equipped === true,
        ),
        armors: items?.filter(
          (item) =>
            item?.itemTypes.includes('armor') && item?.equipped === true,
        ),
        augmentations: items?.filter(
          (item) =>
            (item?.itemTypes.includes('cybernetic') ||
              item?.itemTypes.includes('mutation')) &&
            item?.equipped === true,
        ),
        vehicles: items?.filter(
          (item) =>
            item?.itemTypes.includes('vehicle') && item?.equipped === true,
        ),
        drones: items?.filter(
          (item) =>
            item?.itemTypes.includes('drone') && item?.equipped === true,
        ),
        modifications: items?.filter(
          (item) =>
            item?.itemTypes.includes('modification') && item?.equipped === true,
        ),
        reusables: items?.filter(
          (item) =>
            item?.itemTypes.includes('reusable') && item?.equipped === true,
        ),
        consumables: items?.filter(
          (item) =>
            item?.itemTypes.includes('consumable') && item?.equipped === true,
        ),
      }
    : null;

  const actions = equipment
    ? [
        ...Object.values(equipment).flatMap((items) =>
          items.flatMap((item) => item.itemLinkReference.actions),
        ),
        ...perks.flatMap((perk) => perk.actions),
      ]
    : [];

  const stats =
    character && equipment
      ? calculateCharacterStats(
          character,
          attributes,
          perks,
          equipment,
          actions,
        )
      : {};

  const filterByPreferences = (character: Character) => {
    const characterOwner = gameMaster || character?.userId === user?.id;

    return {
      ...character,
      firstName:
        characterOwner || character?.preferences?.firstName
          ? character?.firstName
          : '???',
      lastName:
        characterOwner || character?.preferences?.lastName
          ? character?.lastName
          : '???',
      level:
        characterOwner || character?.preferences?.level
          ? character?.level
          : '??',
      profits:
        characterOwner || character?.preferences?.profits
          ? character?.profits
          : '???',
      height:
        characterOwner || character?.preferences?.height
          ? character?.height
          : '???',
      weight:
        characterOwner || character?.preferences?.weight
          ? character?.weight
          : '???',
      age:
        characterOwner || character?.preferences?.age ? character?.age : '???',
      sex:
        characterOwner || character?.preferences?.sex ? character?.sex : '???',
      picture:
        characterOwner || character?.preferences?.picture
          ? character?.picture
          : false,
      backstory:
        characterOwner || character?.preferences?.backstory
          ? character?.backstory
          : { html: '<h1>?????</h1>' },
      firstTaste:
        characterOwner || character?.preferences?.backstory
          ? character?.firstTaste
          : { html: '<h1>?????</h1>' },
      badMedicine:
        characterOwner || character?.preferences?.backstory
          ? character?.badMedicine
          : { html: '<h1>?????</h1>' },
      stats: Object.fromEntries(
        Object.entries(stats).map(([stat, value]) => {
          if (characterOwner || character?.preferences?.stats) {
            return [stat, value];
          } else {
            return [stat, '??'];
          }
        }),
      ),
      attributes:
        characterOwner || character?.preferences?.attributes
          ? attributes
          : emptyAttributeTree,
      perks: characterOwner || character?.preferences?.perks ? perks : null,
      equipment:
        characterOwner || character?.preferences?.equipment ? equipment : null,
      inventory:
        characterOwner || character?.preferences?.equipment ? items : null,
      actions:
        characterOwner || character?.preferences?.equipment ? actions : null,
    };
  };

  const filteredCharacter = filterByPreferences(character);

  return {
    filteredCharacter: character ? filteredCharacter : null,
    isLoading: characterLoading || itemsLoading,
    isPending: characterPending || itemsPending,
  };
};

export default useCharacter;
