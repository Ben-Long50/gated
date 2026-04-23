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
const patchNoteServices = {
    getPatchNotes: async () => {
        try {
            const patchNotes = await prisma.patchNote.findMany({
                orderBy: { createdAt: 'desc' },
            });
            return patchNotes;
        }
        catch (error) {
            console.error(error);
            throw new Error('Failed to fetch patch notes');
        }
    },
    getPatchNoteById: async (patchNoteId) => {
        try {
            const patchNote = await prisma.patchNote.findUnique({
                where: { id: patchNoteId },
            });
            return patchNote;
        }
        catch (error) {
            console.error(error);
            throw new Error('Failed to fetch patch note');
        }
    },
    createPatchNote: async (formData) => {
        try {
            const { id } = formData, data = __rest(formData, ["id"]);
            const patchNote = await prisma.patchNote.upsert({
                where: { id: id || 0 },
                update: data,
                create: data,
            });
            return patchNote;
        }
        catch (error) {
            console.error(error);
            throw new Error('Failed to create or update patch note');
        }
    },
    deletePatchNote: async (patchNoteId) => {
        try {
            await prisma.patchNote.delete({
                where: {
                    id: patchNoteId,
                },
            });
        }
        catch (error) {
            console.error(error);
            throw new Error('Failed to delete patch note');
        }
    },
};
export default patchNoteServices;
