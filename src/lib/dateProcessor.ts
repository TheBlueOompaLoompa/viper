export function createFuzzyDate(timestamp: number): string {
    const unixTime = Math.floor(Date.now() / 1000);
    const difference = unixTime - timestamp;

    if(difference < 60) {
        return `${difference} second${difference > 1 ? 's':''} ago`;
    } else if(difference < 60 * 60) {
        return `${Math.floor(difference/60)} minute${Math.floor(difference/60) > 1 ? 's':''} ago`;
    } else if(difference < 60 * 60 * 12) {
        return `${Math.floor((difference/60)/60)} hour${Math.floor((difference/60)/60) > 1 ? 's':''} ago`;
    } else {
        const date = new Date(timestamp);
        return (new Intl.DateTimeFormat('en-US', {dateStyle: 'full', hourCycle: 'h12', timeStyle: 'medium'})).format(date);
    }
}