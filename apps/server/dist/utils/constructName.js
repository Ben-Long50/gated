//@ts-nocheck
import { capitalCase } from 'change-case';
const constructName = (entity) => {
    if (!entity) {
        return '';
    }
    if (typeof entity === 'string') {
        return capitalCase(entity);
    }
    if (entity.firstName) {
        if (entity.lastName) {
            return `${entity.firstName} ${entity.lastName}`;
        }
        else {
            return entity.firstName;
        }
    }
    else {
        return entity.name;
    }
};
export default constructName;
