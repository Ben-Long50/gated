import z from 'zod';
import {
  Costs,
  Description,
  ItemStats,
  Keywords,
  Name,
  Roll,
} from './fieldSchemas.js';
import { ActionSubtype, ActionType } from './enums.js';

export const ActionInput = z.object({
  id: z.number().int().optional(),
  name: Name,
  costs: Costs.optional(),
  roll: z.array(Roll).optional(),
  actionType: ActionType,
  actionSubtypes: z.array(ActionSubtype).optional(),
  duration: z
    .object({
      unit: z.string(),
      value: z.number().int().nonnegative(),
    })
    .nullish(),
  cooldown: z
    .object({
      unit: z.string(),
      value: z.number().int().nonnegative(),
    })
    .nullish(),
  description: Description,
  modifiers: ItemStats.optional(),
  keywords: Keywords.optional(),
});

export type ActionInput = z.infer<typeof ActionInput>;
