import z from 'zod';
export declare const PropertyInput: z.ZodObject<{
    id: z.ZodOptional<z.ZodNumber>;
    name: z.ZodString;
    description: z.ZodString;
    generatedPictureId: z.ZodOptional<z.ZodNumber>;
    gpPrice: z.ZodNumber;
    type: z.ZodEnum<{
        property: "property";
        districtUpgrade: "districtUpgrade";
    }>;
}, z.z.core.$strip>;
export type PropertyInput = z.infer<typeof PropertyInput>;
