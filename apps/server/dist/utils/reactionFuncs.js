//@ts-nocheck
import itemServices from '../services/itemServices.js';
const reactionFuncs = {
    parry: async (character, item, successes, tile) => {
        if (item) {
            await itemServices.setItemNotAvailable(item.id);
        }
        return { reducedSuccesses: successes };
    },
    opportunityAttack: async (character, item, successes, tile) => {
        let damage = item.stats.damage || 0;
        let sanityDamage = item.stats.sanityDamage || 0;
        let instances = 0;
        if (successes && successes > 0) {
            instances = 1;
        }
        if (item) {
            await itemServices.setItemNotAvailable(item.id);
        }
        return { damage, sanityDamage, instances };
    },
};
export default reactionFuncs;
