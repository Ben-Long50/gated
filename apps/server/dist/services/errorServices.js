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
        const errorReports = await prisma.error.findMany({
            include: { user: true },
            orderBy: { createdAt: 'desc' },
        });
        return errorReports;
    },
    createErrorReport: async (formData, userId) => {
        const { id } = formData, data = __rest(formData, ["id"]);
        const errorReport = await prisma.error.create({
            data: Object.assign(Object.assign({}, data), { userId }),
        });
        return errorReport;
    },
    deleteErrorReport: async (errorId) => {
        await prisma.error.delete({
            where: {
                id: errorId,
            },
        });
    },
};
export default errorServices;
