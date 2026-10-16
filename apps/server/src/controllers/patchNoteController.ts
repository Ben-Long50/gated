import { Request, Response } from 'express';
import patchNoteServices from '../services/patchNoteServices.js';
import { validation } from '@gated/shared';
import handleControllerError from './handleControllerError.js';

const patchNoteController = {
  getPatchNotes: async (_req: Request, res: Response) => {
    try {
      const patchNotes = await patchNoteServices.getPatchNotes();
      res.status(200).json(patchNotes);
    } catch (error: any) {
      handleControllerError(res, error);
    }
  },

  getPatchNoteById: async (req: Request, res: Response) => {
    try {
      const patchNote = await patchNoteServices.getPatchNoteById(
        Number(req.params.patchNoteId),
      );
      res.status(200).json(patchNote);
    } catch (error: any) {
      handleControllerError(res, error);
    }
  },

  createPatchNote: async (req: Request, res: Response) => {
    try {
      const validatedPatchNote = validation.PatchNotesInput.parse(req.body);

      const patchNote =
        await patchNoteServices.createPatchNote(validatedPatchNote);

      res
        .status(200)
        .json({ patchNote, message: `Successfully created patch note` });
    } catch (error: any) {
      handleControllerError(res, error);
    }
  },

  deletePatchNote: async (req: Request, res: Response) => {
    try {
      await patchNoteServices.deletePatchNote(Number(req.params.patchNoteId));
      res.status(200).json({ message: 'Patch note successfully deleted' });
    } catch (error: any) {
      handleControllerError(res, error);
    }
  },
};

export default patchNoteController;
