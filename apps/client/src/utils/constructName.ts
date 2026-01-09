import { Character } from 'src/types/character';
import { Item } from 'src/types/item';

const constructName = (entity: Character | Item) => {
  if (!entity) {
    return '';
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
