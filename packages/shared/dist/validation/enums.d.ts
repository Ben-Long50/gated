import z from 'zod';
export declare const Attribute: z.ZodEnum<{
    cybernetica: "cybernetica";
    esoterica: "esoterica";
    peace: "peace";
    violence: "violence";
}>;
export declare const Skill: z.ZodEnum<{
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
export declare const ActionType: z.ZodEnum<{
    action: "action";
    extendedAction: "extendedAction";
    reaction: "reaction";
    passive: "passive";
}>;
export declare const ActionSubtype: z.ZodEnum<{
    monster: "monster";
    movement: "movement";
    attack: "attack";
    upkeep: "upkeep";
    unique: "unique";
}>;
export declare const FactionType: z.ZodEnum<{
    churchOfElShaddai: "churchOfElShaddai";
    corporateHoldouts: "corporateHoldouts";
    federalReservists: "federalReservists";
    noblebloods: "noblebloods";
}>;
export declare const NpcType: z.ZodEnum<{
    monster: "monster";
    shop: "shop";
    goon: "goon";
    template: "template";
}>;
export declare const Sex: z.ZodEnum<{
    male: "male";
    female: "female";
    unknown: "unknown";
}>;
export declare const ConditionType: z.ZodEnum<{
    character: "character";
    item: "item";
}>;
export declare const Month: z.ZodEnum<{
    arctus: "arctus";
    pluvia: "pluvia";
    kavir: "kavir";
    husk: "husk";
    nagai: "nagai";
    zenzi: "zenzi";
    haqMilah: "haqMilah";
    termina: "termina";
}>;
export declare const ItemType: z.ZodEnum<{
    weapon: "weapon";
    armor: "armor";
    cybernetic: "cybernetic";
    mutation: "mutation";
    vehicle: "vehicle";
    drone: "drone";
    modification: "modification";
    reusable: "reusable";
    consumable: "consumable";
}>;
export declare const Rarity: z.ZodEnum<{
    common: "common";
    uncommon: "uncommon";
    rare: "rare";
    blackMarket: "blackMarket";
    artifact: "artifact";
}>;
export declare const PropertyType: z.ZodEnum<{
    property: "property";
    districtUpgrade: "districtUpgrade";
}>;
export declare const KeywordType: z.ZodEnum<{
    chromebits: "chromebits";
    hardwired: "hardwired";
    networked: "networked";
    weapon: "weapon";
    armor: "armor";
    vehicle: "vehicle";
}>;
export declare const MapType: z.ZodEnum<{
    map: "map";
    component: "component";
}>;
export declare const RollModifiers: z.ZodEnum<{
    push: "push";
    lucky: "lucky";
    unlucky: "unlucky";
    booming: "booming";
    dooming: "dooming";
}>;
export declare const UserRole: z.ZodEnum<{
    GUEST: "GUEST";
    USER: "USER";
    PROUSER: "PROUSER";
    ADMIN: "ADMIN";
    SUPERADMIN: "SUPERADMIN";
}>;
