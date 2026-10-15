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
const propertyInclude = {
    gang: true,
    generatedPicture: { select: { publicId: true } },
};
const propertyServices = {
    getBaseProperties: async () => {
        const properties = await prisma.property.findMany({
            where: { basePropertyId: null },
            include: propertyInclude,
        });
        return properties;
    },
    getBatchProperties: async (propertyIds) => {
        const properties = await prisma.property.findMany({
            where: { id: { in: propertyIds } },
            include: propertyInclude,
        });
        return properties;
    },
    getPropertyById: async (propertyId) => {
        const property = await prisma.property.findUnique({
            where: { id: propertyId },
            include: propertyInclude,
        });
        return property;
    },
    createOrUpdateBaseProperty: async (formData) => {
        const { id } = formData, data = __rest(formData, ["id"]);
        const property = await prisma.property.upsert({
            where: { id: id || 0 },
            update: data,
            create: data,
        });
        return property;
    },
    deleteProperty: async (propertyId) => {
        await prisma.property.delete({
            where: {
                id: propertyId,
            },
        });
    },
};
export default propertyServices;
