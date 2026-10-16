import z from 'zod';
export declare const EventInput: z.ZodObject<{
    id: z.ZodOptional<z.ZodNumber>;
    characterId: z.ZodOptional<z.ZodNumber>;
    name: z.ZodString;
    description: z.ZodString;
    month: z.ZodEnum<{
        arctus: "arctus";
        pluvia: "pluvia";
        kavir: "kavir";
        husk: "husk";
        nagai: "nagai";
        zenzi: "zenzi";
        haqMilah: "haqMilah";
        termina: "termina";
    }>;
    day: z.ZodNumber;
    time: z.ZodObject<{
        hour: z.ZodNumber;
        minute: z.ZodNumber;
        second: z.ZodNumber;
    }, z.z.core.$strip>;
}, z.z.core.$strip>;
export type EventInput = z.infer<typeof EventInput>;
