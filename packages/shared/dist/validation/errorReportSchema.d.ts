import z from 'zod';
export declare const ErrorReportInput: z.ZodObject<{
    id: z.ZodOptional<z.ZodNumber>;
    title: z.ZodString;
    content: z.ZodString;
}, z.z.core.$strip>;
export type ErrorReportInput = z.infer<typeof ErrorReportInput>;
