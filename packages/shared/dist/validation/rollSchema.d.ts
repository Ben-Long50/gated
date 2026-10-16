import z from 'zod';
export declare const RollInput: z.ZodObject<{
    characterId: z.ZodNumber;
    actionId: z.ZodNumber;
    modifiers: z.ZodArray<z.ZodEnum<{
        push: "push";
        lucky: "lucky";
        unlucky: "unlucky";
        booming: "booming";
        dooming: "dooming";
    }>>;
    extraDice: z.ZodNumber;
}, z.z.core.$strip>;
export type RollInput = z.infer<typeof RollInput>;
