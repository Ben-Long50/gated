import z from 'zod';
import { RollModifiers } from './enums.js';

export const RollInput = z.object({
  characterId: z.number().int().nonnegative(),
  actionId: z.number().int().nonnegative(),
  modifiers: z.array(RollModifiers),
  extraDice: z.number().int().nonnegative(),
});

export type RollInput = z.infer<typeof RollInput>;
