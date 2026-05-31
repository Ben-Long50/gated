import itemServices from '../services/itemServices.js';
import upload from '../utils/multer.js';
import { uploadToCloudinary } from '../utils/cloudinary.js';
import parseRequestBody from '../utils/parseRequestBody.js';
import { ItemInput, ItemUpgradeInput } from '../validation/itemSchema.js';
import handleControllerError from './handleControllerError.js';
const itemController = {
    getCodexPreviewItems: async (_, res) => {
        try {
            const { items, characters } = await itemServices.getCodexPreviewItems();
            res.status(200).json({ items, characters });
        }
        catch (error) {
            handleControllerError(res, error);
        }
    },
    getCodexItems: async (req, res) => {
        try {
            const items = await itemServices.getCodexItems([
                req.params.category,
            ]);
            res.status(200).json(items);
        }
        catch (error) {
            handleControllerError(res, error);
        }
    },
    getBatchItems: async (req, res) => {
        try {
            if (!req.user) {
                throw new Error('Could not find authenticated user');
            }
            const itemIds = req.query.ids.split(',').map(Number);
            const items = await itemServices.getBatchItems(itemIds);
            res.status(200).json(items);
        }
        catch (error) {
            handleControllerError(res, error);
        }
    },
    getItemById: async (req, res) => {
        try {
            const item = await itemServices.getItemById(Number(req.params.itemId));
            if (!item) {
                throw new Error('Item not found');
            }
            res.status(200).json(item);
        }
        catch (error) {
            handleControllerError(res, error);
        }
    },
    createCodexItem: [
        upload.single('pictureFile'),
        uploadToCloudinary,
        async (req, res) => {
            try {
                const parsedBody = parseRequestBody(req.body);
                const validatedItem = ItemInput.parse(parsedBody);
                const item = await itemServices.createOrUpdateItem(Object.assign(Object.assign({}, validatedItem), { base: true }));
                res.status(200).json({
                    item,
                    message: parsedBody.id
                        ? `Successfully updated ${item.name}`
                        : `Successfully created ${item.name}`,
                });
            }
            catch (error) {
                res.status(500).json({ error: error.message });
            }
        },
    ],
    createOrUpdateItem: [
        upload.single('pictureFile'),
        uploadToCloudinary,
        async (req, res) => {
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
            }
            catch (error) {
                res.status(500).json({ error: error.message });
            }
        },
    ],
    createItemCopy: async (req, res) => {
        try {
            const item = await itemServices.createItemCopy(Number(req.params.itemId));
            res.status(200).json({
                item,
                message: `Successfully create ${item.name} copy`,
            });
        }
        catch (error) {
            handleControllerError(res, error);
        }
    },
    upgradeItem: [
        upload.single('pictureFile'),
        uploadToCloudinary,
        async (req, res) => {
            try {
                if (!req.user) {
                    throw new Error('You must be signed in to complete this action');
                }
                const parsedBody = parseRequestBody(req.body);
                const validatedItem = ItemUpgradeInput.parse(parsedBody);
                const { character, item } = await itemServices.upgradeItem(validatedItem);
                res.status(200).json({
                    character,
                    item,
                    message: `Successfully upgraded ${item.name}`,
                });
            }
            catch (error) {
                res.status(500).json({ error: error.message });
            }
        },
    ],
    createItemConditions: async (req, res) => {
        try {
            if (!req.user) {
                throw new Error('Could not find authenticated user');
            }
            const item = await itemServices.createItemConditions(Number(req.params.itemId), req.body);
            res.status(200).json({
                item,
                message: `Successfully created ${item.name} conditions`,
            });
        }
        catch (error) {
            handleControllerError(res, error);
        }
    },
    deleteItem: async (req, res) => {
        try {
            await itemServices.deleteItem(Number(req.params.itemId));
            res.status(200).json({ message: 'Successfully deleted item' });
        }
        catch (error) {
            handleControllerError(res, error);
        }
    },
};
export default itemController;
