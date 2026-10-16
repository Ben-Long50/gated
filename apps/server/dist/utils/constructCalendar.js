//@ts-nocheck
import calendar from './calendar.js';
const constructCalendar = (campaign) => {
    const eventCalendar = structuredClone(calendar);
    if (eventCalendar && campaign?.events.length > 0) {
        campaign.events.forEach((event) => {
            const monthEntry = eventCalendar[event.month];
            if (!monthEntry)
                return;
            const dayIndex = event.day - 1;
            if (Array.isArray(monthEntry.schedule[dayIndex])) {
                monthEntry.schedule[dayIndex].push(event);
            }
            else {
                monthEntry.schedule[dayIndex] = [event];
            }
        });
    }
    return eventCalendar;
};
export default constructCalendar;
