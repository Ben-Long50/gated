import prisma from '../config/database.js';
import getStatsObject from '../utils/getStatsObject.js';
const itemStatServices = {
    resetItemStats: async (itemId, value) => {
        try {
            const item = await prisma.item.findUnique({
                where: {
                    id: Number(itemId),
                },
                select: { stats: true },
            });
            if (!item) {
                throw new Error('Item not found');
            }
            const statsObject = item.stats;
            const newStats = Object.assign(Object.assign({}, statsObject), value);
            await prisma.item.update({
                where: {
                    id: Number(itemId),
                },
                data: {
                    stats: newStats,
                },
            });
        }
        catch (error) {
            console.error(error);
            throw new Error(`Failed to update item stats ${value.toString()}`);
        }
    },
    editItemStat: async (itemId, value, userId) => {
        var _a, _b;
        try {
            const item = await prisma.item.findUnique({
                where: {
                    id: Number(itemId),
                },
                select: {
                    stats: true,
                    modifiedStats: true,
                    characterInventory: {
                        include: { character: { select: { userId: true } } },
                    },
                },
            });
            if (userId !== ((_b = (_a = item === null || item === void 0 ? void 0 : item.characterInventory) === null || _a === void 0 ? void 0 : _a.character) === null || _b === void 0 ? void 0 : _b.userId)) {
                throw new Error('You can only perform this action on a weapon your character owns');
            }
            if (!item) {
                throw new Error('Armor not found');
            }
            const statsObject = getStatsObject(item);
            let adjustedValues = Object.fromEntries(Object.entries(value).map(([stat, value]) => [
                stat,
                statsObject[stat] + value,
            ]));
            const newStats = Object.assign(Object.assign({}, statsObject), adjustedValues);
            await prisma.item.update({
                where: {
                    id: itemId,
                },
                data: {
                    stats: newStats,
                },
            });
        }
        catch (error) {
            console.error(error);
            throw new Error('Failed to update current block points');
        }
    },
};
export default itemStatServices;
