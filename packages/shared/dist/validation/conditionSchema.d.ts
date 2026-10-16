import z from 'zod';
export declare const ConditionInput: z.ZodObject<{
    id: z.ZodOptional<z.ZodNumber>;
    name: z.ZodString;
    conditionType: z.ZodEnum<{
        character: "character";
        item: "item";
    }>;
    description: z.ZodString;
}, z.z.core.$strip>;
export declare const ConditionReferenceInput: z.ZodArray<z.ZodObject<{
    conditionId: z.ZodNumber;
    stacks: z.ZodNullable<z.ZodNumber>;
}, z.z.core.$strip>>;
export type ConditionInput = z.infer<typeof ConditionInput>;
