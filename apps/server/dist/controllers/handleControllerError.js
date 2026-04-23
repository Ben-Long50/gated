import z, { ZodError } from 'zod';
const handleControllerError = (res, error) => {
    if (error instanceof ZodError) {
        res.status(500).json({ message: z.prettifyError(error) });
    }
    else if (error instanceof Error) {
        res.status(500).json({ message: error });
    }
};
export default handleControllerError;
