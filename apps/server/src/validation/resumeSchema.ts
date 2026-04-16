import z from 'zod';
import { RichText } from './fieldSchemas.js';

export const ResumeInput = z.object({
  backstory: RichText,
  firstTaste: RichText,
  badMedicine: RichText,
});

export type ResumeInput = z.infer<typeof ResumeInput>;
