import z from 'zod';
export declare const KeywordInput: z.ZodObject<{
    id: z.ZodOptional<z.ZodNumber>;
    name: z.ZodString;
    keywordType: z.ZodEnum<{
        chromebits: "chromebits";
        hardwired: "hardwired";
        networked: "networked";
        weapon: "weapon";
        armor: "armor";
        vehicle: "vehicle";
    }>;
    description: z.ZodString;
    gpCost: z.ZodOptional<z.ZodNumber>;
}, z.z.core.$strip>;
export declare const KeywordReferenceCopyInput: z.ZodObject<{
    keywordId: z.ZodNumber;
    value: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
}, z.z.core.$strip>;
export type KeywordInput = z.infer<typeof KeywordInput>;
export type KeywordReferenceCopyInput = z.infer<typeof KeywordReferenceCopyInput>;
