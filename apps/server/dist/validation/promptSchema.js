import z from 'zod';
export const CharacterPromptInput = z.object({
    setting: z.string().min(10).max(500),
    time: z.enum(['daytime', 'nighttime', 'sunrise', 'sunset']),
    height: z.enum(['tall', 'average', 'short']),
    age: z.enum(['old', 'adult', 'teen', 'child']),
    build: z.enum(['fat', 'skinny', 'muscular']),
    sex: z.enum(['male', 'female']),
    hair: z.string().min(10).max(500),
    outfit: z.string().min(10).max(500),
    augmentation: z.string().min(10).max(500),
    weapon: z.string().min(10).max(500),
    pose: z.string().min(10).max(500),
    pictureCount: z.number().int().min(1).max(4),
});
export const ItemPromptInput = z.object({
    setting: z.string().min(10).max(500),
    time: z.enum(['daytime', 'nighttime', 'sunrise', 'sunset']),
    itemDescription: z.string().min(10).max(500),
    itemArrangement: z.string().min(10).max(500),
    pictureCount: z.number().int().min(1).max(4),
});
