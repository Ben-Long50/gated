import { Calendar } from '@gated/shared';

const calendar = {
  arctus: {
    schedule: Array.from({ length: 103 }),
    weather: { description: 'cold', level: 1 },
  },
  pluvia: {
    schedule: Array.from({ length: 52 }),
    weather: { description: 'wet', level: 1 },
  },
  kavir: {
    schedule: Array.from({ length: 51 }),
    weather: { description: 'hot', level: 1 },
  },
  husk: {
    schedule: Array.from({ length: 102 }),
    weather: { description: 'dry', level: 1 },
  },
  nagai: {
    schedule: Array.from({ length: 103 }),
    weather: { description: 'cold', level: 2 },
  },
  zenzi: {
    schedule: Array.from({ length: 52 }),
    weather: { description: 'wet', level: 2 },
  },
  haqMilah: {
    schedule: Array.from({ length: 51 }),
    weather: { description: 'hot', level: 2 },
  },
  termina: {
    schedule: Array.from({ length: 102 }),
    weather: { description: 'dry', level: 2 },
  },
} as Calendar;

export default calendar;
