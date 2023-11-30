
export function weeksBetween(d1: Date, d2: Date) {
    return Math.round((d2.getTime() - d1.getTime()) / (7 * 24 * 60 * 60 * 1000));
}