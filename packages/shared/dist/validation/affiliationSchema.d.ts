import z from 'zod';
export declare const AffiliationInput: z.ZodObject<{
    id: z.ZodOptional<z.ZodNumber>;
    campaignId: z.ZodNumber;
    factionIds: z.ZodArray<z.ZodNumber>;
    gangIds: z.ZodArray<z.ZodNumber>;
    characterIds: z.ZodArray<z.ZodNumber>;
    value: z.ZodNumber;
}, z.z.core.$strip>;
export type AffiliationInput = z.infer<typeof AffiliationInput>;
