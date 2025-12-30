// @ts-nocheck
import itemServices from '../services/itemServices.js';
const actionFuncs = {
    strike: async (item, successes) => {
        let damage = item.stats.damage || 0;
        let sanityDamage = item.stats.sanityDamage || 0;
        let instances = 0;
        if (successes > 0) {
            instances = 1;
        }
        if (item) {
            await itemServices.setItemNotAvailable(item.id);
        }
        return { damage, sanityDamage, instances };
    },
    haymaker: async (item, successes) => {
        let damage = item && item.keywords.length > 0
            ? item.keywords.some((keyword) => keyword.keyword.name === '2H')
                ? item.stats.damage + 3
                : item.stats.damage + 2
            : 0;
        let sanityDamage = item && item.keywords.length > 0
            ? item.keywords.some((keyword) => keyword.keyword.name === '2H')
                ? item.stats.sanityDamage + 3
                : item.stats.sanityDamage + 2
            : 0;
        let instances = 0;
        if (successes > 0) {
            instances = 1;
        }
        if (item) {
            await itemServices.setItemNotAvailable(item.id);
        }
        return { damage, sanityDamage, instances };
    },
    flurry: async (item, successes) => {
        let damage = item.stats.damage || 0;
        let sanityDamage = item.stats.sanityDamage || 0;
        let instances = 0;
        if (successes > 0) {
            const maxSuccesses = item.stats.flurry || 1;
            if (successes < maxSuccesses) {
                instances = successes;
            }
            else {
                instances = maxSuccesses;
            }
        }
        if (item) {
            await itemServices.setItemNotAvailable(item.id);
        }
        return { damage, sanityDamage, instances };
    },
    singleShot: async (item, successes) => {
        let damage = item.stats.damage || 0;
        let sanityDamage = item.stats.sanityDamage || 0;
        let instances = 0;
        if (successes > 0) {
            instances = 1;
        }
        if (item) {
            await itemServices.setItemNotAvailable(item.id);
        }
        return { damage, sanityDamage, instances };
    },
    salvo: async (item, successes) => {
        let damage = item.stats.damage || 0;
        let sanityDamage = item.stats.sanityDamage || 0;
        let instances = 0;
        if (successes > 0) {
            const maxSuccesses = item.stats.salvo || 1;
            if (successes < maxSuccesses) {
                instances = successes;
            }
            else {
                instances = maxSuccesses;
            }
        }
        if (item) {
            await itemServices.setItemNotAvailable(item.id);
        }
        return { damage, sanityDamage, instances };
    },
    block: (blockData) => {
        const blockedDamage = blockData.reduce((sum, data) => sum + data.blockedDamage, 0);
        const blockedSanityDamage = blockData.reduce((sum, data) => sum + data.blockedSanityDamage, 0);
        return { blockedDamage, blockedSanityDamage };
    },
};
export default actionFuncs;
