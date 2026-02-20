import { capitalCase } from 'change-case';
import { Character } from 'src/types/character';
import { Item } from 'src/types/item';

const constructName = (entity: Character | Item | string) => {
  if (!entity) {
    return '';
  }
  if (typeof entity === 'string') {
    return capitalCase(entity);
  }
  if (entity.firstName) {
    if (entity.lastName) {
      return `${entity.firstName} ${entity.lastName}`;
    } else {
      return entity.firstName;
    }
  } else {
    return entity.name;
  }
};

export default constructName;
