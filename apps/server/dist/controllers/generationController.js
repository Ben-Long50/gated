import userServices from '../services/userServices.js';
import handleControllerError from './handleControllerError.js';
import generationServices from '../services/generationServices.js';
const generationController = {
    getGenerationById: async (req, res) => {
        try {
            const picture = await generationServices.getGenerationById(Number(req.params.generationId));
            res.status(200).json(picture);
        }
        catch (error) {
            handleControllerError(res, error);
        }
    },
    getTitlePicture: async (_req, res) => {
        try {
            const picture = await generationServices.getTitlePicture();
            res.status(200).json(picture);
        }
        catch (error) {
            handleControllerError(res, error);
        }
    },
    getStandardPictures: async (req, res) => {
        try {
            if (!req.user) {
                throw new Error('Could not find authenticated user');
            }
            const pictures = await generationServices.getStandardPictures();
            res.status(200).json(pictures);
        }
        catch (error) {
            handleControllerError(res, error);
        }
    },
    addStandardPicture: async (req, res) => {
        try {
            if (req.body.pictures) {
                const newPictures = await generationServices.addStandardPicture(req.body.pictures, req.body.prompt, req.body.type);
                res.status(200).json({
                    newPictures,
                    message: 'Successfully generated and saved standard images',
                });
                return;
            }
        }
        catch (error) {
            handleControllerError(res, error);
        }
    },
    addUserGeneratedPicture: async (req, res) => {
        try {
            if (!req.user) {
                res
                    .send(401)
                    .json({ message: 'You must be signed in to complete this user' });
                return;
            }
            const { id: userId } = req.user;
            if (req.body.pictures) {
                const data = await userServices.addUserGeneratedPicture(req.body.pictures, req.body.prompt, req.body.type, userId);
                res.status(200).json({
                    user: data.user,
                    newPictures: data.newPictures,
                    message: 'Successfully generated and saved images',
                });
                return;
            }
        }
        catch (error) {
            handleControllerError(res, error);
        }
    },
    deleteUnusedGeneratedPictures: async (req, res) => {
        var _a;
        try {
            if (!req.user) {
                throw new Error('Failed to find user');
            }
            const count = await userServices.deleteUnusedGeneratedPictures(req.user.id, req.body.type, (_a = req.body.count) !== null && _a !== void 0 ? _a : 1);
            res.status(200).json({
                message: `Successfully deleted ${count} oldest unused image(s)`,
            });
        }
        catch (error) {
            handleControllerError(res, error);
        }
    },
};
export default generationController;
