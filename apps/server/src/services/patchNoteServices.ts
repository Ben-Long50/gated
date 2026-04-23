import prisma from '../config/database.js';
import { PatchNotesInput } from '../validation/patchNotesSchema.js';

const patchNoteServices = {
  getPatchNotes: async () => {
    try {
      const patchNotes = await prisma.patchNote.findMany({
        orderBy: { createdAt: 'desc' },
      });

      return patchNotes;
    } catch (error: any) {
      console.error(error);
      throw new Error('Failed to fetch patch notes');
    }
  },

  getPatchNoteById: async (patchNoteId: number) => {
    try {
      const patchNote = await prisma.patchNote.findUnique({
        where: { id: patchNoteId },
      });

      return patchNote;
    } catch (error: any) {
      console.error(error);
      throw new Error('Failed to fetch patch note');
    }
  },

  createPatchNote: async (formData: PatchNotesInput) => {
    try {
      const { id, ...data } = formData;

      const patchNote = await prisma.patchNote.upsert({
        where: { id: id || 0 },
        update: data,
        create: data,
      });

      return patchNote;
    } catch (error: any) {
      console.error(error);
      throw new Error('Failed to create or update patch note');
    }
  },

  deletePatchNote: async (patchNoteId: number) => {
    try {
      await prisma.patchNote.delete({
        where: {
          id: patchNoteId,
        },
      });
    } catch (error: any) {
      console.error(error);
      throw new Error('Failed to delete patch note');
    }
  },
};

export default patchNoteServices;
