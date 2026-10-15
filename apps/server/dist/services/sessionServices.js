import prisma from '../config/database.js';
import { NotesInput } from '../validation/notesSchema.js';
import { SessionInput } from '../validation/sessionSchema.js';
const sessionInclude = {
    characters: true,
    generatedPicture: { select: { publicId: true } },
};
const sessionServices = {
    getCampaignSessions: async (campaignId) => {
        const sessions = await prisma.session.findMany({
            where: { campaignId },
            orderBy: { sessionNumber: 'asc' },
        });
        return sessions;
    },
    getSessionById: async (campaignId, sessionId) => {
        const session = await prisma.session.findUnique({
            where: { id: sessionId, campaignId: campaignId },
            include: sessionInclude,
        });
        return session;
    },
    createOrUpdateSessionNotes: async (formData) => {
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
    },
    createOrUpdateSession: async (formData) => {
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
    },
    deleteSession: async (sessionId) => {
        await prisma.session.delete({
            where: {
                id: sessionId,
            },
        });
    },
};
export default sessionServices;
