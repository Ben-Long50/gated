import combatServices from '../services/combatServices.js';
const combatController = {
    getCombats: async (req, res) => {
        try {
            if (!req.user) {
                res
                    .status(401)
                    .json({ error: 'You must be signed in to use this function' });
                return;
            }
            const combats = await combatServices.getCombats(Number(req.params.campaignId));
            res.status(200).json(combats);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    getCombatById: async (req, res) => {
        try {
            const combat = await combatServices.getCombatById(req.params.combatId);
            res.status(200).json(combat);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    createOrUpdateCombat: async (req, res) => {
        try {
            if (!req.user) {
                res.status(401).json({
                    error: 'You do not have the required permissions to create a combat',
                });
                return;
            }
            await combatServices.createOrUpdateCombat(Number(req.params.campaignId), Number(req.params.mapId), req.body);
            res.status(200).json({ message: 'Successfully created combat' });
        }
        catch (error) {
            if (error instanceof Error) {
                res.status(500).json({ error: error.message });
            }
        }
    },
    deleteCombat: async (req, res) => {
        try {
            if (!req.user) {
                res
                    .status(401)
                    .json({ error: 'You must be signed in to use this function' });
                return;
            }
            await combatServices.deleteCombat(Number(req.params.combatId));
            res.status(200).json({ message: 'Successfully deleted combat' });
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
};
export default combatController;
