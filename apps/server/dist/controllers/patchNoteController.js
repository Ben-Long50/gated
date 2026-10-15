import patchNoteServices from '../services/patchNoteServices.js';
import { PatchNotesInput } from '../validation/patchNotesSchema.js';
import handleControllerError from './handleControllerError.js';
const patchNoteController = {
    getPatchNotes: async (_req, res) => {
        try {
            const patchNotes = await patchNoteServices.getPatchNotes();
            res.status(200).json(patchNotes);
        }
        catch (error) {
            handleControllerError(res, error);
        }
    },
    getPatchNoteById: async (req, res) => {
        try {
            const patchNote = await patchNoteServices.getPatchNoteById(Number(req.params.patchNoteId));
            res.status(200).json(patchNote);
        }
        catch (error) {
            handleControllerError(res, error);
        }
    },
    createPatchNote: async (req, res) => {
        try {
            const validatedPatchNote = PatchNotesInput.parse(req.body);
            const patchNote = await patchNoteServices.createPatchNote(validatedPatchNote);
            res
                .status(200)
                .json({ patchNote, message: `Successfully created patch note` });
        }
        catch (error) {
            handleControllerError(res, error);
        }
    },
    deletePatchNote: async (req, res) => {
        try {
            await patchNoteServices.deletePatchNote(Number(req.params.patchNoteId));
            res.status(200).json({ message: 'Patch note successfully deleted' });
        }
        catch (error) {
            handleControllerError(res, error);
        }
    },
};
export default patchNoteController;
