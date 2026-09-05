import sessionServices from '../services/sessionServices.js';
import parseRequestBody from '../utils/parseRequestBody.js';
import { NotesInput } from '../validation/notesSchema.js';
import { SessionInput } from '../validation/sessionSchema.js';
import handleControllerError from './handleControllerError.js';
const sessionController = {
    getCampaignSessions: async (req, res) => {
        try {
            if (!req.user) {
                res
                    .status(401)
                    .json({ error: 'You must be signed in to use this function' });
                return;
            }
            const sessions = await sessionServices.getCampaignSessions(Number(req.params.campaignId));
            res.status(200).json(sessions);
        }
        catch (error) {
            handleControllerError(res, error);
        }
    },
    getSessionById: async (req, res) => {
        try {
            const session = await sessionServices.getSessionById(Number(req.params.campaignId), Number(req.params.sessionId));
            res.status(200).json(session);
        }
        catch (error) {
            handleControllerError(res, error);
        }
    },
    createOrUpdateSessionNotes: async (req, res) => {
        try {
            const validatedNotes = NotesInput.parse(req.body);
            const notes = await sessionServices.createOrUpdateSessionNotes(validatedNotes);
            res.status(200).json({
                notes,
                message: validatedNotes.id
                    ? 'Successfully updated session notes'
                    : 'Successfully created session notes',
            });
        }
        catch (error) {
            handleControllerError(res, error);
        }
    },
    createOrUpdateSession: async (req, res) => {
        try {
            const parsedBody = parseRequestBody(req.body);
            const validatedSession = SessionInput.parse(parsedBody);
            const session = await sessionServices.createOrUpdateSession(validatedSession);
            res.status(200).json({
                session,
                message: validatedSession.id
                    ? `Successfully updated session: ${session.name}`
                    : `Successfully created session: ${session.name}`,
            });
        }
        catch (error) {
            if (error instanceof Error) {
                res.status(500).json({ error: error.message });
            }
        }
    },
    deleteSession: async (req, res) => {
        try {
            await sessionServices.deleteSession(Number(req.params.campaignId));
            res.status(200).json({ message: 'Successfully deleted session' });
        }
        catch (error) {
            handleControllerError(res, error);
        }
    },
};
export default sessionController;
