import { Request, Response } from 'express';
import { MapInput } from '../validation/mapSchema.js';
import parseRequestBody from '../utils/parseRequestBody.js';
import mapServices from '../services/mapServices.js';
import handleControllerError from './handleControllerError.js';

const mapController = {
  getMapById: async (req: Request, res: Response) => {
    try {
      const map = await mapServices.getMapById(Number(req.params.mapId));

      res.status(200).json(map);
    } catch (error: any) {
      handleControllerError(res, error);
    }
  },

  getBatchMaps: async (req: Request, res: Response) => {
    try {
      if (!req.user) {
        throw new Error('Could not find authenticated user');
      }

      const mapIds = (req.query.ids as string).split(',').map(Number);

      const maps = await mapServices.getBatchMaps(mapIds);

      res.status(200).json(maps);
    } catch (error: any) {
      handleControllerError(res, error);
    }
  },

  createOrUpdateMap: async (req: Request, res: Response) => {
    try {
      if (!req.user) {
        throw new Error('You must be logged in to create or update a map');
      }

      const parsedBody = parseRequestBody(req.body);

      const validatedMap = MapInput.parse(parsedBody);

      const map = await mapServices.createOrUpdateMap(
        req.user.id,
        validatedMap,
      );

      res
        .status(200)
        .json({ map, message: `Successfully created map: ${map.name}` });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  deleteMap: async (req: Request, res: Response) => {
    try {
      if (!req.user) {
        res
          .status(401)
          .json({ error: 'You must be signed in to use this function' });
        return;
      }

      await mapServices.deleteMap(Number(req.params.mapId), req.user.id);

      res.status(200).json({ message: 'Successfully deleted map' });
    } catch (error: any) {
      handleControllerError(res, error);
    }
  },
};

export default mapController;
