import prisma from '../config/database.js';
import combineObjects from '../utils/combineObjects.js';
import { itemInclude } from './itemServices.js';
const itemStatServices = {
    resetItemStats: async (itemId, stats) => {
        try {
            const item = await prisma.item.findUnique({
                where: {
                    id: itemId,
                },
                select: { stats: true },
            });
            if (!item) {
                throw new Error('Item not found');
            }
            const typedStats = item.stats;
            const udpatedItem = await prisma.item.update({
                where: {
                    id: itemId,
                },
                data: {
                    stats: Object.assign(Object.assign({}, typedStats), { stats }),
                },
                include: itemInclude,
            });
            return udpatedItem;
        }
        catch (error) {
            console.error(error);
            throw new Error(`Failed to reset item stats`);
        }
    },
    editItemStat: async (itemId, stats, userId) => {
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
            const typedStats = item.stats;
            const updatedItem = await prisma.item.update({
                where: {
                    id: itemId,
                },
                data: {
                    stats: combineObjects(typedStats, stats),
                },
                include: itemInclude,
            });
            return updatedItem;
        }
        catch (error) {
            console.error(error);
            throw new Error('Failed to update stats');
        }
    },
};
export default itemStatServices;
