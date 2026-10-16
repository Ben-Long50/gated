import z from 'zod';
export declare const GangInput: z.ZodObject<{
    id: z.ZodOptional<z.ZodNumber>;
    name: z.ZodString;
    generatedPictureId: z.ZodOptional<z.ZodNumber>;
    background: z.ZodObject<{
        html: z.ZodPipe<z.ZodString, z.ZodTransform<string, string>>;
        nodes: z.ZodObject<{
            root: z.ZodAny;
        }, z.z.core.$strip>;
    }, z.z.core.$strip>;
    campaignId: z.ZodNumber;
    factionId: z.ZodOptional<z.ZodNumber>;
    leaderIds: z.ZodArray<z.ZodNumber>;
    characterIds: z.ZodArray<z.ZodNumber>;
}, z.z.core.$strip>;
export type GangInput = z.infer<typeof GangInput>;
export declare const GangSessionBonusInput: z.ZodArray<z.ZodObject<{
    value: z.ZodNumber;
    description: z.ZodString;
}, z.z.core.$strip>>;
export type GangSessionBonusInput = z.infer<typeof GangSessionBonusInput>;
