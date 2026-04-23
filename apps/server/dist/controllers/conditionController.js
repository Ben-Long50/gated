import conditionServices from '../services/conditionServices.js';
import { ConditionInput } from '../validation/conditionSchema.js';
import handleControllerError from './handleControllerError.js';
const conditionController = {
    getConditions: async (_req, res) => {
        try {
            const conditions = await conditionServices.getConditions();
            res.status(200).json(conditions);
        }
        catch (error) {
            handleControllerError(res, error);
        }
    },
    getConditionById: async (req, res) => {
        try {
            const condition = await conditionServices.getConditionById(req.params.conditionId);
            res.status(200).json(condition);
        }
        catch (error) {
            handleControllerError(res, error);
        }
    },
    createCondition: async (req, res) => {
        try {
            const validatedCondition = ConditionInput.parse(req.body);
            const condition = await conditionServices.createCondition(validatedCondition);
            res
                .status(200)
                .json({ condition, message: `Successfully created ${condition.name}` });
        }
        catch (error) {
            handleControllerError(res, error);
        }
    },
    updateConditionStacks: async (req, res) => {
        try {
            let condition = '';
            if (req.params.characterId) {
                condition = await conditionServices.updateCharacterConditionStacks(Number(req.params.conditionId), req.body.value);
            }
            if (req.params.itemId) {
                condition = await conditionServices.updateItemConditionStacks(Number(req.params.conditionId), req.body.value);
            }
            res
                .status(200)
                .json({ message: `Successfully updated ${condition} stacks` });
        }
        catch (error) {
            handleControllerError(res, error);
        }
    },
    deleteCondition: async (req, res) => {
        try {
            await conditionServices.deleteCondition(Number(req.params.conditionId));
            res.status(200).json({ message: 'Successfully deleted condition' });
        }
        catch (error) {
            handleControllerError(res, error);
        }
    },
    deleteCharacterCondition: async (req, res) => {
        try {
            await conditionServices.deleteCharacterCondition(Number(req.params.conditionId));
            res
                .status(200)
                .json({ message: 'Successfully deleted character condition' });
        }
        catch (error) {
            handleControllerError(res, error);
        }
    },
    deleteItemCondition: async (req, res) => {
        try {
            await conditionServices.deleteItemCondition(Number(req.params.conditionId));
            res.status(200).json({ message: 'Successfully deleted item condition' });
        }
        catch (error) {
            handleControllerError(res, error);
        }
    },
};
export default conditionController;
