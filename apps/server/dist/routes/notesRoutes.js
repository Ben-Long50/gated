import express from 'express';
import authentication from '../middleware/authentication.js';
import sessionController from '../controllers/sessionController.js';
const router = express.Router();
router.post('/notes', authentication.authenticate, sessionController.createOrUpdateSessionNotes);
// router.delete(
//   '/notes/:notesId',
//   authentication.authenticate,
//   sessionController.deleteSession,
// );
export default router;
