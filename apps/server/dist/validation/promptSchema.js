import z from 'zod';
export const CharacterPromptInput = z.object({
    setting: z.string().min(10).max(150),
    time: z.string().min(10).max(150),
    height: z.enum(['tall', 'average', 'short']),
    age: z.enum(['old', 'adult', 'teen', 'child']),
    build: z.enum(['fat', 'skinny', 'muscular']),
    sex: z.enum(['male', 'female']),
    hair: z.string().min(10).max(150),
    outfit: z.string().min(10).max(150),
    augmentation: z.string().min(10).max(150),
    weapon: z.string().min(10).max(150),
    pose: z.string().min(10).max(150),
    pictureCount: z.number().int().min(1).max(4),
});
