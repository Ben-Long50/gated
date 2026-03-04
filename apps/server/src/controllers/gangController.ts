import { Request, Response } from 'express';
import upload from '../utils/multer.js';
import { uploadToCloudinary } from '../utils/cloudinary.js';
import parseRequestBody from '../utils/parseRequestBody.js';
import gangServices from '../services/gangServices.js';

const gangController = {
  getGangs: async (req: Request, res: Response) => {
    try {
      if (!req.user) {
        res
          .status(401)
          .json({ error: 'You must be signed in to use this function' });
        return;
      }

      const gangs = await gangServices.getGangs(req.user.id);

      res.status(200).json(gangs);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  getBatchGangs: async (req: Request, res: Response) => {
    try {
      if (!req.user) {
        throw new Error('Could not find authenticated user');
      }

      const gangs = await gangServices.getBatchGangs(req.body.gangIds);

      res.status(200).json(gangs);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  getGangById: async (req: Request, res: Response) => {
    try {
      const gang = await gangServices.getGangById(Number(req.params.gangId));
      res.status(200).json(gang);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  createGang: [
    upload.single('picture'),
    uploadToCloudinary,
    async (req: Request, res: Response) => {
      try {
        if (!req.user) {
          res.status(401).json({
            error: 'You do not have the required permissions to create a gang',
          });
          return;
        }

        const parsedBody = parseRequestBody(req.body);

        await gangServices.createOrUpdateGang(parsedBody);

        res.status(200).json({ message: 'Successfully created gang' });
      } catch (error) {
        if (error instanceof Error) {
          res.status(500).json({ error: error.message });
        }
      }
    },
  ],

  allocateReputation: async (req: Request, res: Response) => {
    try {
      await gangServices.allocateReputation(
        Number(req.params.gangId),
        req.body.sessionId,
        req.body.bonus,
      );
      res
        .status(200)
        .json({ messagee: 'Successfully updated gang reputation' });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  allocateLevelNodes: async (req: Request, res: Response) => {
    try {
      await gangServices.allocateLevelNodes(
        Number(req.params.gangId),
        req.body.sessionId,
        req.body.bonus,
      );
      res
        .status(200)
        .json({ messagee: 'Successfully updated gang reputation' });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  deleteGang: async (req: Request, res: Response) => {
    try {
      if (!req.user) {
        res
          .status(401)
          .json({ error: 'You must be signed in to use this function' });
        return;
      }

      await gangServices.deleteGang(Number(req.params.gangId));
      res.status(200).json({ message: 'Successfully deleted gang' });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },
};

export default gangController;
