import itemServices from '../services/itemServices.js';
const reactionFuncs = {
    parry: async (item, successes) => {
        if (item) {
            await itemServices.setItemNotAvailable(item.id);
        }
        return { reducedSuccesses: successes };
    },
};
export default reactionFuncs;
