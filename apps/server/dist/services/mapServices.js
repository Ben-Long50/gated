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
        orderBy: { character: { name: 'asc' } },
    },
    encounters: true,
    generatedPicture: { select: { publicId: true } },
};
const mapServices = {
    getCodexMaps: async () => {
        const maps = await prisma.map.findMany({
            where: { userId: null, baseMapId: null },
            select: { id: true },
        });
        return maps;
    },
    getBatchMaps: async (mapIds) => {
        const maps = await prisma.map.findMany({
            where: { id: { in: mapIds } },
            orderBy: { name: 'asc' },
            include: mapInclude,
        });
        return maps;
    },
    getMapById: async (mapId) => {
        const map = await prisma.map.findUnique({
            where: { id: mapId },
            include: mapInclude,
        });
        return map;
    },
    createOrUpdateCodexMap: async (formData) => {
        const { id } = formData, data = __rest(formData, ["id"]);
        const map = await prisma.map.upsert({
            where: { id: id || 0 },
            update: data,
            create: data,
            include: mapInclude,
        });
        return map;
    },
    createOrUpdateMap: async (userId, formData) => {
        const { id } = formData, data = __rest(formData, ["id"]);
        const map = await prisma.map.upsert({
            where: { id: id || 0 },
            update: data,
            create: Object.assign(Object.assign({}, data), { userId }),
            include: mapInclude,
        });
        return map;
    },
    deleteMap: async (mapId, userId) => {
        await prisma.map.delete({
            where: {
                id: mapId,
                OR: [{ userId }, { campaign: { ownerId: userId } }],
            },
        });
    },
};
export default mapServices;
