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
    (value) => (value === null ? undefined : value),
    z
      .object({
        unit: z.string(),
        value: z.number().int().nonnegative(),
      })
      .optional(),
  ),
  cooldown: z.preprocess(
    (value) => (value === null ? undefined : value),
    z
      .object({
        unit: z.string(),
        value: z.number().int().nonnegative(),
      })
      .optional(),
  ),
  description: Description,
  modifiers: z.preprocess(
    (value) => (value === null ? undefined : value),
    ItemStats.optional(),
  ),
  keywords: Keywords.optional(),
  baseActionId: z.preprocess(
    (value) => (value === null ? undefined : value),
    z.number().int().optional(),
  ),
});

export const ActionCopyInput = z.object({
  id: z.number().int().nonnegative(),
  name: Name,
  costs: Costs.nullable(),
  roll: z.array(Roll).nullable(),
  actionType: ActionType,
  actionSubtypes: z.array(ActionSubtype),
  duration: z
    .object({
      unit: z.string(),
      value: z.number().int().nonnegative(),
    })
    .nullable(),

  cooldown: z
    .object({
      unit: z.string(),
      value: z.number().int().nonnegative(),
    })
    .nullable(),

  description: Description,
  modifiers: ItemStats.nullable(),
  baseActionId: z.preprocess(
    (value) => (value === null ? undefined : value),
    z.number().int().optional(),
  ),
});

export type ActionInput = z.infer<typeof ActionInput>;

export type ActionCopyInput = z.infer<typeof ActionCopyInput>;
