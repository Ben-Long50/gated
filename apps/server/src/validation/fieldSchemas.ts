import z from 'zod';
import { Attribute, Month, Skill } from './enums.js';
import sanitizeHtml from 'sanitize-html';

export const Name = z
  .string()
  .min(2, 'Name must be at least 2 characters')
  .max(100, 'Name must be under 100 characters');

export const FirstName = z
  .string()
  .min(2, 'First name must be at least 2 characters')
  .max(100, 'First name must be under 100 characters');

export const LastName = z
  .string()
  .min(2, 'Last name must be at least 2 characters')
  .max(100, 'Last name must be under 100 characters')
  .optional();

export const Description = z
  .string()
  .min(10, 'Description must be at least 10 characters')
  .max(1000, 'Description must be under 1000 characters');

export const RichText = z.object({
  html: z.string().transform((val) =>
    sanitizeHtml(val, {
      allowedTags: [
        'p',
        'br',
        'b',
        'strong',
        'i',
        'em',
        'u',
        's',
        'blockquote',
        'ul',
        'ol',
        'li',
        'code',
        'pre',
        'h1',
        'h2',
        'h3',
        'a',
        'table',
        'thead',
        'tbody',
        'tfoot',
        'tr',
        'th',
        'td',
      ],
      allowedAttributes: {
        a: ['href', 'target'],
        table: ['border', 'cellpadding', 'cellspacing'],
        th: ['colspan', 'rowspan'],
        td: ['colspan', 'rowspan'],
      },
    }),
  ),
  nodes: z.object({ root: z.any() }),
});

export const CharacterStats = z.record(z.string(), z.number().int());

export type CharacterStats = z.infer<typeof CharacterStats>;

export const ItemStats = z.record(z.string(), z.number());

export type ItemStats = z.infer<typeof ItemStats>;

export const Keywords = z.array(
  z.object({
    keywordId: z.number().int(),
    value: z.number().int().int().nonnegative().nullish(),
  }),
);

export const Roll = z.object({ attribute: Attribute, skill: Skill });

export const Costs = z.record(z.string(), z.number().int().nonnegative());

export const Affiliation = z.number().int().min(-5).max(5);

export const Points = z.number().int().min(0).max(4);

export const Attributes = z.object({
  cybernetica: z.object({
    points: Points,
    skills: z.object({
      chromebits: z.object({ points: Points }),
      hardwired: z.object({ points: Points }),
      motorized: z.object({ points: Points }),
      networked: z.object({ points: Points }),
    }),
  }),
  esoterica: z.object({
    points: Points,
    skills: z.object({
      gestalt: z.object({ points: Points }),
      godhead: z.object({ points: Points }),
      mysticism: z.object({ points: Points }),
      outerworld: z.object({ points: Points }),
    }),
  }),
  peace: z.object({
    points: Points,
    skills: z.object({
      barter: z.object({ points: Points }),
      erudition: z.object({ points: Points }),
      rhetoric: z.object({ points: Points }),
      treatment: z.object({ points: Points }),
    }),
  }),
  violence: z.object({
    points: Points,
    skills: z.object({
      assault: z.object({ points: Points }),
      shooting: z.object({ points: Points }),
      subterfuge: z.object({ points: Points }),
      threshold: z.object({ points: Points }),
    }),
  }),
});

export type Attributes = z.infer<typeof Attributes>;

export const Date = z.object({
  month: Month,
  day: z.number().int().nonnegative(),
});

export type Date = z.infer<typeof Date>;

export const Time = z.object({
  hour: z.number().int().min(0).max(59),
  minute: z.number().int().min(0).max(59),
  second: z.number().int().min(0).max(59),
});

export type Time = z.infer<typeof Time>;
