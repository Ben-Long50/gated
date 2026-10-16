import { PhaseHistory } from 'src/types/encounter';
export declare const parsePhaseAction: (phaseHistory: PhaseHistory, blockData?: {
    blockedDamage: number;
    blockedSanityDamage: number;
    armorIds: number[];
}[]) => {
    actionResults: any;
    reactionResults: any;
} | undefined;
