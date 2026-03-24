import express from 'express';
import authentication from '../middleware/authentication.js';
import characterController from '../controllers/characterController.js';
import affiliationController from '../controllers/affiliationController.js';

const router = express.Router();

router.get(
  '/characters',
  authentication.authenticate,
  characterController.getCharacters,
);

router.get('/social/characters', characterController.getSocialCharacters);

router.get(
  '/characters/batch',
  authentication.authenticate,
  characterController.getBatchCharacters,
);

router.get(
  '/characters/:characterId',
  authentication.authenticate,
  characterController.getCharacterById,
);

router.patch(
  '/characters/:characterId/inventory/:inventoryId/equipment/:itemId',
  authentication.authenticate,
  characterController.toggleEquipment,
);

router.patch(
  '/characters/active',
  authentication.authenticate,
  characterController.setActiveCharacter,
);

router.patch(
  '/characters/:characterId/cart/:cartId',
  authentication.authenticate,
  characterController.editCart,
);

router.patch(
  '/characters/:characterId/level',
  authentication.authenticate,
  characterController.updateCharacterLevel,
);

router.patch(
  '/characters/:characterId/levelBonus',
  authentication.authenticate,
  characterController.selectLevelUpBonus,
);

router.post(
  '/characters/:characterId/inventory/:inventoryId',
  authentication.authenticate,
  characterController.completePurchase,
);

router.post(
  '/characters',
  authentication.authenticate,
  characterController.createCharacter,
);

router.post(
  '/characters/:characterId/affiliations/create',
  authentication.authenticate,
  affiliationController.createCharacterAffiliation,
);

router.post(
  '/characters/:characterId/conditions',
  authentication.authenticate,
  characterController.createCharacterConditions,
);

router.post(
  '/characters/:characterId/location',
  authentication.authenticate,
  characterController.updateCharacterLocation,
);

router.post(
  '/characters/:characterId/createTemplate',
  authentication.authenticate,
  characterController.createTemplateCharacter,
);

router.put(
  '/characters/:characterId',
  authentication.authenticate,
  characterController.updateCharacter,
);

router.put(
  '/characters/:characterId/cart/:cartId',
  authentication.authenticate,
  characterController.clearCart,
);

router.delete(
  '/characters/:characterId/location',
  authentication.authenticate,
  characterController.deleteLocation,
);

router.delete(
  '/characters/:characterId',
  authentication.authenticate,
  characterController.deleteCharacter,
);

export default router;
