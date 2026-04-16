import actionServices from '../services/actionServices.js';
import { ActionInput } from '../validation/actionSchema.js';
const actionController = {
    getActions: async (_req, res) => {
        try {
            const actions = await actionServices.getActions();
            res.status(200).json(actions);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    getActionById: async (req, res) => {
        try {
            const action = await actionServices.getActionById(Number(req.params.actionId));
            res.status(200).json(action);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
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
            res.status(500).json({ error: error.message });
        }
    },
    createAction: async (req, res) => {
        try {
            const data = ActionInput.parse(req.body);
            await actionServices.createAction(data);
            res.status(200).json({ message: 'Successfully created action' });
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    activateAction: async (req, res) => {
        try {
            await actionServices.activateAction(Number(req.params.actionId), req.body.value);
            res.status(200).json({ message: 'Successfully toggled action' });
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    deleteAction: async (req, res) => {
        try {
            await actionServices.deleteAction(Number(req.params.actionId));
            res.status(200).json({ message: 'Successfully deleted action' });
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
};
export default actionController;
