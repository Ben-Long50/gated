import { Request, Response } from 'express';
import characterServices from '../services/characterServices.js';
import { uploadToCloudinary } from '../utils/cloudinary.js';
import upload from '../utils/multer.js';
import parseRequestBody from '../utils/parseRequestBody.js';
import cartServices from '../services/cartServices.js';
import {
  CharacterInput,
  CharacterLevelBonus,
  CharacterUpdateInput,
} from '../validation/characterSchema.js';
import z, { ZodError } from 'zod';
import { getIO } from '../sockets/socket.js';
import constructName from '../utils/constructName.js';
import handleControllerError from './handleControllerError.js';

const characterController = {
  getSocialCharacters: async (_: Request, res: Response) => {
    try {
      const characters = await characterServices.getSocialCharacters();
      res.status(200).json(characters);
    } catch (error: any) {
      handleControllerError(res, error);
    }
  },

  getCodexCharacters: async (_: Request, res: Response) => {
    try {
      const characters = await characterServices.getCodexCharacters();
      res.status(200).json(characters);
    } catch (error: any) {
      handleControllerError(res, error);
    }
  },

  getBatchCharacters: async (req: Request, res: Response) => {
    try {
      if (!req.user) {
        throw new Error('Could not find authenticated user');
      }
      const characterIds = (req.query.ids as string).split(',').map(Number);

      const characters =
        await characterServices.getBatchCharacters(characterIds);

      res.status(200).json(characters);
    } catch (error: any) {
      handleControllerError(res, error);
    }
  },

  getCharacterById: async (req: Request, res: Response) => {
    try {
      const character = await characterServices.getCharacterById(
        Number(req.params.characterId),
      );

      res.status(200).json(character);
    } catch (error: any) {
      handleControllerError(res, error);
    }
  },

  getCharacterNotes: async (req: Request, res: Response) => {
    try {
      const notes = await characterServices.getCharacterNotes(
        Number(req.params.characterId),
      );

      res.status(200).json(notes);
    } catch (error: any) {
      handleControllerError(res, error);
    }
  },

  toggleEquipment: async (req: Request, res: Response) => {
    try {
      const item = await characterServices.toggleEquipment(
        Number(req.params.inventoryId),
        Number(req.params.itemId),
      );

      res
        .status(200)
        .json({ item, message: `Successfully toggled ${item.name}` });
    } catch (error: any) {
      handleControllerError(res, error);
    }
  },

  editCart: async (req: Request, res: Response) => {
    try {
      const character = await cartServices.editCartItem(
        Number(req.params.characterId),
        Number(req.params.cartId),
        Number(req.body.itemId),
        Number(req.body.value),
      );

      res.status(200).json({
        character,
        message: `Successfully added ${req.body.value} item(s) to ${constructName(character)}'s cart`,
      });
    } catch (error: any) {
      handleControllerError(res, error);
    }
  },

  completePurchase: async (req: Request, res: Response) => {
    try {
      if (!req.user) {
        throw new Error('Could not find authenticated user');
      }

      await characterServices.addToInventory(
        req.user?.id,
        Number(req.params.characterId),
        Number(req.params.inventoryId),
      );
      await characterServices.clearCart(Number(req.params.characterId));
      res.status(200).json({ message: 'Purchase completed' });
    } catch (error: any) {
      handleControllerError(res, error);
    }
  },

  clearCart: async (req: Request, res: Response) => {
    try {
      await characterServices.clearCart(Number(req.params.characterId));
      res.status(200).json({ message: 'Cart cleared' });
    } catch (error: any) {}
  },

  createCharacter: [
    upload.single('pictureFile'),
    uploadToCloudinary,
    async (req: Request, res: Response) => {
      try {
        if (!req.user) {
          throw new Error('Could not find authenticated user');
        }

        const parsedBody = parseRequestBody(req.body);

        const validatedCharacter = CharacterInput.parse(parsedBody);

        const character = await characterServices.createCharacter(
          validatedCharacter,
          req.user.id,
        );

        const io = getIO();

        if (character.campaignId) {
          io.to(`campaign ${character.campaignId}`).emit('updateCharacter', {
            character,
          });
        }

        res.status(200).json({
          character,
          message: `Successfully created ${constructName(character)}`,
        });
      } catch (error: any) {
        if (error instanceof ZodError) {
          res.status(500).json({ error: z.prettifyError(error) });
        } else if (error instanceof Error) {
          res.status(500).json({ message: error });
        }
      }
    },
  ],

  createCodexCharacter: [
    upload.single('pictureFile'),
    uploadToCloudinary,
    async (req: Request, res: Response) => {
      try {
        if (!req.user) {
          throw new Error('Could not find authenticated user');
        }

        const parsedBody = parseRequestBody(req.body);

        const validatedCharacter = CharacterInput.parse(parsedBody);

        const character = await characterServices.createCharacter({
          ...validatedCharacter,
          base: true,
        });

        const io = getIO();

        if (character.campaignId) {
          io.to(`campaign ${character.campaignId}`).emit('updateCharacter', {
            character,
          });
        }

        res.status(200).json({
          character,
          message: `Successfully created ${constructName(character)}`,
        });
      } catch (error: any) {
        if (error instanceof ZodError) {
          res.status(500).json({ error: z.prettifyError(error) });
        } else if (error instanceof Error) {
          res.status(500).json({ message: error });
        }
      }
    },
  ],

  createTemplateCharacter: async (req: Request, res: Response) => {
    try {
      if (!req.user) {
        throw new Error('Could not find authenticated user');
      }

      const character = await characterServices.createTemplateCharacter(
        Number(req.params.characterId),
        req.user.id,
      );

      res.status(200).json({
        character,
        message: `Successfully created a character copy of ${constructName(character)}`,
      });
    } catch (error: any) {
      handleControllerError(res, error);
    }
  },

  updateCharacter: [
    upload.single('pictureFile'),
    uploadToCloudinary,
    async (req: Request, res: Response) => {
      try {
        if (!req.user) {
          throw new Error('Could not find authenticated user');
        }

        const parsedBody = parseRequestBody(req.body);

        const validatedCharacter = CharacterUpdateInput.parse(parsedBody);

        const character = await characterServices.updateCharacter(
          validatedCharacter,
          req.user.id,
        );

        const io = getIO();

        if (character.campaignId) {
          io.to(`campaign ${character.campaignId}`).emit('updateCharacter', {
            character,
          });
        }

        res.status(200).json({
          character,
          message: `Successfully updated ${constructName(character)}`,
        });
      } catch (error: any) {
        console.error(error);
        if (error instanceof Error) {
          res.status(500).json({ error: error.message });
        }
      }
    },
  ],

  updateCharacterLevel: async (req: Request, res: Response) => {
    try {
      if (!req.user) {
        throw new Error('Could not find authenticated user');
      }

      const character = await characterServices.updateCharacterLevel(
        Number(req.params.characterId),
        req.body.levelChange,
      );

      const io = getIO();

      if (character.campaignId) {
        io.to(`campaign ${character.campaignId}`).emit('updateCharacter', {
          character,
        });
      }

      res.status(200).json({
        character,
        message: `Successfully updated the level of ${constructName(character)} by ${req.body.levelChange}`,
      });
    } catch (error: any) {
      console.error(error);
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      }
    }
  },

  selectLevelUpBonus: async (req: Request, res: Response) => {
    try {
      if (!req.user) {
        throw new Error('Could not find authenticated user');
      }

      const bonus = CharacterLevelBonus.parse(req.body);

      const character = await characterServices.selectLevelUpBonus(
        Number(req.params.characterId),
        bonus,
      );

      const io = getIO();

      if (character.campaignId) {
        io.to(`campaign ${character.campaignId}`).emit('updateCharacter', {
          character,
        });
      }

      res.status(200).json({
        character,
        message: `Successfully selected level up bonus for ${constructName(character)}`,
      });
    } catch (error: any) {
      console.error(error);
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      }
    }
  },

  createCharacterConditions: async (req: Request, res: Response) => {
    try {
      if (!req.user) {
        throw new Error('Could not find authenticated user');
      }

      const character = await characterServices.createCharacterConditions(
        Number(req.params.characterId),
        req.body,
      );

      const io = getIO();

      if (character.campaignId) {
        io.to(`campaign ${character.campaignId}`).emit('updateCharacter', {
          character,
        });
      }

      res.status(200).json({
        character,
        message: `Successfully created conditions on ${constructName(character)}`,
      });
    } catch (error: any) {
      handleControllerError(res, error);
    }
  },

  updateCharacterLocation: async (req: Request, res: Response) => {
    try {
      if (!req.user) {
        throw new Error('Could not find authenticated user');
      }

      await characterServices.createOrUpdateLocation(
        Number(req.params.characterId),
        req.body,
      );

      res.status(200).json({
        message: 'Successfully updapted character location',
      });
    } catch (error: any) {
      handleControllerError(res, error);
    }
  },

  deleteLocation: async (req: Request, res: Response) => {
    try {
      if (!req.user) {
        throw new Error('Could not find authenticated user');
      }

      await characterServices.deleteLocation(Number(req.params.characterId));

      res
        .status(200)
        .json({ message: 'Successfully deleted character location' });
    } catch (error: any) {
      handleControllerError(res, error);
    }
  },

  deleteCharacter: async (req: Request, res: Response) => {
    try {
      if (!req.user) {
        throw new Error('Could not find authenticated user');
      }
      await characterServices.deleteCharacter(
        req.user.id,
        Number(req.params.characterId),
      );

      res.status(200).json({ message: 'Successfully deleted character' });
    } catch (error: any) {
      handleControllerError(res, error);
    }
  },
};

export default characterController;
