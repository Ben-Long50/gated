import z from 'zod';
export declare const PatchNotesInput: z.ZodObject<{
    id: z.ZodOptional<z.ZodNumber>;
    version: z.ZodNumber;
    title: z.ZodString;
    content: z.ZodObject<{
        html: z.ZodPipe<z.ZodString, z.ZodTransform<string, string>>;
        nodes: z.ZodObject<{
            root: z.ZodAny;
        }, z.z.core.$strip>;
    }, z.z.core.$strip>;
}, z.z.core.$strip>;
export type PatchNotesInput = z.infer<typeof PatchNotesInput>;
