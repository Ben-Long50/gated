import { Calendar } from './calendar.js';
import { Month } from './calendar.js';
import { Character } from './character.js';
import { Encounter } from './encounter.js';
import { Affiliation, Faction } from './faction.js';
import { Gang } from './gang.js';
import { Picture } from './picture.js';
import { User } from './user.js';
export type Campaign = {
    id: number;
    createdAt: Date;
    active: boolean;
    ownerId: number;
    owner: User;
    date: {
        month: Month;
        day: number;
    };
    time: {
        hour: number;
        minute: number;
        second: number;
    };
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
};
export type Session = {
    id: number;
    createdAt: Date;
    sessionNumber: number;
    name: string;
    location: string;
    picture: Picture;
    campaign: Campaign;
    campaignId: number;
    briefing: {
        html: string;
        nodes: string;
    };
    characters: Character[];
};
export type Notes = {
    id: number;
    sessionId: number;
    session?: Partial<Session>;
    characterId: number;
    character?: Partial<Character>;
    content: {
        html: string;
        nodes: string;
    };
};
export type Event = {
    id: number;
    campaign: Campaign;
    campaignId: number;
    character: Character;
    characterId: number;
    month: Month;
    day: number;
    time: {
        hour: number;
        minute: number;
        second: number;
    };
    name: string;
    description: string;
};
