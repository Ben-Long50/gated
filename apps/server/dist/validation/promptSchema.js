import z from 'zod';
export const CharacterPromptInput = z.object({
    setting: z.string().min(10).max(250),
    time: z.enum(['daytime', 'nighttime', 'sunrise', 'sunset']),
    height: z.enum(['tall', 'average', 'short']),
    age: z.enum(['old', 'adult', 'teen', 'child']),
    build: z.enum(['fat', 'skinny', 'muscular']),
    sex: z.enum(['male', 'female']),
    hair: z.string().min(10).max(250),
    outfit: z.string().min(10).max(250),
    augmentation: z.string().min(10).max(250),
    weapon: z.string().min(10).max(250),
    pose: z.string().min(10).max(250),
    pictureCount: z.number().int().min(1).max(4),
});
export const ItemPromptInput = z.object({
    setting: z.string().min(10).max(250),
    time: z.enum(['daytime', 'nighttime', 'sunrise', 'sunset']),
    itemDescription: z.string().min(10).max(250),
    itemArrangement: z.string().min(10).max(250),
    pictureCount: z.number().int().min(1).max(4),
});
