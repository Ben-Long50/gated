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
const perkServices = {
    getPerks: async () => {
        try {
            const perks = await prisma.perk.findMany({
                orderBy: { name: 'asc' },
            });
            return perks;
        }
        catch (error) {
            console.error(error);
            throw new Error('Failed to fetch perks');
        }
    },
    getBatchPerks: async (perkIds) => {
        try {
            const perks = await prisma.perk.findMany({
                where: {
                    id: { in: perkIds },
                },
            });
            return perks;
        }
        catch (error) {
            console.error(error);
            throw new Error('Failed to fetch perks');
        }
    },
    getPerkById: async (perkId) => {
        try {
            const perk = await prisma.perk.findUnique({
                where: { id: perkId },
            });
            return perk;
        }
        catch (error) {
            console.error(error);
            throw new Error('Failed to fetch perk');
        }
    },
    createPerk: async (formData) => {
        try {
            const { id } = formData, data = __rest(formData, ["id"]);
            const perk = await prisma.perk.upsert({
                where: { id: id || 0 },
                update: data,
                create: data,
            });
            return perk;
        }
        catch (error) {
            console.error(error);
            throw new Error('Failed to create or update perk');
        }
    },
    deletePerk: async (perkId) => {
        try {
            await prisma.perk.delete({
                where: {
                    id: perkId,
                },
            });
        }
        catch (error) {
            console.error(error);
            throw new Error('Failed to delete perk');
        }
    },
};
export default perkServices;
