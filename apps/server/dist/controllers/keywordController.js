import keywordServices from '../services/keywordServices.js';
import { validation } from '@gated/shared';
import handleControllerError from './handleControllerError.js';
const keywordController = {
    getKeywords: async (_req, res) => {
        try {
            const keywords = await keywordServices.getKeywords();
            res.status(200).json(keywords);
        }
        catch (error) {
            handleControllerError(res, error);
        }
    },
    getKeywordById: async (req, res) => {
        try {
            const keyword = await keywordServices.getKeywordById(Number(req.params.keywordId));
            res.status(200).json(keyword);
        }
        catch (error) {
            handleControllerError(res, error);
        }
    },
    createKeyword: async (req, res) => {
        try {
            const validatedKeyword = validation.KeywordInput.parse(req.body);
            const keyword = await keywordServices.createKeyword(validatedKeyword);
            res
                .status(200)
                .json({ keyword, message: `Successfully created ${keyword.name}` });
        }
        catch (error) {
            handleControllerError(res, error);
        }
    },
    deleteKeyword: async (req, res) => {
        try {
            await keywordServices.deleteKeyword(Number(req.params.keywordId));
            res.status(200).json({ message: 'Successfully deleted keyword' });
        }
        catch (error) {
            handleControllerError(res, error);
        }
    },
};
export default keywordController;
