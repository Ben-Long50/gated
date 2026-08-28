import z from 'zod';
import { Description, Name, RichText } from './fieldSchemas.js';
export const GangInput = z.object({
    id: z.number().int().optional(),
    name: Name,
    generatedPictureId: z.number().int().optional(),
    background: RichText,
    campaignId: z.number().int(),
    factionId: z.number().int().optional(),
    leaderIds: z.array(z.number().int()),
    characterIds: z.array(z.number().int()),
});
export const GangSessionBonusInput = z.array(z.object({
    value: z.number().int().nonnegative(),
    description: Description,
}));
