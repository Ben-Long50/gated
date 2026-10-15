import { Character } from './character';
import { Encounter } from './encounter';
import { Affiliation, Faction } from './faction';
import { Gang } from './gang';
import { Picture } from './picture';
import { User } from './user';

interface Campaign {
  id: number;
  createdAt: Date;
  active: boolean;
  ownerId: number;
  owner: User;
  date: { month: Month; day: number };
  time: { hour: number; minute: number; second: number };
  calendar: Calendar;
  name: string;
  location: string;
  picture: Picture;
  pendingPlayers: User[];
  players: User[];
  factions: Faction[];
  gangs: Gang[];
  characters: Character[];
  sessions: Session[];
  affiliations: Affiliation[];
  encounters: Partial<Encounter>[];
}

interface Session {
  id: number;
  createdAt: Date;
  sessionNumber: number;
  name: string;
  location: string;
  picture: Picture;
  campaign: Campaign;
  campaignId: number;
  briefing: { html: string; nodes: string };
  characters: Character[];
}

interface Notes {
  id: number;
  sessionId: number;
  session?: Partial<Session>;
  characterId: number;
  character?: Partial<Character>;
  content: { html: string; nodes: string };
}

interface Calendar {
  arctus: CalendarMonth;
  pluvia: CalendarMonth;
  kavir: CalendarMonth;
  husk: CalendarMonth;
  nagai: CalendarMonth;
  zenzi: CalendarMonth;
  haqMilah: CalendarMonth;
  termina: CalendarMonth;
}

interface CalendarMonth {
  schedule: (Event[] | undefined)[];
  weather: { description: 'cold' | 'wet' | 'dry' | 'hot'; level: number };
}

interface Event {
  id: number;
  campaign: Campaign;
  campaignId: number;
  character: Character;
  characterId: number;
  month: Month;
  day: number;
  time: { hour: number; minute: number; second: number };
  name: string;
  description: string;
}

enum Month {
  arctus = 'arctus',
  pluvia = 'pluvia',
  kavir = 'kavir',
  husk = 'husk',
  nagai = 'nagai',
  zenzi = 'zenzi',
  haqMilah = 'haqMilah',
  termina = 'termina',
}
