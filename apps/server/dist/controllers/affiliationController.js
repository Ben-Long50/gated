import affiliationServices from '../services/affiliationServices.js';
import { AffiliationInput } from '../validation/affiliationSchema.js';
import handleControllerError from './handleControllerError.js';
const affiliationController = {
    getBatchAffiliations: async (req, res) => {
        try {
            const affiliationIds = req.query.ids.split(',').map(Number);
            const affiliations = await affiliationServices.getBatchAffiliations(affiliationIds);
            res.status(200).json(affiliations);
        }
        catch (error) {
            handleControllerError(res, error);
        }
    },
    getAffiliationById: async (req, res) => {
        try {
            const affiliation = await affiliationServices.getAffiliationById(Number(req.params.affiliationId));
            res.status(200).json(affiliation);
        }
        catch (error) {
            handleControllerError(res, error);
        }
    },
    createAffiliation: async (req, res) => {
        try {
            const validatedAffiliation = AffiliationInput.parse(req.body);
            const affiliation = await affiliationServices.createAffiliation(validatedAffiliation);
            res.status(200).json({
                affiliation,
                message: 'Successfully created affiliation',
            });
        }
        catch (error) {
            handleControllerError(res, error);
        }
    },
    updateAffiliationValue: async (req, res) => {
        try {
            const affiliation = await affiliationServices.updateAffiliationValue(Number(req.params.affiliationId), req.body.value);
            res.status(200).json({
                affiliation,
                message: 'Successfully updated affiliation value',
            });
        }
        catch (error) {
            handleControllerError(res, error);
        }
    },
    deleteAffiliation: async (req, res) => {
        try {
            await affiliationServices.deleteAffiliation(Number(req.params.affiliationId));
            res.status(200).json({ message: 'Successfully deleted affiliation' });
        }
        catch (error) {
            handleControllerError(res, error);
        }
    },
};
export default affiliationController;
