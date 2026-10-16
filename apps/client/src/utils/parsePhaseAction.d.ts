import { PhaseHistory } from '@gated/shared';
export declare const parsePhaseAction: (phaseHistory: PhaseHistory, blockData?: {
    blockedDamage: number;
    blockedSanityDamage: number;
    armorIds: number[];
}[]) => {
    actionResults: any;
    reactionResults: any;
} | undefined;
