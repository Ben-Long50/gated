export type AttributeTree = {
  cybernetica: Attribute;
  esoterica: Attribute;
  peace: Attribute;
  violence: Attribute;
};

export type Attribute = {
  points: number;
  skills: {
    [key: string]: Skill;
  };
};

export type Skill = {
  points: number;
};

export type AttributeName = 'cybernetica' | 'esoterica' | 'peace' | 'violence';

export type SkillName =
  | 'chromebits'
  | 'hardwired'
  | 'motorized'
  | 'networked'
  | 'gestalt'
  | 'outerworld'
  | 'mysticism'
  | 'godhead'
  | 'barter'
  | 'rhetoric'
  | 'erudition'
  | 'treatment'
  | 'assault'
  | 'shooting'
  | 'subterfuge'
  | 'threshold';
