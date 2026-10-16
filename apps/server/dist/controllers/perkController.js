import perkServices from '../services/perkServices.js';
import { validation } from '@gated/shared';
import handleControllerError from './handleControllerError.js';
const perkController = {
    getPerks: async (_req, res) => {
        try {
            const perks = await perkServices.getPerks();
            res.status(200).json(perks);
        }
        catch (error) {
            handleControllerError(res, error);
        }
    },
    getBatchPerks: async (req, res) => {
        try {
            const perkIds = req.query.ids.split(',').map(Number);
            const perks = await perkServices.getBatchPerks(perkIds);
            res.status(200).json(perks);
        }
        catch (error) {
            handleControllerError(res, error);
        }
    },
    getPerkById: async (req, res) => {
        try {
            const perk = await perkServices.getPerkById(Number(req.params.perkId));
            res.status(200).json(perk);
        }
        catch (error) {
            handleControllerError(res, error);
        }
    },
    createPerk: async (req, res) => {
        try {
            const validatedPerk = validation.PerkSchema.parse(req.body);
            const perk = await perkServices.createPerk(validatedPerk);
            res.status(200).json({ perk, message: 'Successfully created perk' });
        }
        catch (error) {
            handleControllerError(res, error);
        }
    },
    deletePerk: async (req, res) => {
        try {
            await perkServices.deletePerk(Number(req.params.perkId));
            res.status(200).json({ message: 'Successfully deleted perk' });
        }
        catch (error) {
            handleControllerError(res, error);
        }
    },
};
export default perkController;
