import z from 'zod';
export declare const NotesInput: z.ZodObject<{
    id: z.ZodOptional<z.ZodNumber>;
    characterId: z.ZodNumber;
    sessionId: z.ZodNumber;
    content: z.ZodObject<{
        html: z.ZodPipe<z.ZodString, z.ZodTransform<string, string>>;
        nodes: z.ZodObject<{
            root: z.ZodAny;
        }, z.z.core.$strip>;
    }, z.z.core.$strip>;
}, z.z.core.$strip>;
export type NotesInput = z.infer<typeof NotesInput>;
