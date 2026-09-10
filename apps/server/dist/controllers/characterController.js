import characterServices from '../services/characterServices.js';
import cartServices from '../services/cartServices.js';
import { CharacterInput, CharacterLevelBonus, CharacterUpdateInput, } from '../validation/characterSchema.js';
import { getIO } from '../sockets/socket.js';
import handleControllerError from './handleControllerError.js';
import prisma from '../config/database.js';
const characterController = {
    getSocialCharacters: async (_, res) => {
        try {
            const characters = await characterServices.getSocialCharacters();
            res.status(200).json(characters);
        }
        catch (error) {
            handleControllerError(res, error);
        }
    },
    getTemplateCharacters: async (req, res) => {
        try {
            if (!req.user) {
                throw new Error('Failed to find user');
            }
            const characters = await characterServices.getTemplateCharacters(req.user.id);
            res.status(200).json(characters);
        }
        catch (error) {
            handleControllerError(res, error);
        }
    },
    getCodexCharacters: async (_, res) => {
        try {
            const characters = await characterServices.getCodexCharacters();
            res.status(200).json(characters);
        }
        catch (error) {
            handleControllerError(res, error);
        }
    },
    getBatchCharacters: async (req, res) => {
        try {
            if (!req.user) {
                throw new Error('Could not find authenticated user');
            }
            const characterIds = req.query.ids.split(',').map(Number);
            const characters = await characterServices.getBatchCharacters(characterIds);
            res.status(200).json(characters);
        }
        catch (error) {
            handleControllerError(res, error);
        }
    },
    getCharacterById: async (req, res) => {
        try {
            const character = await characterServices.getCharacterById(Number(req.params.characterId));
            res.status(200).json(character);
        }
        catch (error) {
            handleControllerError(res, error);
        }
    },
    getCharacterNotes: async (req, res) => {
        try {
            const notes = await characterServices.getCharacterNotes(Number(req.params.characterId));
            res.status(200).json(notes);
        }
        catch (error) {
            handleControllerError(res, error);
        }
    },
    toggleEquipment: async (req, res) => {
        try {
            const item = await characterServices.toggleEquipment(Number(req.params.inventoryId), Number(req.params.itemId));
            res
                .status(200)
                .json({ item, message: `Successfully toggled ${item === null || item === void 0 ? void 0 : item.name}` });
        }
        catch (error) {
            handleControllerError(res, error);
        }
    },
    editCart: async (req, res) => {
        try {
            const character = await cartServices.editCartItem(Number(req.params.characterId), Number(req.params.cartId), Number(req.body.itemId), Number(req.body.value));
            res.status(200).json({
                character,
                message: `Successfully added ${req.body.value} item(s) to ${character.name}'s cart`,
            });
        }
        catch (error) {
            handleControllerError(res, error);
        }
    },
    addBulkItems: async (req, res) => {
        try {
            const character = await cartServices.addBulkItems(Number(req.params.characterId), req.body);
            if (!character) {
                throw new Error('Failed to find character');
            }
            res.status(200).json({
                character,
                message: `Successfully added bulk item(s) to ${character.name}'s cart`,
            });
        }
        catch (error) {
            handleControllerError(res, error);
        }
    },
    completePurchase: async (req, res) => {
        try {
            if (!req.user) {
                throw new Error('Could not find authenticated user');
            }
            const character = await prisma.$transaction(async (tx) => {
                const character = await characterServices.addToInventory(Number(req.params.characterId), Number(req.params.inventoryId), tx);
                await characterServices.clearCart(Number(req.params.characterId), tx);
                if (!character) {
                    throw new Error('Character not found');
                }
                return character;
            }, { timeout: 15000 });
            const io = getIO();
            if (character.campaignId) {
                io.to(`campaign ${character.campaignId}`).emit('updateCharacter', {
                    character,
                });
            }
            res
                .status(200)
                .json({ character, message: 'Successfully completed purchase' });
        }
        catch (error) {
            handleControllerError(res, error);
        }
    },
    clearCart: async (req, res) => {
        try {
            await characterServices.clearCart(Number(req.params.characterId));
            res.status(200).json({ message: 'Successfully cleared cart' });
        }
        catch (error) { }
    },
    createCharacter: async (req, res) => {
        try {
            if (!req.user) {
                throw new Error('Could not find authenticated user');
            }
            const validatedCharacter = CharacterInput.parse(req.body);
            const character = await characterServices.createCharacter(validatedCharacter, req.user.id);
            if (!character) {
                throw new Error('Failed to create character');
            }
            const io = getIO();
            if (character.campaignId) {
                io.to(`campaign ${character.campaignId}`).emit('updateCharacter', {
                    character,
                });
            }
            res.status(200).json({
                character,
                message: `Successfully created ${character.name}`,
            });
        }
        catch (error) {
            handleControllerError(res, error);
        }
    },
    createCodexCharacter: async (req, res) => {
        try {
            if (!req.user) {
                throw new Error('Could not find authenticated user');
            }
            const validatedCharacter = CharacterInput.parse(req.body);
            const character = await characterServices.createCharacter(validatedCharacter);
            if (!character) {
                throw new Error('Failed to create character');
            }
            const io = getIO();
            if (character.campaignId) {
                io.to(`campaign ${character.campaignId}`).emit('updateCharacter', {
                    character,
                });
            }
            res.status(200).json({
                character,
                message: `Successfully created ${character.name}`,
            });
        }
        catch (error) {
            handleControllerError(res, error);
        }
    },
    createTemplateCharacter: async (req, res) => {
        try {
            if (!req.user) {
                throw new Error('Could not find authenticated user');
            }
            const character = await characterServices.createTemplateCharacter(req.user.id, req.body.characterId, req.body.campaignId, req.body.gangId);
            res.status(200).json({
                character,
                message: `Successfully created a copy of template character: ${character.name}`,
            });
        }
        catch (error) {
            handleControllerError(res, error);
        }
    },
    updateCharacter: async (req, res) => {
        try {
            if (!req.user) {
                throw new Error('Could not find authenticated user');
            }
            const validatedCharacter = CharacterUpdateInput.parse(req.body);
            const character = await characterServices.updateCharacter(validatedCharacter);
            const io = getIO();
            if (character.campaignId) {
                io.to(`campaign ${character.campaignId}`).emit('updateCharacter', {
                    character,
                });
            }
            res.status(200).json({
                character,
                message: `Successfully updated ${character.name}`,
            });
        }
        catch (error) {
            console.error(error);
            if (error instanceof Error) {
                res.status(500).json({ error: error.message });
            }
        }
    },
    updateCharacterLevel: async (req, res) => {
        try {
            if (!req.user) {
                throw new Error('Could not find authenticated user');
            }
            const character = await characterServices.updateCharacterLevel(Number(req.params.characterId), req.body.levelChange);
            const io = getIO();
            if (character.campaignId) {
                io.to(`campaign ${character.campaignId}`).emit('updateCharacter', {
                    character,
                });
            }
            res.status(200).json({
                character,
                message: `Successfully updated the level of ${character.name} by ${req.body.levelChange}`,
            });
        }
        catch (error) {
            console.error(error);
            if (error instanceof Error) {
                res.status(500).json({ error: error.message });
            }
        }
    },
    selectLevelUpBonus: async (req, res) => {
        try {
            if (!req.user) {
                throw new Error('Could not find authenticated user');
            }
            const validatedBonus = await CharacterLevelBonus.parseAsync(Object.assign({ characterId: Number(req.params.characterId) }, req.body));
            const character = await characterServices.selectLevelUpBonus(validatedBonus);
            const io = getIO();
            if (character.campaignId) {
                io.to(`campaign ${character.campaignId}`).emit('updateCharacter', {
                    character,
                });
            }
            res.status(200).json({
                character,
                message: `Successfully selected level up bonus for ${character.name}`,
            });
        }
        catch (error) {
            console.error(error);
            if (error instanceof Error) {
                res.status(400).json({ error: error.message });
            }
        }
    },
    createCharacterConditions: async (req, res) => {
        try {
            if (!req.user) {
                throw new Error('Could not find authenticated user');
            }
            const character = await characterServices.createCharacterConditions(Number(req.params.characterId), req.body);
            const io = getIO();
            if (character.campaignId) {
                io.to(`campaign ${character.campaignId}`).emit('updateCharacter', {
                    character,
                });
            }
            res.status(200).json({
                character,
                message: `Successfully created conditions on ${character.name}`,
            });
        }
        catch (error) {
            handleControllerError(res, error);
        }
    },
    updateCharacterLocation: async (req, res) => {
        try {
            if (!req.user) {
                throw new Error('Could not find authenticated user');
            }
            await characterServices.createOrUpdateLocation(Number(req.params.characterId), req.body);
            res.status(200).json({
                message: 'Successfully updapted character location',
            });
        }
        catch (error) {
            handleControllerError(res, error);
        }
    },
    deleteLocation: async (req, res) => {
        try {
            if (!req.user) {
                throw new Error('Could not find authenticated user');
            }
            await characterServices.deleteLocation(Number(req.params.characterId));
            res
                .status(200)
                .json({ message: 'Successfully deleted character location' });
        }
        catch (error) {
            handleControllerError(res, error);
        }
    },
    deleteCharacter: async (req, res) => {
        try {
            if (!req.user) {
                throw new Error('Could not find authenticated user');
            }
            const character = await characterServices.deleteCharacter(req.user.id, Number(req.params.characterId));
            res
                .status(200)
                .json({ character, message: `Successfully deleted ${character.name}` });
        }
        catch (error) {
            handleControllerError(res, error);
        }
    },
};
export default characterController;
