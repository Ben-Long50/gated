import z, { ZodError } from 'zod';
const handleControllerError = (res, error) => {
    if (error instanceof ZodError) {
        res.status(500).json({ error: z.prettifyError(error) });
        return;
    }
    else if (error instanceof Error) {
        res.status(500).json({ error: error.message });
        return;
    }
};
export default handleControllerError;
