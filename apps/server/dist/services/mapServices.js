var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import prisma from '../config/database.js';
const mapInclude = {
    user: {
        select: {
            username: true,
        },
    },
    locations: {
        select: {
            id: true,
        },
        orderBy: { character: { firstName: 'asc' } },
    },
    encounters: true,
};
const mapServices = {
    getBatchMaps: async (mapIds) => {
        try {
            const maps = await prisma.map.findMany({
                where: { id: { in: mapIds } },
                include: mapInclude,
            });
            return maps;
        }
        catch (error) {
            console.error(error);
            throw new Error('Failed to fetch characters');
        }
    },
    getMapById: async (mapId) => {
        try {
            const map = await prisma.map.findUnique({
                where: { id: mapId },
                include: mapInclude,
            });
            return map;
        }
        catch (error) {
            console.error(error);
            throw new Error('Failed to fetch map');
        }
    },
    createOrUpdateMap: async (userId, formData) => {
        const { id } = formData, data = __rest(formData, ["id"]);
        try {
            const map = await prisma.map.upsert({
                where: { id: id || 0 },
                update: data,
                create: Object.assign(Object.assign({}, data), { userId }),
                include: mapInclude,
            });
            return map;
        }
        catch (error) {
            console.error(error);
            throw new Error('Failed to create or update map');
        }
    },
    deleteMap: async (mapId, userId) => {
        try {
            await prisma.map.delete({
                where: {
                    id: mapId,
                    OR: [{ userId }, { campaign: { ownerId: userId } }],
                },
            });
        }
        catch (error) {
            console.error(error);
            throw new Error('Failed to delete map');
        }
    },
};
export default mapServices;
