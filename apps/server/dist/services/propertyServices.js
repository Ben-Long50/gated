import prisma from '../config/database.js';
const propertyServices = {
    getBaseProperties: async () => {
        try {
            const properties = await prisma.property.findMany({
                where: { basePropertyId: null },
                include: {
                    gang: true,
                },
            });
            return properties;
        }
        catch (error) {
            console.error(error);
            throw new Error('Failed to fetch owner properties');
        }
    },
    getBatchProperties: async (propertyIds) => {
        try {
            const properties = await prisma.property.findMany({
                where: { id: { in: propertyIds } },
                include: {
                    gang: true,
                },
            });
            return properties;
        }
        catch (error) {
            console.error(error);
            throw new Error('Failed to fetch properties');
        }
    },
    getPropertyById: async (propertyId) => {
        try {
            const property = await prisma.property.findUnique({
                where: { id: propertyId },
                include: {
                    gang: true,
                },
            });
            return property;
        }
        catch (error) {
            console.error(error);
            throw new Error('Failed to fetch property');
        }
    },
    createOrUpdateBaseProperty: async (formData) => {
        const data = {
            name: formData.name,
            description: formData.description,
            picture: formData.picture,
            gpPrice: formData.gpPrice,
            type: formData.type,
        };
        try {
            const property = await prisma.property.upsert({
                where: { id: (formData === null || formData === void 0 ? void 0 : formData.id) || 0 },
                update: Object.assign({}, data),
                create: Object.assign({}, data),
            });
            return property;
        }
        catch (error) {
            console.error(error);
            throw new Error('Failed to create or update property');
        }
    },
    deleteProperty: async (propertyId) => {
        try {
            await prisma.property.delete({
                where: {
                    id: propertyId,
                },
            });
        }
        catch (error) {
            console.error(error);
            throw new Error(error.message || 'Failed to delete property');
        }
    },
};
export default propertyServices;
