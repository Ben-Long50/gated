import z from 'zod';
export declare const ActionInput: z.ZodObject<{
    id: z.ZodOptional<z.ZodNumber>;
    name: z.ZodString;
    costs: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodNumber>>;
    roll: z.ZodOptional<z.ZodArray<z.ZodObject<{
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
    }, z.z.core.$strip>>>;
    actionType: z.ZodEnum<{
        action: "action";
        extendedAction: "extendedAction";
        reaction: "reaction";
        passive: "passive";
    }>;
    actionSubtypes: z.ZodOptional<z.ZodArray<z.ZodEnum<{
        monster: "monster";
        movement: "movement";
        attack: "attack";
        upkeep: "upkeep";
        unique: "unique";
    }>>>;
    duration: z.ZodPreprocess<z.ZodOptional<z.ZodObject<{
        unit: z.ZodString;
        value: z.ZodNumber;
    }, z.z.core.$strip>>, unknown>;
    cooldown: z.ZodPreprocess<z.ZodOptional<z.ZodObject<{
        unit: z.ZodString;
        value: z.ZodNumber;
    }, z.z.core.$strip>>, unknown>;
    description: z.ZodString;
    modifiers: z.ZodPreprocess<z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodNumber>>, unknown>;
    keywords: z.ZodOptional<z.ZodArray<z.ZodObject<{
        keywordId: z.ZodNumber;
        value: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    }, z.z.core.$strip>>>;
    baseActionId: z.ZodPreprocess<z.ZodOptional<z.ZodNumber>, unknown>;
}, z.z.core.$strip>;
export declare const ActionCopyInput: z.ZodObject<{
    id: z.ZodNumber;
    name: z.ZodString;
    costs: z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodNumber>>;
    roll: z.ZodNullable<z.ZodArray<z.ZodObject<{
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
    }, z.z.core.$strip>>>;
    actionType: z.ZodEnum<{
        action: "action";
        extendedAction: "extendedAction";
        reaction: "reaction";
        passive: "passive";
    }>;
    actionSubtypes: z.ZodArray<z.ZodEnum<{
        monster: "monster";
        movement: "movement";
        attack: "attack";
        upkeep: "upkeep";
        unique: "unique";
    }>>;
    duration: z.ZodNullable<z.ZodObject<{
        unit: z.ZodString;
        value: z.ZodNumber;
    }, z.z.core.$strip>>;
    cooldown: z.ZodNullable<z.ZodObject<{
        unit: z.ZodString;
        value: z.ZodNumber;
    }, z.z.core.$strip>>;
    description: z.ZodString;
    modifiers: z.ZodNullable<z.ZodRecord<z.ZodString, z.ZodNumber>>;
    baseActionId: z.ZodPreprocess<z.ZodOptional<z.ZodNumber>, unknown>;
}, z.z.core.$strip>;
export type ActionInput = z.infer<typeof ActionInput>;
export type ActionCopyInput = z.infer<typeof ActionCopyInput>;
