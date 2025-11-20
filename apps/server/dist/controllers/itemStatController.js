import itemStatServices from '../services/itemStatServices.js';
const itemStatController = {
    editItemStat: async (req, res) => {
        try {
            if (!req.user) {
                throw new Error('You must be logged in to perform this action');
            }
            await itemStatServices.editItemStat(Number(req.params.itemId), req.body.value, req.user.id);
            res
                .status(200)
                .json({ message: `Changed current block points by ${req.body.value}` });
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
};
export default itemStatController;
