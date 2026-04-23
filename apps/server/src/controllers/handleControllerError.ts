import z, { ZodError } from 'zod';
import { Response } from 'express';

const handleControllerError = (res: Response, error: ZodError | Error) => {
  if (error instanceof ZodError) {
    res.status(500).json({ message: z.prettifyError(error) });
  } else if (error instanceof Error) {
    res.status(500).json({ message: error });
  }
};

export default handleControllerError;
