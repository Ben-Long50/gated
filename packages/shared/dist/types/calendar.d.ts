import { Event } from './campaign.js';
export type Calendar = {
    arctus: CalendarMonth;
    pluvia: CalendarMonth;
    kavir: CalendarMonth;
    husk: CalendarMonth;
    nagai: CalendarMonth;
    zenzi: CalendarMonth;
    haqMilah: CalendarMonth;
    termina: CalendarMonth;
};
export type CalendarMonth = {
    schedule: (Event[] | undefined)[];
    weather: {
        description: 'cold' | 'wet' | 'dry' | 'hot';
        level: number;
    };
};
export declare enum Month {
    arctus = "arctus",
    pluvia = "pluvia",
    kavir = "kavir",
    husk = "husk",
    nagai = "nagai",
    zenzi = "zenzi",
    haqMilah = "haqMilah",
    termina = "termina"
}
