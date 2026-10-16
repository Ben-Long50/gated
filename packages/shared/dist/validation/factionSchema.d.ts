import z from 'zod';
export declare const FactionInput: z.ZodObject<{
    id: z.ZodOptional<z.ZodNumber>;
    name: z.ZodString;
    generatedPictureId: z.ZodOptional<z.ZodNumber>;
    factionType: z.ZodEnum<{
        churchOfElShaddai: "churchOfElShaddai";
        corporateHoldouts: "corporateHoldouts";
        federalReservists: "federalReservists";
        noblebloods: "noblebloods";
    }>;
    background: z.ZodOptional<z.ZodObject<{
        html: z.ZodPipe<z.ZodString, z.ZodTransform<string, string>>;
        nodes: z.ZodObject<{
            root: z.ZodAny;
        }, z.z.core.$strip>;
    }, z.z.core.$strip>>;
}, z.z.core.$strip>;
export type FactionInput = z.infer<typeof FactionInput>;
