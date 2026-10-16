export type ActionData = {
    range: number;
    color: string;
    costs: Record<string, number>;
    requirements: string[];
    damage: number;
    sanityDamage: number;
    instances: number;
};
