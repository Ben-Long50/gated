import itemStatServices from '../services/itemStatServices.js';
import { validation } from '@gated/shared';
import { capitalCase } from 'change-case';
import handleControllerError from './handleControllerError.js';
const itemStatController = {
    editItemStat: async (req, res) => {
        try {
            if (!req.user) {
                throw new Error('You must be logged in to perform this action');
            }
            const validatedStats = validation.ItemStats.parse(req.body);
            const item = await itemStatServices.editItemStat(Number(req.params.itemId), validatedStats, req.user.id);
            const statMessages = Object.entries(validatedStats).map(([stat, value]) => `${capitalCase(stat)} by ${value}`);
            const statsMessage = statMessages.join(', ');
            res.status(200).json({
                item,
                message: `Successfully updated the following stats on ${item.name}: ${statsMessage}`,
            });
        }
        catch (error) {
            handleControllerError(res, error);
        }
    },
};
export default itemStatController;
