import z from 'zod';
import { Description, Name } from './fieldSchemas.js';
import { ConditionType } from './enums.js';
export const ConditionInput = z.object({
    id: z.number().int().optional(),
    name: Name,
    conditionType: ConditionType,
    description: Description,
});
