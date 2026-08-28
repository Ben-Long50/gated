import prisma from '../config/database.js';
import { NotesInput } from '../validation/notesSchema.js';
import { SessionInput } from '../validation/sessionSchema.js';

const sessionInclude = {
  characters: true,
  generatedPicture: { select: { publicId: true } },
};

const sessionServices = {
  getCampaignSessions: async (campaignId: number) => {
    try {
      const sessions = await prisma.session.findMany({
        where: { campaignId },
        orderBy: { sessionNumber: 'asc' },
      });

      return sessions;
    } catch (error: any) {
      console.error(error);
      throw new Error('Failed to fetch campaign sessions');
    }
  },

  getSessionById: async (campaignId: number, sessionId: number) => {
    try {
      const session = await prisma.session.findUnique({
        where: { id: sessionId, campaignId: campaignId },
        include: sessionInclude,
      });

      return session;
    } catch (error: any) {
      console.error(error);
      throw new Error('Failed to fetch session');
    }
  },

  createOrUpdateSessionNotes: async (formData: NotesInput) => {
    try {
      const validatedNotes = NotesInput.parse(formData);

      const { id, ...data } = validatedNotes;

      const notes = await prisma.note.upsert({
        where: {
          sessionId_characterId: {
            sessionId: data.sessionId,
            characterId: data.characterId,
          },
        },
        update: {
          content: data.content,
        },
        create: data,
      });

      return notes;
    } catch (error: any) {
      console.error(error);
      throw new Error('Failed to create or update notes');
    }
  },

  createOrUpdateSession: async (formData: SessionInput) => {
    try {
      const validatedSession = SessionInput.parse(formData);

      const { id, characterIds, ...data } = validatedSession;

      const previousSession = await prisma.session.findFirst({
        where: { campaignId: data.campaignId },
        orderBy: {
          sessionNumber: 'desc',
        },
        select: { sessionNumber: true },
      });

      const sessionNumber = previousSession
        ? previousSession?.sessionNumber + 1
        : 0;

      const session = await prisma.session.upsert({
        where: { id: id || 0 },
        update: {
          ...data,
          characters: { set: characterIds.map((id) => ({ id })) },
        },
        create: {
          ...data,
          sessionNumber,
          characters: { connect: characterIds.map((id) => ({ id })) },
        },
        include: sessionInclude,
      });

      return session;
    } catch (error: any) {
      console.error(error);
      throw new Error('Failed to create or update session');
    }
  },

  deleteSession: async (sessionId: number) => {
    try {
      await prisma.session.delete({
        where: {
          id: sessionId,
        },
      });
    } catch (error: any) {
      console.error(error);
      throw new Error('Failed to delete session');
    }
  },
};

export default sessionServices;
