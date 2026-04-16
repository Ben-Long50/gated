import z from 'zod';
import { Attribute, Skill } from './enums.js';
export const Name = z.string().min(2).max(100);
export const LastName = Name.optional();
export const Description = z.string().min(10).max(250);
export const PictureFile = z.file().optional();
export const Picture = z
    .object({
    imageUrl: z.string(),
    publicId: z.string(),
    position: z.object({
        x: z.number().int().min(0).max(100),
        y: z.number().int().min(0).max(100),
    }),
})
    .optional();
export const RichText = z.object({ html: z.string(), nodes: z.string() });
export const CharacterStats = z.record(z.string(), z.number().int().nonnegative());
export const ItemStats = z.record(z.string(), z.number().int().nonnegative());
export const Keywords = z.array(z.object({
    keywordId: z.number().int(),
    value: z.number().int().int().nonnegative(),
}));
export const Roll = z.object({ attribute: Attribute, skill: Skill });
export const Costs = z.record(z.string(), z.number().int().nonnegative());
export const Affiliation = z.number().int().min(-5).max(5);
export const Attributes = z.record(Attribute, z.object({
    points: z.number().int().min(0).max(4),
    skills: z.record(Skill, z.object({
        points: z.number().int().min(0).max(4),
    })),
}));
export const Time = z.object({
    hour: z.number().int().min(0).max(59),
    minute: z.number().int().min(0).max(59),
    second: z.number().int().min(0).max(59),
});
