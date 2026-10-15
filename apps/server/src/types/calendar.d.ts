import { Event } from '@prisma/client';

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
