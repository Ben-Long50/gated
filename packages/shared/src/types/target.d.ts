export type Target = {
  start: { row: number; col: number; characterId?: number };
  end: { row: number; col: number; targetId?: number };
  action: string;
  distance: number;
  color: string;
  occupied: boolean | null;
  inRange: boolean | null;
};
