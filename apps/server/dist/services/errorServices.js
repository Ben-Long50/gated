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
const errorServices = {
    getErrorReports: async () => {
        try {
            const errorReports = await prisma.error.findMany({
                include: { user: true },
                orderBy: { createdAt: 'desc' },
            });
            return errorReports;
        }
        catch (error) {
            console.error(error);
            throw new Error('Failed to fetch error reports');
        }
    },
    createErrorReport: async (formData, userId) => {
        try {
            const { id } = formData, data = __rest(formData, ["id"]);
            const errorReport = await prisma.error.create({
                data: Object.assign(Object.assign({}, data), { userId }),
            });
            return errorReport;
        }
        catch (error) {
            console.error(error);
            throw new Error('Failed to create error report');
        }
    },
    deleteErrorReport: async (errorId) => {
        try {
            await prisma.error.delete({
                where: {
                    id: errorId,
                },
            });
        }
        catch (error) {
            console.error(error);
            throw new Error('Failed to delete error report');
        }
    },
};
export default errorServices;
