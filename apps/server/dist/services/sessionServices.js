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
import { NotesInput } from '../validation/notesSchema.js';
import { SessionInput } from '../validation/sessionSchema.js';
const sessionInclude = {
    characters: true,
    generatedPicture: { select: { publicId: true } },
};
const sessionServices = {
    getCampaignSessions: async (campaignId) => {
        try {
            const sessions = await prisma.session.findMany({
                where: { campaignId },
                orderBy: { sessionNumber: 'asc' },
            });
            return sessions;
        }
        catch (error) {
            console.error(error);
            throw new Error('Failed to fetch campaign sessions');
        }
    },
    getSessionById: async (campaignId, sessionId) => {
        try {
            const session = await prisma.session.findUnique({
                where: { id: sessionId, campaignId: campaignId },
                include: sessionInclude,
            });
            return session;
        }
        catch (error) {
            console.error(error);
            throw new Error('Failed to fetch session');
        }
    },
    createOrUpdateSessionNotes: async (formData) => {
        try {
            const validatedNotes = NotesInput.parse(formData);
            const { id } = validatedNotes, data = __rest(validatedNotes, ["id"]);
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
        }
        catch (error) {
            console.error(error);
            throw new Error('Failed to create or update notes');
        }
    },
    createOrUpdateSession: async (formData) => {
        try {
            const validatedSession = SessionInput.parse(formData);
            const { id, characterIds } = validatedSession, data = __rest(validatedSession, ["id", "characterIds"]);
            const previousSession = await prisma.session.findFirst({
                where: { campaignId: data.campaignId },
                orderBy: {
                    sessionNumber: 'desc',
                },
                select: { sessionNumber: true },
            });
            const sessionNumber = previousSession
                ? (previousSession === null || previousSession === void 0 ? void 0 : previousSession.sessionNumber) + 1
                : 0;
            const session = await prisma.session.upsert({
                where: { id: id || 0 },
                update: Object.assign(Object.assign({}, data), { characters: { set: characterIds.map((id) => ({ id })) } }),
                create: Object.assign(Object.assign({}, data), { sessionNumber, characters: { connect: characterIds.map((id) => ({ id })) } }),
                include: sessionInclude,
            });
            return session;
        }
        catch (error) {
            console.error(error);
            throw new Error('Failed to create or update session');
        }
    },
    deleteSession: async (sessionId) => {
        try {
            await prisma.session.delete({
                where: {
                    id: sessionId,
                },
            });
        }
        catch (error) {
            console.error(error);
            throw new Error('Failed to delete session');
        }
    },
};
export default sessionServices;
