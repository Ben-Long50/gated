import z from 'zod';
export declare const SessionInput: z.ZodObject<{
    id: z.ZodOptional<z.ZodNumber>;
    campaignId: z.ZodNumber;
    name: z.ZodString;
    location: z.ZodString;
    generatedPictureId: z.ZodOptional<z.ZodNumber>;
    briefing: z.ZodObject<{
        html: z.ZodPipe<z.ZodString, z.ZodTransform<string, string>>;
        nodes: z.ZodObject<{
            root: z.ZodAny;
        }, z.z.core.$strip>;
    }, z.z.core.$strip>;
    characterIds: z.ZodArray<z.ZodNumber>;
}, z.z.core.$strip>;
export type SessionInput = z.infer<typeof SessionInput>;
