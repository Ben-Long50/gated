import upload from '../utils/multer.js';
import { uploadToCloudinary } from '../utils/cloudinary.js';
import parseRequestBody from '../utils/parseRequestBody.js';
import propertyServices from '../services/propertyServices.js';
const propertyController = {
    getBaseProperties: async (req, res) => {
        try {
            if (!req.user) {
                res
                    .status(401)
                    .json({ error: 'You must be signed in to use this function' });
                return;
            }
            const properties = await propertyServices.getBaseProperties();
            res.status(200).json(properties);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    getBatchProperties: async (req, res) => {
        try {
            if (!req.user) {
                throw new Error('Could not find authenticated user');
            }
            const properties = await propertyServices.getBatchProperties(req.body.propertyIds);
            res.status(200).json(properties);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    getPropertyById: async (req, res) => {
        try {
            const property = await propertyServices.getPropertyById(Number(req.params.propertyId));
            res.status(200).json(property);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    createOrUpdateBaseProperty: [
        upload.single('pictureFile'),
        uploadToCloudinary,
        async (req, res) => {
            try {
                if (!req.user) {
                    res.status(401).json({
                        error: 'You do not have the required permissions to create a property',
                    });
                    return;
                }
                const parsedBody = parseRequestBody(req.body);
                await propertyServices.createOrUpdateBaseProperty(parsedBody);
                res.status(200).json({ message: 'Successfully created property' });
            }
            catch (error) {
                if (error instanceof Error) {
                    res.status(500).json({ error: error.message });
                }
            }
        },
    ],
    deleteProperty: async (req, res) => {
        try {
            if (!req.user) {
                res
                    .status(401)
                    .json({ error: 'You must be signed in to use this function' });
                return;
            }
            await propertyServices.deleteProperty(Number(req.params.propertyId));
            res.status(200).json({ message: 'Successfully deleted property' });
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
};
export default propertyController;
