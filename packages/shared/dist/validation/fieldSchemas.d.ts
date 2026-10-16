import z from 'zod';
export declare const Name: z.ZodString;
export declare const FirstName: z.ZodString;
export declare const LastName: z.ZodOptional<z.ZodString>;
export declare const Description: z.ZodString;
export declare const RichText: z.ZodObject<{
    html: z.ZodPipe<z.ZodString, z.ZodTransform<string, string>>;
    nodes: z.ZodObject<{
        root: z.ZodAny;
    }, z.z.core.$strip>;
}, z.z.core.$strip>;
export declare const CharacterStats: z.ZodRecord<z.ZodString, z.ZodNumber>;
export type CharacterStats = z.infer<typeof CharacterStats>;
export declare const ItemStats: z.ZodRecord<z.ZodString, z.ZodNumber>;
export type ItemStats = z.infer<typeof ItemStats>;
export declare const Keywords: z.ZodArray<z.ZodObject<{
    keywordId: z.ZodNumber;
    value: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
}, z.z.core.$strip>>;
export declare const Roll: z.ZodObject<{
    attribute: z.ZodEnum<{
        cybernetica: "cybernetica";
        esoterica: "esoterica";
        peace: "peace";
        violence: "violence";
    }>;
    skill: z.ZodEnum<{
        chromebits: "chromebits";
        hardwired: "hardwired";
        motorized: "motorized";
        networked: "networked";
        gestalt: "gestalt";
        outerworld: "outerworld";
        mysticism: "mysticism";
        godhead: "godhead";
        barter: "barter";
        rhetoric: "rhetoric";
        erudition: "erudition";
        treatment: "treatment";
        assault: "assault";
        shooting: "shooting";
        subterfuge: "subterfuge";
        threshold: "threshold";
    }>;
}, z.z.core.$strip>;
export declare const Costs: z.ZodRecord<z.ZodString, z.ZodNumber>;
export declare const Affiliation: z.ZodNumber;
export declare const Points: z.ZodNumber;
export declare const Attributes: z.ZodObject<{
    cybernetica: z.ZodObject<{
        points: z.ZodNumber;
        skills: z.ZodObject<{
            chromebits: z.ZodObject<{
                points: z.ZodNumber;
            }, z.z.core.$strip>;
            hardwired: z.ZodObject<{
                points: z.ZodNumber;
            }, z.z.core.$strip>;
            motorized: z.ZodObject<{
                points: z.ZodNumber;
            }, z.z.core.$strip>;
            networked: z.ZodObject<{
                points: z.ZodNumber;
            }, z.z.core.$strip>;
        }, z.z.core.$strip>;
    }, z.z.core.$strip>;
    esoterica: z.ZodObject<{
        points: z.ZodNumber;
        skills: z.ZodObject<{
            gestalt: z.ZodObject<{
                points: z.ZodNumber;
            }, z.z.core.$strip>;
            godhead: z.ZodObject<{
                points: z.ZodNumber;
            }, z.z.core.$strip>;
            mysticism: z.ZodObject<{
                points: z.ZodNumber;
            }, z.z.core.$strip>;
            outerworld: z.ZodObject<{
                points: z.ZodNumber;
            }, z.z.core.$strip>;
        }, z.z.core.$strip>;
    }, z.z.core.$strip>;
    peace: z.ZodObject<{
        points: z.ZodNumber;
        skills: z.ZodObject<{
            barter: z.ZodObject<{
                points: z.ZodNumber;
            }, z.z.core.$strip>;
            erudition: z.ZodObject<{
                points: z.ZodNumber;
            }, z.z.core.$strip>;
            rhetoric: z.ZodObject<{
                points: z.ZodNumber;
            }, z.z.core.$strip>;
            treatment: z.ZodObject<{
                points: z.ZodNumber;
            }, z.z.core.$strip>;
        }, z.z.core.$strip>;
    }, z.z.core.$strip>;
    violence: z.ZodObject<{
        points: z.ZodNumber;
        skills: z.ZodObject<{
            assault: z.ZodObject<{
                points: z.ZodNumber;
            }, z.z.core.$strip>;
            shooting: z.ZodObject<{
                points: z.ZodNumber;
            }, z.z.core.$strip>;
            subterfuge: z.ZodObject<{
                points: z.ZodNumber;
            }, z.z.core.$strip>;
            threshold: z.ZodObject<{
                points: z.ZodNumber;
            }, z.z.core.$strip>;
        }, z.z.core.$strip>;
    }, z.z.core.$strip>;
}, z.z.core.$strip>;
export type Attributes = z.infer<typeof Attributes>;
export declare const Date: z.ZodObject<{
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
}, z.z.core.$strip>;
export type Date = z.infer<typeof Date>;
export declare const Time: z.ZodObject<{
    hour: z.ZodNumber;
    minute: z.ZodNumber;
    second: z.ZodNumber;
}, z.z.core.$strip>;
export type Time = z.infer<typeof Time>;
