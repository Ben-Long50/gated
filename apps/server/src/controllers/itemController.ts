import { Request, Response } from 'express';
import itemServices from '../services/itemServices.js';
import upload from '../utils/multer.js';
import { uploadToCloudinary } from '../utils/cloudinary.js';
import parseRequestBody from '../utils/parseRequestBody.js';
import characterServices from '../services/characterServices.js';
import { ItemType } from '@prisma/client';
import { ItemInput, ItemUpgradeInput } from '../validation/itemSchema.js';

const itemController = {
  getItems: async (req: Request, res: Response) => {
    try {
      const category = req.params.category.slice(0, -1) as ItemType;

      const items = await itemServices.getItems([category]);

      res.status(200).json(items);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
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
      res.status(500).json({ error: error.message });
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
      res.status(500).json({ error: error.message });
    }
  },

  createOrUpdateItem: [
    upload.single('picture'),
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
      res.status(500).json({ error: error.message });
    }
  },

  modifyItem: [
    upload.single('picture'),
    uploadToCloudinary,
    async (req: Request, res: Response) => {
      try {
        if (!req.user) {
          throw new Error('You must be signed in to complete this action');
        }

        const parsedBody = parseRequestBody(req.body);

        const validatedItem = ItemUpgradeInput.parse(parsedBody);

        const character = await characterServices.getCharacterById(
          Number(req.params.characterId),
        );

        if (!character) {
          throw new Error(
            'This item must be associated with an existing character to modify it',
          );
        }

        if (character.profits < parsedBody.upgradePrice) {
          throw new Error(
            'You do not have enough profits to purchase the chosen upgrades',
          );
        }

        await characterServices.updateCharacter(
          {
            profits: character.profits - validatedItem.upgradePrice,
          },
          req.user.id,
          character.id,
        );

        const item = await itemServices.upgradeItem(validatedItem);
        res
          .status(200)
          .json({ item, message: `Successfully upgraded ${item.name}` });
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

      res
        .status(200)
        .json({
          item,
          message: `Successfully created ${item.name} conditions`,
        });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  deleteItem: async (req: Request, res: Response) => {
    try {
      await itemServices.deleteItem(Number(req.params.itemId));
      res.status(200).json({ message: 'Successfully deleted item' });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },
};

export default itemController;
