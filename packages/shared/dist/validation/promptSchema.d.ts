import z from 'zod';
export declare const PromptInput: z.ZodObject<{
    type: z.ZodEnum<{
        character: "character";
        item: "item";
        scene: "scene";
    }>;
    setting: z.ZodString;
    time: z.ZodEnum<{
        daytime: "daytime";
        nighttime: "nighttime";
        sunrise: "sunrise";
        sunset: "sunset";
    }>;
    description: z.ZodString;
    pictureCount: z.ZodNumber;
}, z.z.core.$strip>;
export type PromptInput = z.infer<typeof PromptInput>;
