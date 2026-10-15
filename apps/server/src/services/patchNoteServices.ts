import prisma from '../config/database.js';
import { PatchNotesInput } from '../validation/patchNotesSchema.js';

const patchNoteServices = {
  getPatchNotes: async () => {
    const patchNotes = await prisma.patchNote.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return patchNotes;
  },

  getPatchNoteById: async (patchNoteId: number) => {
    const patchNote = await prisma.patchNote.findUnique({
      where: { id: patchNoteId },
    });

    return patchNote;
  },

  createPatchNote: async (formData: PatchNotesInput) => {
    const { id, ...data } = formData;

    const patchNote = await prisma.patchNote.upsert({
      where: { id: id || 0 },
      update: data,
      create: data,
    });

    return patchNote;
  },

  deletePatchNote: async (patchNoteId: number) => {
    await prisma.patchNote.delete({
      where: {
        id: patchNoteId,
      },
    });
  },
};

export default patchNoteServices;
