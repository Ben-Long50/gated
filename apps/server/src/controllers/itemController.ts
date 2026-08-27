import { Request, Response } from 'express';
import itemServices from '../services/itemServices.js';
import upload from '../utils/multer.js';
import { uploadToCloudinary } from '../utils/cloudinary.js';
import parseRequestBody from '../utils/parseRequestBody.js';
import { ItemType } from '@prisma/client';
import { ItemInput, ItemUpgradeInput } from '../validation/itemSchema.js';
import handleControllerError from './handleControllerError.js';
import { getIO } from '../sockets/socket.js';
import characterServices from '../services/characterServices.js';

const itemController = {
  getCodexPreviewItems: async (_: Request, res: Response) => {
    try {
      const { items, characters } = await itemServices.getCodexPreviewItems();

      res.status(200).json({ items, characters });
    } catch (error: any) {
      handleControllerError(res, error);
    }
  },

  getCodexItems: async (req: Request, res: Response) => {
    try {
      const items = await itemServices.getCodexItems([
        req.params.category as ItemType,
      ]);

      res.status(200).json(items);
    } catch (error: any) {
      handleControllerError(res, error);
    }
  },

  getBatchItems: async (req: Request, res: Response) => {
    try {
      if (!req.user) {
        throw new Error('Could not find authenticated user');
      }
      const itemIds = (req.query.ids as string).split(',').map(Number);

      const items = await itemServices.getBatchItems(itemIds);

      res.status(200).json(items);
    } catch (error: any) {
      handleControllerError(res, error);
    }
  },

  getItemById: async (req: Request, res: Response) => {
    try {
      const item = await itemServices.getItemById(Number(req.params.itemId));

      if (!item) {
        throw new Error('Item not found');
      }

      res.status(200).json(item);
    } catch (error: any) {
      handleControllerError(res, error);
    }
  },

  createCodexItem: [
    upload.single('pictureFile'),
    uploadToCloudinary,
    async (req: Request, res: Response) => {
      try {
        const parsedBody = parseRequestBody(req.body);

        const validatedItem = ItemInput.parse(parsedBody);

        const item = await itemServices.createOrUpdateItem(validatedItem);

        res.status(200).json({
          item,
          message: parsedBody.id
            ? `Successfully updated ${item.name}`
            : `Successfully created ${item.name}`,
        });
      } catch (error: any) {
        res.status(500).json({ error: error.message });
      }
    },
  ],

  createOrUpdateItem: [
    upload.single('pictureFile'),
    uploadToCloudinary,
    async (req: Request, res: Response) => {
      try {
        const parsedBody = parseRequestBody(req.body);

        const validatedItem = ItemInput.parse(parsedBody);

        const item = await itemServices.createOrUpdateItem(validatedItem);

        res.status(200).json({
          item,
          message: parsedBody.id
            ? `Successfully updated ${item.name}`
            : `Successfully created ${item.name}`,
        });
      } catch (error: any) {
        res.status(500).json({ error: error.message });
      }
    },
  ],

  createItemCopy: async (req: Request, res: Response) => {
    try {
      const item = await itemServices.createItemCopy(Number(req.params.itemId));

      res.status(200).json({
        item,
        message: `Successfully create ${item.name} copy`,
      });
    } catch (error: any) {
      handleControllerError(res, error);
    }
  },

  upgradeItem: [
    upload.single('pictureFile'),
    uploadToCloudinary,
    async (req: Request, res: Response) => {
      try {
        if (!req.user) {
          throw new Error('You must be signed in to complete this action');
        }

        const parsedBody = parseRequestBody(req.body);

        const validatedItem = ItemUpgradeInput.parse(parsedBody);

        const { character, item } =
          await itemServices.upgradeItem(validatedItem);

        res.status(200).json({
          character,
          item,
          message: `Successfully upgraded ${item.name}`,
        });
      } catch (error: any) {
        res.status(500).json({ error: error.message });
      }
    },
  ],

  createItemConditions: async (req: Request, res: Response) => {
    try {
      if (!req.user) {
        throw new Error('Could not find authenticated user');
      }

      const item = await itemServices.createItemConditions(
        Number(req.params.itemId),
        req.body,
      );

      res.status(200).json({
        item,
        message: `Successfully created ${item.name} conditions`,
      });
    } catch (error: any) {
      handleControllerError(res, error);
    }
  },

  deleteItem: async (req: Request, res: Response) => {
    try {
      const item = await itemServices.getItemById(Number(req.params.itemId));

      await itemServices.deleteItem(Number(req.params.itemId));

      if (item.characterInventory?.characterId) {
        const character = await characterServices.getCharacterById(
          item.characterInventory.characterId,
        );

        if (!character) {
          throw new Error('No character found');
        }

        const io = getIO();

        if (character.campaignId) {
          io.to(`campaign ${character.campaignId}`).emit('updateCharacter', {
            character,
          });
        }

        res
          .status(200)
          .json({ character, message: 'Successfully deleted item' });
      } else {
        res.status(200).json({ message: 'Successfully deleted item' });
      }
    } catch (error: any) {
      handleControllerError(res, error);
    }
  },
};

export default itemController;
