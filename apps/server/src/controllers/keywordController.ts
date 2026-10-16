import { Request, Response } from 'express';
import keywordServices from '../services/keywordServices.js';
import { validation } from '@gated/shared';
import handleControllerError from './handleControllerError.js';

const keywordController = {
  getKeywords: async (_req: Request, res: Response) => {
    try {
      const keywords = await keywordServices.getKeywords();
      res.status(200).json(keywords);
    } catch (error: any) {
      handleControllerError(res, error);
    }
  },

  getKeywordById: async (req: Request, res: Response) => {
    try {
      const keyword = await keywordServices.getKeywordById(
        Number(req.params.keywordId),
      );
      res.status(200).json(keyword);
    } catch (error: any) {
      handleControllerError(res, error);
    }
  },

  createKeyword: async (req: Request, res: Response) => {
    try {
      const validatedKeyword = validation.KeywordInput.parse(req.body);

      const keyword = await keywordServices.createKeyword(validatedKeyword);

      res
        .status(200)
        .json({ keyword, message: `Successfully created ${keyword.name}` });
    } catch (error: any) {
      handleControllerError(res, error);
    }
  },

  deleteKeyword: async (req: Request, res: Response) => {
    try {
      await keywordServices.deleteKeyword(Number(req.params.keywordId));
      res.status(200).json({ message: 'Successfully deleted keyword' });
    } catch (error: any) {
      handleControllerError(res, error);
    }
  },
};

export default keywordController;
