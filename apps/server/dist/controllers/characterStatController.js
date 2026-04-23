import characterStatServices from '../services/characterStatServices.js';
import { CharacterStats } from '../validation/fieldSchemas.js';
import constructName from '../utils/constructName.js';
import { capitalCase } from 'change-case';
import handleControllerError from './handleControllerError.js';
const characterStatController = {
    editCharacterStat: async (req, res) => {
        try {
            const validatedStats = CharacterStats.parse(req.body);
            const character = await characterStatServices.editCharacterStat(Number(req.params.characterId), validatedStats);
            const statMessages = Object.entries(validatedStats).map(([stat, value]) => `${capitalCase(stat)} by ${value}`);
            const statsMessage = statMessages.join(', ');
            res.status(200).json({
                character,
                message: `Successfully updated the following stats on ${constructName(character)}: ${statsMessage}`,
            });
        }
        catch (error) {
            handleControllerError(res, error);
        }
    },
    resetCharacterStat: async (req, res) => {
        try {
            const validatedStats = CharacterStats.parse(req.body);
            const character = await characterStatServices.resetCharacterStat(Number(req.params.characterId), validatedStats);
            const statMessages = Object.entries(validatedStats).map(([stat, _]) => `${capitalCase(stat)}`);
            const statsMessage = statMessages.join(', ');
            res
                .status(200)
                .json({ character, message: `Reset stats: ${statsMessage}` });
        }
        catch (error) {
            handleControllerError(res, error);
        }
    },
    editProfits: async (req, res) => {
        try {
            const character = await characterStatServices.editProfits(Number(req.params.characterId), Number(req.body.value));
            res.status(200).json({
                character,
                message: `Successfully adjusted the profits of ${constructName(character)} by ${req.body.value}`,
            });
        }
        catch (error) {
            handleControllerError(res, error);
        }
    },
};
export default characterStatController;
