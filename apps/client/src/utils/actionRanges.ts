import { Character } from 'src/types/character';
import { Item } from 'src/types/item';

const actionRanges = {
  basicMovement: (character: Character, item: Item) => {
    return character.stats.speed;
  },
  strike: (character: Character, item: Item) => {
    return item.stats.range || 1;
  },
  haymaker: (character: Character, item: Item) => {
    return item.stats.range || 1;
  },
  flurry: (character: Character, item: Item) => {
    return item.stats.range || 1;
  },
  charge: (character: Character, item: Item) => {
    return character.stats.speed + 2 || 1;
  },
  throw: (character: Character, item: Item) => {
    return character.attributes.violence.skills.assault.points + 4 || 4;
  },
  singleShot: (character: Character, item: Item) => {
    const isRifle = item.keywords.some(
      (keyword) => keyword.keyword.name === 'Rifle',
    );
    const isBraced = item.conditions.some(
      (condition) => condition.condition.name === 'Braced',
    );

    if (isRifle && isBraced && item.stats.range) {
      return item.stats.range * 1.5;
    } else {
      return item.stats.range || 1;
    }
  },
  salvo: (character: Character, item: Item) => {
    const isRifle = item.keywords.some(
      (keyword) => keyword.keyword.name === 'Rifle',
    );
    const isBraced = item.conditions.some(
      (condition) => condition.condition.name === 'Braced',
    );

    if (isRifle && isBraced && item.stats.range) {
      return item.stats.range * 1.5;
    } else {
      return item.stats.range || 1;
    }
  },
};

export default actionRanges;
