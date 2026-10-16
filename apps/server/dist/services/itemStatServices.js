import prisma from '../config/database.js';
import { itemInclude } from './itemServices.js';
import { combineObjects } from '@gated/shared';
const itemStatServices = {
    resetItemStats: async (itemId, stats) => {
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
                stats: { ...typedStats, stats },
            },
            include: itemInclude,
        });
        return udpatedItem;
    },
    editItemStat: async (itemId, stats, userId) => {
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
        if (userId !== item?.characterInventory?.character?.userId) {
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
    },
};
export default itemStatServices;
