import express from 'express';
import userController from '../controllers/userController.js';
import authentication from '../middleware/authentication.js';
import { generateBFLPicture } from '../middleware/pictureGenerationMiddleware.js';
import { uploadGeneratedPictureToCloudinary } from '../utils/cloudinary.js';

const router = express.Router();

router.get(
  '/users',
  authentication.authenticate,
  userController.getUsersByUsernameQuery,
);

router.get(
  '/users/authenticated',
  authentication.authenticate,
  userController.getAuthenticatedUser,
);

router.get(
  '/users/batch',
  authentication.authenticate,
  userController.getBatchUsers,
);

router.get(
  '/users/:userId',
  authentication.authenticate,
  userController.getUserById,
);

router.post(
  '/users/generate',
  authentication.authenticate,
  authentication.authenticateSuperadmin,
  generateBFLPicture,
  uploadGeneratedPictureToCloudinary,
  userController.addUserGeneratedPicture,
);

router.post('/users', authentication.authenticate, userController.createUser);

router.put('/users', authentication.authenticate, userController.updateUser);

router.patch(
  '/users/:userId/role',
  authentication.authenticate,
  authentication.authenticateSuperadmin,
  userController.updateUserRole,
);

export default router;
