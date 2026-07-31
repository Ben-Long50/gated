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
  duration: z.preprocess(
  (value) => value === null ? undefined : value,
    z
    .object({
      unit: z.string(),
      value: z.number().int().nonnegative(),
    })
    .optional(),
  cooldown: z.preprocess(
  (value) => value === null ? undefined : value,
    z
    .object({
      unit: z.string(),
      value: z.number().int().nonnegative(),
    })
    .optional(),
  description: Description,
  modifiers: ItemStats.optional(),
  keywords: Keywords.optional(),
  baseActionId: z.preprocess(
  (value) => value === null ? undefined : value,
    z.number().int().optional()
});

export type ActionInput = z.infer<typeof ActionInput>;
