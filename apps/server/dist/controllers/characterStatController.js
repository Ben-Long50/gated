import characterStatServices from '../services/characterStatServices.js';
const characterStatController = {
    editCharacterStat: async (req, res) => {
        try {
            await characterStatServices.editCharacterStat(Number(req.params.characterId), req.body.value);
            res.status(200).json({
                message: `Changed character stats by ${req.body.value.toString()}`,
            });
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    resetCharacterStat: async (req, res) => {
        try {
            await characterStatServices.resetCharacterStat(Number(req.params.characterId), req.body.value);
            res.status(200).json({
                message: `Changed current stats ${req.body.value}`,
            });
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    editProfits: async (req, res) => {
        try {
            await characterStatServices.editProfits(Number(req.params.characterId), Number(req.body.value));
            res
                .status(200)
                .json({ message: `Changed current profits by ${req.body.value}` });
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
};
export default characterStatController;
