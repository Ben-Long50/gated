import z from 'zod';
import { RichText } from './fieldSchemas.js';
export const ResumeInput = z.object({
    backstory: RichText,
    firstTaste: RichText,
    badMedicine: RichText,
});
