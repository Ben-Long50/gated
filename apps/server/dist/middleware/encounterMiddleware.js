import encounterServices from '../services/encounterServices.js';
import characterServices from '../services/characterServices.js';
import campaignServices from '../services/campaignServices.js';
const encounterMiddleware = {
    validateEncounterPermissions: async (req, res, next) => {
        if (!req.user) {
            res.status(401).json({ error: 'No user found' });
            return;
        }
        const campaign = await campaignServices.getCampaignById(Number(req.params.campaignId));
        const encounter = await encounterServices.getEncounterById(Number(req.params.encounterId));
        const activeCharacterId = encounter.turnOrder[encounter.turnPosition];
        const activeCharacter = await characterServices.getCharacterById(activeCharacterId);
        if (!activeCharacter) {
            res.status(500).json({ error: 'Failed to find active character' });
            return;
        }
        if (req.user.id !== activeCharacter.userId &&
            req.user.id !== campaign.ownerId) {
            res.status(403).json({
                error: 'Only the Game Master or active player may perform this function',
            });
        }
        return next();
    },
    validateReactionPermissions: async (req, res, next) => {
        if (!req.user) {
            res.status(401).json({ error: 'No user found' });
            return;
        }
        const campaign = await campaignServices.getCampaignById(Number(req.params.campaignId));
        const encounter = await encounterServices.getEncounterById(Number(req.params.encounterId));
        const reactiveCharacterIds = encounter.reactions;
        const reactiveCharacterPromises = [];
        for (const id of reactiveCharacterIds) {
            reactiveCharacterPromises.push(characterServices.getCharacterById(id));
        }
        const reactiveCharacters = await Promise.all(reactiveCharacterPromises);
        const permissions = reactiveCharacters.some((character) => req.user && req.user.id === (character === null || character === void 0 ? void 0 : character.userId));
        if (req.user.id !== campaign.ownerId && !permissions) {
            res.status(500).json({
                error: 'Only the Game Master or users with characters in a reaction state may roll a reaction',
            });
            return;
        }
        return next();
    },
};
export default encounterMiddleware;
