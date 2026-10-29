export type RollData = [number, { modifiers: string[]; extraDice: number }][];

export type RollResult = {
  diceArray: number[];
  successes: number;
};

export type RollResultData = [number, RollResult][];

export type RollResultMap = Map<number, RollResult>;
