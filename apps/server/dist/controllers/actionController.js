import actionServices from '../services/actionServices.js';
import handleControllerError from './handleControllerError.js';
import { validation } from '@gated/shared';
const actionController = {
    getActions: async (_req, res) => {
        try {
            const actions = await actionServices.getActions();
            res.status(200).json(actions);
        }
        catch (error) {
            handleControllerError(res, error);
        }
    },
    getActionById: async (req, res) => {
        try {
            const action = await actionServices.getActionById(Number(req.params.actionId));
            res.status(200).json(action);
        }
        catch (error) {
            handleControllerError(res, error);
        }
    },
    getBatchActions: async (req, res) => {
        try {
            if (!req.user) {
                throw new Error('Could not find authenticated user');
            }
            const actionIds = req.query.ids.split(',').map(Number);
            const actions = await actionServices.getBatchActions(actionIds);
            res.status(200).json(actions);
        }
        catch (error) {
            handleControllerError(res, error);
        }
    },
    createOrUpdateAction: async (req, res) => {
        try {
            const data = validation.ActionInput.parse(req.body);
            const action = await actionServices.createOrUpdateAction(data);
            res.status(200).json({ action, message: 'Successfully created action' });
        }
        catch (error) {
            handleControllerError(res, error);
        }
    },
    activateAction: async (req, res) => {
        try {
            const action = await actionServices.activateAction(Number(req.params.actionId), req.body.value);
            res.status(200).json({ action, message: 'Successfully toggled action' });
        }
        catch (error) {
            handleControllerError(res, error);
        }
    },
    deleteAction: async (req, res) => {
        try {
            await actionServices.deleteAction(Number(req.params.actionId));
            res.status(200).json({ message: 'Successfully deleted action' });
        }
        catch (error) {
            handleControllerError(res, error);
        }
    },
};
export default actionController;
