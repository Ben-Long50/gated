import z from 'zod';
export declare const ItemInput: z.ZodObject<{
    id: z.ZodOptional<z.ZodNumber>;
    name: z.ZodString;
    itemTypes: z.ZodArray<z.ZodEnum<{
        weapon: "weapon";
        armor: "armor";
        cybernetic: "cybernetic";
        mutation: "mutation";
        vehicle: "vehicle";
        drone: "drone";
        modification: "modification";
        reusable: "reusable";
        consumable: "consumable";
    }>>;
    rarity: z.ZodEnum<{
        common: "common";
        uncommon: "uncommon";
        rare: "rare";
        blackMarket: "blackMarket";
        artifact: "artifact";
    }>;
    grade: z.ZodNumber;
    description: z.ZodString;
    price: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
    stats: z.ZodRecord<z.ZodString, z.ZodNumber>;
    generatedPictureId: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    itemIds: z.ZodOptional<z.ZodArray<z.ZodNumber>>;
    actionIds: z.ZodOptional<z.ZodArray<z.ZodNumber>>;
    keywords: z.ZodArray<z.ZodObject<{
        keywordId: z.ZodNumber;
        value: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    }, z.z.core.$strip>>;
}, z.z.core.$strip>;
export declare const ItemUpgradeBaseInput: z.ZodObject<{
    id: z.ZodNumber;
    name: z.ZodString;
    grade: z.ZodNumber;
    description: z.ZodString;
    generatedPictureId: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    upgradePrice: z.ZodNumber;
    modifiedStats: z.ZodRecord<z.ZodString, z.ZodNumber>;
    keywords: z.ZodArray<z.ZodObject<{
        keywordId: z.ZodNumber;
        value: z.ZodOptional<z.ZodNumber>;
    }, z.z.core.$strip>>;
    characterId: z.ZodNumber;
}, z.z.core.$strip>;
export declare const ItemCopyInput: z.ZodObject<{
    id: z.ZodNumber;
    name: z.ZodString;
    itemTypes: z.ZodArray<z.ZodEnum<{
        weapon: "weapon";
        armor: "armor";
        cybernetic: "cybernetic";
        mutation: "mutation";
        vehicle: "vehicle";
        drone: "drone";
        modification: "modification";
        reusable: "reusable";
        consumable: "consumable";
    }>>;
    rarity: z.ZodEnum<{
        common: "common";
        uncommon: "uncommon";
        rare: "rare";
        blackMarket: "blackMarket";
        artifact: "artifact";
    }>;
    grade: z.ZodNumber;
    description: z.ZodString;
    price: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
    stats: z.ZodRecord<z.ZodString, z.ZodNumber>;
    generatedPictureId: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    equipped: z.ZodBoolean;
    baseItemId: z.ZodNullable<z.ZodNumber>;
}, z.z.core.$strip>;
export type ItemInput = z.infer<typeof ItemInput>;
export type ItemUpgradeInput = z.infer<typeof ItemUpgradeBaseInput>;
export type ItemCopyInput = z.infer<typeof ItemCopyInput>;
export declare const WeaponStats: z.ZodObject<{
    damage: z.ZodOptional<z.ZodNumber>;
    sanityDamage: z.ZodOptional<z.ZodNumber>;
    salvo: z.ZodOptional<z.ZodNumber>;
    flurry: z.ZodOptional<z.ZodNumber>;
    range: z.ZodOptional<z.ZodNumber>;
    magCapacity: z.ZodOptional<z.ZodNumber>;
    currentAmmoCount: z.ZodOptional<z.ZodNumber>;
    magCount: z.ZodOptional<z.ZodNumber>;
    currentMagCount: z.ZodOptional<z.ZodNumber>;
    power: z.ZodOptional<z.ZodNumber>;
    currentPower: z.ZodOptional<z.ZodNumber>;
    weight: z.ZodOptional<z.ZodNumber>;
}, z.z.core.$strip>;
export declare const ArmorStats: z.ZodObject<{
    armor: z.ZodOptional<z.ZodNumber>;
    ward: z.ZodOptional<z.ZodNumber>;
    block: z.ZodOptional<z.ZodNumber>;
    currentBlock: z.ZodOptional<z.ZodNumber>;
    power: z.ZodOptional<z.ZodNumber>;
    currentPower: z.ZodOptional<z.ZodNumber>;
    weight: z.ZodOptional<z.ZodNumber>;
}, z.z.core.$strip>;
export declare const CyberneticStats: z.ZodObject<{
    cyber: z.ZodOptional<z.ZodNumber>;
    power: z.ZodOptional<z.ZodNumber>;
    currentPower: z.ZodOptional<z.ZodNumber>;
}, z.z.core.$strip>;
export declare const MutationStats: z.ZodObject<{
    block: z.ZodOptional<z.ZodNumber>;
    currentBlock: z.ZodOptional<z.ZodNumber>;
    power: z.ZodOptional<z.ZodNumber>;
}, z.z.core.$strip>;
export declare const ReusableStats: z.ZodObject<{
    range: z.ZodOptional<z.ZodNumber>;
    speed: z.ZodOptional<z.ZodNumber>;
    wyrmMoldSlots: z.ZodOptional<z.ZodNumber>;
    wyrmMoldPoints: z.ZodOptional<z.ZodNumber>;
    esotericCharges: z.ZodOptional<z.ZodNumber>;
    currentEsotericCharges: z.ZodOptional<z.ZodNumber>;
    power: z.ZodOptional<z.ZodNumber>;
    currentPower: z.ZodOptional<z.ZodNumber>;
    weight: z.ZodOptional<z.ZodNumber>;
}, z.z.core.$strip>;
export declare const ConsumableStats: z.ZodObject<{
    range: z.ZodOptional<z.ZodNumber>;
    weight: z.ZodOptional<z.ZodNumber>;
}, z.z.core.$strip>;
export declare const VehicleStats: z.ZodObject<{
    size: z.ZodOptional<z.ZodNumber>;
    speed: z.ZodOptional<z.ZodNumber>;
    agility: z.ZodOptional<z.ZodNumber>;
    hull: z.ZodOptional<z.ZodNumber>;
    currentHull: z.ZodOptional<z.ZodNumber>;
    armor: z.ZodOptional<z.ZodNumber>;
    cargo: z.ZodOptional<z.ZodNumber>;
    currentCargo: z.ZodOptional<z.ZodNumber>;
    pass: z.ZodOptional<z.ZodNumber>;
    currentPass: z.ZodOptional<z.ZodNumber>;
    hangar: z.ZodOptional<z.ZodNumber>;
    currentHangar: z.ZodOptional<z.ZodNumber>;
    slots: z.ZodOptional<z.ZodNumber>;
}, z.z.core.$strip>;
export declare const DroneStats: z.ZodObject<{
    hull: z.ZodOptional<z.ZodNumber>;
    currentHull: z.ZodOptional<z.ZodNumber>;
    armor: z.ZodOptional<z.ZodNumber>;
    power: z.ZodOptional<z.ZodNumber>;
    currentPower: z.ZodOptional<z.ZodNumber>;
    speed: z.ZodOptional<z.ZodNumber>;
    slots: z.ZodOptional<z.ZodNumber>;
    weight: z.ZodOptional<z.ZodNumber>;
}, z.z.core.$strip>;
export declare const ModificationStats: z.ZodObject<{
    range: z.ZodOptional<z.ZodNumber>;
}, z.z.core.$strip>;
export declare const StatsSchemaByItemType: {
    readonly weapon: z.ZodObject<{
        damage: z.ZodOptional<z.ZodNumber>;
        sanityDamage: z.ZodOptional<z.ZodNumber>;
        salvo: z.ZodOptional<z.ZodNumber>;
        flurry: z.ZodOptional<z.ZodNumber>;
        range: z.ZodOptional<z.ZodNumber>;
        magCapacity: z.ZodOptional<z.ZodNumber>;
        currentAmmoCount: z.ZodOptional<z.ZodNumber>;
        magCount: z.ZodOptional<z.ZodNumber>;
        currentMagCount: z.ZodOptional<z.ZodNumber>;
        power: z.ZodOptional<z.ZodNumber>;
        currentPower: z.ZodOptional<z.ZodNumber>;
        weight: z.ZodOptional<z.ZodNumber>;
    }, z.z.core.$strip>;
    readonly armor: z.ZodObject<{
        armor: z.ZodOptional<z.ZodNumber>;
        ward: z.ZodOptional<z.ZodNumber>;
        block: z.ZodOptional<z.ZodNumber>;
        currentBlock: z.ZodOptional<z.ZodNumber>;
        power: z.ZodOptional<z.ZodNumber>;
        currentPower: z.ZodOptional<z.ZodNumber>;
        weight: z.ZodOptional<z.ZodNumber>;
    }, z.z.core.$strip>;
    readonly cybernetic: z.ZodObject<{
        cyber: z.ZodOptional<z.ZodNumber>;
        power: z.ZodOptional<z.ZodNumber>;
        currentPower: z.ZodOptional<z.ZodNumber>;
    }, z.z.core.$strip>;
    readonly mutation: z.ZodObject<{
        block: z.ZodOptional<z.ZodNumber>;
        currentBlock: z.ZodOptional<z.ZodNumber>;
        power: z.ZodOptional<z.ZodNumber>;
    }, z.z.core.$strip>;
    readonly reusable: z.ZodObject<{
        range: z.ZodOptional<z.ZodNumber>;
        speed: z.ZodOptional<z.ZodNumber>;
        wyrmMoldSlots: z.ZodOptional<z.ZodNumber>;
        wyrmMoldPoints: z.ZodOptional<z.ZodNumber>;
        esotericCharges: z.ZodOptional<z.ZodNumber>;
        currentEsotericCharges: z.ZodOptional<z.ZodNumber>;
        power: z.ZodOptional<z.ZodNumber>;
        currentPower: z.ZodOptional<z.ZodNumber>;
        weight: z.ZodOptional<z.ZodNumber>;
    }, z.z.core.$strip>;
    readonly consumable: z.ZodObject<{
        range: z.ZodOptional<z.ZodNumber>;
        weight: z.ZodOptional<z.ZodNumber>;
    }, z.z.core.$strip>;
    readonly vehicle: z.ZodObject<{
        size: z.ZodOptional<z.ZodNumber>;
        speed: z.ZodOptional<z.ZodNumber>;
        agility: z.ZodOptional<z.ZodNumber>;
        hull: z.ZodOptional<z.ZodNumber>;
        currentHull: z.ZodOptional<z.ZodNumber>;
        armor: z.ZodOptional<z.ZodNumber>;
        cargo: z.ZodOptional<z.ZodNumber>;
        currentCargo: z.ZodOptional<z.ZodNumber>;
        pass: z.ZodOptional<z.ZodNumber>;
        currentPass: z.ZodOptional<z.ZodNumber>;
        hangar: z.ZodOptional<z.ZodNumber>;
        currentHangar: z.ZodOptional<z.ZodNumber>;
        slots: z.ZodOptional<z.ZodNumber>;
    }, z.z.core.$strip>;
    readonly drone: z.ZodObject<{
        hull: z.ZodOptional<z.ZodNumber>;
        currentHull: z.ZodOptional<z.ZodNumber>;
        armor: z.ZodOptional<z.ZodNumber>;
        power: z.ZodOptional<z.ZodNumber>;
        currentPower: z.ZodOptional<z.ZodNumber>;
        speed: z.ZodOptional<z.ZodNumber>;
        slots: z.ZodOptional<z.ZodNumber>;
        weight: z.ZodOptional<z.ZodNumber>;
    }, z.z.core.$strip>;
    readonly modification: z.ZodObject<{
        range: z.ZodOptional<z.ZodNumber>;
    }, z.z.core.$strip>;
};
