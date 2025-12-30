import encounterServices from '../services/encounterServices.js';
const encounterController = {
    getEncounters: async (req, res) => {
        try {
            if (!req.user) {
                res
                    .status(401)
                    .json({ error: 'You must be signed in to use this function' });
                return;
            }
            const encounters = await encounterServices.getEncounters(Number(req.params.campaignId));
            res.status(200).json(encounters);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    getEncounterById: async (req, res) => {
        try {
            const encounter = await encounterServices.getEncounterById(Number(req.params.encounterId));
            res.status(200).json(encounter);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    getBatchEncounters: async (req, res) => {
        try {
            if (!req.user) {
                throw new Error('Could not find authenticated user');
            }
            const encounters = await encounterServices.getBatchEncounters(req.body.combatIds);
            res.status(200).json(encounters);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    getEncounterHistory: async (req, res) => {
        try {
            if (!req.user) {
                throw new Error('Could not find authenticated user');
            }
            const history = await encounterServices.getEncounterHistory(Number(req.params.encounterId));
            res.status(200).json(history);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    activateEncounter: async (req, res) => {
        try {
            if (!req.user) {
                throw new Error('Could not find authenticated user');
            }
            await encounterServices.activateEncounter(Number(req.params.encounterId));
            res.status(200).json({ message: 'Successfully activated encounter' });
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    advancePhase: async (req, res) => {
        try {
            if (!req.user) {
                throw new Error('Could not find authenticated user');
            }
            await encounterServices.advancePhase(Number(req.params.encounterId));
            res
                .status(200)
                .json({ message: 'Successfully advanced encounter phase' });
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    advanceTurn: async (req, res) => {
        try {
            if (!req.user || !req.encounter) {
                throw new Error('Could not find authenticated user');
            }
            await encounterServices.advanceTurn(req.encounter, Number(req.params.encounterId));
            res.status(200).json({ message: 'Successfully advanced encounter turn' });
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    rollInitiative: async (req, res) => {
        try {
            if (!req.user) {
                throw new Error('Could not find authenticated user');
            }
            await encounterServices.rollInitiative(Number(req.params.encounterId));
            res.status(200).json({ message: 'Successfully rolled initiative' });
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    rollAction: async (req, res) => {
        try {
            if (!req.user) {
                throw new Error('Could not find authenticated user');
            }
            const encounterId = Number(req.params.encounterId);
            const action = await encounterServices.rollAction(Number(req.params.campaignId), encounterId, req.body);
            await encounterServices.setPhaseAction(encounterId, action);
            await encounterServices.advancePhase(encounterId);
            res.status(200).json({ message: 'Successfully rolled action' });
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    rollReaction: async (req, res) => {
        try {
            if (!req.user) {
                throw new Error('Could not find authenticated user');
            }
            const encounterId = Number(req.params.encounterId);
            const reaction = await encounterServices.rollReaction(Number(req.params.campaignId), encounterId, req.body);
            await encounterServices.setPhaseReaction(encounterId, reaction);
            res.status(200).json({ message: 'Successfully rolled reaction' });
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    scheduleReaction: async (req, res) => {
        try {
            if (!req.user) {
                throw new Error('Could not find authenticated user');
            }
            await encounterServices.scheduleReaction(Number(req.params.encounterId), req.body.characterId);
            res.status(200).json({ message: 'Successfully scheduled reaction' });
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    passReaction: async (req, res) => {
        try {
            if (!req.user) {
                throw new Error('Could not find authenticated user');
            }
            await encounterServices.passReaction(Number(req.params.encounterId), req.body.characterId);
            res.status(200).json({ message: 'Successfully passed reaction' });
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    finishReaction: async (req, res) => {
        try {
            if (!req.user) {
                throw new Error('Could not find authenticated user');
            }
            await encounterServices.finishReaction(Number(req.params.encounterId), req.body.characterId);
            res.status(200).json({ message: 'Successfully finished reaction' });
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    passAllReactions: async (req, res) => {
        try {
            if (!req.user) {
                throw new Error('Could not find authenticated user');
            }
            await encounterServices.passAllReactions(Number(req.params.encounterId));
            res.status(200).json({ message: 'Successfully passed all reactions' });
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    confirmActionQueueResults: async (req, res) => {
        try {
            if (!req.user || !req.encounter) {
                throw new Error('Could not find authenticated user');
            }
            await encounterServices.confirmActionQueueResults(req.encounter, req.body);
            await encounterServices.advancePhase(Number(req.params.encounterId));
            res
                .status(200)
                .json({ message: 'Successfully confirmed action queue results' });
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    createOrUpdateEncounter: async (req, res) => {
        try {
            if (!req.user) {
                res.status(401).json({
                    error: 'You do not have the required permissions to create a encounter',
                });
                return;
            }
            await encounterServices.createOrUpdateEncounter(Number(req.params.campaignId), Number(req.params.mapId), req.body);
            res.status(200).json({ message: 'Successfully created encounter' });
        }
        catch (error) {
            if (error instanceof Error) {
                res.status(500).json({ error: error.message });
            }
        }
    },
    deleteEncounter: async (req, res) => {
        try {
            if (!req.user) {
                res
                    .status(401)
                    .json({ error: 'You must be signed in to use this function' });
                return;
            }
            await encounterServices.deleteEncounter(Number(req.params.encounterId));
            res.status(200).json({ message: 'Successfully deleted encounter' });
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
};
export default encounterController;
