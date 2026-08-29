import z from 'zod';
export const PromptInput = z.object({
    type: z.enum(['character', 'item', 'scene']),
    setting: z.string().min(10).max(500),
    time: z.enum(['daytime', 'nighttime', 'sunrise', 'sunset']),
    description: z.string().min(10).max(800),
    pictureCount: z.number().int().min(1).max(4),
});
