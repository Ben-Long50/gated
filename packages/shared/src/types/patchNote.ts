export type PatchNote = {
  id: number;
  createdAt: Date;
  version: number;
  title: string;
  content: { html: string; nodes: object };
};
