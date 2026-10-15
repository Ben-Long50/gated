import prisma from '../config/database.js';
const patchNoteServices = {
    getPatchNotes: async () => {
        const patchNotes = await prisma.patchNote.findMany({
            orderBy: { createdAt: 'desc' },
        });
        return patchNotes;
    },
    getPatchNoteById: async (patchNoteId) => {
        const patchNote = await prisma.patchNote.findUnique({
            where: { id: patchNoteId },
        });
        return patchNote;
    },
    createPatchNote: async (formData) => {
        const { id, ...data } = formData;
        const patchNote = await prisma.patchNote.upsert({
            where: { id: id || 0 },
            update: data,
            create: data,
        });
        return patchNote;
    },
    deletePatchNote: async (patchNoteId) => {
        await prisma.patchNote.delete({
            where: {
                id: patchNoteId,
            },
        });
    },
};
export default patchNoteServices;
