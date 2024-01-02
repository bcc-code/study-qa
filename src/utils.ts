/* 
export function weeksBetween(d1: Date, d2: Date) {
    if (d2.getTime() - d1.getTime() < 0) return 1;
    return Math.round((d2.getTime() - d1.getTime()) / (7 * 24 * 60 * 60 * 1000));
} */

function getWeekNumber(d: Date) {
    // Copy date so don't modify original
    d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    // Set to nearest Thursday: current date + 4 - current day number
    // Make Sunday's day number 7
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
    // Get first day of year
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    // Calculate full weeks to nearest Thursday
    const weekNum = Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
    // Return array of year and week number
    return {
        year: d.getUTCFullYear(),
        weekNum,
    };
}

const startDate = new Date("2024-01-08");
const startingWeekNum = getWeekNumber(startDate);
const weeksSinceStart = getWeekNumber(new Date()).weekNum - startingWeekNum.weekNum;
export const currentWeek = Math.max(weeksSinceStart, 1);