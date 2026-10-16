import z from 'zod';
export declare const MapInput: z.ZodObject<{
    id: z.ZodOptional<z.ZodNumber>;
    campaignId: z.ZodOptional<z.ZodNumber>;
    type: z.ZodEnum<{
        map: "map";
        component: "component";
    }>;
    draft: z.ZodBoolean;
    name: z.ZodString;
    description: z.ZodString;
    width: z.ZodNumber;
    height: z.ZodNumber;
    baseColor: z.ZodString;
    layerCount: z.ZodNumber;
    layers: z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        id: z.ZodNumber;
        hidden: z.ZodBoolean;
        componentCount: z.ZodNumber;
        components: z.ZodArray<z.ZodType<any, unknown, z.z.core.$ZodTypeInternals<any, unknown>>>;
    }, z.z.core.$strip>>;
    generatedPictureId: z.ZodOptional<z.ZodNumber>;
}, z.z.core.$strip>;
export type MapInput = z.infer<typeof MapInput>;
